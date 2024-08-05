import { Component, OnInit } from '@angular/core';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mobile-page',
  templateUrl: './mobile-page.component.html',
  styleUrls: ['./mobile-page.component.css']
})
export class MobilePageComponent implements OnInit {

  encryptedValue: any;
  decryptedValue: any;
  schemeType: any;
  schemeInfo: any;
  schemeId: any;
  prodName: any;
  bankId: any;
  docRequire: any;
  farmerInfo: any;
  farmerId: any;
  applicationId: any;
  public loading = false;

  constructor(public route: ActivatedRoute,
    public authService: CitizenAuthService,
    private encDec: EncryptDecryptService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    this.schemeId = this.encDec.decText(encSchemeId);


    this.route.queryParams
      .subscribe(params => {

        this.encryptedValue = params.encryptedValue;
        this.decryptedValue = this.encDec.decText(params.encryptedValue);
        this.schemeType = params.type;
        this.schemeInfo = params.pInfo;

      }
      );
    this.doLogin();
  }

  /*function definations*/


  decryptValues(String: any) {

    let textParam = {
      "text": String
    };
    this.loading = true;
    this.authService.decryptText(textParam).subscribe(res => {

      let result = res.result;
      let status = res.status;
      let schemeArr = result.split(':');
      // this.encryptValues(schemeArr[0]);
      this.farmerId = schemeArr[0];
      this.schemeId = schemeArr[1];
      this.docRequire = schemeArr[2];

      return status;

    });


  }
  encryptValues(String: any) {

    let textParam = {
      "text": String
    };
    this.loading = true;
    this.authService.encryptText(textParam).subscribe(res => {

      //let result = res.result;
      this.farmerId = res.result;
    });


  }


  doLogin() {
    let userId = this.encryptedValue;
    let textParam = {
      "text": userId
    };

    console.log(userId);
    this.authService.decryptText(textParam).subscribe(res => {

      let result = res.result;
      let status = res.status;
      if (status == 200) {
        let schemeArr = result.split(':');
        // this.encryptValues(schemeArr[0]);
        this.farmerId = schemeArr[0];
        this.schemeId = schemeArr[1];
        this.docRequire = schemeArr[2];
        this.prodName = schemeArr[3];
        this.bankId = schemeArr[4];
        this.applicationId = schemeArr[5];
        let stype = this.schemeType;

        let loginParam = {
          "userId": this.farmerId
        };
        this.loading = true;
        this.authService.mobilelogin(loginParam).subscribe(res => {
          if (res.status == 1) {
            let result = res.result;
            let profileId = result.profileId;
            let namePrfx = result.namePrefix;
            let appName = result.applicantName;
            //let profPicUrl = result.profPicUrl;

            let userSesnArr = {};
            userSesnArr["USER_SESSION"] = "access_token";
            userSesnArr["USER_ID"] = profileId;
            userSesnArr["USER_NAME_PRFX"] = namePrfx;
            userSesnArr["USER_FULL_NAME"] = appName;
            userSesnArr["MOBILE_REQUEST"] = true;
            userSesnArr["USER_PROF_PIC"] = result.vchProfilePic;
            userSesnArr["USER_MOBILE"] = result.vchMobileNo;
            userSesnArr["USER_SOURCE"] = result.intApplicantSource;
            userSesnArr["USER_AADHAR"] = result.aadharNo;

            userSesnArr["USER_BANK_NAME"] = result.vchBankName;
            userSesnArr["USER_BANK_BRANCH"] = result.vchBankBranchName;
            userSesnArr["USER_IFSC_CODE"] = result.vchBankIfscCode;
            userSesnArr["USER_BANK_ACC_NO"] = result.vchBankAccNo;
            userSesnArr["USER_BANK_ACC_HOLDER_NAME"] = result.vchBankAccHolderName;
            userSesnArr["USER_DOB"] = result.dteDateOfBirth;
            userSesnArr["USER_CATEGORY"] = result.tinCaste;
            userSesnArr["USER_ADDRESS"] = result.txtAddress;
            userSesnArr["USER_MARITAL_STATUS"] = result.tinMomstatus;
            userSesnArr["USER_DISTRICT_ID"] = result.intDistrictId;
            userSesnArr["USER_BLOCK_ID"] = result.intBlockId;
            userSesnArr["USER_GP_ID"] = result.intGpId;
            userSesnArr["USER_VILLAGE_ID"] = result.intVillageId;
            userSesnArr["USER_DISTRICT_NAME"] = result.vchDistrict;
            userSesnArr["USER_BLOCK_NAME"] = result.vchBlock;
            userSesnArr["USER_GP_NAME"] = result.vchGp;
            userSesnArr["USER_VILLAGE_NAME"] = result.vchVillage;
            
            sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
            if (stype == 1 && this.schemeId!='') {
              this.loading = false;
              let loanDetails = this.schemeId+':0:'+this.docRequire+':0:0:'+this.prodName;
              this.doSchemeApply(loanDetails,this.prodName,1,'Scheme',this.bankId);
            }else if(stype==3){
                this.loading = false;
                this.doSchemePreview(this.schemeId+':'+this.applicationId+':0:0');               
            }else if(stype==4){
              this.loading = false;
              let loanDetails = this.schemeId+':'+this.applicationId+':'+this.docRequire+':0:0:'+this.prodName;
              this.doSchemeApply(loanDetails,this.prodName,1,'Scheme',this.bankId);             
          }
            else {
              this.loading = false;
              this.router.navigateByUrl('/citizen-portal/dashboard');
            }

          }
          else {
            Swal.fire({
              icon: 'error',
              text: res.msg
            });

          }
        });
      }



    });






  }
  doSchemePreview(schemeStr: any) {
    // let encSchemeStr = this.encDec.encText(schemeStr.toString());
    // this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
    this.modalService.dismissAll();
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-preview', encSchemeStr]);
  }

  doSchemeApply(schemeStr : any,schemeName:any, schmServTypeId:any,schmServTypeNm:any,bankId:any)
  {
    this.setSchmServSesNm(schemeName,schmServTypeId,schmServTypeNm,bankId);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/profile-update',encSchemeStr]);
  }
 // mthod to set scheme session details
 setSchmServSesNm(schemeName:any, schmServTypeId:any,schmServTypeNm:any,bankId:any)
 {
   let schmSesnArr = {};
   schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
   schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = schmServTypeNm;
   schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schmServTypeId;
   schmSesnArr["FFS_APPLY_SCHEME_MODULE_ID"] = bankId;
   sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
 } 
}
