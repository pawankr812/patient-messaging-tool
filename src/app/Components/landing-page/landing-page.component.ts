import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/Services/appService/appService.service';
import { UserService } from 'src/app/Services/userService/userService.service';
import { LoaderService } from 'src/app/Services/loader/loader.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { noop, Observable, Observer, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  public users: any;
  public facilityCodeError: boolean = false;
  loginForm: FormGroup;
  public displayUserName: string = "";
  search: string;
  suggestions$: Observable<[]>;
  facilityArray = [];
  constructor(private http: HttpClient, public router: Router, public formbuilder: FormBuilder, public userService: UserService, public appService: AppService, public loaderService: LoaderService) {
    // this.createLoginForm();
  }

  ngOnInit() {
    console.log('dfgcfvh')
    this.router.navigateByUrl('/dashboard-ed');
    // this.userService.getAppointmentDates();
    // this.getCurrentUser();
    // this.getToken();
    // this.loginForm.get("facilityCode").valueChanges.subscribe(selectedValue => {
    //   if (selectedValue == "") {
    //     this.facilityCodeError = false;
    //   }
    // });
    // this.suggestions$ = new Observable((observer: Observer<string>) => {
    //   observer.next(this.loginForm.get("facilityCode").value);
    // }).pipe(
    //   switchMap((query: string) => {
    //     if (query && query.length > 1) {
    //       return this.appService.facilityLookup(query).pipe(
    //         map((data) => {
    //           data.data.forEach(element => {
    //             element.facility = element.facilityCode+' - '+element.facilityName
    //           });
    //           this.facilityArray = data && data.data ? data.data : [];
    //           return data && data.data || [] }),
    //         tap(() => noop, err => {
    //           this.facilityArray = [];
    //           this.facilityCodeError = err && err.message || 'Something goes wrong';
    //         })
    //       );
    //     }
    //     return of([]);
    //   })
    // );
  }

  // public createLoginForm() {
  //   this.loginForm = this.formbuilder.group({
  //     facilityCode: new FormControl('', Validators.required)
  //   });
  // }

  // convenience getter for easy access to form fields
  // get f() { return this.loginForm.controls; }

  // getToken() {
  //   let token = localStorage.getItem("token");
  //   if (token) {
  //     if (this.tokenExpired(token)) {
  //       this.logout();
  //     } else {
  //       var decodedData = window.atob(token);
  //       localStorage.setItem("token", token);
  //       localStorage.setItem("userData", decodedData);
  //       // this.userService.getAppointmentDates();
        
  //       if(this.userService.facilityType=='AMB')
  //       {
  //         this.router.navigateByUrl('dashboard');
  //       }
  //       else{
  //         this.router.navigateByUrl('dashboard-ed');
  //       }
  //     }
  //   }
  //   else {
  //     this.logout();
  //   }
  // }

  // tokenExpired(token: string) {
  //   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  //   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  // }

  // logout() {
  //   this.userService.logout();
  // }

  // decodeAllUsers(users) {
  //   if (users && users.length) {
  //     users.forEach(user => {
  //       if (user.token) {
  //         var decodedData = window.atob(user.token);
  //         user.data = JSON.parse(decodedData);
  //       }
  //     });
  //   }
  //   return users;
  // }

  // login(value) {
  //   if (value && value.facilityCode != "") {
  //     let data = this.facilityArray.find(item => item['facility'] === value.facilityCode);
  //     this.loaderService.showLoader = true;
  //     this.appService.getUser(data ? data.facilityCode : value.facilityCode).subscribe(res => {
  //       if (res && res.facilities && res.facilities) {
  //         localStorage.setItem("userData", JSON.stringify(res));
  //         this.facilityCodeError = false;
  //         var token = btoa(JSON.stringify(res))
  //         localStorage.setItem("token", token);
  //         this.userService.setLoggedInUser();
  //         // this.userService.getAppointmentDates();

  //         //this.router.navigateByUrl('dashboard');
  //         if (this.userService.facilityType == 'AMB') {
  //           this.router.navigateByUrl('dashboard');
  //         }
  //         else {
  //           this.router.navigateByUrl('dashboard-ed');
  //         }

  //       }
  //       else {
  //         this.facilityCodeError = true;
  //       }
  //       this.loaderService.showLoader = false;
  //     },
  //       error => {
  //         this.facilityCodeError = true;
  //         this.loaderService.showLoader = false;
  //       });
  //   }
  // }

  // public getCurrentUser() {
  //   this.appService.getCurrentUser().subscribe(res => {
  //     this.displayUserName = res && res.data ? res.data : "";
  //   }, error => {
  //     this.displayUserName = "";
  //   })
  // }

  // typeaheadOnSelect(e) {
  //   if (e && e.value != "") {
  //     this.facilityCodeError = false;
  //   }
  // }

  // noSpeacialCharacters(e) {	
  //   var k = e.keyCode; 
  //   return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  // }
  // ngOnDestroy() {
  //   this.facilityArray = [];
  // }
}
