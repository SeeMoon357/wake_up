// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/WakeUp.sol";

/**
 * @title WakeUpTest
 * @notice Comprehensive test suite for WakeUp contract
 * @dev Uses Foundry's vm.warp() for time manipulation
 */
contract WakeUpTest is Test {
    WakeUp public wakeup;
    
    address public owner;
    address public alice;
    address public bob;
    address public charlie;

    // Test constants
    uint256 constant DEPOSIT_AMOUNT = 0.01 ether;
    uint256 constant TOMORROW_7AM = 1 days + 7 hours; // Relative time

    event ChallengeJoined(address indexed user, uint256 deposit, uint256 firstTarget);
    event CheckInSuccess(address indexed user, uint256 streak, uint256 nextTarget);
    event ChallengeRestarted(address indexed user, uint256 newTarget);
    event WithdrawalSuccess(address indexed user, uint256 amount);

    function setUp() public {
        // Deploy contract
        owner = address(this);
        wakeup = new WakeUp();

        // Create test users with ETH
        alice = makeAddr("alice");
        bob = makeAddr("bob");
        charlie = makeAddr("charlie");
        
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
        vm.deal(charlie, 10 ether);
    }

    /*//////////////////////////////////////////////////////////////
                            JOIN TESTS
    //////////////////////////////////////////////////////////////*/

    function test_Join_Success() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit ChallengeJoined(alice, DEPOSIT_AMOUNT, targetTime);
        
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Verify state
        WakeUp.User memory user = wakeup.getUser(alice);
        assertEq(user.deposit, DEPOSIT_AMOUNT);
        assertEq(user.nextCheckIn, targetTime);
        assertEq(user.streak, 0);
        assertTrue(user.isActive);
        assertEq(wakeup.activeUsers(), 1);
    }

    function test_Join_RevertIf_DepositTooLow() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        vm.expectRevert(WakeUp.InvalidDeposit.selector);
        wakeup.join{value: 0.0001 ether}(targetTime); // Below minimum
    }

    function test_Join_RevertIf_DepositTooHigh() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        vm.expectRevert(WakeUp.InvalidDeposit.selector);
        wakeup.join{value: 2 ether}(targetTime); // Above maximum
    }

    function test_Join_RevertIf_AlreadyActive() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.startPrank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);
        
        vm.expectRevert(WakeUp.AlreadyActive.selector);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime + 1 days);
        vm.stopPrank();
    }

    function test_Join_RevertIf_TargetTooSoon() public {
        uint256 targetTime = block.timestamp + 30 minutes; // Less than 1 hour
        
        vm.prank(alice);
        vm.expectRevert(WakeUp.InvalidTargetTime.selector);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);
    }

    function test_Join_MultipleUsers() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);
        
        vm.prank(bob);
        wakeup.join{value: DEPOSIT_AMOUNT * 2}(targetTime + 1 hours);
        
        vm.prank(charlie);
        wakeup.join{value: DEPOSIT_AMOUNT * 3}(targetTime + 2 hours);

        assertEq(wakeup.activeUsers(), 3);
        assertEq(address(wakeup).balance, DEPOSIT_AMOUNT * 6);
    }

    /*//////////////////////////////////////////////////////////////
                          CHECK-IN TESTS
    //////////////////////////////////////////////////////////////*/

    function test_CheckIn_Success_ExactTime() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        // Alice joins
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Warp to exact target time
        vm.warp(targetTime);

        // Check in with next target
        uint256 nextTarget = targetTime + 1 days;
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit CheckInSuccess(alice, 1, nextTarget);
        
        wakeup.checkIn(nextTarget);

        // Verify state
        WakeUp.User memory user = wakeup.getUser(alice);
        assertEq(user.streak, 1);
        assertEq(user.nextCheckIn, nextTarget);
    }

    function test_CheckIn_Success_EarlyEdge() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Warp to 15 minutes before target (earliest valid time)
        vm.warp(targetTime - 15 minutes);

        uint256 nextTarget = targetTime + 1 days;
        vm.prank(alice);
        wakeup.checkIn(nextTarget);

        WakeUp.User memory user = wakeup.getUser(alice);
        assertEq(user.streak, 1);
    }

    function test_CheckIn_Success_LateEdge() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Warp to 15 minutes after target (latest valid time)
        vm.warp(targetTime + 15 minutes);

        uint256 nextTarget = targetTime + 1 days;
        vm.prank(alice);
        wakeup.checkIn(nextTarget);

        WakeUp.User memory user = wakeup.getUser(alice);
        assertEq(user.streak, 1);
    }

    function test_CheckIn_RevertIf_TooEarly() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Warp to 16 minutes before target (outside window)
        vm.warp(targetTime - 16 minutes);

        uint256 nextTarget = targetTime + 1 days;
        vm.prank(alice);
        vm.expectRevert(WakeUp.TooEarly.selector);
        wakeup.checkIn(nextTarget);
    }

    function test_CheckIn_RevertIf_TooLate() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Warp to 16 minutes after target (outside window)
        vm.warp(targetTime + 16 minutes);

        uint256 nextTarget = targetTime + 1 days;
        vm.prank(alice);
        vm.expectRevert(WakeUp.TooLate.selector);
        wakeup.checkIn(nextTarget);
    }

    function test_CheckIn_RevertIf_IntervalTooShort() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        vm.warp(targetTime);

        // Try to set next target only 6 hours away (below 12 hour minimum)
        uint256 nextTarget = targetTime + 6 hours;
        vm.prank(alice);
        vm.expectRevert(WakeUp.IntervalTooShort.selector);
        wakeup.checkIn(nextTarget);
    }

    function test_CheckIn_ThreeConsecutiveDays() public {
        uint256 day1 = block.timestamp + TOMORROW_7AM;
        
        // Day 0: Join
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(day1);

        // Day 1: First check-in
        vm.warp(day1);
        uint256 day2 = day1 + 1 days;
        vm.prank(alice);
        wakeup.checkIn(day2);
        assertEq(wakeup.getUser(alice).streak, 1);

        // Day 2: Second check-in
        vm.warp(day2);
        uint256 day3 = day2 + 1 days;
        vm.prank(alice);
        wakeup.checkIn(day3);
        assertEq(wakeup.getUser(alice).streak, 2);

        // Day 3: Third check-in (success!)
        vm.warp(day3);
        uint256 day4 = day3 + 1 days;
        vm.prank(alice);
        wakeup.checkIn(day4);
        assertEq(wakeup.getUser(alice).streak, 3);
    }

    /*//////////////////////////////////////////////////////////////
                          RESTART TESTS
    //////////////////////////////////////////////////////////////*/

    function test_Restart_Success() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Miss the window (warp to 20 minutes after target)
        vm.warp(targetTime + 20 minutes);

        // Restart with new target
        uint256 newTarget = block.timestamp + 1 days;
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit ChallengeRestarted(alice, newTarget);
        
        wakeup.restart(newTarget);

        // Verify state
        WakeUp.User memory user = wakeup.getUser(alice);
        assertEq(user.streak, 0); // Streak reset
        assertEq(user.nextCheckIn, newTarget);
        assertEq(user.deposit, DEPOSIT_AMOUNT); // Deposit still locked
        assertTrue(user.isActive);
    }

    function test_Restart_RevertIf_NotYetFailed() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Try to restart while still in valid window
        vm.warp(targetTime);

        uint256 newTarget = block.timestamp + 1 days;
        vm.prank(alice);
        vm.expectRevert(WakeUp.TooEarly.selector);
        wakeup.restart(newTarget);
    }

    function test_Restart_AfterStreak() public {
        uint256 day1 = block.timestamp + TOMORROW_7AM;
        
        // Build up a streak
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(day1);

        vm.warp(day1);
        uint256 day2 = day1 + 1 days;
        vm.prank(alice);
        wakeup.checkIn(day2);
        assertEq(wakeup.getUser(alice).streak, 1);

        // Miss day 2
        vm.warp(day2 + 20 minutes);

        // Restart - should reset streak
        uint256 newTarget = block.timestamp + 1 days;
        vm.prank(alice);
        wakeup.restart(newTarget);

        assertEq(wakeup.getUser(alice).streak, 0);
    }

    /*//////////////////////////////////////////////////////////////
                        WITHDRAW TESTS
    //////////////////////////////////////////////////////////////*/

    function test_Withdraw_Success_AfterCompletion() public {
        uint256 day1 = block.timestamp + TOMORROW_7AM;
        
        // Complete 3-day challenge
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(day1);

        // Day 1
        vm.warp(day1);
        vm.prank(alice);
        wakeup.checkIn(day1 + 1 days);

        // Day 2
        vm.warp(day1 + 1 days);
        vm.prank(alice);
        wakeup.checkIn(day1 + 2 days);

        // Day 3
        vm.warp(day1 + 2 days);
        vm.prank(alice);
        wakeup.checkIn(day1 + 3 days);

        // Withdraw
        uint256 balanceBefore = alice.balance;
        vm.prank(alice);
        vm.expectEmit(true, false, false, true);
        emit WithdrawalSuccess(alice, DEPOSIT_AMOUNT);
        
        wakeup.withdraw();

        // Verify
        assertEq(alice.balance, balanceBefore + DEPOSIT_AMOUNT);
        assertEq(wakeup.getUser(alice).deposit, 0);
        assertEq(wakeup.activeUsers(), 0);
    }

    function test_Withdraw_RevertIf_NotQualified() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Try to withdraw with 0 streak
        vm.prank(alice);
        vm.expectRevert(WakeUp.NotQualified.selector);
        wakeup.withdraw();
    }

    function test_Withdraw_RevertIf_NoDeposit() public {
        vm.prank(alice);
        vm.expectRevert(WakeUp.NotActive.selector);
        wakeup.withdraw();
    }

    function test_Withdraw_MultipleUsers() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        // Alice and Bob join
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);
        
        vm.prank(bob);
        wakeup.join{value: DEPOSIT_AMOUNT * 2}(targetTime);

        assertEq(wakeup.activeUsers(), 2);

        // Both complete challenge
        for (uint256 i = 0; i < 3; i++) {
            vm.warp(targetTime + i * 1 days);
            
            vm.prank(alice);
            wakeup.checkIn(targetTime + (i + 1) * 1 days);
            
            vm.prank(bob);
            wakeup.checkIn(targetTime + (i + 1) * 1 days);
        }

        // Alice withdraws
        vm.prank(alice);
        wakeup.withdraw();
        assertEq(wakeup.activeUsers(), 1);

        // Bob withdraws
        vm.prank(bob);
        wakeup.withdraw();
        assertEq(wakeup.activeUsers(), 0);

        assertEq(address(wakeup).balance, 0);
    }

    /*//////////////////////////////////////////////////////////////
                        EMERGENCY TESTS
    //////////////////////////////////////////////////////////////*/

    function test_EmergencyMode_AllowsWithdrawal() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        // Enable emergency mode
        wakeup.setEmergencyMode(true);
        assertTrue(wakeup.emergencyMode());

        // Alice can withdraw even with 0 streak
        vm.prank(alice);
        wakeup.withdraw();

        assertEq(alice.balance, 10 ether); // Got deposit back
    }

    function test_EmergencyMode_RevertIf_NotOwner() public {
        vm.prank(alice);
        vm.expectRevert(WakeUp.Unauthorized.selector);
        wakeup.setEmergencyMode(true);
    }

    /*//////////////////////////////////////////////////////////////
                        STATUS TESTS
    //////////////////////////////////////////////////////////////*/

    function test_GetUserStatus_Idle() public {
        (uint8 status, ) = wakeup.getUserStatus(alice);
        assertEq(status, 0); // Idle
    }

    function test_GetUserStatus_Waiting() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        (uint8 status, uint256 timeInfo) = wakeup.getUserStatus(alice);
        assertEq(status, 1); // Waiting
        assertGt(timeInfo, 0); // Time until window
    }

    function test_GetUserStatus_WindowOpen() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        vm.warp(targetTime);

        (uint8 status, uint256 timeInfo) = wakeup.getUserStatus(alice);
        assertEq(status, 2); // Window open
        assertEq(timeInfo, 15 minutes); // Time remaining
    }

    function test_GetUserStatus_Missed() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);

        vm.warp(targetTime + 20 minutes);

        (uint8 status, uint256 timeInfo) = wakeup.getUserStatus(alice);
        assertEq(status, 3); // Missed
        assertEq(timeInfo, 5 minutes); // Time since missed
    }

    function test_GetUserStatus_Success() public {
        uint256 day1 = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(day1);

        // Complete 3 check-ins
        for (uint256 i = 0; i < 3; i++) {
            vm.warp(day1 + i * 1 days);
            vm.prank(alice);
            wakeup.checkIn(day1 + (i + 1) * 1 days);
        }

        (uint8 status, uint256 timeInfo) = wakeup.getUserStatus(alice);
        assertEq(status, 4); // Success
        assertEq(timeInfo, 3); // Streak count
    }

    function test_GetStats() public {
        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(targetTime);
        
        vm.prank(bob);
        wakeup.join{value: DEPOSIT_AMOUNT * 2}(targetTime);

        (uint256 activeUsers, uint256 totalLocked, bool emergency) = wakeup.getStats();
        
        assertEq(activeUsers, 2);
        assertEq(totalLocked, DEPOSIT_AMOUNT * 3);
        assertFalse(emergency);
    }

    /*//////////////////////////////////////////////////////////////
                        REENTRANCY TESTS
    //////////////////////////////////////////////////////////////*/

    function test_Withdraw_NoReentrancy() public {
        // Deploy malicious contract
        MaliciousUser attacker = new MaliciousUser(wakeup);
        vm.deal(address(attacker), 10 ether);

        uint256 targetTime = block.timestamp + TOMORROW_7AM;
        
        // Attacker joins and completes challenge
        attacker.joinChallenge{value: DEPOSIT_AMOUNT}(targetTime);

        for (uint256 i = 0; i < 3; i++) {
            vm.warp(targetTime + i * 1 days);
            attacker.checkInChallenge(targetTime + (i + 1) * 1 days);
        }

        // Attempt reentrancy attack
        uint256 contractBalanceBefore = address(wakeup).balance;
        uint256 attackerBalanceBefore = address(attacker).balance;
        
        attacker.attemptReentrancy();

        // Verify only one withdrawal succeeded
        assertEq(address(wakeup).balance, contractBalanceBefore - DEPOSIT_AMOUNT);
        assertEq(address(attacker).balance, attackerBalanceBefore + DEPOSIT_AMOUNT); // Got deposit back once
    }
}

/**
 * @notice Malicious contract for testing reentrancy protection
 */
contract MaliciousUser {
    WakeUp public wakeup;
    bool public attacking;

    constructor(WakeUp _wakeup) {
        wakeup = _wakeup;
    }

    function joinChallenge(uint256 _target) external payable {
        wakeup.join{value: msg.value}(_target);
    }

    function checkInChallenge(uint256 _nextTarget) external {
        wakeup.checkIn(_nextTarget);
    }

    function attemptReentrancy() external {
        attacking = true;
        wakeup.withdraw();
    }

    receive() external payable {
        // Try to reenter withdraw
        if (attacking && address(wakeup).balance > 0) {
            try wakeup.withdraw() {
                // Should fail due to deleted user state
            } catch {
                // Expected to fail
            }
        }
    }
}
