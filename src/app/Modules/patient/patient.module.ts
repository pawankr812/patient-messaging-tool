import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { AddPatientPageComponent } from './add-patient-page/add-patient-page.component';
import { SharedModule } from 'src/app/Modules/shared/shared.module';
//import { PageHeaderComponent } from '../page-header/page-header.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask'
//import { CustomTime } from '../../Pipes/CustomTime';
import { JwPaginationModule } from 'jw-angular-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddFamilyComponent } from './add-family/add-family.component';
import {CalendarModule} from 'primeng/calendar';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;


@NgModule({
  declarations: [
    PatientComponent,
    PatientListComponent,
    AddPatientPageComponent,
    //PageHeaderComponent,
    AddPatientComponent,
    AddFamilyComponent
    //CustomTime,
  ],
  imports: [
    CommonModule,
    SharedModule,
    PatientRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(options),
    JwPaginationModule,
    CalendarModule
  ],
  providers: []
})
export class PatientModule { }
