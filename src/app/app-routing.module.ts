import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { ForbiddenComponent } from './Modules/errorHandlers/forbidden/forbidden.component';
import { PageNotFoundComponent } from './Modules/errorHandlers/page-not-found/page-not-found.component';
import { ErrorComponent } from './Modules/errorHandlers/error/error.component';
import { AuthGuard, LoggedInAuthGuard} from './Guards/auth-guard.service';
import { SelectDashboardComponent } from './Components/select-dashboard/select-dashboard.component';
const routes: Routes = [
  // { path: 'PHS', component: LandingPageComponent, canActivate:[LoggedInAuthGuard] },
  { path: '', redirectTo:'select-dashboard', pathMatch:'full' },
  {path: 'select-dashboard', component: SelectDashboardComponent},
 
  {
    path: 'dashboard',
    loadChildren: () => import('./Modules/patient/patient.module').then(m => m.PatientModule),
    // canActivate: [AuthGuard]
  },
 
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}