'use client';

import { Select, SelectItem, Input } from '@heroui/react';
import { CAMPAIGN_CATEGORIES } from '@/utils/constants';

const sortOptions = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'most-funded', label: 'Most Funded' },
  { key: 'most-backed', label: 'Most Backed' },
  { key: 'ending-soon', label: 'Ending Soon' },
];

const categoryItems = CAMPAIGN_CATEGORIES.map((c) => ({ key: c.value, label: c.label }));

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

      <Select
        placeholder="Category"
        selectedKeys={filters.category ? [filters.category] : []}
        onSelectionChange={(keys) => onFilterChange({ ...filters, category: Array.from(keys)[0] || '' })}
        className="w-full sm:w-48"
      >
        <SelectItem key="">All Categories</SelectItem>
        {categoryItems.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))}
      </Select>

      <Select
        placeholder="Sort by"
        selectedKeys={[filters.sort || 'newest']}
        onSelectionChange={(keys) => onFilterChange({ ...filters, sort: Array.from(keys)[0] || 'newest' })}
        className="w-full sm:w-48"
      >
        {sortOptions.map((item) => (
          <SelectItem key={item.key}>{item.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
