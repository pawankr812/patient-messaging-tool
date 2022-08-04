import { Injectable } from '@angular/core';
import { user } from 'src/app/Interfaces/User';
import { AppService } from '../appService/appService.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public isPtientListAvailable: boolean = true;
  public userName: string = "";
  public facilityCode: string = "";
  public facilityName: string = "";
  public facilityID: string = "";
  public userID: string = "";
  public facilityType:string=''; 
  public appointmentDates = new BehaviorSubject(null);
    constructor(public appService: AppService, public router: Router) {
    // this.setLoggedInUser();
    // this.getAppointmentDates();
  }

  setLoggedInUser() {
    let user = this.getLoggedInUser();
    if (user) {
      this.userName = user.userName;
      this.facilityCode = user.facilities.facilityCode;
      this.userID = user.userID;
      this.facilityName = user.facilities.facilityName;
      this.facilityID = user.facilities.facilityID;
      this.facilityType=user.facilities.facilityType;
      
    }
    else {
      this.userName = "";
      this.facilityCode = "";
      this.userID = "";
      this.facilityName = "";
      this.facilityID = "";
    }
  }

  getLoggedInUser(): user {
    if (localStorage.getItem("userData")) {
      return JSON.parse(localStorage.getItem("userData"));
    } else {
      return null;
    }
  }

  private getUserName(inuser: user) {
    let name = "";
    if (inuser) {
      if (inuser.lastName && inuser.lastName.trim() != "") {
        name = name.concat(inuser.lastName, ',');
      }
      if (inuser.firstName && inuser.firstName.trim() != "") {
        name = name.concat(" ", inuser.firstName);
      }
    }
    name = name.trim();
    return name;
  }

  formatTimeData(date) {
    let dt = new Date(date);
    let hour = dt.getHours().toString().length < 2 ? '0' + dt.getHours() : dt.getHours();
    let minute = (dt.getMinutes() || '00').toString().length < 2 ? '0' + dt.getMinutes() : (dt.getMinutes() || '00');
    let time = {
      hour: Number(hour),
      minute: Number(minute)
    }
    return time;
  }

  public getAppointmentDates() {
    this.appService.getAppointmentDates().subscribe(res => {
      if (res && res.status && res.status.toLowerCase() == "ok") {
        this.appointmentDates.next(res.data ? res.data : []);
      }
    });
  }

  public logout(){
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    this.router.navigate(['']);
    this.appointmentDates.next(null);
  }
}