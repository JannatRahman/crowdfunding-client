'use client';

import { useState } from 'react';
import { useCampaigns } from '@/hooks/useCampaigns';
import CampaignGrid from '@/components/campaign/CampaignGrid';
import CampaignFilters from '@/components/campaign/CampaignFilters';
import Pagination from '@/components/shared/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { getDaysLeft } from '@/utils/formatters';

export default function CampaignsPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'newest',
    page: 1,
  });

  const debouncedSearch = useDebounce(filters.search);
  const { data, isLoading } = useCampaigns({
    search: debouncedSearch,
    category: filters.category,
    sort: filters.sort,
    page: filters.page,
    limit: 12,
  });

  const campaigns = (data?.campaigns || []).filter((c) => {
    const daysLeft = getDaysLeft(c.endDate || c.deadline);
    const isValidStatus = c.status === 'active' || c.status === 'approved';
    return daysLeft > 0 && isValidStatus;
  });
  const pagination = data?.pagination || { pages: 1, page: 1 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Campaigns</h1>
        <p className="text-gray-500 mt-1">Discover amazing projects to support</p>
      </div>

      <CampaignFilters filters={filters} onFilterChange={setFilters} />

      <CampaignGrid campaigns={campaigns} isLoading={isLoading} />

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />
    </div>
  );
}
