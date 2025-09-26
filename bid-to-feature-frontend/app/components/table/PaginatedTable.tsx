import { useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface PaginatedTableProps {
  headers: string[];
  data: any[][];
  itemsPerPage?: number;
}

const getPaginationRange = (totalPages: number, currentPage: number) => {
  const range: number[] = [];
  const delta = 1;

  range.push(1);

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (totalPages > 1) {
    range.push(totalPages);
  }

  const withEllipses: (string | number)[] = [range[0]];
  for (let i = 1; i < range.length; i++) {
    if (range[i] - range[i - 1] > 1) {
      withEllipses.push('...');
    }
    withEllipses.push(range[i]);
  }

  return withEllipses;
};

export default function PaginatedTable({
  headers,
  data,
  itemsPerPage = 10,
}: PaginatedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const paginationRange = getPaginationRange(totalPages, currentPage);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 font-medium bg-slate-50 rounded-md">
            <tr>
              {headers.map((header) => (
                <th key={header} scope="col" className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-slate-100">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
        <span className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{' '}
          {data.length} entries
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <LuChevronLeft />
          </button>
          <div className="flex items-center gap-1">
            {paginationRange.map((page, index) =>
              typeof page === 'number' ? (
                <button
                  key={index}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-3 py-1">
                  {page}
                </span>
              )
            )}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <LuChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
