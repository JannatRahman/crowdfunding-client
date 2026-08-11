'use client';

import { FormInput } from '@/components/shared/FormField';
import { CAMPAIGN_CATEGORIES } from '@/utils/constants';

const sortOptions = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'most-funded', label: 'Most Funded' },
  { key: 'most-backed', label: 'Most Backed' },
  { key: 'ending-soon', label: 'Ending Soon' },
];

const selectClasses =
  'w-full sm:w-48 px-4 py-2.5 border border-cf-tan rounded-xl text-sm font-semibold text-cf-dark bg-white shadow-sm outline-none focus:border-cf-dark transition-colors cursor-pointer';

export default function CampaignFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <FormInput
        placeholder="Search campaigns..."
        value={filters.search || ''}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        className="flex-1"
        classNames={{
          inputWrapper: 'border border-cf-tan hover:border-cf-dark/50 focus-within:!border-cf-dark rounded-xl bg-white shadow-sm transition-all duration-200',
        }}
        startContent={
          <svg className="w-4 h-4 text-cf-brown/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      <select
        value={filters.category || ''}
        onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        className={selectClasses}
      >
        <option value="">All Categories</option>
        {CAMPAIGN_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <select
        value={filters.sort || 'newest'}
        onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
        className={selectClasses}
      >
        {sortOptions.map((item) => (
          <option key={item.key} value={item.key}>{item.label}</option>
        ))}
      </select>
    </div>
  );
}
