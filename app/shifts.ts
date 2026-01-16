export type Shift = {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  tips: number;
  notes?: string;
};

export function calcTotals(shifts: Shift[]) {
  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
  const totalTips = shifts.reduce((sum, s) => sum + s.tips, 0);
  const hourly = totalHours > 0 ? totalTips / totalHours : 0;

  return { totalHours, totalTips, hourly };
}
