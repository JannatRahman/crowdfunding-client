'use client';

import { useEffect, useRef, useState } from 'react';

export default function useCountUp(target, { duration = 1000, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(0 + (target - 0) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return decimals > 0 ? Number(value.toFixed(decimals)) : Math.round(value);
}
