export function calculateSavingsPCT(newVal: number, oldVal: number): number {
  if (oldVal <= 0) return 0;

  const pct = ((oldVal - newVal) / oldVal) * 100;
  return Math.round(pct * 100) / 100;
}
