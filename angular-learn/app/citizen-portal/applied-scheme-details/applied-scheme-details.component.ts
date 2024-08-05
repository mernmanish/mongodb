import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { RedirectService } from '../../redirect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitizenSchemeActivityService } from '../service-api/citizen-scheme-activity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-applied-scheme-details',
  templateUrl: './applied-scheme-details.component.html',
  styleUrls: ['./applied-scheme-details.component.css']
})
export class AppliedSchemeDetailsComponent implements OnInit {

  constructor(private router:Router,private route:ActivatedRoute, private objSchm:CitizenSchemeService,private encDec: EncryptDecryptService,
    private modalService: NgbModal,private objSchmActv:CitizenSchemeActivityService,private objRedirect: RedirectService) { }
  respSts:any;
  respList:any;
  applicantId:any;
  schemeId:any;
  applctnId: any;
  public loading = false;
  resDocSts: any;
  resDocList: any;
  respsubsidy:any;
  appQrySts=environment.constQrySts;
  appRsmSts=environment.constRsmSts;
  sujogProcessId=environment.sujogPortal;
  rsmInfo: any[];
  public isRsmFlg:boolean=false;
  schemeStr;
  redirectList: any[] = [];
  redirectKeyList='';
  mobileNo='';
  redirectURL='';
  refNo='';
  refText='Reference No.';

  @ViewChild('rsmModal') rsmModalRef: ElementRef;

  ngOnInit(): void {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId  = this.route.snapshot.paramMap.get('id');
   
 
    this.schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = this.schemeStr.split(':');
    this.schemeId = schemeArr[0];
    // console.log(schemeArr[1]);
 


    let params = {
      "schemeId":this.schemeId,
      "profId":this.applicantId,
      "applctnId":0
    };
    this.getAppldSchmLst(params);  
   
  }
  getAppldSchmLst(params:any)
  {
    this.objSchm.getAppldSchmLst(params).subscribe(res=>{
      this.respSts  = res.status;
      this.respList = res.result;
      if(res.status.directorate=='Mo Bidyut'){
        this.refText='UPAN No.'
      }      
      console.log(this.refText);
    });
  }
  doSchemeApply(schemeStr : any,schemeName:any, schmServTypeId:any,schmServTypeNm:any)
  {
    this.setSchmServSesNm(schemeName,schmServTypeId,schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/profile-update',encSchemeStr]);
  }
  goBack() {
    window.history.back();
  }
  doSchemePreview(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-preview',encSchemeStr]);
  }

  doUploadPaymentReceipt(schemeStr : any)
  {
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/upload-payment-receipt',encSchemeStr]);
  }

  updateScheme(schemeStru : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStru.toString());
    console.log(encSchemeStr);
    this.router.navigate(['/citizen-portal/updateSchemestatus',encSchemeStr]);
    
  }



  
  // mthod to set scheme session details
  setSchmServSesNm(schemeName:any, schmServTypeId:any,schmServTypeNm:any)
  {
    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = schmServTypeNm;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schmServTypeId;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
  }

  doQueryReply(schemeStr : any,schemeName:any, schmServTypeId:any,schmServTypeNm:any)
  {
    this.setSchmServSesNm(schemeName,schmServTypeId,schmServTypeNm);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-query-reply',encSchemeStr]);
  }

  doReply(schemeId : any,applicationId : any){
    let arrayRedUrl:any = [];
    let apiParam = {
      "schemeId":schemeId,
      "applicationId":applicationId
    }
    this.objSchm.getRedirectQueryAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        this.redirectList = res.result.redirectInfo;
        this.redirectKeyList = res.result.redirectInfo.apiKeyDtls;
        this.redirectURL   = res.result.redirectInfo.redirectURL;
        this.mobileNo   = res.result.redirectInfo.mobileNo;

        let redirectArr=this.redirectKeyList;
        let value='';
        let replaceArr={"appId":applicationId,"[frmmob]":this.mobileNo};
          for(let i = 0; i < redirectArr.length; i++){            
            let key=redirectArr[i]['key'];
            let keyValue=redirectArr[i]['value'];
            
            let fieldValue = replaceArr[keyValue];
            if(typeof(fieldValue)!='undefined' && fieldValue!='')
            {
              arrayRedUrl.push({[key]:fieldValue});         
            }
          }
          arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
          let finalRedirectArrs = [];
          finalRedirectArrs.push(arrayRedUrl);
        //console.log(finalRedirectArrs);
        this.objRedirect.post(finalRedirectArrs,this.redirectURL);
      }
    });
  }

  doIntegrationPreview(schemeId : any,applicationId : any){
    let arrayRedUrl:any = [];
    let apiParam = {
      "schemeId":schemeId,
      "applicationId":applicationId
    }
    this.objSchm.getRedirectQueryAPI(apiParam).subscribe(res => {
      console.log(res);
      if (res.status == 1) {
        this.redirectList = res.result.redirectInfo;
        this.redirectKeyList = res.result.redirectInfo.apiStatusKeyDtls;
        this.redirectURL   = res.result.redirectInfo.statusURL;
        this.mobileNo   = res.result.redirectInfo.mobileNo;
        let applicantName   = res.result.redirectInfo.applicantName;
        let email   = res.result.redirectInfo.email;
        this.refNo   = res.result.redirectInfo.integrationReferenceNo;
        let intChkStsURLType   = res.result.redirectInfo.intChkStsURLType;
        let redirectArr=this.redirectKeyList;
        let value='';
        let arrayOfUrl = [];
        let strVal ='';
        if(intChkStsURLType==2){
          let replaceArr={"appId":applicationId,"[frmmob]":this.mobileNo,"[refNo]":this.refNo,"[frmname]":applicantName,"[frmmail]":email};
          for(let i = 0; i < redirectArr.length; i++){            
            let key=redirectArr[i]['key'];
            let keyValue=redirectArr[i]['value'];
            arrayRedUrl.push({[key]:keyValue});
            
            let fieldValue = replaceArr[keyValue];
            if(typeof(fieldValue)!='undefined' && fieldValue!='')
            {
              arrayRedUrl.push({[key]:fieldValue});         
            }
          }
          arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
          let finalRedirectArrs = [];
          finalRedirectArrs.push(arrayRedUrl);
          //console.log(finalRedirectArrs);return false;
          this.objRedirect.post(finalRedirectArrs,this.redirectURL);
        }else if(intChkStsURLType==1){
          let replaceArr={"appId":applicationId,"[frmmob]":this.mobileNo,"[refNo]":this.refNo};
          let str ='';
          
          for(let i = 0; i < redirectArr.length; i++){
            let key=redirectArr[i]['key'];
            let keyValue=redirectArr[i]['value'];
            
            let fieldValue = replaceArr[keyValue];
            if(typeof(fieldValue)!='undefined' && fieldValue!='')
            {
              str += key+"=" +fieldValue + ",";
            }            
          }
          let lastChar = str.charAt(str.length - 1);
          if (lastChar == ',') {
              strVal = str.slice(0, -1);
          }
          window.location.href = this.redirectURL+strVal;
        }
        
      }
    });
  }

  

  viewActivities(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/AllActivities',encSchemeStr]);
  }

  getRsmHist(applctnId:any) {
    let params = {
      "schemeId":this.schemeId,
      "profileId":this.applicantId,
      "applctnId":applctnId
    };
    this.loading = true;
    this.objSchmActv.schemeRsmHist(params).subscribe(res=>{   
      if (res.status == 1) {
        this.rsmInfo  = JSON.parse(JSON.stringify(res.result['rsmInfoArr']));
        this.isRsmFlg = true;
      } else {
        this.isRsmFlg = false;
        this.rsmInfo = [];
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
      }
      this.loading = false;     
    },
    error => {
      Swal.fire({
        icon: 'error',
        text: environment.errorMsg
      });
      this.loading = false;
    });

    this.open(this.rsmModalRef);
  }
  open(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
