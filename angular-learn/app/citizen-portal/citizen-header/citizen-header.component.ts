import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { WebsiteApiService } from '../../website/website-api.service';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../communication.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-citizen-header',
  templateUrl: './citizen-header.component.html',
  styleUrls: ['./citizen-header.component.css']
})
export class CitizenHeaderComponent implements OnInit {

  private subscription: Subscription;
  siteURL = environment.siteURL;

  domainURL = environment.domainUrl;
  citizenNm = '';
  citizenPic: any;
  loginSts = false;
  windowWidth: any = $(window).width();
  fontSize = 16;
  clickLimit = 3;
  ClickCount = 0;
  ClickCountminus = 0;
  language: any = 'English';
  textSearch: any = "";
  applicantSource = 0;
  krushakOdishaUrl = environment.krushakOdishaUrl;
  sourceAppUrl = '';




  error: any;
  apiUrl = environment.apiUrl;
  lang = '';
  searchform: any;

  loading = false;
  masterNotificationObj :any = 0;
  masterNotificationObjs :any = 0;
  NotificationList:any=[];
  userId:any;
  NotificationListSms:any=[];
  NotificationListEmail:any=[];
  isDataFlag = false;

  regFormStatus = 0;
  @ViewChild('someModal') someModalRef: ElementRef;
  addharNo: any;
  tinPasswordChange : any;
  isInstructionStatus: any;
  private interval: any; // Adjust type based on your needs

  constructor(private authService: CitizenAuthService,
    private router: Router,
    public translate: TranslateService,
    private apilist: WebsiteApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private objSchm: CitizenSchemeService,
    private communicationService: CommunicationService
  ) {
    
  }


  ngOnInit(): void {
    const instructionStatus = sessionStorage.getItem('instructionStatus');
    this.isInstructionStatus = instructionStatus ? instructionStatus : 'false';
    this.subscription = this.communicationService.buttonClicked$.subscribe(() => {
      this.handleOpenRegistration();
    });

    //this.getRegistrationCountStatus();
    // console.log('citizen-header');
    this.searchform = this.formBuilder.group({
      txtSearch: ['', Validators.required]
    });

   
   
    this.interval = setInterval(() => {
      if(sessionStorage.getItem('FFS_SESSION') != null){
        let profileId = JSON.parse(sessionStorage.getItem('FFS_SESSION')).USER_ID;
      
      this.authService.checkLoginUser({ intProfileId: profileId }).subscribe(
        res => {
          let loginStatus: any = res.result.tinLoginStatus;
          let status: number = res.status;
          // if (res.status == 1 && (res.result && (loginStatus === 0 || loginStatus == 0 || loginStatus != 1))) {
          if (status == 200 && (loginStatus == 0 ||  loginStatus == "0") ) {

            localStorage.setItem('checkLogOutUser', 'logout' + Math.random());
            sessionStorage.removeItem('FFS_SESSION');
            sessionStorage.removeItem('intProfileId');
            sessionStorage.removeItem('sourceType');
            sessionStorage.clear();
            const currentUrl = this.router.url;
            if (currentUrl !== '/login') {
              alert('Your session has been expired! Please login again.');
              this.router.navigateByUrl('/login');
            }
          }
        },
        error => {
          console.error('Error checking login status:', error);
        }
      );
    }
    }, 10000); //10 seconds

    // this.tinPasswordChange = this.authService.getTinPasswordChange();
    // console.log("tinValue",this.tinPasswordChange);
    // console.log("type", typeof this.tinPasswordChange);
    // if(this.tinPasswordChange !== undefined || this.tinPasswordChange !== '') {
    //   if(this.tinPasswordChange != 1 || this.tinPasswordChange !== 1 || this.tinPasswordChange === 0 || this.tinPasswordChange == 0 || this.tinPasswordChange == "0" || this.tinPasswordChange === "0") {
    //     setInterval(() => {
    //         this.router.navigateByUrl('/citizen-portal/changepassword');
    //     }, 1000); // Redirect every 1 seconds
    //   }
    // }
    // const userChangePasswordInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    // if (userChangePasswordInfo) {
    //   let passwordStatus: number = JSON.parse(sessionStorage.getItem('FFS_SESSION')).tinPasswordChange;
    //   if (passwordStatus === 0) {
    //     setInterval(() => {
    //       this.router.navigateByUrl('/citizen-portal/changepassword');
    //     }, 2000); // Redirect every 2 seconds
    //   }
    // }

    //this.applicantId = farmerInfo.USER_ID;

  

    
    
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-dark');
      $('#slider').prop("checked", true)

    } else {
      this.setTheme('theme-light');
      $('#slider').prop("checked", false)
    }
    this.loginSts = this.authService.isLoggedIn();
    if (this.loginSts) {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      //console.log(farmerInfo);
      this.citizenNm = farmerInfo.USER_FULL_NAME;
      this.citizenPic = farmerInfo.USER_PROF_PIC;

      // let profData = farmerInfo.USER_PROF_PIC.replace('data:image/png;base64,','');
      // if(profData != ''){
      //   this.citizenPic=this._sanitizer.bypassSecurityTrustResourceUrl(farmerInfo.USER_PROF_PIC);
      // }

      this.applicantSource = farmerInfo.USER_SOURCE;
      this.addharNo = farmerInfo.USER_AADHAR;
      this.userId = farmerInfo.USER_ID;
      //this.getNotificationListHeaderCount();
      //this.getNotificationListHeaderCountSms();
    }
    if (this.windowWidth < 800) {
      //header:not(.search input)
      $('.citizenmenu:not(.navbar-collapse)').on("click", function (event) {

        $('.navbar-collapse').removeClass('show');

      });
    }
  }

  scroll(divId: any) {
    // let elDiv = document.getElementById('BankDetails');
    // elDiv.scrollIntoView();
    document.getElementById(divId).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
      });
  }
  changeLang(language: string) {
    // localStorage.setItem('locale', language);
    localStorage.setItem('locale', 'English');
    this.translate.use(language);

    window.location.reload();
  }

  IncreaseFontSize() {
    if (this.ClickCount >= this.clickLimit) {

      return false;
    }
    else {
      this.fontSize = (this.fontSize + 1);
      document.body.style.fontSize = this.fontSize + 'px';
      this.ClickCount++;
      return true;
    }

  }
  DecreaseFontSize() {
    if (this.ClickCountminus >= this.clickLimit) {

      return false;
    }
    else {
      this.fontSize = (this.fontSize - 1);
      document.body.style.fontSize = this.fontSize + 'px';
      this.ClickCountminus++;
      return true;
    }

  }

  ResetFontSize() {


    document.body.style.fontSize = '16px';
    this.ClickCount = 0;
    this.ClickCountminus = 0;
  }
  doLogout() {
    this.authService.logout();
  }


  koLogin() {
    let regParam = {
      "aadhaar_no": this.addharNo,
      "source": 'IRMS',
    };
    this.authService.krushakLogin(regParam).subscribe(res => {
    })
  }

  setTheme(themeName: any) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }
  // function to toggle between light and dark theme
  toggleTheme() {

    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-light');
    } else {
      this.setTheme('theme-dark');
    }
  }
  getNotificationListHeaderCount(){
    this.loading = true;
    let params = {
      "profileId":this.userId
    };
    let result = 0;
  this.objSchm.getNotificationListHeaderCount(params).subscribe(res => {
    this.masterNotificationObj = res.result;
    result = res.result.length;
     if(res.result.length>0){
      this.loading = false;
      this.NotificationList = res.result;
     }
  },
    error => {
      this.loading = false;
      this.NotificationList = [];
    });
    return result;
  }

  openNotificationModal(param_type){
    this.loading = true;
    let params = {
      "profileId":this.userId,
       "type":param_type
    };
 this.objSchm.getNotificationListHeader(params).subscribe(res => {

    if(res.result.length>0){
      if(param_type==2) {
        this.NotificationListSms = res.result;

      }else if(param_type==1){
      this.NotificationListEmail = res.result;

      }
     this.isDataFlag = true;
     this.loading = false;
    }	else{
      this.loading = false;
      this.isDataFlag = false;
    }

  },
    error => {
      this.loading = false;
      this.NotificationListSms = [];
      this.NotificationListEmail=[];
    });
  }

  // added by Gopinath Jena
  getRegistrationCount() {
  const sessionInfo = JSON.parse(sessionStorage.getItem("FFS_SESSION"));
    this.objSchm.getRegistrationCount({'USER_ID':sessionInfo.USER_ID}).subscribe(res => {
      console.log(res);
      if(Object.keys(res.result).length >= 1) {
        this.regFormStatus = 1;
        this.router.navigate(['/citizen-portal/registration-manage']);
      } else {
        this.regFormStatus = 0;
        this.router.navigate(['/citizen-portal/registration']);
      }
    });
    //routerLink="/citizen-portal/registration
  }

  getRegistrationAccess() {
    const sessionInfo = JSON.parse(sessionStorage.getItem("FFS_SESSION"));
      this.objSchm.applicationStatus({'intProfId':sessionInfo.USER_ID}).subscribe(res => {
        console.log(res);
        if(res.status == 200) {
          if(res.result.applicationStatus < 3){ // For pending
            // this.regFormStatus = 1;
            Swal.fire({
              icon: 'info',
              html: '<p><strong>You have one application pending!</strong><p>'
            });
            this.router.navigate(['/citizen-portal/dashboard']);
          }else if(res.result.applicationStatus == 7 || res.result.applicationStatus == 8){ // For Aoorove & reject
            this.router.navigate(['/citizen-portal/registration']);
          }else if(res.result.applicationStatus == 9){ // For Draft
            this.router.navigate(['/citizen-portal/registration-manage']);
          }else if(res.result.applicationStatus == 10){ // For New
            this.router.navigate(['/citizen-portal/registration']);
          }else if(res.result.applicationStatus == 3){ // For Revert
            Swal.fire({
              title: 'You have one application reverted! Please apply from dashboard...',   
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes'
            }).then((result) => {
              if (result.isConfirmed){
                this.router.navigate(['/citizen-portal/dashboard']);
              }
            });
          }
        }else {
          // this.regFormStatus = 0;
          Swal.fire({
            icon: 'error',
            html: '<p><strong>Something went wrong! Please try again</strong><p>'
          });
          this.router.navigate(['/citizen-portal/dashboard']);
        }
      });
      //routerLink="/citizen-portal/registration
    }
  /**
   * Function Name: handleOpenRegistration
   * Description: This function is used to handle the instruction submittion
   * Created On: 27th Mar 2024
   * Created By: Bibhuti Bhusan Sahoo
   */
  handleOpenRegistration(){
    this.isInstructionStatus = 'false';
    sessionStorage.setItem('instructionStatus', this.isInstructionStatus);
    this.router.navigate(['/citizen-portal/registration']);
  }
  /**
   * Function Name: getRegistrationCountStatus
   * Description: This function is used to get the Registration Status
   * Created On: 27th Mar 2024
   * Created By: Bibhuti Bhusan Sahoo
   */
  getRegistrationCountStatus(){
    const sessionInfo = JSON.parse(sessionStorage.getItem("FFS_SESSION"));
    this.objSchm.getRegistrationStatus({'intProfileId':sessionInfo.USER_ID}).subscribe(res => {
      if(res.status == 200 && res.result == 0){
        this.isInstructionStatus = true;
        sessionStorage.setItem('instructionStatus', this.isInstructionStatus);
      }
    });
  }
 
}
