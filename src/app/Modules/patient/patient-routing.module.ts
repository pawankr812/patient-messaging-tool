import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../Guards/auth-guard.service';
import { PatientComponent } from './patient.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { AddPatientPageComponent } from './add-patient-page/add-patient-page.component'

const routes: Routes = [
  {
    path: '', component: PatientComponent,
    children: [
      {
        path: '',
        component: PatientListComponent
      },
      {
        path: 'addPatientPage',
        component: AddPatientPageComponent
      }
    ]
  }
  // {
  //   path: '', component: PatientComponent, canActivate: [AuthGuard],
  //   children: [
  //     {
  //       path: '',
  //       component: PatientListComponent,
  //       canActivate: [AuthGuard]
  //     },
  //     {
  //       path: 'addPatientPage',
  //       component: AddPatientPageComponent,
  //       canActivate: [AuthGuard]
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class PatientRoutingModule { }
