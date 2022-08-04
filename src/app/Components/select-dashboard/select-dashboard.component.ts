import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/Services/appService/appService.service';

@Component({
  selector: 'app-select-dashboard',
  templateUrl: './select-dashboard.component.html',
  styleUrls: ['./select-dashboard.component.css']
})
export class SelectDashboardComponent implements OnInit {
dashboardList:any;
showCondition:any;
  constructor(private _router: Router ,public appService: AppService,) { }

  ngOnInit() {
    this.getDashboardList();
  }
  getAppointmentsFromCerner(){
    this.appService.getAppointmentFromCerner().subscribe(data => {
      console.log(' data',data);
   });
  }
  getAppointmentsFromAllscript(){
    this.appService.getAppointmentFromAllscript().subscribe(data => {
      console.log(' data',data);
   });
  }
  getDashboardList() {
     this.appService.getDashboardsList().subscribe(data => {
        this.dashboardList =data.data.facilities;
        console.log('dashboard data',this.dashboardList);
     });
  }
  
  navigateTo(value) {
    this.showCondition=value
    let endurl ="dashboard";
    localStorage.setItem('dashboardType',value);
    if (value) {
      if(value=="AMB")
      {
          this.getAppointmentsFromCerner();
      }else if(value.toLowerCase()=="amballscript")
      {
          this.getAppointmentsFromAllscript();
      }
      
        this._router.navigate([endurl]);
    }
}
}
