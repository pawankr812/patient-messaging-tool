import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class NotificationService {
     signlrNotification :Subject<boolean> = new Subject();   
}
export class NotificationSearchService {
    searchNotification :Subject<boolean> = new Subject();   
}