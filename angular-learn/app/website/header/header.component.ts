import { Component, OnInit, HostListener, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, NavigationEnd  } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';

import { WebsiteApiService } from '../website-api.service';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { LoginService } from '../../login/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CitizenMasterService } from '../../citizen-portal/service-api/citizen-master.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class HeaderComponent implements OnInit {
  siteURL = environment.siteURL;
  domainURL = environment.domainUrl;
  cmsdomainUrl = environment.cmsdomainUrl;
  codeOfConduct = environment.CODEOFCONDUCT;
  windowWidth: any = $(window).width();
  private minSize: number = 14;
  private maxSize: number = 18;
  private defaultSize: number = 16;
  citizenNm = '';
  loginSts = false;
  loginStatus: boolean = false;
  language: any = 'English';

  userName: any = '';
  userId: any = '';
  aadharNo: any = '';
  mobileNo: any = '';

  public loading = false;
  applicantId: any;
  respSts: any;
  menuitems: any;
  textSearch: any = "";
  block: any="";
  gp: any="";
  village: any="";
  blockDet: any=[];
  searchform = new FormGroup({});
  lastName: string;

  constructor(private authService: CitizenAuthService,
    private router: Router,
    public translate: TranslateService,
    private menulist: WebsiteApiService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    public masterService: CitizenMasterService
  ) {
    // translate.addLangs(['English', 'Odia']);
    // if (localStorage.getItem('locale')) {
    //   const browserLang = localStorage.getItem('locale');
    //   translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
    //   $('body').addClass(browserLang);
    // } else {
    //   localStorage.setItem('locale', 'English');
    //   translate.setDefaultLang('English');
    // }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.extractLastName(event.url);
    });
  }
  private extractLastName(url: string): void {
    const segments = url.split('/');
    this.lastName = segments[segments.length - 1];
   }
  ngOnInit(): void {
    //this.getMenu();

      this.searchform = this.formBuilder.group({
     });

    this.loginSts = this.authService.isLoggedIn();
    if(this.loginSts)
    {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      this.applicantId = farmerInfo.USER_ID;
      let nmPrfx=farmerInfo.USER_NAME_PRFX;
      let fullNm=farmerInfo.USER_FULL_NAME;
      this.citizenNm=fullNm;
    }
    



    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-dark');
      $('#slider').prop("checked", true)

    } else {
      this.setTheme('theme-light');
      $('#slider').prop("checked", false)
    }


    

    if (this.windowWidth < 800) {
      $('header:not(.search input)').on("click", function (event) {

        $('.navbar-collapse').removeClass('show');

      });
    }
    
  }

  changeLang(language: string) {
    // localStorage.setItem('locale', language);
    this.translate.use(language);
    window.location.reload();
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



  // getMenu() {
  //   let params = {
  //     "mType": 1,
  //     "lang": localStorage.getItem('locale')
  //   };
  //   this.loading = true;
  //   this.menulist.headerMenu(params).subscribe(res => {
  //     if (res['status'] == '200') {

  //       this.respSts = res.status;
  //       this.menuitems = res.result;

  //       this.loading = false;
  //     } else {
  //       this.menuitems = [];
  //       this.loading = false;
  //     }


  //   });
  // }


  doLogout() {
    this.authService.logout();
  }

  logout() {
    this.loginService.logout();
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
  sendBankuser(){
    window.open(this.cmsdomainUrl);
    
  }
 

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


}
