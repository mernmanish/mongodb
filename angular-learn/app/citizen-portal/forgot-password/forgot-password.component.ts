import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgbModal, NgbTooltip, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ValidatorchklistService } from '../../validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { NgModule } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  citizenUserId = null;
  citizenPassword = null;
  mailLength = 30;
  siteURL = environment.siteURL;

  userIdStatus = true;
  OTPStatus = false;
  submitted = false;
  mobileNo = "";
  maxLghMob = 10;
  minLghMob = 10;
  loading = false;
  textOTP = "";
  maxLghotp = 6;
  minLghotp = 6;
  verifyForm: FormGroup;
  reverify: any = 0;
  resend = 0;
  public editable = false;
  sendOTP='';
  enctext='';
  timeLeft: number = 30;
  interval;

  fileUrl:any= environment.irmsHomeUrl;
  emailInput: any = '';
  captchaImg = '';
  captchaInput = '';
  captchaData = '';
  captchaImgDisplay = false;
  @ViewChild('someModal') someModalRef:ElementRef;

  constructor(public authService: CitizenAuthService, 
    private router: Router, 
    public vldChkLst: ValidatorchklistService,
    private modalService: NgbModal,
    public translate: TranslateService) {
      translate.addLangs(['English', 'Odia']);
      if (localStorage.getItem('locale')) {
        const browserLang = localStorage.getItem('locale');
        translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
      } else {
        localStorage.setItem('locale', 'English');
        translate.setDefaultLang('English');
      }
     }

  ngOnInit(): void {
  this.authService.getCaptcha().subscribe((res: any) => {
    if (res.status == 1) {
      this.captchaImg = 'data:image/jpg;base64,' + res.img;
      this.captchaData = res.data;
      this.captchaImgDisplay = true;
    }
  });
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
  changeLang(language: string) {
    // localStorage.setItem('locale', language);
    localStorage.setItem('locale', 'English');
    this.translate.use(language);
    window.location.reload();
  }
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
        this.editable= true;
      }
    },1000)
  }



  forgotPassword(){
    let emailAddress = this.emailInput;
    let vSts = true;
    if (!this.vldChkLst.blankCheck(emailAddress, "Enter your Email id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validEmail(emailAddress)) {
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
      let regParam = {
      
        "email": emailAddress,
        "captcha": this.captchaInput,
        "captchaData": this.captchaData
      };
      this.loading = true;
      this.authService.forgotPassword(regParam).subscribe(res => {
        if (res.status == 1) {
          this.router.navigateByUrl('/citizen-portal/login');
          Swal.fire({
            icon: 'success',
            html: '<p>Password changed successfully, Please <b>check your Email</b> for password !<p>'
          });
          let result = res.result;
          this.loading = false;       
        }
        else if (res.status == 2) {
          Swal.fire({
            icon: 'error',
            text: 'You can not change password for this Email id'
          });
          let result = res.result;
          this.loading = false;        
        }
        else if (res.status == 4) {
          Swal.fire({
            icon: 'error',
            text: 'Wrong Captcha'
          });
          vSts = false;
          this.reloadCaptcha();
          this.loading = false;        
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Something went Wrong, Please try again'
          });
          this.loading = false;
        
        }
      });
    }
    
  }   

}







