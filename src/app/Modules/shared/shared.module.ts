import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LeftPanelComponent } from './leftPanel/left-panel.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { CustomTime } from 'src/app/Pipes/CustomTime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DatatableComponent } from './datatable/datatable.component';
import { JwPaginationModule } from 'jw-angular-pagination';
import { PhoneFormat } from 'src/app/Pipes/PhoneFormat';
import { DatatableGridComponent } from './datatable-grid/datatable-grid.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {CalendarModule} from 'primeng/calendar'
@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    LeftPanelComponent,
    PageHeaderComponent,
    CustomTime,
    PhoneFormat,
    DatatableComponent,
    DatatableGridComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    JwPaginationModule,
    TypeaheadModule.forRoot(),
    NgxPaginationModule,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    LeftPanelComponent,
    PageHeaderComponent,
    CustomTime,
    DatatableComponent,
    DatatableGridComponent,
    PhoneFormat,
  ]
})
export class SharedModule { }
