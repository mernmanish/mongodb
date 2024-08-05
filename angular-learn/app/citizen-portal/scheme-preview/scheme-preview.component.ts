import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { formatDate } from '@angular/common';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CitizenSchemeActivityService } from '../service-api/citizen-scheme-activity.service';
import { DatePipe } from '@angular/common';
import { CitizenHeaderComponent } from '../citizen-header/citizen-header.component';

@Component({
  selector: 'app-scheme-preview',
  templateUrl: './scheme-preview.component.html',
  styleUrls: ['./scheme-preview.component.css'],
  providers: [DatePipe, CitizenHeaderComponent]
})
export class SchemePreviewComponent implements OnInit {
  loading = false;
  finalForm :any;
  finalSubmitted = false;
  schemeId: any;
  applicantId: any;
  applctnId: any;
  branchId: any;
  directorateId: any;
  sectorId: any;
  applicantName: any;
  emailId: any;
  mobileNo: any;
  fatherNm: any;
  aadhaarNo: any;
  gender: any;
  castCatg: any;
  dob: any;
  address: any;
  profImgUrl: any;
  farmInfoSts: any;
  districtNm: any;
  blockNm: any;
  gpNm: any;
  villageNm: any;
  schmSts: any;
  schmData: any;
  schmHrDt: any='';
  editSts = 0;
  resDocSts: any;
  resPaySts: any;
  resDocList: any=[];
  resPayList: any;
  paymentDetails: any;
  qryArr: any[] = [];
  isServcFlg: boolean = false;
  docSectnSts: boolean = false; // document section display/ not
  paySectnSts: boolean = false; // document section display/ not
  apprRsmSts = 0; // resubmit status
  appHistId = 0; // application history id

  marineType = 0;
  distLabel = 'District';
  blockLabel = 'Block / ULB';
  gpLabel = 'GP / Ward';
  sujogPortal=environment.sujogPortal;
  sujogCity='';
  bankImg:any;
  btnStatusChk:any=false;
  profilePic:any;
  checkBoxChk = false;
  responseSts: any;
  applicationDetails:any =[];
  appldetcnt: any;
  applicationId:any;
  constructor(private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService, private objProf: CitizenProfileService, private objSchmCtrl: CitizenSchemeService, private objSchmActv: CitizenSchemeActivityService, private datepipe: DatePipe, private test: CitizenHeaderComponent) { }

  ngOnInit(): void {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    this.profilePic = farmerInfo.USER_PROF_PIC;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    console.log(schemeArr);
    this.schemeId = schemeArr[0];
    this.applctnId = schemeArr[1];
    this.editSts = (schemeArr[2] === undefined) ? 0 : schemeArr[2];
    this.appHistId = 0;//(schemeArr[3] === undefined) ? 0 : schemeArr[3];
    this.branchId = (schemeArr[3] === undefined) ? 0 : schemeArr[3];
    this.directorateId = schemeArr[4];
    this.sectorId = schemeArr[5];
    setTimeout(() => {
      this.getFarmrInfo();
      this.getSchmDynmCtrls();
      this.getDynmDocs();
      if (this.editSts == 0) {
        this.getSchmQryRlyLst();
      }
    }, 1000);
    this.getApplicationDetails();
  }

  // get farmer  basic info
  getFarmrInfo() {
    let params = {
      "profileId": this.applicantId
    };
    this.loading = true;
    this.objProf.profileBuild(params).subscribe(res => {
      this.farmInfoSts = res.status;
      if (res.status > 0) {
        let resProfInfo = res.result['profileInfo'];
        // get profile info
        this.applicantId = resProfInfo['applicantId'];
        this.applicantName = resProfInfo['applicantName'];
        this.emailId = resProfInfo['emailId'];
        this.mobileNo = resProfInfo['mobileNo'];
        this.fatherNm = resProfInfo['fatherNm'];
        let aadhaarNoP = resProfInfo['aadhaarNo'];
        this.aadhaarNo = '';
        if (aadhaarNoP != '') {
          this.aadhaarNo = "X".repeat(8) + aadhaarNoP.substr(8, 4);
        }
        this.gender = resProfInfo['genderNm'];
        this.castCatg = resProfInfo['castCatgNm'];
        let dobV = resProfInfo['dob'];
        let dtmDob = new Date(dobV);
        this.dob = formatDate(dtmDob, 'dd-MMM-yyyy', 'en-US');
        this.districtNm = resProfInfo['districtNm'];
        this.blockNm = resProfInfo['blockNm'];
        this.gpNm = resProfInfo['gpNm'];
        this.villageNm = resProfInfo['vlgNm'];
        this.address = resProfInfo['address'];
        this.profImgUrl = resProfInfo['profPic'];
        this.loading = false;
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }
  // get scheme info
  getSchmDynmCtrls() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applicationId": this.applctnId,
      "mainSectionId": 0,
      "appHistId": this.appHistId
    };
    this.loading = true;
    this.objSchmCtrl.schemeDynCtrls(params).subscribe(res => {
    
      if (res.status > 0) {
        this.schmSts = res.status;
        this.schmData = res.result['ctrlArr'];
        this.schmHrDt = res.result['schmSrvArr'];
        this.bankImg  = res.result.schmSrvArr.bankImg;
        let marineSec = this.schmHrDt.sector;
        if (marineSec == 1) {
          this.marineType = 1;
          this.distLabel = 'Marine Jurisdiction';
          this.blockLabel = 'Marine Extension';
          this.gpLabel = 'FLC / FH';
        }
        else if (marineSec == 3) {
          this.marineType = 2;
          this.distLabel = 'District / Marine Jurisdiction';
          this.blockLabel = 'Block / ULB / Marine Extension';
          this.gpLabel = 'GP / Ward / FLC / FH';
        }
        if(this.schemeId==environment.sujogPortal){
          this.sujogCity=res.result.schmSrvArr.redirectAPIDetls;
        }else{
          this.sujogCity='';
        }
        let schemeTypeId = this.schmHrDt.schmServType;
        this.isServcFlg = (schemeTypeId == environment.constService) ? true : false;
        this.docSectnSts = (this.schmHrDt.schmServDocSctn == 1) ? true : false;
        this.paySectnSts = (this.schmHrDt.schmServPaySctn == 1) ? true : false;
        if(this.paySectnSts){
          this.getPaymentDetails();
        }
        this.apprRsmSts = this.schmHrDt.apprRsmSts;
        this.loading = false;
        this.initForm();
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }
  // get scheme documents
  getDynmDocs() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId,
      "appHistId": this.appHistId
    };
    this.loading = true;
    this.objSchmCtrl.getSchmDocList(params).subscribe(res => {
      if (res.status > 0) {
        this.resDocSts = res.status;
        this.resDocList = res.result['docArr'];
        this.loading = false;
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });

  }

  private initForm() {
    if (this.apprRsmSts == 1) {
      this.finalForm = new FormGroup({
        'resubmitRmrk': new FormControl('',
          [
            Validators.required,
          ]
        ),
        'terms': new FormControl('',
          [
            Validators.required,
          ]
        ),
      });
    }
    else {
      this.finalForm = new FormGroup({
        'terms': new FormControl('',
          [
            Validators.required,
          ]
        ),
      });
    }
  }


  doSchmModify() {
    let docSectnFlg = (this.docSectnSts == true) ? 1 : 0;
    let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':' + docSectnFlg).toString());
    this.router.navigate(['/citizen-portal/profile-update', encAppCtnId]);
  }


  get g(): { [key: string]: AbstractControl } {
    return this.finalForm.controls;
  }
  onFinalSubmit() {
    this.finalSubmitted = true;
    
    let alrtMsg = (this.apprRsmSts == 1) ? 'Please enter remark & select declaration' : 'Please select declaration';
    // if (this.finalForm.invalid) {
    //   Swal.fire({
    //     icon: 'error',
    //     text: alrtMsg
    //   });
    //   return;
    // }
    // if(!this.btnStatusChk)
    // {
    //   return false;
    // }
    
    // return false;
    const checkbox = document.getElementById(
      'declarationCheck',
    ) as HTMLInputElement | null;
    if (checkbox?.checked == false) {
      this.checkBoxChk = true;
      Swal.fire({
        icon: 'error',
        text: alrtMsg
      });
      return false;
    }

    let resubmitRmrk = (this.apprRsmSts == 1) ? (this.finalForm.controls.resubmitRmrk.value) : '';
    let schemeParam = {
      "profileId": this.applicantId,
      "schemeId": this.schemeId,
      "applctnId": this.applctnId,
      "branchId": this.branchId,
      "resubmitRmrk": resubmitRmrk
    }
    
    // if(this.schemeId==environment.sujogPortal){
    //   this.loading = true;
    //   this.objSchmCtrl.schemeFnlSubmitSujog(schemeParam).subscribe(res => {
    //     if (res.status == 1) {
    //       this.loading = false;
    //       let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
    //       this.router.navigate(['/citizen-portal/success', encAppCtnId]);
    //     }
    //     else {
    //       Swal.fire({
    //         icon: 'error',
    //         text: res.msg
    //       });
    //       this.loading = false;
    //     }
    //   },
    //     error => {
    //       Swal.fire({
    //         icon: 'error',
    //         text: environment.errorMsg
    //       });
    //     });
    // }else{
      
    // if(this.paySectnSts &&  this.resPaySts ==1){
    //   Swal.fire({
    //     title: 'Proceed for payment?',
    //     showDenyButton: true,
    //     showCancelButton: false,
    //     confirmButtonText: 'Yes',
    //     // denyButtonText: `Don't save`,
    //   }).then((result) => {
    //     /* Read more about isConfirmed, isDenied below */
    //     if (result.isConfirmed) {
    //       this.loading = true;
    //       this.objSchmCtrl.schemePaySubmit(schemeParam).subscribe(res => {
    //         if (res.status == 1) {
    //           let result = res.result.resData;
    //           this.sendPayment(result)
    //           // let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
    
    //           // window.location.href = "https://www.google.com/";
    //         }
    //         else {
    //           Swal.fire({
    //             icon: 'error',
    //             text: res.msg
    //           });
    //           this.loading = false;
    //         }
    //       },
    //       error => {
    //           Swal.fire({
    //             icon: 'error',
    //             text: environment.errorMsg
    //           });
    //         });
    //     } 
    //   })
      
      
    // }else{
      
      this.objSchmCtrl.schemeFnlSubmit(schemeParam).subscribe(res => {
        
        if (res.status == 1) {
          this.loading = false;
          let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
          this.router.navigate(['/citizen-portal/success', encAppCtnId])
          .then(() => {
            window.location.reload();
          });
          // let result = this.test.getNotificationListHeaderCount();
          // if(result>0)
          //   this.router.navigate(['/citizen-portal/success', encAppCtnId]);
          // else
          //   this.router.navigate(['/citizen-portal/success', encAppCtnId]);
          
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
          this.loading = false;
        }
      });
      //}
    //}

  }


  // get scheme query details
  getSchmQryRlyLst() {
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId,
      "appHistId": this.appHistId
    };
    this.loading = true;
    this.objSchmActv.getSchmQryRlyList(params).subscribe(res => {
      if (res.status > 0) {
        this.loading = false;
        this.qryArr = res.result['qryInfoArr'];
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });

  }
  // get addmore value
  getAddMoreVal(elmV: any, colT: any) {
    if (elmV != '') {
      if (colT == 9) {
        let dateArr = elmV.split('/');
        let dateString1 = dateArr['2'] + '-' + dateArr['1'] + '-' + dateArr['0'];
        let newDate = new Date(dateString1);
        elmV = this.getFormatedDate(newDate, 'dd-MMM-yyyy');
      }
      if (colT == 10) {
        let newDate = new Date('1970-01-01T' + elmV);
        elmV = this.getFormatedDate(newDate, 'h:mm a');
      }
      if (colT == 11) {
        let newDate = new Date(elmV);
        elmV = this.getFormatedDate(newDate, 'dd-MMM-yyyy h:mm a');
      }
    }
    else {
      elmV = '--';
    }
    return elmV;
  }
  printPage() {
    window.print();
  }
  // format date in typescript
  getFormatedDate(date: any, format: string) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, format);
  }
  goBack() {
    window.history.back();
  }

  getPaymentDetails(){
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applctnId": this.applctnId,
      "appHistId": this.appHistId
    };
    this.loading = true;
    this.objSchmCtrl.getSchmPayList(params).subscribe(res => {
      if (res.result.applctnSts > 0) {
        this.resPaySts = res.result.applctnSts;
        
        this.resPayList = res.result['payArr'];
        this.paymentDetails = res.result['paymentDetails'];
        this.loading = false;
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }


  sendPayment(result:any){
    
    this.loading = true;
      var mapForm = document.createElement("form");
      mapForm.method = "POST"; // or "post" if appropriate
      mapForm.action = result.action;
      var hdn_qs = document.createElement("input");
      hdn_qs.type = "hidden";
      hdn_qs.name = "hdn_qs";
      hdn_qs.setAttribute("value","");
      mapForm.appendChild(hdn_qs);
      
      var actionUrl = document.createElement("input");
      actionUrl.type = "hidden";
      actionUrl.name = "actionUrl";
      actionUrl.setAttribute("value", result.action);
      mapForm.appendChild(actionUrl);
      
    
      document.body.appendChild(mapForm);
     
      mapForm.submit();

      // this.loading = false;
    }
    getApplicationDetails() {
      
      let params = {
  
        "applctnId": this.applctnId,
        "profId": this.applicantId
      };
      this.loading = true;
  
  
      this.objSchmCtrl.getTrackApplication(params).subscribe(res => {
        this.responseSts = res.status;
        if (res.status > 0) {
  
          this.applicationDetails = res.result[0];
         
          //console.log(this.applicationDetails[0].rejectReason[0].vchReason);
          this.loading = false;
        }
      },
        error => {
          Swal.fire({
            icon: 'error',
            // text: environment.errorMsg
            text: 'It is taking to long time! Please wait. We are searching your data..'
          });
          this.loading = false;
        });
    }
}
