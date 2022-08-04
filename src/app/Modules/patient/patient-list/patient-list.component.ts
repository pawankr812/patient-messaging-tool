import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppService } from 'src/app/Services/appService/appService.service';
import { Router } from '@angular/router';
import { MessagesService } from 'src/app/Services/message/messages.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { Subscription } from 'rxjs';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { UserService } from 'src/app/Services/userService/userService.service';
import { HostListener } from "@angular/core";
import { oauth2 as SMART } from "fhirclient";
import { IAppointmentData } from '../../../Interfaces/appointment';
import { FilterService } from 'src/app/Services/appService/filter.service';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NotificationService } from 'src/app/Services/notificationService/notification.service';
import { NotificationSearchService } from 'src/app/Services/notificationService/searchNotification.service';
@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  subscription: Subscription;
  subsSearch: Subscription;
  subsSort: Subscription;
  public appointmentData: Array<IAppointmentData> = [];
  addPatient: boolean = false;
  addFamily: boolean = false;
  MessageBox: boolean = false;
  subMenuTable: boolean[] = [];
  messageType: any = "";
  patientarry = [];
  patientColumnarry = [];
  messageTempList = [];
  patientList: any;
  designView:any="grid";
  patientListMaster: any
  patientMessageList = [];
  public patientData: any;
  patientToView: any = {};
  lastMessageTime: any;
  isMesageTextInvalid: boolean = false;
  isSearched: boolean = false;
  screenWidth: number;
  serchText: string;
  aptTimeAsc: boolean = true;
  patientNameAsc: boolean = true;
  checkTimeAsc: boolean = true;
  providerAsc: boolean = true;
  public selectedDate = "";
  public dateSubscription: Subscription;
  public dateChangeSubscription: Subscription;
  today = new Date();
  totalPatientCount: number;
  totalMessageCount: number;
  todayPatientCount: number;
  todayMessageCount: number;
  dashboardType = "";
  public appointmentDates: Array<[]> = [];
  headerdata: any;
  controlNumber:any;
  sentTo: any ;
  sentToNumber: any;
  toggleMessage="message";
  messageTo:any;
  activeTab = 'search';
  collapse='false';
  customMessageValue='';

  private hubConnection: HubConnection;
  constructor(public appService: AppService,
    public messagesService: MessagesService,
    public loaderService: LoaderService,
    public router: Router,
    public userService: UserService,
    private filterService: FilterService,
    private notificationService: NotificationService,
    private searchNotificationService: NotificationSearchService,
    public http: HttpClient
  ) {
    this.getScreenSize();
    this.dashboardType = localStorage.getItem('dashboardType');
    // this.dateSubscription = this.userService.appointmentDates.subscribe(data => {
    //   if (data && data.length) {
    //     this.appointmentDates = data;
    //     this.selectedDate = data[0];
    //   }
    // });
  }

  ngOnInit() {
    localStorage.removeItem('patient')
    this.getPatientList();
    this.getHeaderInfo();
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('http://fb.spectraltech.ai/PMTAPI/api/notify', { skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets })
      .build();
    this.hubConnection.start().then(function () {
      console.log('SignalR Connected!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.hubConnection.on("BroadcastMessage", (resp) => {
      this.getPatientList(true);
      let _res = JSON.parse(JSON.stringify(resp))
      let templist=this.patientList.data;
       if(resp){
          templist.forEach(element => {
         if(element.patientID==_res.patientID){
           element.status=_res.status;
         }
         else{
           element.status="other";
         }
 
         
       });
       if (this.patientData) {
         this.viewMore(this.patientData, 0);
       }
     }
     this.patientList.data=templist
     this.patientList=templist
      this.getHeaderInfo();
      this.notificationService.signlrNotification.next(resp);
    });
    
    this.subscription = this.loaderService.NotifyEvent.subscribe(evt => {
      if (evt && (evt.message = "addmessage" || evt.message == "addpatient")) {
         this.getHeaderInfo();
         this.getPatientList()
      }
    });
    this.notificationService.signlrNotification.subscribe(resp => {
     
    })
    
    this.getMessageTempList('patient');
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }

  showHide(data){
    
    if(this.collapse=='true'){
    this.collapse='false'
    this.message=''
    }else{
      this.collapse='true'
      if(data){
        this.messageType=data.displayName;
        this.message=data.messageText;
    
      }
    }
  

  }
  clearCustomMessage(){
    
    (document.getElementById('myCustomMessageInput')as HTMLInputElement).value = '';
    this.customMessageValue='';
    this.message=''
  }
  getPatientList(hideLoader?:boolean) {
    if(!hideLoader){
    this.loaderService.showLoader = true;
    }
    setTimeout(() => {
      let opts = {

        "facilityType": localStorage.getItem('dashboardType') ? localStorage.getItem('dashboardType') : "ED",
        "appointmentDate": "2021-09-08 00:00:00.000"
      }
      this.appService.getPatientsList(opts).subscribe(data => {
        if( this.dashboardType.toLowerCase() !='or'){
          data.displayInfo = data.displayInfo.sort((a, b) => a.sequence - b.sequence);
          data.data=data.data.sort(
            (a, b) => (new Date(a.appointmentDate).getTime() < new Date(b.appointmentDate).getTime()? -1 :(new Date(a.appointmentDate).getTime() > new Date(b.appointmentDate).getTime() ? 1 : 0)));
        
        }else{
        data.displayInfo = data.displayInfo.sort((a, b) => a.sequence - b.sequence);
        data.data=data.data.sort(
          (a, b) => (new Date(a.checkInTime).getTime() < new Date(b.checkInTime).getTime()? -1 :(new Date(a.checkInTime).getTime() > new Date(b.checkInTime).getTime() ? 1 : 0)));
      }
        this.patientList = JSON.parse(JSON.stringify(data));
        this.patientListMaster = JSON.parse(JSON.stringify(data));

        // for (var i = 0; i < data.displayInfo.length; i++) {
          debugger
          this.patientColumnarry.push("patientName");
          this.patientColumnarry.push("provider");
        // }
        console.log(data)
        this.loaderService.showLoader = false;
        if (data.status.toUpperCase() == "SUCCESS") {
          this.isSearched = false;

          if (data.data.length > 0) {
            this.userService.isPtientListAvailable = true;
          }
          else {
            this.userService.isPtientListAvailable = false;
          }
          for (let i = 0; i < this.patientarry.length; i++) {
            this.subMenuTable[i] = false;
          }
        }
        else {
          this.loaderService.showLoader = false;
          this.hideSubMenu();
        }
      },
        error => {
          this.loaderService.showLoader = false;
          this.hideSubMenu();
        });
    }, 2000)
  }

  OpenMessageBox(patient) {
    debugger
    this.message = "";
    this.patientData = patient; 
    if(patient.contactNumber){
      this.sentTo="patient"
    }else if(!patient.contactNumber && patient.familyMemberContactNumber){
      this.sentTo="familyMember"
    }    
    this.MessageBox = true;    
  }
deleteConfirmation(patient)
{
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to delete this patient?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b7e9d8',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:'No'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deletePatient(patient)
    }
  })
}
  deletePatient(patient) {
      let opts = {
        facilityID: this.userService.facilityID,
        patientID: patient.patientID
      }
      this.appService.deletePatient(opts).subscribe(data => {
        if (data.status.toLowerCase() == "success") {
          this.getPatientList();
        }
      }, err => {
      })
    }  

  OpenAddPatientModal(patient: any) {
    
    if (patient && patient.patientID) {
      this.patientToView = patient;
      if (this.dashboardType == 'OR') {
        this.addFamily = true;
      } else {
        this.addPatient = true;
      }
    } else {
      this.addPatient = true;
    }


    /*  if (this.screenWidth <= 480) {
       localStorage.setItem('patient', JSON.stringify(this.patientToView))
       this.router.navigate(['dashboard/addPatientPage']);
     } else if (this.screenWidth > 480) {
       this.addPatient = true;
     } */
  }

  OpenEditPatientModal(patient: any) {
    if (patient && patient.patientID) {
      this.patientToView = patient;
      if (this.dashboardType == 'OR' ) {
        this.addFamily = true;
      } else {
        this.addPatient = true;
      }
    }


    /*  if (this.screenWidth <= 480) {
       localStorage.setItem('patient', JSON.stringify(this.patientToView))
       this.router.navigate(['dashboard/addPatientPage']);
     } else if (this.screenWidth > 480) {
       this.addPatient = true;
     } */
  }

  CloseAddPatientModal() {
    this.addPatient = false;
    localStorage.removeItem('patient')
  }

  ChangeMessageType(template, e) {
    this.messageType = e.target.checked;
    if (e.target.checked) {
      this.messageType = template.displayName;
      this.message = template.messageText
/*       if (sessionStorage.getItem("messageTemplate")) {
        this.messageTempList = [];
        this.messageTempList = JSON.parse(sessionStorage.getItem("messageTemplate"));
      } */
    }
    this.validateMessageBox(template.messageText)
  }
  patientHistory(patient,index){
    this.toggleMessage="messagehistory";
    this.message=''
    this.collapse='false'
    this.viewMore(patient, index) 
  }
  viewMore(patient, index) {
    
    this.patientMessageList = [];
    this.hideSubMenu();
    this.messagesService.getPatientMessageList(patient).subscribe(res => {
      if (res && res.data) {
        this.patientMessageList = res.data;
        this.patientMessageList.forEach(value=>{
          console.log( value.status)
          localStorage.setItem("message",value.status +"|"+value.patientID)});
        this.subMenuTable[index] = true;
      }
      else {
        this.hideSubMenu();
      }
    }, error => {
      this.hideSubMenu();
    });
  }

  hideSubMenu() {
    for (let i = 0; i < this.subMenuTable.length; i++) {
      this.subMenuTable[i] = false;
    }
  }
  DeleteMessage(id){
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this message?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b7e9d8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText:'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = "http://fb.spectraltech.ai/PMTAPI/api/api/patient/DeleteMessage/"+id;
    this.http.get(url).subscribe(res => {
      this.viewMore(this.patientData,0)
      console.log(res)
    })
      }
    })
    

  }
  getMessageTempList(type) {
    // if (this.messageTempList.length) {
    //   this.messageType = this.messageTempList[0].displayName;
    //   this.validateMessageBox(this.messageTempList[0].messageText);
    //   return;
    // }

   // this.loaderService.showLoader = true;
    this.messagesService.getMessageTemplate(this.dashboardType.toUpperCase(),type).subscribe(res => {
      if (res.status.toLowerCase() == "success") {
        this.messageTempList = res.data;
        if (this.messageTempList.length) {
          // this.messageType = this.messageTempList[0].displayName;
          // this.message = this.messageTempList[0].messageText;
          this.validateMessageBox(this.messageTempList[0].messageText)
          //sessionStorage.setItem("messageTemplate", JSON.stringify(res.data));
        }
       // this.loaderService.showLoader = false;
      }
      else {
        this.messageTempList = [];
        this.loaderService.showLoader = false;
      }
    }, error => {
      this.messageTempList = [];
      this.loaderService.showLoader = false;
    });
  }
  message = "";
  getMessageTempListByType(type,number,familyNumber){
    
    if(type=='family' ){
      if(number){
        this.getMessageTempList(type);
      }

    }else if(type=='both' ){
      if(number && familyNumber){
      this.getMessageTempList(type);
      }
    }else if(type=='patient' ){
      if(number){
        this.getMessageTempList(type);
      }

    }
  }
  sendNotification(action,data) {
    
    let req =null
    // if(this.patientData.facilityCode.toUpperCase()=="OR")
    // {
    //   this.sentTo="familymember";
    // }
    if(action=='New'){
    if (this.message.length == 0) {
      // if(this.dashboardType.toLowerCase() =='or'){
      this.validateMessageBox(this.message);
      
      return;
      // }else{
        // this.message=this.messageTempList[0].messageText;
      //}
    }
    if (!this.validateContactNumber()) {
      this.resetMessage();
      // this.erroalert(" Please update family member details")
      return;
    }
    this.loaderService.showLoader = true;

     req = {
      "MRN": this.patientData.mrn,
      "createdDate": new Date(),
      "text": this.message,
      "status": "Pending",
      "patientID": this.patientData.patientID,
      "sendTo": this.sentToNumber,
      "messageTo": this.sentTo,
      "action":action,
    }
  }else{
    this.loaderService.showLoader = false;
  let sentNumber=data.sendTo.match(/\d/g);
  
     req = {
      "MRN": this.patientData.mrn,
      "createdDate": new Date(),
      "text": data.text,
      "status": "Pending",
      "patientID": this.patientData.patientID,
      "sendTo": sentNumber.join(""),
      "messageTo": this.sentTo,
      "action":action,
      "controlNo":data.controlNo
    }
  }
    this.messagesService.updatePatientStatus(req).subscribe(res => {
     
      if(action=='New'){
        this.toggleMessage="message"
      this.customMessageValue=''
      this.loaderService.showLoader = false;
      this.resetMessage();
      let tmpIndex = this.subMenuTable.indexOf(true);
      this.loaderService.NotifyEvent.next({ data: null, message: "addmessage" });
      if (tmpIndex >= 0) {
        this.viewMore(req, tmpIndex);
      }
    }else{
      this.loaderService.showLoader = false;
      this.viewMore(this.patientData,0)
    }
     
    }, error => {
      this.loaderService.showLoader = false;
      this.resetMessage();
    });
  }
  validateContactNumber() {
    // if (this.dashboardType.toLowerCase() == 'or' && (this.patientData.familyMemberContactNumber)) {
    //   this.sentToNumber = this.patientData.familyMemberContactNumber
    //   //this.messageTo = 'familymember';
    //   return true
    // }
    // else
     if (this.dashboardType.toLowerCase() == 'ed' || this.dashboardType.toLowerCase() == 'or') {
      if (this.sentTo.toLowerCase() == 'patient' && (this.patientData.contactNumber)) {
        this.sentToNumber = this.patientData.contactNumber;
        this.messageTo = this.patientData.patientName;
        return true
      }
      else if (this.sentTo.toLowerCase() == 'familymember' && (this.patientData.familyMemberContactNumber)) {
        this.sentToNumber = this.patientData.familyMemberContactNumber;
        this.messageTo = this.patientData.familyMemberLastName + ", " + this.patientData.familyMemberFirstName;
        return true
      }
      else if (this.sentTo.toLowerCase() == 'patient|familymember' && (this.patientData.familyMemberContactNumber && this.patientData.contactNumber)) {
        this.sentToNumber = this.patientData.contactNumber + "|" +this.patientData.familyMemberContactNumber;
        this.messageTo = this.patientData.familyMemberLastName + ", " + this.patientData.familyMemberFirstName;
        return true
      }
    }
    else  if(this.dashboardType.toLowerCase() == 'amb' || this.dashboardType.toLowerCase() == 'amballscript' ){
      {
        if (this.patientData.contactNumber) {
          this.sentToNumber = this.patientData.contactNumber
          this.messageTo = this.patientData.patientName
          return true
        }
      }
    }
    return false
  }
  erroalert(message) {
    Swal.fire({
      icon: 'warning',
      text: message,
    })
  }
  onMessageInput(event) {
    if (event && event.target.value) {
      this.customMessageValue=event.target.value;
      this.message=this.customMessageValue
      this.validateMessageBox(event.target.value);
    } else {
      this.validateMessageBox('')
    }
  }
  validateMessageBox(msgtext) {
    this.isMesageTextInvalid = !(msgtext && msgtext.trim());
  }
changeDesignView(e){
 
  this.patientList=this.patientListMaster
  this.designView=e;
}
  public resetMessage() {
    let data= this.patientListMaster
    if( this.dashboardType.toLowerCase() !='or'){
      data.displayInfo = data.displayInfo.sort((a, b) => a.sequence - b.sequence);
      data.data=data.data.sort(
        (a, b) => (new Date(a.appointmentDate).getTime() < new Date(b.appointmentDate).getTime()? -1 :(new Date(a.appointmentDate).getTime() > new Date(b.appointmentDate).getTime() ? 1 : 0)));
    
    }else{
    data.displayInfo = data.displayInfo.sort((a, b) => a.sequence - b.sequence);
    data.data=data.data.sort(
      (a, b) => (new Date(a.checkInTime).getTime() < new Date(b.checkInTime).getTime()? -1 :(new Date(a.checkInTime).getTime() > new Date(b.checkInTime).getTime() ? 1 : 0)));
  }
  this.patientList=data;
    this.sentTo = "patient";
    this.MessageBox = false;
    this.patientData = null;
    this.lastMessageTime = null;
    this.patientMessageList=null;
    this.toggleMessage="message"
    // if(this.dashboardType.toLowerCase() == 'or') {
      this.messageType = "";
      this.message = "";
      this.getMessageTempList('patient')
    // } else {
    //   this.messageType = this.messageTempList[0].displayName;
    //   this.message = this.messageTempList[0].messageText;
    // }
  }

  public getMessageText() {
    let template = this.messageTempList.find(item => item.displayName == this.messageType);
    if (template && template.messageText) {
      return template.messageText.trim();
    }
    return "";
  }

  getPatientFlag(event) {
    this.addPatient = false;
    localStorage.removeItem('patient')
    this.patientToView = {};
    if (event &&( event.flag.toLowerCase() == "updated"||event.flag.toLowerCase() == "added" )) {
    this.getPatientList();
    }
  }

  getFamilyFlag(event) {
    ;
    this.addFamily = false;
    localStorage.removeItem('patient')
    this.patientToView = {};
    if (event && event.flag == "updated") {
      this.getPatientList();
    }
  }

  // searchPatientList(textToSearch) {
  //   
  //   //this.loaderService.showLoader = true;
  //   // let opts = {
  //   //   facilityID: this.userService.facilityID,
  //   //   searchText: textToSearch,
  //   //   date: this.selectedDate
  //   // }
  //   // this.appService.searchPatientList(opts,this.userService.facilityType).subscribe(data => {
  //   //   this.loaderService.showLoader = false;
  //   //   if (data.status.toUpperCase() == "OK") {
  //        this.patientListDummy.data.find(function (element) {
  //         return element ==textToSearch;
  //     });
  //       this.hideSubMenu();
  //       this.isSearched = true
  //     // }
  //     // else {
  //     //   this.loaderService.showLoader = false;
  //     //   this.hideSubMenu();
  //     // }
  //   // },
  //   //   error => {
  //   //     this.loaderService.showLoader = false;
  //   //     this.hideSubMenu();
  //   //   });
  // }
  searchPatientList(filterValue: string) {
    
    let data = this.filterService.filterData(this.patientListMaster.data, this.patientColumnarry, filterValue)
    // if(data.length==0){
    //   this.erroalert("Sorry, we couldn't find any results for "+filterValue)
    // }
    // else{
    this.patientList.data=data
    this.hideSubMenu();
    // }

  }

  sortPatientList(data: any) {
    if (data && this.patientarry.length) {
      if (data.name == "aptTime") {
        data.isAsc ? this.patientarry.sort((a, b) => (new Date(a.ApptTime).getTime() > new Date(b.ApptTime).getTime()) ? 1 : -1) :
          this.patientarry.sort((a, b) => (new Date(a.ApptTime).getTime() < new Date(b.ApptTime).getTime()) ? 1 : -1);

      }
      else if (data.name == "patientName") {
        data.isAsc ? this.patientarry.sort((a, b) => (a.PatientLastName.toLowerCase() > b.PatientLastName.toLowerCase()) ? 1 : (a.PatientLastName.toLowerCase() === b.PatientLastName.toLowerCase()) ? ((a.PatientFirstName.toLowerCase() > b.PatientFirstName.toLowerCase()) ? 1 : -1) : -1) :
          this.patientarry.sort((a, b) => (a.PatientLastName.toLowerCase() < b.PatientLastName.toLowerCase()) ? 1 : (a.PatientLastName.toLowerCase() === b.PatientLastName.toLowerCase()) ? ((a.PatientFirstName.toLowerCase() < b.PatientFirstName.toLowerCase()) ? 1 : -1) : -1);
      }
      else if (data.name == "provider") {
        data.isAsc ? this.patientarry.sort((a, b) => (a.Provider.toLowerCase() > b.Provider.toLowerCase()) ? 1 : -1) :
          this.patientarry.sort((a, b) => (a.Provider.toLowerCase() < b.Provider.toLowerCase()) ? 1 : -1);
      }
    }
    this._signup.ngOnInit();
  }

  retryMessage(message, patient) {
    let input = {
      facilityID: this.userService.facilityID,
      controlNo: message.amplifyControlNo
    };

    this.messagesService.retryNotification(input).subscribe(data => {
      if (data.status.toUpperCase() == "OK") {
        let tmpIndex = this.subMenuTable.indexOf(true);
        if (tmpIndex >= 0) {
          this.viewMore(patient, tmpIndex);
        }
        this.loaderService.NotifyEvent.next({ data: null, message: "addmessage" });
      }
      else {
        this.loaderService.showLoader = false;
        this.hideSubMenu();
      }
    },
      error => {
        this.loaderService.showLoader = false;
        this.hideSubMenu();
      });
  }

  pageOfItems: Array<any>;
  pageSize: number = 10;
  @ViewChild(JwPaginationComponent, { read: false, static: false }) _signup: JwPaginationComponent
  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  getLastMessageTime(patient): void {
    let input = {
      patientID: patient.patientID,
      facilityID: this.userService.facilityID
    };
    this.messagesService.getLastMessageSent(input).subscribe(res => {
      if (res && res.data) {
        this.lastMessageTime = res.data.LastMessageTime;
      }
    },
      error => {
      });
  }

  formatTime(date): string {
    let dt = new Date(date);
    let isPM = dt.getHours() >= 12;
    let isMidday = dt.getHours() == 12;
    let time = [dt.getHours().toString().length < 2 ? '0' + dt.getHours() : dt.getHours(),
    (dt.getMinutes() || '00').toString().length < 2 ? '0' + dt.getMinutes() : (dt.getMinutes() || '00')].join(':');
    return time;
  }

  searchPatient(event) {
    if( event.target.value.length>2)
    {
    if (event && event.target) {
      if (event.target.value != "" ) {
        this.searchPatientList(event.target.value);
        console.log("parent",this.patientList)
       
      }
      else {
        this.patientList.data=this.patientListMaster.data
      }
    }
  }else if(event.target.value.length==0)
  {
    this.patientList.data=this.patientListMaster.data
  }
}
  searchPatientOnEnter(event) {
    
    if (event && event.target) {
      if (event.target.value != "" ) {
        debugger
        this.searchPatientList(event.target.value);
        if( this.patientList.data.length==0){
          this.erroalert("Sorry, we couldn't find any results for "+ JSON.stringify(event.target.value))
        }
      }
      else {
        debugger
        this.patientList.data=this.patientListMaster.data
      }
    }
  }

  searchPatientOnClik() {
    if (this.serchText && this.serchText.trim()) {
      let serchText = this.serchText.trim();
      if (serchText != "") {
        this.searchPatientList(serchText);
      }
      else {
    
        this.getPatientList();
      }
    }
  }
  searchPatientBlank(event) {
    if (event && event.target && event.target.value == "") {
      this.patientList.data=this.patientListMaster.data
    }
  }
//   clickView(data:any){
//     this.designView=data;

// }
  sortBy(fieldName) {
    let sortData = { name: fieldName, isAsc: true };
    if (fieldName == "aptTime") {
      sortData.isAsc = this.aptTimeAsc;
      this.aptTimeAsc = !this.aptTimeAsc;
    } else if (fieldName == "patientName") {
      sortData.isAsc = this.patientNameAsc;
      this.patientNameAsc = !this.patientNameAsc;
    }
    else if (fieldName == "provider") {
      sortData.isAsc = this.providerAsc;
      this.providerAsc = !this.providerAsc;
    }
    this.sortPatientList(sortData);
  }

  dateChange() {
    this.getPatientList();
  }

  getHeaderInfo() {
     
      this.appService.getHeaderInfo().subscribe(data => {
        console.log(data.data)
        if (data && data.data ) {
          console.log(data.data)
          this.headerdata = data.data;
          this.today = this.headerdata.todayDate;
          this.setHeaderData(this.headerdata);
        }
      }, error => {
        this.headerdata = {};
      });
  }

  setHeaderData(headerdata) {
    this.todayMessageCount = headerdata.todayMessageCount;
    this.todayPatientCount = headerdata.todayPatientCount;
    this.totalMessageCount = headerdata.totalMessageCount;
    this.totalPatientCount = headerdata.totalPatientCount;
    this.today = headerdata.todayDate;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subsSearch) {
      this.subsSearch.unsubscribe();
    }

    if (this.subsSort) {
      this.subsSort.unsubscribe();
    }
    this.selectedDate = "";
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

  clickAction(patient: any) {
    if(patient )
    this.OpenEditPatientModal(patient);
  }
 

  //   patientListDummy = {
  //     "displayInfo": [
  //         {
  //             "columnDisplayName": "PATIENT",
  //             "columnName": "patientName",
  //             "sequence": "3",
  //             "clickAction": "edit",
  //             "columnType": "data",
  //             "sorting": false
  //         },
  //         {
  //             "columnDisplayName": "PRACTITIONER",
  //             "columnName": "provider",
  //             "sequence": "4",
  //             "clickAction": "",
  //             "columnType": "data",
  //             "sorting": true
  //         },
  //         {
  //             "columnDisplayName": "ENTRY DATE",
  //             "columnName": "appointmentDate",
  //             "sequence": "2",
  //             "clickAction": "",
  //             "columnType": "data",
  //             "sorting": true
  //         },
  //         {
  //             "columnDisplayName": "ENTRY TIME",
  //             "columnName": "checkInTime",
  //             "sequence": "1",
  //             "clickAction": "",
  //             "columnType": "data",
  //             "sorting": true
  //         },
  //         {
  //             "columnDisplayName": "MESSAGE",
  //             "columnName": "message",
  //             "sequence": "6",
  //             "clickAction": "",
  //             "columnType": "action",
  //             "sorting": false
  //         },
  //         {
  //             "columnDisplayName": "STATUS",
  //             "columnName": "status",
  //             "sequence": "5",
  //             "clickAction": "",
  //             "columnType": "data",
  //             "sorting": false
  //         }
  //     ],
  //     "data": [
  //         {
  //             "patientID": "2",
  //             "firstName": "Thomas",
  //             "lastName": "Muller",
  //             "patientName": "Muller, Thomas",
  //             "provider": "John",
  //             "appointmentDate": "9/3/2021 12:00:00 AM",
  //             "checkInTime": "",
  //             "contactNumber": "8899776655",
  //             "facilityCode": "ED",
  //             "message": null,
  //             "status": null
  //         },
  //         {
  //             "patientID": "4",
  //             "firstName": "Mark",
  //             "lastName": "Waughn",
  //             "patientName": "Waughn, Mark",
  //             "provider": "John",
  //             "appointmentDate": "9/8/2021 12:00:00 AM",
  //             "checkInTime": "",
  //             "contactNumber": "7788998899",
  //             "facilityCode": "ED",
  //             "message": null,
  //             "status": null
  //         },
  //         {
  //             "patientID": "7",
  //             "firstName": "Jack",
  //             "lastName": "Doe",
  //             "patientName": "Doe, Jack",
  //             "provider": "John",
  //             "appointmentDate": "9/8/2021 12:00:00 AM",
  //             "checkInTime": "",
  //             "contactNumber": "8877665555",
  //             "facilityCode": "ED",
  //             "message": null,
  //             "status": null
  //         },
  //         {
  //             "patientID": "12",
  //             "firstName": "Jerry",
  //             "lastName": "Hales",
  //             "patientName": "Hales, Jerry",
  //             "provider": "John",
  //             "appointmentDate": "9/3/2021 12:00:00 AM",
  //             "checkInTime": "",
  //             "contactNumber": "8978678788",
  //             "facilityCode": "ED",
  //             "message": null,
  //             "status": null
  //         },
  //         {
  //             "patientID": "14",
  //             "firstName": "George",
  //             "lastName": "Clooney",
  //             "patientName": "Clooney, George",
  //             "provider": "John",
  //             "appointmentDate": "9/9/2021 12:00:00 AM",
  //             "checkInTime": "",
  //             "contactNumber": "8787988787",
  //             "facilityCode": "ED",
  //             "message": null,
  //             "status": null
  //         },
  //         {
  //             "patientID": "15",
  //             "firstName": "John",
  //             "lastName": "Shrek",
  //             "patientName": "Shrek, John",
  //             "provider": "John",
  //             "appointmentDate": "9/9/2021 12:00:00 AM",
  //             "checkInTime": "",
  //             "contactNumber": "7888778898",
  //             "facilityCode": "ED",
  //             "message": null,
  //             "status": null
  //         },
  //         {
  //             "patientID": "18",
  //             "firstName": "Jerry1",
  //             "lastName": "Hales1",
  //             "patientName": "Hales1, Jerry1",
  //             "provider": "John",
  //             "appointmentDate": "9/9/2021 12:00:00 AM",
  //             "checkInTime": "",
  //             "contactNumber": "8978678788",
  //             "facilityCode": "ED",
  //             "message": null,
  //             "status": null
  //         }
  //     ],
  //     "message": "",
  //     "status": "Success"
  // }
}
