'use client';

import { useState, useMemo } from 'react';

export function usePagination(totalItems, itemsPerPage = 12) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const pagination = useMemo(() => ({
    page: currentPage,
    pages: totalPages,
    limit: itemsPerPage,
    total: totalItems,
    skip: (currentPage - 1) * itemsPerPage,
  }), [currentPage, totalPages, itemsPerPage, totalItems]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
    totalPages,
    pagination,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
