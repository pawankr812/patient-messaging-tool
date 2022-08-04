import { Injectable } from '@angular/core';
import { HttpClient, HttpParams ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHeaderInfo } from 'src/app/Interfaces/header';
import { IPatientListResp } from 'src/app/Interfaces/patientList';
import { environment } from '../../../environments/environment';

//import { UserService } from '../userService/userService.service';
import * as FHIR from "fhirclient";
(window as any).FHIR = FHIR;
import { oauth2 as SMART } from "fhirclient";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public client;
  constructor(public http: HttpClient) {
    
    // FHIR.oauth2.authorize({
    //   "client_id": "e4dd4ed8-fbcf-4c28-9c55-970f74c7fb39",
    //   // "iss": "https://launch.smarthealthit.org/v/r2/sim/eyJoIjoiMSIsImIiOiI1YzQxY2VjZi1jZjgxLTQzNGYtOWRhNy1lMjRlNWE5OWRiYzIiLCJpIjoiMSIsImUiOiJTTUFSVC0xMjM0In0/fhir",
    //   'scope':  'user/Appointment.read user/Patient.read user/Observation.read launch online_access openid profile',
    // });  
    // FHIR.oauth2.authorize({
    //   "client_id": "e4dd4ed8-fbcf-4c28-9c55-970f74c7fb39",
    //   'scope':  'user/Appointment.read user/Patient.read user/Observation.read launch online_access openid profile',
    // });   
    // FHIR.oauth2.ready()
    // .then(client => {
    //   console.log('client',client) 
    //   // this.smart = client;
    //   client.request("Appointment?date=2021").then(result => {
    //   console.log('result++++++++++++++',result)
    // })
    // .catch(console.error);
    //   });

  //   SMART.init({
  //     iss: "https://launch.smarthealthit.org/v/r3/fhir",
  //     // iss:
  //     //     "https://launch.smarthealthit.org/v/r2/sim/eyJoIjoiMSIsImkiOiIxIiwiaiI6IjEiLCJlIjoiU01BUlQtMTIzNCJ9/fhir",
  //     redirectUri: "dashboard-ed",
  //     clientId: "e4dd4ed8-fbcf-4c28-9c55-970f74c7fb39",
  //     scope:  'user/Appointment.read user/Patient.read user/Observation.read launch online_access openid profile',
  // })
  //     .then(client => {
  //       console.log('client',client)
  //         return client.request(`Appointment`);
  //     })
  //     .then(
  //         (Appointment) => {
  //           console.log('Appointment',Appointment);

  //         },
  //         error => {
  //             console.error(error);
  //         }
  //     );
   }

  public baseURL: string = environment.API_ENDPOINT;  
   patientListUrl = 'getPatients';
  //patientListUrl = 'getAppointments';
  headerUrl = 'getMessageSummary';
  addpatientUrl = 'savePatientRealTime';
  searchPatientListUrl="getPatientsBySearch";
  updtPatient='savePatientRealTime';
  loggedInUserUrl="getToken";
  getUserURL="getUser";
  searchFacilityURL="searchFacility";
  getCurrentUserURL="getCurrentUsername";
  getAppointmentDatesURL="getAppointmentDates";
  getAppointments="GetAppointments";
  deletePatientUrl="DeletePatient";
  getCurrentTimeUrl="getCurrentTime";
  getDashboardUrl="GetDashboard";

  

  public getDashboardsList(): Observable<any> {
    const url = this.baseURL + this.getDashboardUrl;
    return this.http.get(url);
  }
  public getAppointmentFromCerner(): Observable<any> {
    const url = this.baseURL + this.getAppointments;
    return this.http.get(url);
  }
  public getAppointmentFromAllscript(): Observable<any> {
    const url = this.baseURL + "GetAllScriptsData";
    return this.http.get(url);
  }
  getCurrentUser(): Observable<any> {
    const url = this.baseURL + this.getCurrentUserURL;
    return this.http.get(url);
  }
  getPatientsListCerner(): Observable<any> {
    let token =localStorage.getItem('token')
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + token);
    const url = 'https://fhir-ehr-code.cerner.com/dstu2/ec2458f2-1e24-41c8-b71b-0e701af7583d/Appointment?date=2021&practitioner=12742069';
    return this.http.get(url, { headers: header });
  }
  public getPatientsList(opts): Observable<any> {
    const url = this.baseURL + this.patientListUrl;
    return this.http.post<IPatientListResp>(url,opts);
  }

  addPatient(opts): Observable<IPatientListResp> {
    const url = this.baseURL + this.addpatientUrl;
    return this.http.post<IPatientListResp>(url,opts);
  }

  getHeaderInfo(): Observable<IHeaderInfo> {
    const url = this.baseURL + this.headerUrl + "/"  + localStorage.getItem("dashboardType");
    const params = new HttpParams();
    return this.http.get<IHeaderInfo>(url);
  }

  public getPatientName(patientData) {
    let name = "";
    if (patientData) {
      if (patientData.lastName && patientData.lastName.trim() != "" && patientData.lastName != "null") {
        name = name.concat(patientData.lastName,',');
      }
      if (patientData.firstName && patientData.firstName.trim() != "" && patientData.firstName != "null") {
        name = name.concat(" ", patientData.firstName);
      }
      if (patientData.suffix && patientData.suffix.trim() != "" && patientData.suffix != "null") {
        name = name.concat(" ", patientData.suffix);
      }
      if (patientData.middleName && patientData.middleName.trim() != "" && patientData.middleName != "null") {
        name = name.concat(" ", patientData.middleName);
      }
    }
    name = name.trim();
    return name;
  }

  searchPatientList(opts,facilityType): Observable<IPatientListResp> {
    const url = this.baseURL + this.searchPatientListUrl;
    const params = new HttpParams({
      fromObject: {
        facilityID: opts.facilityID,
        searchText: opts.searchText,
        date: opts.date,
        facilityType:facilityType
      }
    });
    return this.http.get<IPatientListResp>(url,{params:params});
  }

  updatePatient(opts): Observable<IPatientListResp> {
    const url = this.baseURL + this.addpatientUrl;
    // const params = new HttpParams({
    //   fromObject: {
    //     firstName: patientdata.firstName,
    //     middleName: patientdata.middleName||'',
    //     lastName: patientdata.lastName,
    //     suffix: patientdata.suffix ||'',
    //     providerName: patientdata.providerName?patientdata.providerName:"",
    //     contactNo: patientdata.phoneNumber,
    //     appointmentTime:patientdata.appointmentTime? `${('0' + patientdata.appointmentTime.hour).slice(-2)}:${('0' + patientdata.appointmentTime.minute).slice(-2)}`:'',
    //     appointmentDate: patientdata.appointmentDate,
    //     checkInTime: patientdata.checkInTime ? `${('0' + patientdata.checkInTime.hour).slice(-2)}:${('0' + patientdata.checkInTime.minute).slice(-2)}` : "",
    //     facilityID: patientdata.facilityID,
    //     facilityType:facilityType
    //   }
    // });
    return this.http.post<IPatientListResp>(url,opts);
  }
  addFamily(opts): Observable<IPatientListResp> {
    const url = this.baseURL + "UpdatePatientFamilyMember";
    return this.http.post<IPatientListResp>(url,opts);
  }
  
  // getToken(): Promise<any>{
  //   const url = this.baseURL + this.loggedInUserUrl;
  //   return this.http.get(url).toPromise();
  // }
  getToken(){
    let header = new HttpHeaders().set("Authorization", 'Basic YmQ0MGY1MDEtNDVkZC00MjVhLTljZDgtM2ZkMmI4MDdjMTU4OldTZDVOQjBXU0g3RmdNdVpaN3ZTTWpheHllTTU0ZElF');
    const params = new HttpParams({
      fromObject: {
        // grant_type: 'refresh_token',
        // refresh_token: 'eyJpZCI6ImZjYTdhMWI4LTMxMTMtNDMxNS05ODA1LWY1NzRlNzNlYmY0ZSIsInNlY3JldCI6IjY0NzhiNThmLWMwYjctNDc1ZC1hNzBhLTMwZWI5MDVlNzljNSIsInZlciI6IjEuMCIsInR5cGUiOiJvbmxpbmVfYWNjZXNzIiwicHJvZmlsZSI6InNtYXJ0LXYxIn0=',
         grant_type: 'client_credentials',
         scope: 'system/Appointment.read system/Observation.read system/Patient.read system/Practitioner.read system/Schedule.read system/Slot.read system/Appointment.write system/Patient.write'
    }
    });
    const url = 'https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/token';
    return this.http.post(url,params, {headers: header})
  ;
  }
  isAuthenticated(){
    let data = localStorage.getItem('token');
    if(data){
      return true;
    }
    return false;
  } 

  getUser(code): Observable<any>{
    const url = this.baseURL + this.getUserURL;
    const params = new HttpParams({
      fromObject: {
        facilityCode: code
      }
    });
    return this.http.get(url, {params: params});
  }

  facilityLookup(code): Observable<any>{
    const url = this.baseURL + this.searchFacilityURL;
    const params = new HttpParams({
      fromObject: {
        search: code
      }
    });
    return this.http.get(url, {params: params});
  }

  getAppointmentDates(): Observable<any>{
    console.log('client',this.client)
    const url = this.baseURL + this.getAppointmentDatesURL;
    return this.http.get(url);
  }

  deletePatient(opts): Observable<any> {
    const url = this.baseURL + this.deletePatientUrl+"/"+opts.patientID;
   
    return this.http.post(url,{});
  }
   getCurrentTime(): Observable<any>{
    const url = this.baseURL + this.getCurrentTimeUrl;
    return this.http.get(url);
  } 
}