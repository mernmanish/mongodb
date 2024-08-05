// citizen-auth.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CitizenAuthService implements OnDestroy {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', // Changed to application/json
      'Authorization': environment.my_bearer_auth,
    })
  };
  isAuthenticate = false;
  siteURL = environment.siteURL;
  private subscription: Subscription;
  private tinPasswordChange: any;

  constructor(private http: HttpClient, private router: Router) {
    // Listen for localStorage changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'checkLogOutUser') {
        // Clear session storage for the current tab
        sessionStorage.removeItem('FFS_SESSION');
        sessionStorage.removeItem('intProfileId');
        sessionStorage.removeItem('sourceType');
        sessionStorage.clear();

        // Redirect to the login page
        this.router.navigateByUrl('/login');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  checkLoginUser(params): Observable<any> {
    let serviceURL = environment.websiteserviceURL + 'checkLoginUser';
    let userLoginStautsResponse = this.http.post(serviceURL, params);
    return userLoginStautsResponse;
    
  }

  login(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'userLogin';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }

  aadharVerify(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'generateAadhaarOtpVerify';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  reVerifyAadhaarOtp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'reVerifyAadhaarOtp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  verifyAadhaarOtp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'verifyAadhaarOtp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  sendotp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'sendotp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  verifyotp(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'verifyotp';
    let regRes = this.http.post(serviceURL, params);
    return regRes;
  }

  register(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'userRegistration';
    let regRes = this.http.post(websiteserviceURL, params);
    return regRes;
  }

  public isLoggedIn() {
    return sessionStorage.getItem('FFS_SESSION') !== null;
  }

  public logout() {
    let intProfileId = sessionStorage.getItem('intProfileId');
    if (intProfileId !== null) {
      let websiteserviceURL = environment.websiteserviceURL + 'logOutStatusUpdate';
      let bodyData = { intProfileId: intProfileId };
      this.http.post(websiteserviceURL, bodyData).subscribe(
        (response) => {
          localStorage.setItem('checkLogOutUser', 'logout' + Math.random());
          sessionStorage.removeItem('FFS_SESSION');
          sessionStorage.removeItem('intProfileId');
          sessionStorage.removeItem('sourceType');
          sessionStorage.clear();
          // Navigate to the login page
          this.router.navigateByUrl('/login');
        },
        (error) => {
          console.error('Error updating logout status', error);
        }
      );
    } else {
      console.error('intProfileId not found in session storage');
    }
  }

  setTinPasswordChange(value: any): void {
    this.tinPasswordChange = value;
  }

  getTinPasswordChange(): any {
    return this.tinPasswordChange;
  }
  
  public getCaptcha() {
    let websiteserviceURL = environment.websiteserviceURL + 'getCaptcha';
    let loginResponse = this.http.post(websiteserviceURL, null);
    return loginResponse;
  }

  forgotPassword(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'forgotPassword';
    let regRes = this.http.post(websiteserviceURL, params);
    return regRes;
  }

  changePassword(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'changePassword';
    let regRes = this.http.post(websiteserviceURL, params);
    return regRes;
  }

  getServiceId(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getServiceId';
    let regRes = this.http.post(websiteserviceURL, params);
    return regRes;
  }

  getEmploySetList(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getFinancialDomicilledDetails';
    let regRes = this.http.post(websiteserviceURL, params);
    return regRes;
  }

  mobilelogin(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'farmerMobileLogin';
    let loginResponse = this.http.post(serviceURL, params);
    return loginResponse;
  }

  krushakLogin(params): Observable<any>{
    let reqHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': "abg123hymf567frebdt435hdngti789mchcbe123ncbcbf8680fsrebbcjdyteue35346482gdgdvcbd0987654321"
    })
    let serviceURL = environment.krushakOdishaUrl + 'getRegisteredFarmerData';
    let regRes = this.http.post(serviceURL, params, { headers: reqHeader });
    return regRes;
  }

  decryptText(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'decryptText';
    let decryptResponse = this.http.post(serviceURL, params);
    return decryptResponse;
  }

  encryptText(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'encryptText';
    let decryptResponse = this.http.post(serviceURL, params);
    return decryptResponse;
  }
}
