export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}
export type SortColumn = keyof any | '';
export type SortDirection = 'asc' | 'desc' | '';
