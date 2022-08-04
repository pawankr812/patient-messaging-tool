import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './Modules/shared/shared.module';
import {  DatatableGridComponent} from './Modules/shared/datatable-grid/datatable-grid.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { ForbiddenComponent } from './Modules/errorHandlers/forbidden/forbidden.component';
import { PageNotFoundComponent } from './Modules/errorHandlers/page-not-found/page-not-found.component';
import { ErrorComponent } from './Modules/errorHandlers/error/error.component';
import { FormsModule } from '@angular/forms';
import { AuthGuard, LoggedInAuthGuard } from "./Guards/auth-guard.service";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './Interceptor/http-error.interceptor';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { SelectDashboardComponent } from './Components/select-dashboard/select-dashboard.component';
import { FilterService } from './Services/appService/filter.service';
import { PhoneFormat } from './Pipes/PhoneFormat';
import { NgxPaginationModule } from 'ngx-pagination';
import dateFormat, { masks } from "dateformat";
import {CalendarModule} from 'primeng/calendar';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ForbiddenComponent,
    PageNotFoundComponent,
    ErrorComponent,
    SelectDashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    TypeaheadModule.forRoot(),
    BrowserAnimationsModule,
    CalendarModule,
  ],
  bootstrap: [AppComponent],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  },
  FilterService,
   { 
     provide : LocationStrategy, 
     useClass: HashLocationStrategy 
   },
    AuthGuard,
    LoggedInAuthGuard
  ]
})
export class AppModule { }
