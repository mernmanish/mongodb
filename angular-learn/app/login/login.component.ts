import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
import { NgbModal, NgbTooltip, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { TranslateService } from '@ngx-translate/core';
import * as CryptoJS from 'crypto-js';
import { CitizenAuthService } from '../citizen-portal/service-api/citizen-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public fg: FormGroup;
  sourceType = sessionStorage.getItem('sourceType') ? sessionStorage.getItem('sourceType') : '';
  isVisible: any = this.sourceType == 'irms' ? 1:'';
  isSelected: boolean = true;
  aadharNoInput: any = '';
  // mrutunjay added
  emailInput: any = '';
  passwordInput: any = '';
  // Mrutunjay Added
  mobileNoInput: any = '';
  valid: boolean = false;
  timeLeft: number = 120;
  interval;
  public editable = false;
  loading = false;
  textOTP: any = '';
  enctext: any = '';
  result: any = '';
  maxAadharLenght = 12;
  minAadharLenght = 12;
  maxLghMob = 10;
  minLghMob = 10;
  
  fileUrl:any= environment.irmsHomeUrl;
  //fileUrl:any= 'http://164.164.122.169:8060/irms_STG/irms/assets/images/';
  returnUrl: any = '';
  submitedEncStr: any = '';
  language: any = 'English';
  passwordType:any;
  show = false;
  @ViewChild('someModal') someModalRef: ElementRef;
  captchaImg = '';
  captchaInput = '';
  captchaData = '';
  captchaImgDisplay = false;

  constructor(public authService: CitizenAuthService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private modalService: NgbModal,
    public vldChkLst: ValidatorchklistService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private encDec: EncryptDecryptService,
    public translate: TranslateService,
  ) {
    translate.addLangs(['English', 'Odia']);
    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
      $('body').addClass(browserLang);
    } else {
      localStorage.setItem('locale', 'English');
      translate.setDefaultLang('English');
    }

    
    // this.fg = this.fb.group({
    //   aadharNoInput: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    //   mobileNoInput: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    //   isVisible: ['', [Validators.required]]
    // })
  }

  ngOnInit(): void {
    this.authService.getCaptcha().subscribe((res: any) => {
      if (res.status == 1) {
        this.captchaImg = 'data:image/jpg;base64,' + res.img;
        this.captchaData = res.data;
        this.captchaImgDisplay = true;
      }
    });
    this.isVisible=1;
    this.isSelected=true;
    if (sessionStorage.getItem('FFS_SESSION') != '' && sessionStorage.getItem('FFS_SESSION') != null) {
      this.router.navigate(['/citizen-portal/dashboard']);
    }

    this.returnUrl = this.activateRoute.snapshot.params.returnUrl;
    this.activateRoute.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'];
      this.submitedEncStr = params['id'];
    });
    if(this.submitedEncStr != '' && this.submitedEncStr != undefined){
      let submitedText = this.encDec.decText(this.submitedEncStr);
      let submitedArr =  submitedText.split(':');
      //console.log(submitedArr);
      let beforeLoginSelectedDistrict = (submitedArr[0] != undefined && submitedArr[0] != '') ? submitedArr[0] : 0;
      let beforeLoginSelectedBlock = (submitedArr[1] != undefined && submitedArr[1] != '') ? submitedArr[1] : 0;
      let beforeLoginSelectedBank = (submitedArr[2] != undefined && submitedArr[2] != '') ? submitedArr[2] : 0;
      let beforeLoginSelectedUrl = (submitedArr[3] != undefined && submitedArr[3] != '') ? submitedArr[3] : '';
      if(beforeLoginSelectedUrl == 'LoanProduct')
        this.returnUrl = beforeLoginSelectedUrl;
      sessionStorage.setItem('beforeLoginSelectedDistrict',beforeLoginSelectedDistrict);
      sessionStorage.setItem('beforeLoginSelectedBlock', beforeLoginSelectedBlock);
      sessionStorage.setItem('beforeLoginSelectedBank', beforeLoginSelectedBank);
    }
    this.passwordType = 'password';
  }

  reloadCaptcha() {
    this.captchaImgDisplay = false;
    this.authService.getCaptcha().subscribe((res: any) => {
      if (res.status == 1) {
        this.captchaImg = 'data:image/jpg;base64,' + res.img;
        this.captchaData = res.data;
        this.captchaImgDisplay = true;
      }
    });
  }

  /**
   * Function name: g
   * description :  This method is to get all the form controls
   * created by  : Mrutunjay Pani
   * created on  : 20Jun2022
   */
  get g() {
    return this.fg.controls;
  }

  /**
   * Function name: startTimer
   * description :  This method for start the otp timer
   * created by  : Mrutunjay Pani
   * created on  : 20Jun2022
   */
  startTimer() {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.editable = false;
      } else {
        this.timeLeft = 0;
        this.editable = true;
      }
    }, 1000)
  }


  /**
   * Function name: onSubmit
   * description :  This method for submit the login form
   * created by  : Mrutunjay Pani
   * created on  : 20Jun2022
   */
  // onSubmit() {
  //   //console.log(this.fg.value.aadharNoInput);
  //   this.loading = true;
  //   let param = {
  //     "aadhaarnumber": this.aadharNoInput,
  //     "mobilenumber": this.mobileNoInput,
  //     "isVisible": this.isVisible
  //   }
  //   this.loginService.farmerLoginCheckWithOtpSend(param).subscribe(res => {
  //     console.log(res);
  //     if (res.status == 1) {
  //       this.startTimer();
  //       this.open(this.someModalRef);
  //       this.enctext = res.result.enctext;
  //       this.result = res.result;
  //     } else {
  //       this.loading = false;
  //       this.textOTP = null;
  //       Swal.fire({
  //         icon: 'error',
  //         text: res.msg
  //       });
  //     }
  //   },
  //     error => {

  //     });
  // }

  /**
   * Function name: loginForm
   * description :  This method for login form
   * created by  : Mrutunjay Pani
   * created on  : 14Jun2022
   * return type : string
   */
  loginForm() {
    //alert(this.aadharNoInput);
    // let aadhaarnumber = this.aadharNoInput;
    // let mobilenumber = this.mobileNoInput;
    let emailAddress = this.emailInput;
    let password = this.passwordInput;
    let isVisible = this.isVisible;
    //console.log('hello');
    let vSts = true;
    if(isVisible == 2){
      if (!this.vldChkLst.blankCheck(emailAddress, "Enter Email Address")) {
        vSts = false;
      }
      else if (!this.vldChkLst.validEmail(emailAddress)) {
        vSts = false;
      }
      else if (!this.vldChkLst.blankCheck(password, "Enter Password")) {
        vSts = false;
      }else if (this.captchaInput == '' || typeof (this.captchaInput) == undefined || this.captchaInput == null) {

        Swal.fire({
          icon: 'error',
          text: 'Enter Captcha Code'
        });
        vSts = false;
        this.reloadCaptcha();
      }
      else {
        vSts = true;
      }
    }else if(isVisible == 1){
      if (!this.vldChkLst.blankCheck(emailAddress, "Enter Email Address")) {
        vSts = false;
      }
      else if (!this.vldChkLst.validEmail(emailAddress)) {
        vSts = false;
      }
      else if (!this.vldChkLst.blankCheck(password, "Enter Password")) {
        vSts = false;
      }else if (this.captchaInput == '' || typeof (this.captchaInput) == undefined || this.captchaInput == null) {

        Swal.fire({
          icon: 'error',
          text: 'Enter Captcha Code'
        });
        vSts = false;
        this.reloadCaptcha();
      }
      else {
        vSts = true;
      }
    }
    else{
      vSts = false;
      Swal.fire({
        icon: 'error',
        text: 'Select User Type'
      });
    }

    if (!vSts) {
      return vSts;
    }
    else {
      this.loading = true;
      let hashedPassword = CryptoJS.SHA256(this.passwordInput).toString(CryptoJS.enc.Hex);
      let param = {
        "email": this.emailInput,
        "password": hashedPassword,
        //"password": this.passwordInput,
        "isVisible": this.isVisible,
        "captcha": this.captchaInput,
        "captchaData": this.captchaData
      }
      this.loginService.farmerLoginCheckWithOtpSend(param).subscribe(res => {
      // let respData = response.RESPONSE_DATA;
      // let respToken = response.RESPONSE_TOKEN;
      // let verifyToken = CryptoJS.HmacSHA256(respData, environment.apiHashingKey).toString();
      // let res : any = { 'status': 0, 'result': {} };
      // if (respToken == verifyToken) {
        // res = JSON.parse(atob(respData));
        //console.log("res", res);
        if (res.status == 1) {
          this.loading = false;
          this.timeLeft = 120;
          
          // if(this.interval) {
          //   clearInterval(this.interval);
          // }
          this.startTimer();
          // this.open(this.someModalRef);
          this.enctext = res.result.enctext;
          this.result = res.result;
          this.authService.setTinPasswordChange(this.result.tinPasswordChange);
          //console.log(res.result);
          let userInfo = {
            "userName": this.result.vchApplicantName,
            "userId": this.result.intProfileId,
            "aadharNo": this.result.aadharNo,
            "mobileNo": this.result.mobileNo
          }
          sessionStorage.setItem("intProfileId",this.result.intProfileId);
          localStorage.setItem("userInfo", JSON.stringify(userInfo));

          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = this.result.intProfileId;
          userSesnArr["USER_NAME_PRFX"] = this.result.vchApplicantPrefix;
          userSesnArr["USER_FULL_NAME"] = this.result.vchApplicantName;
          userSesnArr["USER_PROF_PIC"] = this.result.vchProfilePic;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = this.result.mobileNo;
          userSesnArr["USER_SOURCE"] = this.result.intApplicantSource;
          userSesnArr["USER_AADHAR"] = this.result.aadharNo;
          userSesnArr["USER_BANK_NAME"] = this.result.vchBankName;
          userSesnArr["USER_BANK_BRANCH"] = this.result.vchBankBranchName;
          userSesnArr["USER_IFSC_CODE"] = this.result.vchBankIfscCode;
          userSesnArr["USER_BANK_ACC_NO"] = this.result.vchBankAccNo;
          userSesnArr["USER_BANK_ACC_HOLDER_NAME"] = this.result.vchBankAccHolderName;
          userSesnArr["USER_DOB"] = this.result.dteDateOfBirth;
          userSesnArr["USER_CATEGORY"] = this.result.tinCaste;
          userSesnArr["USER_ADDRESS"] = this.result.txtAddress;
          userSesnArr["USER_MARITAL_STATUS"] = this.result.tinMomstatus;
          userSesnArr["USER_DISTRICT_ID"] = this.result.intDistrictId;
          userSesnArr["USER_BLOCK_ID"] = this.result.intBlockId;
          userSesnArr["USER_GP_ID"] = this.result.intGpId;
          userSesnArr["USER_VILLAGE_ID"] = this.result.intVillageId;
          userSesnArr["USER_DISTRICT_NAME"] = this.result.vchDistrict;
          userSesnArr["USER_BLOCK_NAME"] = this.result.vchBlock;
          userSesnArr["USER_GP_NAME"] = this.result.vchGp;
          userSesnArr["USER_VILLAGE_NAME"] = this.result.vchVillage;
          userSesnArr["USER_GENDER"] = this.result.chrGender;
          userSesnArr["USER_ORG_TYPE"] = this.result.orgTypeId;
          userSesnArr["tinPasswordChange"] = this.result.tinPasswordChange;
          // if(this.result.intApplicantSource == 2){
          //   let krushakInfo = this.krushakOdishaLogin(this.result.aadharNo);
          // }
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          if(this.result.regStatus == 0){
            sessionStorage.setItem('instructionStatus', 'true');
            this.router.navigateByUrl('/citizen-portal/instructions');
          }
          else
            this.router.navigateByUrl('/citizen-portal/dashboard');
        }else if (res.status == 4) {
          Swal.fire({
            icon: 'error',
            text: 'Wrong Captcha'
          });
          vSts = false;
          this.reloadCaptcha();
          this.loading = false;        
        } else {
          this.loading = false;
          this.textOTP = null;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      // }
    },
        error => {

        });
    }
  }

  /**
   * Function name: verifyOTP
   * description :  This method for verify OTP
   * created by  : Mrutunjay Pani
   * created on  : 20Jun2022
   * return type : string
   */
  verifyOTP() {
    //console.log(this.sendOTP);
    let textOTP = this.textOTP;
    let vSts = true;
    let otpTime = this.timeLeft;
    let enctext = this.enctext;
    //let sendotp='123456';
    if (!this.vldChkLst.blankCheck(textOTP, "Otp")) {
      vSts = false;
      this.textOTP = null;
    }
    else if (otpTime === 0) {
      this.textOTP = null;
      Swal.fire({
        icon: 'error',
        text: 'OTP expired, Click resend to get OTP'
      });
      vSts = false;
    }
    else {
      vSts = true;
    }


    if (!vSts) {
      return vSts;
    }
    else {
      this.loading = true;
      let regParam = {

        "otp": textOTP,
        "enctext": enctext,
      };
      this.loginService.verifyotp(regParam).subscribe(res => {
        if (res.status == 1) {
          this.loading = false;
          this.modalService.dismissAll();
          //this.register()
          //console.log(this.result);

          let userInfo = {
            "userName": this.result.vchApplicantName,
            "userId": this.result.intProfileId,
            "aadharNo": this.result.aadharNo,
            "mobileNo": this.result.mobileNo
          }
          localStorage.setItem("userInfo", JSON.stringify(userInfo));

          let userSesnArr = {};
          userSesnArr["USER_SESSION"] = "access_token";
          userSesnArr["USER_ID"] = this.result.intProfileId;
          userSesnArr["USER_NAME_PRFX"] = this.result.vchApplicantPrefix;
          userSesnArr["USER_FULL_NAME"] = this.result.vchApplicantName;
          userSesnArr["USER_PROF_PIC"] = this.result.vchProfilePic;
          userSesnArr["MOBILE_REQUEST"] = false;
          userSesnArr["USER_MOBILE"] = this.result.mobileNo;
          userSesnArr["USER_SOURCE"] = this.result.intApplicantSource;
          userSesnArr["USER_AADHAR"] = this.result.aadharNo;
          userSesnArr["USER_BANK_NAME"] = this.result.vchBankName;
          userSesnArr["USER_BANK_BRANCH"] = this.result.vchBankBranchName;
          userSesnArr["USER_IFSC_CODE"] = this.result.vchBankIfscCode;
          userSesnArr["USER_BANK_ACC_NO"] = this.result.vchBankAccNo;
          userSesnArr["USER_BANK_ACC_HOLDER_NAME"] = this.result.vchBankAccHolderName;
          userSesnArr["USER_DOB"] = this.result.dteDateOfBirth;
          userSesnArr["USER_CATEGORY"] = this.result.tinCaste;
          userSesnArr["USER_ADDRESS"] = this.result.txtAddress;
          userSesnArr["USER_MARITAL_STATUS"] = this.result.tinMomstatus;
          userSesnArr["USER_DISTRICT_ID"] = this.result.intDistrictId;
          userSesnArr["USER_BLOCK_ID"] = this.result.intBlockId;
          userSesnArr["USER_GP_ID"] = this.result.intGpId;
          userSesnArr["USER_VILLAGE_ID"] = this.result.intVillageId;
          userSesnArr["USER_DISTRICT_NAME"] = this.result.vchDistrict;
          userSesnArr["USER_BLOCK_NAME"] = this.result.vchBlock;
          userSesnArr["USER_GP_NAME"] = this.result.vchGp;
          userSesnArr["USER_VILLAGE_NAME"] = this.result.vchVillage;
          userSesnArr["USER_GENDER"] = this.result.chrGender;
          // if(this.result.intApplicantSource == 2){
          //   let krushakInfo = this.krushakOdishaLogin(this.result.aadharNo);
          // }
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(userSesnArr));
          if(this.returnUrl == 'ApplyForLoan')
            this.router.navigateByUrl('/citizen-portal/scheme-directorate');
          else if(this.returnUrl == 'LoanProduct')
            this.router.navigateByUrl('/home/loan-product');
          else
            this.router.navigateByUrl('/citizen-portal/dashboard');
        }
        else {
          this.loading = false;
          this.textOTP = null;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      });

    }
  }

  /**
   * Function name: open
   * description :  This method is for open modal
   * created by  : Mrutunjay Pani
   * created on  : 20Jun2022
   */
  open(content: any) {
    this.modalService.open(content, { size: 'md', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  resendOtp() {
    let textOTP = this.textOTP;
    this.timeLeft = 120;
    // if(this.interval) {
    //   clearInterval(this.interval);
    // }
    this.startTimer();
    let mobileNo = this.result.mobileNo;
    this.textOTP = null;
    let regParam = {
      "mobileNo": mobileNo,
    };
    this.loading = true;
    this.loginService.sendotp(regParam).subscribe(res => {
      if (res.status == 1) {
        this.loading = false;
        this.enctext = res.result.enctext;
      }
      else {
        this.loading = false;
      }
      //console.log(res);
    });
  }
  changeLang(language: string) {
    localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
  }
 /*
  * Function: toggleFieldTextType
  * Description: To toggle Password field b/w text & Pass
  * Created By: Sibananda Sahu
  * Date: 29 May 2024
  */
  toggleFieldTextType() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.show = true;
    } else {
      this.passwordType = 'password';
      this.show = false;
    }
  }
}
