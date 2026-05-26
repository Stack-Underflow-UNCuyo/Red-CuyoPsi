export const queryKeys = {
  psychologists: {
    all: ['psychologists'] as const,
    list: () => ['psychologists', 'list'] as const,
    detail: (id: number) => ['psychologists', 'detail', id] as const,
    availability: (id: number, dateFrom: string, dateTo: string) =>
      ['psychologists', 'availability', id, dateFrom, dateTo] as const,
    transactions: (id: number, month?: string) =>
      ['psychologists', 'transactions', id, month] as const,
  },
  appointments: {
    all: ['appointments'] as const,
    detail: (id: number) => ['appointments', 'detail', id] as const,
    byPatient: (patientId: number) => ['appointments', 'patient', patientId] as const,
  },
  patients: {
    all: ['patients'] as const,
    detail: (id: number) => ['patients', 'detail', id] as const,
  },
  sessionNotes: {
    all: ['sessionNotes'] as const,
    byPatient: (patientId: number) => ['sessionNotes', 'patient', patientId] as const,
  },
};
