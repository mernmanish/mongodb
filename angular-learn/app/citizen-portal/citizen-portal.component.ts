import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CitizenAuthService } from './service-api/citizen-auth.service';
import { filter } from 'rxjs/operators';
import { compileClassMetadata } from '@angular/compiler';

@Component({
  selector: 'app-citizen-portal',
  templateUrl: './citizen-portal.component.html',
  styleUrls: ['./citizen-portal.component.css']
})
export class CitizenPortalComponent implements OnInit {
  isLogin = false;
  mobileReq=false;
  routerPath = null;
  
  constructor(private authService: CitizenAuthService, private router: Router, activatedRoute: ActivatedRoute) {
          
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if (event instanceof NavigationEnd) {
            let rootFiles = ['/citizen-portal/login','/citizen-portal/registration-confirmation/:id','/citizen-portal/forgotpassword','/citizen-portal/mobilepage'];
            //console.log(event.url);
            if (rootFiles.includes(event.url)) {
              this.isLogin = false;
            }
            else {
              
              this.isLogin = true;
              let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
              if(farmerInfo)
              {
                this.mobileReq = (typeof(farmerInfo.MOBILE_REQUEST)!='undefined')?farmerInfo.MOBILE_REQUEST:false;
              } 
            }
          }
        });


  }

  



  ngOnInit(): void {
  }
  onActivate(event) {
    window.scroll(0,0);

  // applicable particular component
    if (event.constructor.name === 'RegistrationComponent') {
      // Add your class to the root element of the activated component
      const element = document.querySelector('.page-container');
      if (element) {
        element.classList.add('modified_pagecontain');
      }
    } else {
      const element = document.querySelector('.page-container');
      if (element) {
        element.classList.remove('modified_pagecontain');
      }
    }

    // applicable particular component
 
}
}
