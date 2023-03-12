import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from 'src/app/src/directives/sortable-directive';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { cutString } from 'src/app/src/helpers/string.helper';
import { SortEvent } from 'src/app/src/models/sort-event';
import { TableData } from 'src/app/src/models/table-data';
import { TableRow } from 'src/app/src/models/table-row';
import { JsonService } from 'src/app/src/services/json.service';
import { Table } from 'src/app/src/models/table';

@Component({
  selector: 'visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent {
  @ViewChildren(NgbdSortableHeader) headers?: QueryList<NgbdSortableHeader> | null;
  public hiddenColumns: string[] = [];
  public table?: Table | null;
  public showAlert = false;

  constructor(private jsonService: JsonService) {
    jsonService.tableSubject.subscribe(t => this.table = t);
  }

  flat(): void {
    this.showAlert = this.jsonService.flat();
  }

  getColumn(column: string, data: TableData[]): TableData | null | undefined {
    if (!column.trim() || !data?.length)
      return null;

    return data.find(d => d.name === column);
  }

  hide(column: string, e: any): void {
    e.stopPropagation();
    e.preventDefault();
    if (!column.trim())
      return;

    if (!this.table?.columns?.length
      || !this.table?.rows?.length)
      return;

    const col = this.table.columns.find(c => c.name === column);
    if (col)
      col.visible = false;

    this.table?.rows.forEach(t => {
      const data = t.tableData.find(d => d.name === column);
      if (data)
        data.visible = false;
    });

    this.hiddenColumns.push(column);
  }

  onSort({ column, direction }: SortEvent): void {
    if (!this.headers || !this.headers.length)
      return;

    if (!this.table?.columns?.length
      || !this.table?.rows?.length)
      return;

    this.table.columns.forEach(c => {
      if (c.name === column)
        c.direction = direction;
      else
        c.direction = '';
    });

    this.headers.forEach(header => {
      if (header.sortable !== column)
        header.direction = '';
    });

    if (direction === '' || column === '')
      return;

    var sortedContent = this.table.rows.sort((a: TableRow, b: TableRow) => {
      var dataA = a.tableData.find(t => t.name === column)?.value?.toString() ?? '';
      var dataB = b.tableData.find(t => t.name === column)?.value?.toString() ?? '';
      const res = dataA < dataB ? -1 : dataA > dataB ? 1 : 0;
      return direction === 'asc' ? res : -res;
    });

    this.table = {
      columns: this.table.columns,
      rows: [...sortedContent]
    }
  }

  rowHasColumn(column: string, data: TableData[]): boolean {
    if (!column.trim() || !data || !data.length)
      return false;

    const d = data.find(d => d.name === column);
    return !!d;
  }


  show(column: string): void {
    if (!column.trim())
      return;

    if (!this.table?.columns?.length || !this.table?.rows?.length)
      return;

    const col = this.table.columns.find(c => c.name === column);
    if (col)
      col.visible = true;

    this.table.rows.forEach(t => {
      const data = t.tableData.find(d => d.name === column);
      if (data)
        data.visible = true;
    });

    this.hiddenColumns = this.hiddenColumns.filter(h => h != column);
  }

  togglePopOver(popover: NgbPopover, value: any): void {
    if (popover.isOpen())
      popover.close();

    if (typeof value === 'string'
      && this.jsonService.tryToGetJson(value))
      value = JSON.stringify(JSON.parse(value), null, 2);

    popover.open({ value });
  }
}
