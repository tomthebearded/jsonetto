import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbPaginationModule, NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import {
  BoxArrowDownRight, CaretDown,
  CaretUp, Eye, EyeSlash, UsbC
} from 'ng-bootstrap-icons/icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbdSortableHeader } from './src/directives/sortable-directive';
import { HomeComponent } from './src/pages/home/home.component';
import { ImportComponent } from './src/pages/home/components/import/import.component';
import { VisualizerComponent } from './src/pages/home/components/visualizer/visualizer.component';
import { JsonService } from './src/services/json.service';

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
    HomeComponent,
    ImportComponent,
    VisualizerComponent
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
  providers: [
    JsonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
