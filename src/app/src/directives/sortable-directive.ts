import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { SortColumn, SortDirection, SortEvent } from '../models/sort-event';


@Directive({
  selector: 'th[sortable]',
  standalone: true,
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();
  newDirection: { [key: string]: SortDirection } = { asc: 'desc', desc: '', '': 'asc' };

  rotate() {
    this.direction = this.newDirection[this.direction];
    this.sort.emit({ column: this.sortable, direction: this.direction });
  }
}
