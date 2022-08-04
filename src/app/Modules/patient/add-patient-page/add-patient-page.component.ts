import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, NgForm, Validators } from '@angular/forms';
import { AppService } from 'src/app/Services/appService/appService.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/Services/userService/userService.service';
import { user } from 'src/app/Interfaces/User';

@Component({
  selector: 'app-add-patient-page',
  templateUrl: './add-patient-page.component.html',
  styleUrls: ['./add-patient-page.component.css']
})
export class AddPatientPageComponent implements OnInit {

  @Input() patient: any;
  public appointmentDates: Array<[]> = [];
  addPatientForm: FormGroup;
  isUpdate: boolean = false;

  constructor(public router: Router, public formbuilder: FormBuilder,
    public appService: AppService, public loaderService: LoaderService,
    public userService: UserService, public activatedRoute: ActivatedRoute) {
    this.userService.appointmentDates.subscribe(data => {
      if (data && data.length) {
        this.appointmentDates = data;
      }
    });
    this.createAddPatientForm();
  }

  ngOnInit() {
    this.patient = JSON.parse(localStorage.getItem('patient'));
    if (this.patient && this.patient.patientID) {
      this.addPatientForm.setValue({
        firstName: this.patient.firstName,
        lastName: this.patient.lastName,
        appointmentTime: this.userService.formatTimeData(this.patient.appointmentTime),
        appointmentDate: this.patient.appointmentDate,
        checkInTime: this.patient.checkInTime ? this.userService.formatTimeData(this.patient.checkInTime) : "",
        providerName: this.patient.providerName,
        phoneNumber: this.patient.contactNo,
        suffix: ((this.patient.suffix == 'null' ? '' : this.patient.suffix) || ''),
        middleName: ((this.patient.middleName == 'null' ? '' : this.patient.middleName) || ''),
        facilityID: this.patient.facilityID,
        patientID: this.patient.patientID
      });
      this.isUpdate = true;
    }
  }

  public createAddPatientForm() {
    this.addPatientForm = this.formbuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      appointmentTime: new FormControl('', Validators.required),
      appointmentDate: new FormControl(this.appointmentDates.length ? this.appointmentDates[0] : "", Validators.required),
      checkInTime: new FormControl(''),
      providerName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      suffix: new FormControl(),
      middleName: new FormControl(),
      facilityID: new FormControl(this.userService.facilityID),
      patientID: new FormControl('')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addPatientForm.controls; }

  postData(addPatientForm) {
    this.loaderService.showLoader = true;
    let opts =  {firstName: this.patient.firstName,
    lastName: this.patient.lastName,
    appointmentTime: this.userService.formatTimeData(this.patient.appointmentTime),
    appointmentDate: this.patient.appointmentDate,
    checkInTime: this.patient.checkInTime ? this.userService.formatTimeData(this.patient.checkInTime) : "",
    providerName: this.patient.providerName,
    phoneNumber: this.patient.contactNo,
    suffix: ((this.patient.suffix == 'null' ? '' : this.patient.suffix) || ''),
    middleName: ((this.patient.middleName == 'null' ? '' : this.patient.middleName) || ''),
    facilityID: this.patient.facilityID,
    patientID: this.patient.patientID,
    mrn:""
  }
    this.appService.addPatient(opts).subscribe(data => {
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
      err => {
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
    localStorage.removeItem('patient');
    this.router.navigate(['dashboard']);
  }

  update(addPatientForm) {
    this.loaderService.showLoader = true;
    this.appService.updatePatient(addPatientForm).subscribe(data => {
      this.loaderService.showLoader = false;
      if (data.status.toUpperCase() == "OK") {
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
      err => {
        this.loaderService.showLoader = false;
        this.CloseModal('failed', {});
      });
  }

}
