import { Component, QueryList, ViewChildren } from '@angular/core';
import { NgbdSortableHeader } from '../../directives/sortable-directive';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChildren(NgbdSortableHeader) headers?: QueryList<NgbdSortableHeader> | null;
  public active = 1;
  public hiddenColumns: string[] = [];
  public searchTerm: string = '';
  public showAlert = false;

  handleImportSuccess(event: any) {
    if (event === true)
      this.active = 2;
    else
      this.showAlert = true;
  }
}


