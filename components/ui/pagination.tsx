"use client";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  offset: number;
  limit: number;
  total: number;
  onPageChange: (newOffset: number) => void;
};

export default function Pagination({
  offset,
  limit,
  total,
  onPageChange,
}: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const handlePrevious = () => {
    if (offset > 0) {
      onPageChange(Math.max(offset - limit, 0));
    }
  };

  const handleNext = () => {
    if (offset + limit < total) {
      onPageChange(offset + limit);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4">
      <Button onClick={handlePrevious} disabled={offset === 0}>
        Sebelumnya
      </Button>

      <span>
        Halaman {currentPage} dari {totalPages}
      </span>

      <Button onClick={handleNext} disabled={offset + limit >= total}>
        Berikutnya
      </Button>
    </div>
  );
}
