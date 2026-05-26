export const queryKeys = {
  psychologists: {
    all: ['psychologists'] as const,
    list: () => ['psychologists', 'list'] as const,
    detail: (id: number) => ['psychologists', 'detail', id] as const,
    availability: (id: number, dateFrom: string, dateTo: string) =>
      ['psychologists', 'availability', id, dateFrom, dateTo] as const,
  },
};
