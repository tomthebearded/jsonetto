import { Column } from "./column";
import { TableRow } from "./table-row";

export interface Table {
  columns: Column[];
  rows: TableRow[];
}
