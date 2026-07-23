'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer({ endDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  function getTimeLeft(end) {
    const diff = new Date(end) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span className="text-red-500 font-semibold">Campaign ended</span>;
  }

  return (
    <div className="flex gap-3">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map(({ value, label }) => (
        <div key={label} className="text-center">
          <div className="w-14 h-14 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xl font-bold">
            {String(value).padStart(2, '0')}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  );
}
