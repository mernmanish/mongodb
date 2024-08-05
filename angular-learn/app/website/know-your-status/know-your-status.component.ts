import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { WebsiteApiService } from '../website-api.service';

@Component({
  selector: 'app-know-your-status',
  templateUrl: './know-your-status.component.html',
  styleUrls: ['./know-your-status.component.css']
})
export class KnowYourStatusComponent implements OnInit {
  @ViewChild('ApplicationModal') ApplicationModal:ElementRef;
  statusform :any;
  submitted = false;
  applications: any;
  public loading = false;
  bodyData: any;
  applicationDetails: any;
  isDataFlag = false;
  siteURL = environment.siteURL;
  dtApplication = '--';
  SchemePrev: any;
  error: any;
  farmerInfo:any;
applicationNo:any;
otherDetails:any;
p: number = 1;
  constructor(   
    private formBuilder:FormBuilder,
    private api: WebsiteApiService,
    private modalService: NgbModal,
    private el: ElementRef,) { }

  ngOnInit(): void {
    this.initForm()
  }  

getKeyByValue(object:any, value:any) {
    for (var type in object) {
      if(value == type){
        return object[type]; 
      }
    }
  }

  private initForm() {
    // this.loading=true;
      this.statusform = this.formBuilder.group({
        
        'txtapplicationId': new FormControl('',
                  [
                    Validators.required,
                  ]
      )
    });
  }


getApplicationDetails(){
    this.submitted=true;
    // console.log(this.loginForm);
    if (this.statusform.invalid) {
      return;
    }
 
   
  
    this.loading = true;
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let params = {
      "applicationId": this.statusform.value.txtapplicationId
     
    };
    
    this.api.getApplicationTrack(params)
    .subscribe(
      // error => console.log(error)
      (res: any)=> {
         //console.log(res.result);
        
          this.applicationDetails = res.result;
        
          if(this.applicationDetails.length > 0){
            this.isDataFlag = true;
            this.loading = false;
          
         
         
          }
          else{
            this.isDataFlag = false;
           this.loading = false;
           this.applicationDetails="";
           }
          //  console.log(res.result[0]);
         

       
      
       
      },
      error => {
        this.error = error
        this.applicationDetails = []
      }

    );



  //   console.log(this.bodyData)
 }

  

  get f(): { [key: string]: AbstractControl } {
    return this.statusform.controls;
  }



}
