import React from 'react';

import { type Updater } from 'use-immer';

import { PAGE_SIZE_OPTIONS } from '@/constants';

import { IconSolarMenuDots } from '../icons';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type PaginationProps = {
  total?: number;
  params: {
    pageIndex: number;
    pageSize: number;
  };
  updateParams: Updater<{
    pageIndex: number;
    pageSize: number;
  }>;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
};

export const Pagination = ({
  params,
  updateParams,
  total = 0,
  showSizeChanger,
  showQuickJumper,
}: PaginationProps) => {
  const pageCount = Math.ceil(total / params.pageSize);
  const delta = 3;

  const [quickJumpPage, setQuickJumpPage] = React.useState('');

  // Memoize pagination range to avoid unnecessary re-renders
  const paginationRange = React.useMemo(() => {
    const range = [];
    for (
      let i = Math.max(2, Number(params.pageIndex) - delta);
      i <= Math.min(pageCount - 1, Number(params.pageIndex) + delta);
      i++
    ) {
      range.push(i);
    }

    if (Number(params.pageIndex) - delta > 2) {
      range.unshift('...');
    }
    if (Number(params.pageIndex) + delta < pageCount - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (pageCount !== 1) {
      range.push(pageCount);
    }

    return range;
  }, [pageCount, params]);

  return (
    <div className="flex items-center space-x-6 lg:space-x-8 py-4">
      <div className="flex items-center space-x-2">
        {paginationRange.map((pageNumber, i) =>
          pageNumber === '...' ? (
            <Button key={i} variant="ghost" className="!cursor-not-allowed">
              <IconSolarMenuDots />
            </Button>
          ) : (
            <Button
              key={i}
              variant={
                pageNumber === Number(params.pageIndex) ? 'outline' : 'ghost'
              }
              onClick={() => {
                updateParams((draft) => {
                  draft.pageIndex = Number(pageNumber);
                });
              }}
            >
              {pageNumber}
            </Button>
          ),
        )}
        {showQuickJumper && (
          <div className="flex items-center space-x-2">
            跳转至
            <Input
              className="w-12 mx-2"
              value={quickJumpPage}
              onChange={(e) => {
                if (Number(e.target.value?.trim())) {
                  setQuickJumpPage(`${Number(e.target.value?.trim())}`);
                }
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  updateParams((draft) => {
                    draft.pageIndex = Math.min(
                      Number(quickJumpPage),
                      pageCount,
                    );
                  });
                  setQuickJumpPage('');
                }
              }}
            />
            页
          </div>
        )}
        {showSizeChanger && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium whitespace-nowrap">每页条数</p>
            <Select
              value={`${params.pageSize}`}
              onValueChange={(value) => {
                updateParams((draft) => {
                  draft.pageSize = Number(value);
                });
              }}
            >
              <SelectTrigger className="h-10 w-[70px]">
                <SelectValue placeholder={params.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};