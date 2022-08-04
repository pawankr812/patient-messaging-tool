import { Component, OnInit, Output, EventEmitter, Input, ModuleWithComponentFactories } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { AppService } from 'src/app/Services/appService/appService.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/userService/userService.service';
import { user } from 'src/app/Interfaces/User';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import dateFormat from "dateformat";
// import {CalendarModule} from 'primeng/calendar'
@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
  providers:[DatePipe]
})
export class AddPatientComponent implements OnInit {

  @Input() patient: any;
  @Output() AddPatientFlag = new EventEmitter<any>();
  addPatientForm: FormGroup;
  isUpdate: boolean = false;
  dob:any;
  public appointmentDates = [];
  public sexList=[ "Select Sex","Male", "Female",  "Transgender Male","Transgender Female", "Non-binary", "Does not wish to disclose","Other",];
  public dashboardType: any;
 public time
  constructor(public router: Router, public formbuilder: FormBuilder,
    public appService: AppService, public loaderService: LoaderService,
    public userService: UserService , private datePipe:DatePipe) {
      
   
      console.log(this.time)
      for(let i = 0; i < 3; i++) {
        debugger
        var date = new Date();
        date.setDate(date.getDate() + i);
        this.appointmentDates.push(this.datePipe.transform( date,"MM/dd/yyyy"));
      }  
     console.log(this.appointmentDates)
    // this.userService.appointmentDates.subscribe(data => {
    //   if (data && data.length) {
    //     this.appointmentDates = data;
    //   }
    //});
    this.createAddPatientForm();
  }

  ngOnInit() {
   
    // if(!this.appointmentDates.includes(this.formatDate()))
    // {
    //   this.appointmentDates.push(this.formatDate())
    // }
    this.dashboardType = localStorage.getItem('dashboardType');
    debugger
    if (this.patient && this.patient.patientID) {
        this.addPatientForm.setValue({
          firstName: this.patient.firstName,
          lastName: this.patient.lastName,
          // appointmentTime: dateFormat(this.patient.appointmentDate, "HH:MM a") ,
          // // appointmentDate: dateFormat(this.patient.appointmentDate, "yyyy-mm-dd") ,
          // appointmentDate:  this.formatDate(),
          // checkInTime:  dateFormat(this.patient.checkInTime, "HH:MM a")  ,
          appointmentTime: this.patient.appointmentDate ? this.userService.formatTimeData(this.patient.appointmentDate) : "",
          appointmentDate:  this.formatDate(),
          checkInTime: this.patient.checkInTime ? this.userService.formatTimeData(this.patient.checkInTime) : "",
          provider: this.patient.provider,
          contactNumber: this.patient.contactNumber,
          suffix: '',
          middleName: this.patient.middleName,
          facilityID: '',
          patientID: this.patient.patientID,
          facilityCode: localStorage.getItem('dashboardType'),
          familyContactNumber :this.patient.familyMemberContactNumber ? this.patient.familyMemberContactNumber:'',
          familyfirstName:this.patient.familyMemberFirstName ?this.patient.familyMemberFirstName:'',
          familylastName:this.patient.familyMemberLastName ?this.patient.familyMemberLastName:'',
          sex:this.patient.sex?this.patient.sex:this.sexList[0],
          date:this.patient.dob
        });
        this.isUpdate = true;
      
    }else{
      let date= new Date();
      this.addPatientForm.setValue({
        firstName: '',
        lastName: '',
        appointmentDate:   this.appointmentDates[0],
        checkInTime:'',
         provider: '',
        contactNumber: '',
        suffix: '',
        middleName: '',
        facilityID: '',
        patientID: '',
        facilityCode: localStorage.getItem('dashboardType'),
        familyContactNumber :'',
        familyfirstName:'',
        familylastName:'',
        sex:this.sexList[0],
        date:'',
        appointmentTime: this.userService.formatTimeData(date) })
    }
    
  }

  public createAddPatientForm() {
    this.addPatientForm = this.formbuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      appointmentTime: new FormControl('', Validators.required),
      appointmentDate: new FormControl(this.appointmentDates.length ? this.appointmentDates[0] : "", Validators.required),
      checkInTime: new FormControl(''),
      provider: new FormControl('', Validators.required),
      contactNumber: new FormControl('', Validators.required),
      suffix: new FormControl(),
      middleName: new FormControl(),
      facilityID: new FormControl(this.userService.facilityID),
      patientID: new FormControl(''),
      facilityCode: new FormControl(''),
      familyContactNumber :new FormControl(''),
      familyfirstName: new FormControl(''),
      familylastName: new FormControl(''),
      sex:new FormControl(''),
      date:new FormControl('')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addPatientForm.controls; }
formatDate(){
if(this.patient.appointmentDate){
  let appointmentDate =  this.patient.appointmentDate.split(' ')[0];
  if (appointmentDate.length>0){
let date =new Date(appointmentDate)
 return this.datePipe.transform(date,"MM/dd/yyyy");
  }
 
}

}
setDob(e){

  let date =new Date(e)
  this.dob=this.datePipe.transform(date,"MM/dd/yyyy");
 
   (document.getElementById('dob')as HTMLInputElement).value = this.dob;
    let _date= {year: date.getFullYear(), month:  date.getMonth(), day: date.getDate()}
    return _date
}
  postData(addPatientForm) {
    this.loaderService.showLoader = true;
    debugger
    let opts = {
      firstName: addPatientForm.firstName,
      familyMemberFirstName: addPatientForm.familyfirstName,
      middleName: addPatientForm.middleName || '',
      lastName: addPatientForm.lastName,
      FamilyMemberLastName: addPatientForm.familylastName,
      suffix: addPatientForm.suffix || '',
      provider: addPatientForm.provider ? addPatientForm.provider : "",
      contactNumber: addPatientForm.contactNumber,
      familyMemberContactNumber: addPatientForm.familyContactNumber,
      // appointmentDate: addPatientForm.appointmentDate + ' ' + addPatientForm.appointmentTime +':'+'00'  ,
      // checkInTime: addPatientForm.checkInTime ,
      appointmentDate: addPatientForm.appointmentDate + ' ' +`${('0' + addPatientForm.appointmentTime.hour).slice(-2)}:${('0' + addPatientForm.appointmentTime.minute).slice(-2)}` +':'+'00'  ,
      checkInTime: addPatientForm.checkInTime ? `${('0' + addPatientForm.checkInTime.hour).slice(-2)}:${('0' + addPatientForm.checkInTime.minute).slice(-2)}` : "",
      
      facilityID: addPatientForm.facilityID,
      facilityCode: localStorage.getItem('dashboardType'),
      mrn:"",
      sex:this.sendSexValue(addPatientForm.sex) || '',
      dob: addPatientForm.date || ''
    }
    this.appService.addPatient(opts).subscribe(data => {
      this.loaderService.showLoader = false;
      debugger
      if (data.status.toUpperCase() == "SUCCESS") {
        this.loaderService.NotifyEvent.next({ message: "addpatient" });
        this.loaderService.AddPatientEvent.next("getPatientList");
        this.CloseModal('added', {});
        
      }
      else if (data.status.toUpperCase() == "ERROR") {
        this.CloseModal('failed', {});
      }
      else {
        this.CloseModal('failed', {});
      }
    },
      error => {
        this.loaderService.showLoader = false;
        this.CloseModal('failed', {});
      });
  }

  save(addPatientForm: NgForm) {
    if (this.isUpdate) {
      this.update(addPatientForm);
    }
    else {
      this.postData(addPatientForm);
    }
  }

  CloseModal(flg: string, data: any) {
    this.addPatientForm.reset();
    this.createAddPatientForm();
    this.isUpdate = false;
    this.AddPatientFlag.emit({ flag: flg, data: data });
  }

  update(addPatientForm) {
    debugger
    let opts = {
      firstName: addPatientForm.firstName,
      familyMemberFirstName: addPatientForm.familyfirstName,
      middleName: addPatientForm.middleName || '',
      lastName: addPatientForm.lastName,
      familyMemberLastName: addPatientForm.familylastName,
      suffix: addPatientForm.suffix || '',
      provider: addPatientForm.provider ? addPatientForm.provider : "",
      contactNumber: addPatientForm.contactNumber,
      familyMemberContactNumber: addPatientForm.familyContactNumber,
      // appointmentDate: addPatientForm.appointmentDate + ' ' + addPatientForm.appointmentTime +':'+'00'  ,
      // checkInTime: addPatientForm.checkInTime ,
      appointmentDate: addPatientForm.appointmentDate + ' ' +`${('0' + addPatientForm.appointmentTime.hour).slice(-2)}:${('0' + addPatientForm.appointmentTime.minute).slice(-2)}` +':'+'00'  ,
      checkInTime: addPatientForm.checkInTime ? `${('0' + addPatientForm.checkInTime.hour).slice(-2)}:${('0' + addPatientForm.checkInTime.minute).slice(-2)}` : "",
      
      facilityID: addPatientForm.facilityID,
      facilityCode: localStorage.getItem('dashboardType'),
      mrn:this.patient.mrn,
      patientID:addPatientForm.patientID,
      sex:this.sendSexValue(addPatientForm.sex),
      dob:  addPatientForm.date || '',
      // dob:this.formateDob(addPatientForm.dob)
    }
    this.loaderService.showLoader = true;
    
      this.appService.updatePatient(opts).subscribe(data => {
        this.loaderService.showLoader = false;
        if (data.status.toUpperCase() == "SUCCESS") {
          this.CloseModal('updated', addPatientForm);
          this.loaderService.NotifyEvent.next({ message: "updated" });
        }
        else if (data.status.toUpperCase() == "ERROR") {
          this.CloseModal('failed', {});
        }
        else {
          this.CloseModal('failed', {});
        }
      },
        error => {
          this.loaderService.showLoader = false;
          this.CloseModal('failed', {});
        });
    
  }
  formateDob(e){
    debugger
    return  e.year +"-" +( e.month) + "-" + ( e.day) ;
  }
  onDateSelected(e){
    console.log(e)
    this.dob = e;
    if (e !== "" && e !== null && e !== undefined) {

      let params = ('0' + e.month).slice(-2) + "/" + ('0' + e.day).slice(-2) + "/" + e.year;
      (document.getElementById('dob')as HTMLInputElement).value =params;
      //  this.dob=       e.year +"-" +( '0' +e.month).slice(-2) + "-" + ('0' + e.day).slice(-2);
    }
  }
 sendSexValue(event){
   if(event.toLowerCase()!='select sex')
   {
     return event;
   }else{
     return ''
   }
 }
}
