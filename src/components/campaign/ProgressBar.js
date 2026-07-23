import { ProgressBar as HeroProgressBar } from '@heroui/react';
import { formatCurrency, getProgressPercent } from '@/utils/formatters';

export default function ProgressBar({ current, goal, showLabel = true }) {
  const percent = getProgressPercent(current, goal);

  return (
    <div className="w-full">
      <HeroProgressBar
        value={percent}
        color={percent >= 100 ? 'success' : 'primary'}
        size="md"
        className="w-full"
        showLabel={showLabel}
        aria-label={`${percent}% funded`}
      />
      <div className="flex justify-between mt-1 text-sm">
        <span className="font-semibold text-gray-900">{formatCurrency(current)}</span>
        <span className="text-gray-500">of {formatCurrency(goal)} goal</span>
      </div>
    </div>
  );
}
