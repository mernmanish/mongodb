import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { CitizenSchemeService } from '../../citizen-portal/service-api/citizen-scheme.service';
@Component({
  selector: 'app-track-status',
  templateUrl: './track-status.component.html',
  styleUrls: ['./track-status.component.css']
})
export class TrackStatusComponent implements OnInit {
  siteURL = environment.siteURL;

  fileUrl = environment.fileUrl;
  dirIcons = environment.directoryListicons;
  public loading = false;
  farmerInfo:any;
  applicationDetails: any;
  isDataFlag = false;
  error: any;
  trackInfo:any;
  constructor( private api: CitizenSchemeService,) { 
   
  }

  ngOnInit(): void {
    this.getApplicationDetails()
  }
  getApplicationDetails(){
   
    this.loading = true;
    this.trackInfo = JSON.parse(sessionStorage.getItem('TRACKINFO'));
    let params = {
      "applicationId":this.trackInfo.txtapplicationId,
       "profId": this.trackInfo.profId
    };
    this.api.getTrackApplication(params)
    .subscribe(
      (res: any)=> {
         this.applicationDetails = res.result;
         if(this.applicationDetails.length >0){
           this.isDataFlag = true;
           this.loading = false;
          }
         else{
          this.isDataFlag = false;
          this.loading = false;
          this.applicationDetails="";
         }
        
     },
      error => {
        this.error = error
        this.applicationDetails = []
      }

    );
 }

}
