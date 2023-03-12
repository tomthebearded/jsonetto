import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { cutString } from "../helpers/string.helper";
import { Table } from "../models/table";
import { TableData } from "../models/table-data";
import { TableRow } from "../models/table-row";

@Injectable()
export class JsonService {
  private rows: TableRow[] = [];
  private json: any;
  private jsonArray?: any[] | null;
  private columns: { name: string, direction: string, visible: boolean }[] = [];
  public tableSubject = new BehaviorSubject<Table | null>(null);

  flat(): boolean {
    this.rows = [];
    if (!this.jsonArray || !this.jsonArray.length)
      return false;
      
    try {
      this.columns = [];
      this.jsonArray.forEach(j => {
        const row = new TableRow();
        this.unpackAndFlatJson(j, row);
        this.rows.push(row);
      });
      this.tableSubject.next({ columns: this.columns, rows: this.rows });
      return true;
    } catch {
      return false;
    }
  }

  public import(value?: string | undefined): boolean {
    this.resetData();

    if (!value?.trim())
      return false;

    this.json = this.tryToGetJson(value);

    if (!this.json)
      return false;

    this.jsonArray = Array.isArray(this.json)
      ? this.json
      : [this.json];

    try {
      this.jsonArray.forEach(j => {
        const row = new TableRow();
        this.unpackJson(j, row);
        this.rows.push(row);
      });
      this.tableSubject.next({ columns: this.columns, rows: this.rows });
      return true;
    }
    catch {
      return false;
    }

  }

  public tryToGetJson(str?: string | null): any {
    if (!str?.trim())
      return null;

    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  private resetData(): void {
    this.rows = [];
    this.json = null;
    this.jsonArray = null;
    this.columns = [];
    this.rows = [];
    this.tableSubject.next(null);
  }

  unpackAndFlatJson(json: any, tableRow: TableRow, prefix?: string | null): void {
    if (!json || !tableRow)
      return;

    let currentValue: any;

    Object.keys(json).forEach(k => {
      var data = new TableData();
      data.name = !prefix?.trim() ? k : prefix + k;

      currentValue = json[k];

      if (typeof (currentValue) != 'object') {
        data.value = cutString(currentValue.toString());
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
        } else
          this.unpackAndFlatJson(currentValue, tableRow, k + ".");
      }
    });

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
        data.value = cutString(currentValue.toString());
        data.context = currentValue;
      }
      else {
        data.value = Array.isArray(currentValue) ? '[...]' : '{...}';
        data.context = JSON.stringify(currentValue);
      }

      tableRow.tableData.push(data);
    });
  }
}

