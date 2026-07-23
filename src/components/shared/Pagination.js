'use client';

import { Button } from '@heroui/react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        size="sm"
        variant="light"
        isDisabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        Prev
      </Button>

      {start > 1 && (
        <>
          <Button size="sm" variant="light" onPress={() => onPageChange(1)}>1</Button>
          {start > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          size="sm"
          variant={page === currentPage ? 'solid' : 'light'}
          color={page === currentPage ? 'primary' : 'default'}
          onPress={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400">...</span>}
          <Button size="sm" variant="light" onPress={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="light"
        isDisabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}
