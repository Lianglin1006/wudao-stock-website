import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomCalendarProps {
  selected: Date;
  onSelect: (date: Date) => void;
}

export function CustomCalendar({ selected, onSelect }: CustomCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(selected));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  // 获取当月第一天是星期几
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // 获取当月天数
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 获取上个月天数
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // 生成日历数组
  const calendarDays: Array<{ day: number; isCurrentMonth: boolean; date: Date }> = [];

  // 上个月的日期
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month - 1, day)
    });
  }

  // 当月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i)
    });
  }

  // 下个月的日期（补充到42天，6周）
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }

  const isSelected = (date: Date) => {
    return (
      date.getFullYear() === selected.getFullYear() &&
      date.getMonth() === selected.getMonth() &&
      date.getDate() === selected.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (date: Date) => {
    if (!isFutureDate(date)) {
      onSelect(date);
    }
  };

  return (
    <div className="p-3 w-[280px]">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={handlePrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-7 flex items-center justify-center text-white hover:bg-[rgba(99,127,252,0.3)] rounded"
        >
          <ChevronLeft className="size-4" />
        </motion.button>
        <div className="text-sm text-white">
          {year}年 {monthNames[month]}
        </div>
        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-7 flex items-center justify-center text-white hover:bg-[rgba(99,127,252,0.3)] rounded"
        >
          <ChevronRight className="size-4" />
        </motion.button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-[0.8rem] text-[rgba(255,255,255,0.6)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7">
        {calendarDays.map((item, index) => {
          const isDisabled = isFutureDate(item.date);
          return (
            <motion.button
              key={index}
              onClick={() => handleDayClick(item.date)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.1 } : {}}
              whileTap={!isDisabled ? { scale: 0.9 } : {}}
              className={`
                h-8 flex items-center justify-center text-sm rounded
                ${!item.isCurrentMonth ? 'text-[rgba(255,255,255,0.3)]' : 'text-white'}
                ${isDisabled ? 'text-[rgba(255,255,255,0.2)] cursor-not-allowed opacity-40' : ''}
                ${isSelected(item.date) ? 'bg-[#637ffc] text-white' : ''}
                ${isToday(item.date) && !isSelected(item.date) ? 'bg-[rgba(99,127,252,0.2)]' : ''}
                ${!isSelected(item.date) && !isDisabled ? 'hover:bg-[rgba(99,127,252,0.3)]' : ''}
              `}
            >
              {item.day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
