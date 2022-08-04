import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  showLoader: boolean = false;
  public AddPatientEvent = new BehaviorSubject(null);
  public NotifyEvent= new BehaviorSubject(null);
  constructor() { }
}
