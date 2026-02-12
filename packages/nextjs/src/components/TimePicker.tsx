'use client';

import { useState } from 'react';

interface TimePickerProps {
  value: string; // 格式: "HH:mm"
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

/**
 * 时间选择器组件
 * 支持每 5 分钟为一个单位选择
 */
export function TimePicker({ value, onChange, disabled, label, description }: TimePickerProps) {
  // 解析当前时间
  const [hours, minutes] = value.split(':').map(Number);

  // 生成小时选项（00-23）
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);

  // 生成分钟选项（每 5 分钟）
  const minuteOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  // 处理小时变化
  const handleHourChange = (newHour: number) => {
    onChange(`${String(newHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  // 处理分钟变化
  const handleMinuteChange = (newMinute: number) => {
    onChange(`${String(hours).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex items-center space-x-3">
        {/* 小时选择 */}
        <div className="flex-1">
          <select
            value={hours}
            onChange={(e) => handleHourChange(Number(e.target.value))}
            disabled={disabled}
            className="input text-center text-lg font-semibold"
          >
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}
              </option>
            ))}
          </select>
          <div className="text-center text-xs text-gray-500 mt-1">小时</div>
        </div>

        <div className="text-2xl font-bold text-gray-400">:</div>

        {/* 分钟选择 */}
        <div className="flex-1">
          <select
            value={minutes}
            onChange={(e) => handleMinuteChange(Number(e.target.value))}
            disabled={disabled}
            className="input text-center text-lg font-semibold"
          >
            {minuteOptions.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}
              </option>
            ))}
          </select>
          <div className="text-center text-xs text-gray-500 mt-1">分钟</div>
        </div>
      </div>

      {description && (
        <div className="mt-2 text-xs text-gray-500">
          {description}
        </div>
      )}
    </div>
  );
}
