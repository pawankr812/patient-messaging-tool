import { Component, OnInit, Output, EventEmitter, Input, ModuleWithComponentFactories } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'
import { AppService } from 'src/app/Services/appService/appService.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/userService/userService.service';
import { user } from 'src/app/Interfaces/User';


@Component({
  selector: 'app-add-family',
  templateUrl: './add-family.component.html',
  styleUrls: ['./add-family.component.css']
})
export class AddFamilyComponent implements OnInit {

  @Input() patient: any;
  @Output() AddPatientFlag = new EventEmitter<any>();
  addPatientForm: FormGroup;
  isUpdate: boolean = false;

  public appointmentDates = [];
  public dashboardType: any;

  constructor(public router: Router, public formbuilder: FormBuilder,
    public appService: AppService, public loaderService: LoaderService,
    public userService: UserService) {

    // this.userService.appointmentDates.subscribe(data => {
    //   if (data && data.length) {
    //     this.appointmentDates = data;
    //   }
    //});
    this.createAddPatientForm();
  }

  ngOnInit() {
    this.dashboardType = localStorage.getItem('dashboardType');
    this.appointmentDates.push(["11/10/2019"]);
    if (this.patient && this.patient.patientID) {
      this.appointmentDates = [];
      this.appointmentDates.push(this.patient.appointmentDate.split(' ')[0]);

      this.addPatientForm.setValue({
        firstName: this.patient.familyMemberFirstName,
        lastName: this.patient.familyMemberLastName,
        contactNumber: this.patient.familyMemberContactNumber,
        suffix: '',
        middleName: this.patient.familyMemberMiddleName,
        facilityID: this.userService.facilityID,
        patientID: '',
        facilityCode: '',
        sex:this.patient.sex,
        dob:this.patient.dob
      });
      this.isUpdate = true;

    }
  }

  public createAddPatientForm() {
    this.addPatientForm = this.formbuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      contactNumber: new FormControl(''),
      suffix: new FormControl(),
      middleName: new FormControl(),
      facilityID: new FormControl(this.userService.facilityID),
      patientID: new FormControl(''),
      facilityCode: new FormControl(''),
      sex:new FormControl(''),
      dob:new FormControl('')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addPatientForm.controls; }

  postData(addPatientForm) {
    this.loaderService.showLoader = true;
    let opts = {
      firstName: addPatientForm.firstName,
      middleName: addPatientForm.middleName || '',
      lastName: addPatientForm.lastName,
      suffix: addPatientForm.suffix || '',
      provider: addPatientForm.providerName ? addPatientForm.providerName : "",
      contactNumber: addPatientForm.phoneNumber,
      appointmentTime: addPatientForm.appointmentTime ? `${('0' + addPatientForm.appointmentTime.hour).slice(-2)}:${('0' + addPatientForm.appointmentTime.minute).slice(-2)}` : '',
      appointmentDate: addPatientForm.appointmentDate,
      checkInTime: addPatientForm.checkInTime ? `${('0' + addPatientForm.checkInTime.hour).slice(-2)}:${('0' + addPatientForm.checkInTime.minute).slice(-2)}` : "",
      facilityID: addPatientForm.facilityID,
      facilityCode: 'OR',
      sex:addPatientForm.sex|| '',
      dob:addPatientForm.dob|| ''
    }
    this.appService.addPatient(addPatientForm).subscribe(data => {
      this.loaderService.showLoader = false;
      if (data.status.toUpperCase() == "OK") {
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
    // if (this.isUpdate) {
      if (this.addPatientForm.valid) {
        this.update(addPatientForm);
      }
  //  }
    // else {
    //   this.postData(addPatientForm);
    // }
  }

  CloseModal(flg: string, data: any) {
    this.addPatientForm.reset();
    this.createAddPatientForm();
    this.isUpdate = false;
    this.AddPatientFlag.emit({ flag: flg, data: data });
  }

  update(addPatientForm) {
    let opts = {
      firstName: addPatientForm.firstName,
      middleName: addPatientForm.middleName || '',
      lastName: addPatientForm.lastName,
      contactNumber: addPatientForm.contactNumber,
      facilityID: addPatientForm.facilityID,
      facilityCode: "OR",
      patientID: this.patient.patientID,
      sex:addPatientForm.sex,
      dob:addPatientForm.dob
    }
    this.loaderService.showLoader = true;

    this.appService.addFamily(opts).subscribe(data => {
      this.loaderService.showLoader = false;
      if (data.status.toLowerCase() == "success") {
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

}
