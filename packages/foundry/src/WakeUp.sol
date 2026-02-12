// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WakeUp
 * @author wake_up DAO
 * @notice A decentralized wake-up challenge contract with stake-based commitment
 * @dev Users stake ETH and must check in within time windows to maintain their streak
 */
contract WakeUp {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Minimum deposit required to join a challenge
    uint256 public constant MIN_DEPOSIT = 0.001 ether;

    /// @notice Maximum deposit allowed per user
    uint256 public constant MAX_DEPOSIT = 1 ether;

    /// @notice Time window before and after target time (±15 minutes = 30 min total)
    uint256 public constant CHECKIN_WINDOW = 15 minutes;

    /// @notice Minimum interval between check-ins to prevent gaming
    uint256 public constant MIN_INTERVAL = 18 hours;

    /// @notice Number of successful check-ins required to complete challenge
    uint256 public constant SUCCESS_THRESHOLD = 3;

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice User challenge data
    struct User {
        uint256 deposit;        // Amount of ETH staked
        uint256 nextCheckIn;    // Unix timestamp of next check-in target
        uint256 lastCheckInTime; // Unix timestamp of last successful check-in
        uint256 streak;         // Current consecutive successful check-ins
        bool isActive;          // Whether user is currently in a challenge
    }

    /// @notice Mapping from user address to their challenge data
    mapping(address => User) public users;

    /// @notice Total number of users currently active in challenges
    uint256 public activeUsers;

    /// @notice Emergency mode flag - allows all users to withdraw regardless of streak
    bool public emergencyMode;

    /// @notice Contract owner (for emergency functions only)
    address public owner;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event ChallengeJoined(address indexed user, uint256 deposit, uint256 firstTarget);
    event CheckInSuccess(address indexed user, uint256 streak, uint256 nextTarget);
    event ChallengeRestarted(address indexed user, uint256 newTarget);
    event WithdrawalSuccess(address indexed user, uint256 amount);
    event EmergencyModeToggled(bool enabled);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error InvalidDeposit();
    error AlreadyActive();
    error NotActive();
    error InvalidTargetTime();
    error TooEarly();
    error TooLate();
    error IntervalTooShort();
    error NotQualified();
    error TransferFailed();
    error Unauthorized();

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        owner = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                            MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                        CORE CHALLENGE FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Join a new wake-up challenge by staking ETH
     * @param _firstTarget Unix timestamp of the first check-in target (must be in future)
     * @dev Deposit must be between MIN_DEPOSIT and MAX_DEPOSIT
     * @dev First target must be at least 1 hour in the future to prevent immediate check-ins
     */
    function join(uint256 _firstTarget) external payable {
        // Validate deposit amount
        if (msg.value < MIN_DEPOSIT || msg.value > MAX_DEPOSIT) {
            revert InvalidDeposit();
        }

        // Ensure user is not already in a challenge
        if (users[msg.sender].isActive) {
            revert AlreadyActive();
        }

        // Validate target time (must be at least 1 hour in future)
        if (_firstTarget <= block.timestamp + 1 hours) {
            revert InvalidTargetTime();
        }

        // Initialize user challenge
        users[msg.sender] = User({
            deposit: msg.value,
            nextCheckIn: _firstTarget,
            lastCheckInTime: 0, // 初始化为 0，首次打卡不受限制
            streak: 0,
            isActive: true
        });

        // Increment active users counter
        activeUsers++;

        emit ChallengeJoined(msg.sender, msg.value, _firstTarget);
    }

    /**
     * @notice Check in during the valid time window and set next target
     * @param _nextTarget Unix timestamp for the next check-in (must be at least 18 hours from last check-in)
     * @dev Can only be called within CHECKIN_WINDOW before/after nextCheckIn time
     * @dev Increments streak on success
     */
    function checkIn(uint256 _nextTarget) external {
        User storage user = users[msg.sender];

        // Ensure user is active
        if (!user.isActive) {
            revert NotActive();
        }

        // Calculate valid time window
        uint256 windowStart = user.nextCheckIn > CHECKIN_WINDOW 
            ? user.nextCheckIn - CHECKIN_WINDOW 
            : 0;
        uint256 windowEnd = user.nextCheckIn + CHECKIN_WINDOW;

        // Check if too early
        if (block.timestamp < windowStart) {
            revert TooEarly();
        }

        // Check if too late (user missed the window)
        if (block.timestamp > windowEnd) {
            revert TooLate();
        }

        // 新逻辑：验证下次打卡时间距离本次打卡时间 >= 18 小时
        if (_nextTarget < block.timestamp + MIN_INTERVAL) {
            revert IntervalTooShort();
        }

        // Update user state
        user.lastCheckInTime = block.timestamp; // 记录本次打卡时间
        user.streak++;
        user.nextCheckIn = _nextTarget;

        emit CheckInSuccess(msg.sender, user.streak, _nextTarget);
    }

    /**
     * @notice Restart challenge after missing a check-in window
     * @param _newTarget Unix timestamp for the new first check-in
     * @dev Can only be called if user missed their window (too late to check in)
     * @dev Resets streak to 0 but keeps deposit locked
     */
    function restart(uint256 _newTarget) external {
        User storage user = users[msg.sender];

        // Ensure user is active
        if (!user.isActive) {
            revert NotActive();
        }

        // Can only restart if user missed the window
        if (block.timestamp <= user.nextCheckIn + CHECKIN_WINDOW) {
            revert TooEarly(); // Not yet failed, can still check in
        }

        // Validate new target (距离上次打卡 >= 18 小时)
        if (_newTarget < user.lastCheckInTime + MIN_INTERVAL) {
            revert IntervalTooShort();
        }

        // Reset streak but keep deposit
        user.streak = 0;
        user.nextCheckIn = _newTarget;

        emit ChallengeRestarted(msg.sender, _newTarget);
    }

    /**
     * @notice Withdraw deposit after completing challenge or during emergency
     * @dev Requires streak >= SUCCESS_THRESHOLD OR emergencyMode == true
     * @dev Uses Checks-Effects-Interactions pattern to prevent reentrancy
     */
    function withdraw() external {
        User storage user = users[msg.sender];

        // Check user has a deposit
        if (user.deposit == 0) {
            revert NotActive();
        }

        // Check qualification (completed challenge OR emergency mode)
        if (user.streak < SUCCESS_THRESHOLD && !emergencyMode) {
            revert NotQualified();
        }

        // Cache values before state changes
        uint256 amount = user.deposit;
        bool wasActive = user.isActive;

        // Effects: Clear user state BEFORE external call
        delete users[msg.sender];

        // Update active users counter if user was active
        if (wasActive) {
            activeUsers--;
        }

        // Interactions: Transfer ETH (using call for better gas control)
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            revert TransferFailed();
        }

        emit WithdrawalSuccess(msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        EMERGENCY FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Toggle emergency mode (owner only)
     * @param _enabled Whether to enable or disable emergency mode
     * @dev When enabled, all users can withdraw regardless of streak
     * @dev Used for contract upgrades or critical bugs
     */
    function setEmergencyMode(bool _enabled) external onlyOwner {
        emergencyMode = _enabled;
        emit EmergencyModeToggled(_enabled);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get current status of a user's challenge
     * @param _user Address of the user to query
     * @return status Current state: 0=Idle, 1=Waiting, 2=WindowOpen, 3=Missed, 4=Success
     * @return timeInfo Relevant timestamp (time until window or time since missed)
     */
    function getUserStatus(address _user) external view returns (uint8 status, uint256 timeInfo) {
        User storage user = users[_user];

        // Status 0: Idle (not active)
        if (!user.isActive) {
            return (0, 0);
        }

        // Status 4: Success (completed challenge)
        if (user.streak >= SUCCESS_THRESHOLD) {
            return (4, user.streak);
        }

        uint256 windowStart = user.nextCheckIn > CHECKIN_WINDOW 
            ? user.nextCheckIn - CHECKIN_WINDOW 
            : 0;
        uint256 windowEnd = user.nextCheckIn + CHECKIN_WINDOW;

        // Status 3: Missed (past the window)
        if (block.timestamp > windowEnd) {
            return (3, block.timestamp - windowEnd); // Time since missed
        }

        // Status 2: Window Open (can check in now)
        if (block.timestamp >= windowStart) {
            return (2, windowEnd - block.timestamp); // Time remaining in window
        }

        // Status 1: Waiting (before window opens)
        return (1, windowStart - block.timestamp); // Time until window opens
    }

    /**
     * @notice Get complete user data
     * @param _user Address of the user to query
     */
    function getUser(address _user) external view returns (User memory) {
        return users[_user];
    }

    /**
     * @notice Get contract statistics
     * @return _activeUsers Number of users currently in challenges
     * @return _totalLocked Total ETH locked in the contract
     * @return _emergencyMode Whether emergency mode is enabled
     */
    function getStats() external view returns (
        uint256 _activeUsers,
        uint256 _totalLocked,
        bool _emergencyMode
    ) {
        return (activeUsers, address(this).balance, emergencyMode);
    }
}
