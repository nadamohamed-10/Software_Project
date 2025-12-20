import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

describe('usePagination Hook', () => {
  const testData = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePagination({ data: testData }));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5); // 50 items / 10 items per page
    expect(result.current.itemsPerPage).toBe(10);
    expect(result.current.totalItems).toBe(50);
    expect(result.current.currentItems).toHaveLength(10);
    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPrevPage).toBe(false);
  });

  it('should paginate data correctly', () => {
    const { result } = renderHook(() => usePagination({ data: testData, itemsPerPage: 5 }));

    // First page
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(10); // 50 items / 5 items per page
    expect(result.current.currentItems).toEqual([
      'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'
    ]);

    // Go to second page
    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems).toEqual([
      'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'
    ]);
  });

  it('should navigate between pages', () => {
    const { result } = renderHook(() => usePagination({ data: testData, itemsPerPage: 10 }));

    // Initially on first page
    expect(result.current.currentPage).toBe(1);
    expect(result.current.hasPrevPage).toBe(false);
    expect(result.current.hasNextPage).toBe(true);

    // Go to next page
    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.hasPrevPage).toBe(true);
    expect(result.current.hasNextPage).toBe(true);

    // Go to last page
    act(() => {
      result.current.goToPage(5);
    });

    expect(result.current.currentPage).toBe(5);
    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPrevPage).toBe(true);

    // Try to go to next page from last page (should stay on last page)
    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(5);

    // Go to previous page
    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(4);
  });

  it('should handle edge cases', () => {
    // Empty data
    const { result: emptyResult } = renderHook(() => usePagination({ data: [] }));
    expect(emptyResult.current.totalPages).toBe(0);
    expect(emptyResult.current.currentItems).toHaveLength(0);

    // Data smaller than itemsPerPage
    const smallData = ['Item 1', 'Item 2', 'Item 3'];
    const { result: smallResult } = renderHook(() => usePagination({ data: smallData, itemsPerPage: 5 }));
    expect(smallResult.current.totalPages).toBe(1);
    expect(smallResult.current.currentItems).toEqual(smallData);
  });

  it('should handle invalid page numbers gracefully', () => {
    const { result } = renderHook(() => usePagination({ data: testData, itemsPerPage: 10 }));

    // Try to go to page 0 (should go to page 1)
    act(() => {
      result.current.goToPage(0);
    });
    expect(result.current.currentPage).toBe(1);

    // Try to go to page beyond last page (should go to last page)
    act(() => {
      result.current.goToPage(10);
    });
    expect(result.current.currentPage).toBe(5); // Last page
  });
});