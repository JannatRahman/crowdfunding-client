'use client';

import { Input } from '@heroui/react';
import { CAMPAIGN_CATEGORIES } from '@/utils/constants';

const sortOptions = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'most-funded', label: 'Most Funded' },
  { key: 'most-backed', label: 'Most Backed' },
  { key: 'ending-soon', label: 'Ending Soon' },
];

export default function CampaignFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Input
        placeholder="Search campaigns..."
        value={filters.search || ''}
        onValueChange={(v) => onFilterChange({ ...filters, search: v })}
        className="flex-1"
        startContent={
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      <select
        value={filters.category || ''}
        onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        className="w-full sm:w-48 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        {CAMPAIGN_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <select
        value={filters.sort || 'newest'}
        onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
        className="w-full sm:w-48 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sortOptions.map((item) => (
          <option key={item.key} value={item.key}>{item.label}</option>
        ))}
      </select>
    </div>
  );
}
