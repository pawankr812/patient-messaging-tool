import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IPatientResp } from 'src/app/Interfaces/patient';
import { AppService } from 'src/app/Services/appService/appService.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(public http: HttpClient, public appService: AppService) { }
  patientMessageUrl = 'GetAllMessages';
  DeleteMessageUrl = 'DeleteMessage';
  messageTemplateUrl = 'GetMessageTemplates';
  sendNotificationUrl = 'sendNotification';
  retryNotificationUrl = 'retryNotification';
  patientLastMessageUrl = 'getPatientsLastMessageByPatientID';
  updatePatientStatusUrl = 'UpdatePatientStatus';

  //http://fb.spectraltech.ai/PMTAPI/api/api/patient/GetAllMessages?patienID=4
  //http://fb.spectraltech.ai/PMTAPI/api/api/patient/GetMessageTemplates/AMB

  getMessageTemplate(facilityID,type): Observable<any> {
    const url = this.appService.baseURL + this.messageTemplateUrl + "/" + facilityID + "/" + type;   
    return this.http.get(url);
  }

  getPatientMessageList(data: any): Observable<IPatientResp> {
    console.log(data);
    const url = this.appService.baseURL + this.patientMessageUrl;
    const params = new HttpParams({
      fromObject: {
        patientID: data.patientID       
      }
    });
    return this.http.get<IPatientResp>(url, { params: params });
  }
 

  sendNotification(data: any): Observable<any> {
    const url = this.appService.baseURL + this.sendNotificationUrl;
    const params = new HttpParams({
      fromObject: {
        patientID: data.patientID,
        contactNo: data.contactNo,
        facilityID: data.facilityID,
        messageType: data.messageType,
        sentByID: data.sentByID,
        sentByName: data.sentByName,
        status: data.status,
        messageText: data.messageText,
        patientName: data.patientName,
        subject: data.subject,
        date: data.date
      }
    });
    return this.http.get(url, { params: params });
  }

  retryNotification(data: any): Observable<any> {
    const url = this.appService.baseURL + this.retryNotificationUrl;
    const params = new HttpParams({
      fromObject: {
        facilityID: data.facilityID,
        controlNo: data.controlNo
      }
    });
    return this.http.get(url, { params: params });
  }

  getLastMessageSent(data: any): Observable<any> {
    const url = this.appService.baseURL + this.patientLastMessageUrl;
    const params = new HttpParams({
      fromObject: {
        facilityID: data.facilityID,
        patientID: data.patientID
      }
    });
    return this.http.get(url, { params: params });
  }

  updatePatientStatus(reqObject: any): Observable<any> {
    const url = this.appService.baseURL + this.updatePatientStatusUrl;

    
    return this.http.post(url, reqObject);
  }

}
