/**
 * Service Name: CommunicationService
 * Created On: 27th Mar 2024
 * Created By: Bibhuti Bhusan Sahoo
 */


import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor() { }
  private buttonClickedSource = new Subject<void>();
  buttonClicked$ = this.buttonClickedSource.asObservable();
  
  emitButtonClick() {
    this.buttonClickedSource.next();
  }
}
