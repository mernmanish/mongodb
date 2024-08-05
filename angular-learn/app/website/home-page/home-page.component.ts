import { Component,  OnInit,  ElementRef,  ViewChild,  HostListener, Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { WebsiteApiService } from '../website-api.service';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { CitizenMasterService } from '../../citizen-portal/service-api/citizen-master.service';
import { CitizenSchemeService } from '../../citizen-portal/service-api/citizen-scheme.service';
import {
  NgbModal,
  NgbTooltip,
  ModalDismissReasons,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';

import Swiper from 'swiper';

declare let require: any;
const FileSaver = require('file-saver');

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})

@Injectable({
  providedIn: 'root'
})


export class HomePageComponent implements OnInit {
  private minSize: number = 14;
  private maxSize: number = 18;
  private defaultSize: number = 16;
  siteURL = environment.siteURL;
  domainUrl = environment.domainUrl;

  fileUrl = environment.fileUrl;
  dirIcons = environment.directoryListicons;
  dateVal: any;
  public loading = false;
  public allBanks = false;
  public allProducts = false;
  applicantId: any;
  respSts: any;
  respList: any;
  groupedDirectorate: any;
  directorates: any;
  districts: any;
  sectors: any;
  faqs: any;
  banks: any;
  selBank: any;
  branches: any;
  dprs: any;
  faqTypes: any;
  isFlag: any;
  otherDirectorate: any;
  announcementitems: any;
  notificationitems: any;
  closeResult = '';
  isAnnouncementFlag = false;
  isnotificationFlag = false;

  loginSts = false;
  submitted = false;
  statusforms: any;
  farmerInfo: any;
  applicationDetails: any;
  isDataFlag = false;
  error: any;
  mixDirectorate: any = [];
  textOTP: any = '';
  enctext: any = '';
  result: any = '';
  typesArr: any;
  checkedIDs: any = [];
  valid: boolean = false;
  timeLeft: number = 120;
  interval;
  applicationId: any;
  public editable = false;
  block: any;
  bankbranchs: any = [];
  allBanksLoan: any;
  allSancAmt: any = 'Calculating...';
  allSancAppl: any = 'Calculating...';
  totalApplicationApply: any = 'Calculating...';
  blank = '';
  applicationDetailList: any = [];
  txtapplicationId: any = '';
  mobileNo: any = '';
  applicantName: any;
  allSancAmtOd: any = '';
  browserLang: any;
  language: any= 'English';
  RegdCountList: any;
  RegdCount: any;
  IncApplyCount: any;
  IncAproveCount: any;
  @ViewChild('someModal') someModalRef: ElementRef;
  swiperRef:any;
  swiperValue:any;
  constructor(
    private router: Router,
    private objSchm: CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private servicesList: WebsiteApiService,
    public authService: CitizenAuthService,
    public masterService: CitizenMasterService,
    private api: CitizenSchemeService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public vldChkLst: ValidatorchklistService,
    private serviceList: WebsiteApiService
  ) {}

  ngOnInit(): void {
    // this.language = localStorage.getItem('locale');
    sessionStorage.removeItem('TRACKINFO');
    this.loginSts = this.authService.isLoggedIn();
    if (this.loginSts) {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      this.applicantId = farmerInfo.USER_ID;
    }
    this.getFaqs(0);
    this.getFaqTypes();
    this.initForm();
    this.getAllApplicationCount();

    // init Swiper:
    this.swiperRef = new Swiper('.mySwiper', {
      
      navigation: {
        nextEl: ' .swiper-button-next',
        prevEl: ' .swiper-button-prev',
        
      }, 
      //paginationClickable: true,
      spaceBetween: 0,

      breakpoints: {
        1920: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        1360: {
          slidesPerView: 4,
          spaceBetween: 0,
        },
        1028: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        600: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        375: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    });

    this.swiperValue = new Swiper('.Swipercard', {
      loop: false,

      //paginationClickable: true,
      spaceBetween: 0,

      breakpoints: {
        1920: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        1360: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 0,
        },
        1028: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        600: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        375: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
      },
    });
  }

  nextSlide(){
    this.swiperRef.slideNext();
    this.swiperValue.slideNext();
  }  
  prevSlide(){
    this.swiperRef.slidePrev();
    this.swiperValue.slidePrev();
  }

  increaseFontSize(): void {
    const bodyElements = document.getElementsByTagName('body');
    for (let i = 0; i < bodyElements.length; i++) {
      let currentFontSize = parseInt(bodyElements[i].style.fontSize.replace('px', ''), 10) || this.defaultSize;
      if (currentFontSize < this.maxSize) {
        currentFontSize += 1;
        bodyElements[i].style.fontSize = currentFontSize + 'px';
      }
    }
  }

  decreaseFontSize(): void {
    const bodyElements = document.getElementsByTagName('body');
    for (let i = 0; i < bodyElements.length; i++) {
      let currentFontSize = parseInt(bodyElements[i].style.fontSize.replace('px', ''), 10) || this.defaultSize;
      if (currentFontSize > this.minSize) {
        currentFontSize -= 1;
        bodyElements[i].style.fontSize = currentFontSize + 'px';
      }
    }
  }

  resetFontSize(): void {
    const bodyElements = document.getElementsByTagName('body');
    for (let i = 0; i < bodyElements.length; i++) {
      bodyElements[i].style.fontSize = this.defaultSize + 'px';
    }
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
  convertNumberToOdia(dataToConvert = '') {
    let eng = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '₹', ' '];
    let odi = ['0', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯', ',', '₹', ' '];
    let retData = '';
    for (let i = 0; i < dataToConvert.length; i++) {
      let index = eng.indexOf(dataToConvert[i]);

      if (index < 0) {
        retData += dataToConvert[index];
      } else {
        retData += odi[index];
      }
    }
    return retData;
  }
  viewSchemsPage(schemeStr: any, type: any) {
    let encSchemeStr = this.encDec.encText(
      schemeStr.toString() + ':' + type.toString()
    );
    this.router.navigate(['/home/scheme-list', encSchemeStr]);
  }

  getFaqs(e: any) {
    this.loading = true;
    if (e.checked) {
      this.checkedIDs.push(e.value);
    } else {
      this.checkedIDs = this.checkedIDs.filter((evt) => evt !== e.value);
    }
    let params = {
      intTypes: this.checkedIDs,
    };
    this.servicesList.getFaqs(params).subscribe((res) => {
      if (res['status'] == 200) {
        this.faqs = res.result['faqs'];
        this.loading = false;
      } else {
        this.loading = false;
        this.faqs = [];
      }
    });
  }
  getFaqTypes() {
    let params = {};
    this.loading = true;
    this.servicesList.getFaqTypes(params).subscribe((res) => {
      if (res['status'] == 200) {
        this.faqTypes = res.result['faqTypes'];
        this.loading = false;
      } else {
        this.loading = false;
        this.faqTypes= []
      }
    });
  }

  doSchemeApply(schemeStr: any, scheme: any) {
    let schmSesnArr = {};
    let schemeName = scheme.vchProcessName;
    let schemeSrvName = scheme.strSchmServNm;
    let schemeSvrId = scheme.intSchmServType;
    schmSesnArr['FFS_APPLY_SCHEME_NAME'] = schemeName;
    schmSesnArr['FFS_APPLY_SCHEME_TYPE'] = schemeSrvName;
    schmSesnArr['FFS_APPLY_SCHEME_TYPE_ID'] = schemeSvrId;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/profile-update', encSchemeStr]);
  }
  viewAppliedScheme(schemeStr: any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
  }

  removeTags(str) {
    if (str === null || str === '') return false;
    else str = str.toString();

    return str.replace(/(<([^>]+)>)|&nbsp;/gi, '').substring(0, 100);
  }
  /**
   * description :  This Function added from Bindurekha Nayak
   * created by  : Bindurekha Nayak
   * created on  : 21Jun2022
   */
  get f(): { [key: string]: AbstractControl } {
    return this.statusforms.controls;
  }
  private initForm() {
    this.statusforms = this.formBuilder.group({
      txtapplicationId: new FormControl('', [Validators.required]),
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
        this.editable = true;
      }
    }, 1000);
  }

  closeOtpModal() {
    this.modalService.dismissAll(`clcick`);
  }
 
 
  open(content: any) {
    this.modalService
      .open(content, {
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  
  downloadFile(url: any, name: any) {
    FileSaver.saveAs(url, name);
  }
  
 
  redirectToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: 'ApplyForLoan' },
    });
  }
  /*end */

  isScrolled: boolean = false;

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Logic to determine if the window has been scrolled
    if (window.pageYOffset > 600) {
      this.isScrolled = true; // Add a class to navbar menu
    } else {
      this.isScrolled = false; // Remove the class from navbar menu
    }
  }

  @ViewChild('mainContent') mainContent!: ElementRef;
  scrollToMainContent() {
    const mainContentElement = this.mainContent.nativeElement as HTMLElement;
    mainContentElement.scrollIntoView({ behavior: 'smooth' });
  }
  /*By:Sibananda sahu Start of apllication count 26/02/2024 */
  getAllApplicationCount() {
    this.loading = true;
    let retryCount = 0;
    const maxRetries = 4; // Maximum number of retries
    
    const fetchData = () => {
      this.serviceList.getAllApplicationCount('').subscribe((res) => {
        if (res.status == 1) {
          this.RegdCount = res.result[0].regdTotal;
          this.IncApplyCount = res.result[0].incentiveTotal;
          this.IncAproveCount = res.result[0].incentiveApprove;
          this.loading = false;
        } else {
          this.loading = false;
          this.RegdCount = [];
          this.IncApplyCount = [];
          this.IncAproveCount = [];
        }
      }, (error) => {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchData, 2000); // Retrying after 2 seconds
        } else {
          console.error('Failed to fetch data after maximum retries');
          this.loading = false;
        }
      });
    };
  
    // Initial call to fetchData
    fetchData();
  }
  /*By:Sibananda sahu  End apllication count 26/02/2024 */

  selectItem(selectedValue: number) {
    this.serviceList.setSelectedValue(selectedValue);
    this.router.navigate(['/home/policies']);
  }

}
