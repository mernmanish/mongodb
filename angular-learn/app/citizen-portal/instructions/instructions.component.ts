/**
 * Component Name: InstructionsComponent
 * Created On: 27th Mar 2024
 * Created By: Bibhuti Bhusan Sahoo
 */

import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {

  constructor(private communicationService: CommunicationService, private router: Router) { }
  loading = false;
  ngOnInit(): void {
    const instructionStatus = sessionStorage.getItem('instructionStatus');
    if(instructionStatus && instructionStatus == 'false'){
      this.router.navigateByUrl('/citizen-portal/dashboard');
    }
  }

  /**
   * Function Name: openRegistration
   * Description: This function send the instruction to shared service on Agree condition
   * Creted on: 27th Mar 2024
   * Created By: Bibhuti Bhusan Sahoo
   */
  openRegistration() {
    this.loading = true;
    this.communicationService.emitButtonClick();
  }

}
