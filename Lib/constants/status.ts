export const STATUS_FLOW = [
  'LEAD',
  'QUOTATION',
  'APPROVED',
  'PICKUP_VERIFIED',
  'STORED',
  'RETURNED',
  'CLOSED',
] as const;

export type Status = typeof STATUS_FLOW[number] | 'DISPUTE';

export function statusBerikutnya(status: string): string | null {
  const idx = STATUS_FLOW.indexOf(status as any);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}
