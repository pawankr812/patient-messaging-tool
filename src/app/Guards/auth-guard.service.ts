import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AppService } from '../Services/appService/appService.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private _appService: AppService, private _router: Router) { }

    canActivate(): boolean {
        if (this._appService.isAuthenticated()) {
            return true;
        } else {
            this._router.navigate([''])
            return false
        }
    }
}

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {

    constructor(private _appService: AppService, private _router: Router) { }

    canActivate(): boolean {
        if (this._appService.isAuthenticated()) {
            this._router.navigate(['/dashboard-ed'])
            return false
        } else {
            return true
        }
    }
}
