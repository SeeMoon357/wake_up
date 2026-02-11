// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/WakeUp.sol";

/**
 * @title Deploy
 * @notice Deployment script for WakeUp contract
 * @dev Run with: forge script script/Deploy.s.sol --rpc-url <network> --broadcast
 */
contract Deploy is Script {
    function run() external returns (WakeUp) {
        // Get deployer private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy WakeUp contract
        WakeUp wakeup = new WakeUp();

        console.log("===========================================");
        console.log("WakeUp Contract Deployed!");
        console.log("===========================================");
        console.log("Contract Address:", address(wakeup));
        console.log("Deployer (Owner):", vm.addr(deployerPrivateKey));
        console.log("Network:", block.chainid);
        console.log("===========================================");
        console.log("");
        console.log("Contract Configuration:");
        console.log("- Min Deposit:", wakeup.MIN_DEPOSIT() / 1e18, "ETH");
        console.log("- Max Deposit:", wakeup.MAX_DEPOSIT() / 1e18, "ETH");
        console.log("- Check-in Window:", wakeup.CHECKIN_WINDOW() / 60, "minutes");
        console.log("- Success Threshold:", wakeup.SUCCESS_THRESHOLD(), "check-ins");
        console.log("===========================================");

        vm.stopBroadcast();

        return wakeup;
    }
}
