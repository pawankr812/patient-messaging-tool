import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/Services/appService/appService.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/Services/userService/userService.service';
import { Router } from '@angular/router';
import { HostListener } from "@angular/core";
import { noop, Observable, Observer, of } from 'rxjs';	
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
  dashboardType=localStorage.getItem('dashboardType')
  AddPatient: boolean = false;
  ToggleBar: boolean = false;
  screenWidth: number;
  userId: any;
  userName: any;
  userFirstName: any;
  userLastName: any;
  clinicName: any;
  facilityName: any = '';
  facilityCode: string = "";
  facilityId: any = '';
  subscription: Subscription;
  mobSidebar: boolean = false;
  public dateSubscription: Subscription;
  public selectedDate = "";
  public appointmentDates: Array<[]> = [];
  search: string;	
  suggestions$: Observable<[]>;	
  facilityArray = [];
  wish:any;


  constructor(private appService: AppService, public loaderService: LoaderService,
    public userService: UserService, public router: Router) {
    this.getScreenSize();
    this.dateSubscription = this.userService.appointmentDates.subscribe(data => {
      if (data && data.length) {
        this.appointmentDates = data;
        this.selectedDate = data[0];
      }
    });
  }

  ngOnInit() {
   
    if(this.dashboardType.toLowerCase()=='amb'){
      this.dashboardType='AMB Cerner'
    }else{
      if(this.dashboardType.toLowerCase()=='amballscript'){
        this.dashboardType='AMB Allscripts'
      }
    }
   var today = new Date()
var curHr = today.getHours()

if (curHr < 12) {
  this.wish='Good Morning'
} else if (curHr < 16) {
  this.wish='Good Afternoon'
} else {
  this.wish='Good Evening'
}
    this.userName = this.userService.userName;
    this.facilityName = localStorage.getItem("dashboardType").replace("B"," ");
    this.facilityId = this.userService.facilityID;
    this.userId = this.userService.userID;

    this.suggestions$ = new Observable((observer: Observer<string>) => {	
      observer.next(this.facilityCode);	
    }).pipe(	
      switchMap((query: string) => {	
        if (query && query.length > 1) {	
          return this.appService.facilityLookup(query).pipe(	
            map((data) => {	
              data.data.forEach(element => {	
                element.facility = element.facilityCode+' - '+element.facilityName	
              });	
              this.facilityArray = data && data.data ? data.data : [];	
              return data && data.data || [] }),	
            tap(() => noop, err => {	
              this.facilityArray = [];	
            })	
          );	
        }	
        return of([]);	
      })	
    );
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }
  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.OpenToggleBar(2,event);
    event.stopPropagation()  
  }

  OpenAddPatientModal() {
    if (this.screenWidth <= 480) {
      this.AddPatient = false;
      this.router.navigate(['dashboard/addPatientPage']);
    } else if (this.screenWidth > 480) {
      this.AddPatient = true;
    }
  }

  getAddPatientFlag(event) {
    this.AddPatient = false;
    if (event == "added" || event == "updated") {
      this.loaderService.AddPatientEvent.next('getPatientList');
    }
  }

  OpenMobileSidebar() {
    this.mobSidebar = true;
  }

  CloseMobSidebar() {
    this.mobSidebar = false;
  }

  OpenToggleBar(id,event) {
    if(id == 1) {
    if (this.ToggleBar == false) {
      this.ToggleBar = true;
      event.stopPropagation()
    } else if (this.ToggleBar == true) {
      this.ToggleBar = false;
    }
  }
    else {
      this.ToggleBar = false;
    }
//      var hidediv=(document.getElementById('hideMe')as HTMLInputElement).addEventListener('mouseup',function(event){
//       if(event.target != hidediv){
//         pol.style.display = 'none';
//     }
// });  
//      console.log(hidediv)
  }

  

  logout() {
    this.userService.logout();
  }

  typeaheadOnSelect(e) {	
    
    if (e && e.value != "") {	
      let data = this.facilityArray.find(item => item['facility'] === e.value);	
      this.loaderService.showLoader = true;	
      this.appService.getUser(data ? data.facilityCode : e.value).subscribe(res => {	
        //localStorage.removeItem('userData');	
        //localStorage.removeItem('token');	
        this.userService.logout();
      
        if (res && res.facilities && res.facilities) {
          localStorage.setItem("userData", JSON.stringify(res));
          var token = btoa(JSON.stringify(res))
          localStorage.setItem("token", token);
          this.userService.setLoggedInUser();
          // this.userService.getAppointmentDates();
          // ,this.userService.redirectUser();	
          let currentPath = window.location.pathname+'/';
          if (this.userService.facilityType == 'AMB') {
            this.router.navigateByUrl('dashboard-ed');
            if(currentPath.indexOf("/dashboard-ed/")>-1)
            //if(currentPath=="/pmt/ui/dashboard")
            {
              window.location.reload();
            }
          }
          else {
            this.router.navigateByUrl('dashboard-ed');
            if(currentPath.indexOf("/dashboard-ed/")>-1)
            //if(currentPath=="/pmt/ui/dashboard-ed")
            {
              window.location.reload();
            }
          }
        }
        this.loaderService.showLoader = false;	
      },	
        error => {	
          this.loaderService.showLoader = false;	
        });	
    }	
}

noSpeacialCharacters(e) {	
  var k = e.keyCode;  
  return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.selectedDate = "";
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
    this.facilityArray = [];
  }
  
}
