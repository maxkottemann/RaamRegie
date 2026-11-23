export type VanDay = {
  date: string;
  employee: string[];
  van_id: string;
};
interface VanDaySelection {
  items: VanDay[];
  count: number;
}
