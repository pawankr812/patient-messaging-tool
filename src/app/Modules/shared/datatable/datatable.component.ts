import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { MessagesService } from 'src/app/Services/message/messages.service';
import { NotificationService } from 'src/app/Services/notificationService/notification.service';
import { IDataSource } from './IDatatable';
import { SortingService } from './sorting.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
  providers: [SortingService]
})
export class DatatableComponent implements OnInit {

  dataSource: IDataSource;
  subMenuTable: boolean[] = [];
  patientMessageList: any[] = [];
  private sortingFlag: boolean = false;
  private sortingColumnName;
  pageSize: number = 8;
  pageOfItems: Array<any>;
  isSearched: boolean = false;
  expandedPatient: any;
  expandedPatientIndex: any;
 currPage=1;
 hidePagination:boolean=false
  @Input() set DataSource(_dataSource: IDataSource) {
    this.dataSource=_dataSource;
    var dashboardType =localStorage.getItem("dashboardType");
    console.log("aa",this.dataSource)
    if (this.dataSource && this.dataSource.displayInfo && this.dataSource.displayInfo.length > 0) {
      if ( this.dataSource.data.length > 8){
        this.hidePagination=true
              }
      if( dashboardType.toLowerCase() !='or'){
        this.dataSource.displayInfo = this.dataSource.displayInfo.sort((a, b) => a.sequence - b.sequence);
        this.dataSource.data=this.dataSource.data.sort(
          (a, b) => (new Date(a.appointmentDate).getTime() < new Date(b.appointmentDate).getTime()? -1 :(new Date(a.appointmentDate).getTime() > new Date(b.appointmentDate).getTime() ? 1 : 0)));
      
      }else{
      this.dataSource.displayInfo = this.dataSource.displayInfo.sort((a, b) => a.sequence - b.sequence);
      this.dataSource.data=this.dataSource.data.sort(
        (a, b) => (new Date(a.checkInTime).getTime() < new Date(b.checkInTime).getTime()? -1 :(new Date(a.checkInTime).getTime() > new Date(b.checkInTime).getTime() ? 1 : 0)));
    }}

    /* if (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0) {
      for (let i = 0; i < this.dataSource.data.length; i++) {
        this.subMenuTable[i] = false;
      }
    } */
  }

  @Output() ClickAction = new EventEmitter();
  @Output() OpenMessageBoxAction = new EventEmitter();
  @Output() DeleteAction = new EventEmitter();

  @ViewChild(JwPaginationComponent, { read: false, static: false }) _signup: JwPaginationComponent
  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
    //this.hideSubMenu();
    
  }


  constructor(
    private messagesService: MessagesService,
    private sorting: SortingService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    
      this.notificationService.signlrNotification.subscribe(resp => {
        if (this.expandedPatient && this.expandedPatientIndex >= 0) {
          this.viewMoreSignalR(this.expandedPatient, this.expandedPatientIndex);
        }
      })
    
  }

  clickAction(patient, clickAction) {
    this.ClickAction.emit(patient);
  }

  viewMore(patient, index) {
    this.patientMessageList = [];
    
    this.expandedPatient = patient;
    this.expandedPatientIndex = index;

    this.hideSubMenu();
    this.subMenuTable[index] = true;
    this.messagesService.getPatientMessageList(patient).subscribe(res => {
      if (res && res.data) {
        this.patientMessageList = res.data;
        this.subMenuTable[index] = true;
      }
      else {
        this.hideSubMenu();
      }
    }, error => {
      this.hideSubMenu();
    });
  }
  viewMoreSignalR(patient, index) {
    this.patientMessageList = [];
    
    this.expandedPatient = patient;
    this.expandedPatientIndex = index;

    this.hideSubMenu();
   // this.subMenuTable[index] = true;
    this.messagesService.getPatientMessageList(patient).subscribe(res => {
      if (res && res.data) {
        this.patientMessageList = res.data;
        //this.subMenuTable[index] = true;
      }
      else {
        this.hideSubMenu();
      }
    }, error => {
    });
  }
  OpenMessageBox(appointment) {
    if((!appointment.familyMemberContactNumber && !appointment.contactNumber) && appointment.facilityCode.toUpperCase()=="OR"){
      appointment.updateFromMessageBox=true;
      this.ClickAction.emit(appointment);
    }else
     if(!appointment.contactNumber && appointment.facilityCode.toUpperCase()!="OR"){
      appointment.updateFromMessageBox=true;
      this.ClickAction.emit(appointment);
    }else{
      this.OpenMessageBoxAction.emit(appointment);
      this.expandedPatient=appointment;
    }
    }
  erroalert(message) {
    Swal.fire({
      icon: 'warning',
      text: message,
    })
  }
  hideSubMenu(index?: number) {
    if (index) {
      this.subMenuTable[index] = false;
    } else {
      for (let i = 0; i < this.subMenuTable.length; i++) {
        this.subMenuTable[i] = false;
      }
    }
  }

  deletePatient(appointment) {
    this.DeleteAction.emit(appointment);
  }

  retryMessage(msg, appointment) {

  }
  changeTextColor(data:any)
  {
    let style ={};
    if(data && data.facilityCode !='AMB' && data.facilityCode.toLowerCase() !='amballscript')
    {
      if(!data.familyMemberContactNumber || data.familyMemberContactNumber=='0' || !data.contactNumber )
      {
        style={"color":"red"}
      }
    }
    else if(data && (data.facilityCode =='AMB' ||data.facilityCode.toLowerCase() =='amballscript') )
    {
      if(!data.contactNumber )
      {
        style={"color":"red"}
      }
    }
    return style;
  }

  sortBy(columnName) {
debugger
    if (this.sortingColumnName == columnName) {
      this.sortingFlag = !this.sortingFlag;
      let _dataToSort: IDataSource = JSON.parse(JSON.stringify(this.dataSource));
      this.dataSource.data = this.sorting.SortData(columnName, this.sortingFlag, _dataToSort.data);
    } else {
      this.sortingFlag = false;
      this.sortingColumnName = columnName;
      let _dataToSort: IDataSource = JSON.parse(JSON.stringify(this.dataSource));
      this.dataSource.data = this.sorting.SortData(columnName, this.sortingFlag, _dataToSort.data);
    }
  }

}
