// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/WakeUp.sol";

/**
 * @title WakeUp18HourTest
 * @notice 测试 18 小时间隔的新逻辑
 */
contract WakeUp18HourTest is Test {
    WakeUp public wakeup;
    address public alice;

    uint256 constant DEPOSIT_AMOUNT = 0.01 ether;

    function setUp() public {
        wakeup = new WakeUp();
        alice = makeAddr("alice");
        vm.deal(alice, 10 ether);
    }

    /**
     * 测试：周六 9:00 打卡 → 周日 7:00（往前调 2 小时）
     * 应该成功，因为间隔 22 小时 > 18 小时
     */
    function test_CheckIn_AllowEarlierTime() public {
        // 周六加入，设定周日 09:00
        uint256 sunday9am = block.timestamp + 1 days + 9 hours;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(sunday9am);

        // 周日 09:00 打卡
        vm.warp(sunday9am);
        
        // 设定周一 07:00（往前调 2 小时）
        uint256 monday7am = sunday9am + 1 days - 2 hours; // 22 小时后
        
        vm.prank(alice);
        wakeup.checkIn(monday7am); // 应该成功

        WakeUp.User memory user = wakeup.getUser(alice);
        assertEq(user.streak, 1);
        assertEq(user.nextCheckIn, monday7am);
    }

    /**
     * 测试：第二次打卡时，设定 17 小时后的时间
     * 应该失败，因为 < 18 小时
     */
    function test_CheckIn_RevertIf_Only17Hours() public {
        uint256 day1 = block.timestamp + 1 days;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(day1);

        // 第一次打卡（成功）
        vm.warp(day1);
        uint256 day2 = day1 + 24 hours;
        vm.prank(alice);
        wakeup.checkIn(day2);

        // 第二次打卡，尝试设定 17 小时后（应该失败）
        vm.warp(day2);
        uint256 nextTarget = day2 + 17 hours;
        
        vm.prank(alice);
        vm.expectRevert(WakeUp.IntervalTooShort.selector);
        wakeup.checkIn(nextTarget);
    }

    /**
     * 测试：打卡后 18 小时整设定下次时间
     * 应该成功（边界测试）
     */
    function test_CheckIn_Allow18HoursExact() public {
        uint256 day1 = block.timestamp + 1 days;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(day1);

        vm.warp(day1);
        
        // 设定 18 小时后（应该成功）
        uint256 nextTarget = day1 + 18 hours;
        
        vm.prank(alice);
        wakeup.checkIn(nextTarget);

        assertEq(wakeup.getUser(alice).streak, 1);
    }

    /**
     * 测试：灵活作息场景
     * 周末 9:00 → 工作日 7:00 → 周末 9:00
     */
    function test_CheckIn_FlexibleSchedule() public {
        // 周六 9:00
        uint256 sat9am = block.timestamp + 1 days + 9 hours;
        
        vm.prank(alice);
        wakeup.join{value: DEPOSIT_AMOUNT}(sat9am);

        // 周六 9:00 打卡，设定周日 9:00
        vm.warp(sat9am);
        uint256 sun9am = sat9am + 24 hours;
        vm.prank(alice);
        wakeup.checkIn(sun9am);
        assertEq(wakeup.getUser(alice).streak, 1);

        // 周日 9:00 打卡，设定周一 7:00（往前调）
        vm.warp(sun9am);
        uint256 mon7am = sun9am + 22 hours; // 22 小时 > 18 小时
        vm.prank(alice);
        wakeup.checkIn(mon7am);
        assertEq(wakeup.getUser(alice).streak, 2);

        // 周一 7:00 打卡，设定周二 7:00
        vm.warp(mon7am);
        uint256 tue7am = mon7am + 24 hours;
        vm.prank(alice);
        wakeup.checkIn(tue7am);
        assertEq(wakeup.getUser(alice).streak, 3);

        // 完成挑战！
        (uint8 status, ) = wakeup.getUserStatus(alice);
        assertEq(status, 4); // Success
    }
}
