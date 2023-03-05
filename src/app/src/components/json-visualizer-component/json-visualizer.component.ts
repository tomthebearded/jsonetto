import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from '../../directives/sortable-directive';
import { SortEvent } from '../../models/sort-event';
import { TableData } from '../../models/table-data';
import { TableRow } from '../../models/table-row';

@Component({
  selector: 'json-visualizer',
  templateUrl: './json-visualizer.component.html',
  styleUrls: ['./json-visualizer.component.scss']
})
export class JsonVisualizerComponent {
  @ViewChildren(NgbdSortableHeader) headers?: QueryList<NgbdSortableHeader> | null;
  private json: any;
  private jsonArray?: any[] | null;
  public active = 1;
  public columns: { name: string, direction: string, visible: boolean }[] = [];
  public content: TableRow[] = [];
  public hiddenColumns: string[] = [];
  public searchTerm: string = '';
  public showAlert = false;
  public tableContent: TableRow[] = [];
  public value?: string | null;

  onFiledrop(event: any) {
    if (!event?.target?.files
      || event.target.files > 1)
      return;
    if (!this.validateExtensions(event.target.files[0]))
      this.showAlert = true;

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      this.value = event?.target?.result?.toString();
      this.import();
    });
    reader.readAsText(event.target.files[0]);
  }

  import(): void {
    this.resetData();

    if (!this.value?.trim())
      return;

    this.json = this.tryToGetJson(this.value);

    if (!this.json) {
      this.showAlert = true;
      return;
    }

    this.jsonArray = Array.isArray(this.json)
      ? this.json
      : [this.json];

    this.jsonArray.forEach(j => {
      const row = new TableRow();
      this.unpackJson(j, row);
      this.content.push(row);
    });

    this.tableContent = this.content;
    this.active = 2;
  }

  show(column: string) {
    if (!column.trim())
      return;

    const col = this.columns.find(c => c.name === column);
    if (col)
      col.visible = true;

    this.tableContent.forEach(t => {
      const data = t.tableData.find(d => d.name === column);
      if (data)
        data.visible = true;
    });

    this.hiddenColumns = this.hiddenColumns.filter(h => h != column);
  }

  hide(column: string, e: any) {
    e.stopPropagation();
    e.preventDefault();
    if (!column.trim())
      return;

    const col = this.columns.find(c => c.name === column);
    if (col)
      col.visible = false;

    this.tableContent.forEach(t => {
      const data = t.tableData.find(d => d.name === column);
      if (data)
        data.visible = false;
    });

    this.hiddenColumns.push(column);
  }

  onSort({ column, direction }: SortEvent) {
    if (!this.headers || !this.headers.length)
      return;

    this.columns.forEach(c => {
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
      return this.tableContent;

    var sortedContent = this.content.sort((a: TableRow, b: TableRow) => {
      var dataA = a.tableData.find(t => t.name === column)?.value?.toString() ?? '';
      var dataB = b.tableData.find(t => t.name === column)?.value?.toString() ?? '';
      const res = dataA < dataB ? -1 : dataA > dataB ? 1 : 0;
      return direction === 'asc' ? res : -res;
    });

    return this.tableContent = [...sortedContent];
  }

  togglePopOver(popover: NgbPopover, value: any): void {
    if (popover.isOpen())
      popover.close();
    else {
      if (typeof value === 'string') {
        var json = this.tryToGetJson(value);
        if (json)
          value = JSON.stringify(JSON.parse(value), null, 2);
      }
    }

    popover.open({ value });
  }

  flat() {
    this.content = [];
    if (!this.jsonArray || !this.jsonArray.length)
      return;
    try {
      this.columns = [];
      this.jsonArray.forEach(j => {
        const row = new TableRow();
        this.unpackAndFlatJson(j, row);
        this.content.push(row);
      });
      this.tableContent = this.content;
    } catch {
      this.showAlert = true;
    }
  }

  private unpackAndFlatJson(json: any, tableRow: TableRow, prefix?: string | null): void {
    if (!json || !tableRow)
      return;

    let currentValue: any;

    Object.keys(json).forEach(k => {
      var data = new TableData();
      data.name = !prefix?.trim() ? k : prefix + k;

      currentValue = json[k];

      if (typeof (currentValue) != 'object') {
        data.value = this.cutString(currentValue.toString());
        data.context = currentValue;
        tableRow.tableData.push(data);
        if (!this.columns.find(c => c.name === data.name))
          this.columns.push({ name: data.name, direction: '', visible: true });
      }
      else {
        if (Array.isArray(currentValue)) {
          if (currentValue.every(c => typeof c === 'object'))
            for (let i = 0; i < currentValue.length; i++)
              this.unpackAndFlatJson(currentValue[i], tableRow, k + "[" + i + "].");
          else {
            data.value = '[...]';
            data.context = JSON.stringify(currentValue);
            tableRow.tableData.push(data);
            if (!this.columns.find(c => c.name === data.name))
              this.columns.push({ name: data.name, direction: '', visible: true });
          }
        } else {
          this.unpackAndFlatJson(currentValue, tableRow, k + ".");
        }
      }
    });

  }

  rowHasColumn(column: string, data: TableData[]): boolean {
    if (!column.trim()
      || !data
      || !data.length) {
      return false;
    }

    const d = data.find(d => d.name === column);

    if (d)
      return true;

    return false;
  }

  getColumn(column: string, data: TableData[]): TableData | null | undefined {
    if (!column.trim()
      || !data
      || !data.length) {
      return null;
    }

    return data.find(d => d.name === column);
  }

  private unpackJson(json: any, tableRow: TableRow): void {
    if (!json || !tableRow)
      return;

    let currentValue: any;

    Object.keys(json).forEach(k => {
      var data = new TableData();
      data.name = k;

      if (!this.columns.find(c => c.name === k))
        this.columns.push({ name: k, direction: '', visible: true });

      currentValue = json[k];

      if (typeof (currentValue) != 'object') {
        data.value = this.cutString(currentValue.toString());
        data.context = currentValue;
      }
      else {
        data.value = Array.isArray(currentValue) ? '[...]' : '{...}';
        data.context = JSON.stringify(currentValue);
      }

      tableRow.tableData.push(data);
    });
  }

  private cutString(str?: string | null): string {
    if (!str?.trim())
      return '';

    if (str.length > 17)
      str = `${str.slice(0, 17)}...`;

    return str;
  }

  private resetData(): void {
    this.columns = [];
    this.content = [];
    this.json = null;
    this.jsonArray = null;
    this.searchTerm = '';
    this.tableContent = [];
    this.hiddenColumns = [];
  }

  private tryToGetJson(str?: string | null): any {
    if (!str?.trim())
      return null;

    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  private validateExtensions(file: File): boolean {
    let extension = file?.name?.toLowerCase().match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)?.[0]
    return extension === '.json';
  }
}


