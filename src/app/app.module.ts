import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { JsonVisualizerComponent } from './src/components/json-visualizer-component/json-visualizer.component';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from './src/directives/sortable-directive';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import {
  EyeSlash, CaretDown, CaretUp, UsbC, Eye, BoxArrowDownRight
} from 'ng-bootstrap-icons/icons';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

const icons = {
  EyeSlash,
  CaretDown,
  CaretUp,
  UsbC,
  Eye,
  BoxArrowDownRight
};

@NgModule({
  declarations: [
    AppComponent,
    JsonVisualizerComponent
  ],
  imports: [
    AppRoutingModule,
    BootstrapIconsModule.pick(icons),
    BrowserModule,
    CommonModule,
    FormsModule,
    NgbdSortableHeader,
    NgbModule,
    NgbPaginationModule,
    NgbPopoverModule,
    NgbTypeaheadModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
