import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { param } from 'jquery';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsiteApiService {
  constructor(private Http: HttpClient) {}
  private selectedValueSubject: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  selectedValue$ = this.selectedValueSubject.asObservable();
  headerMenu(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'menu/index';
    let menuRes = this.Http.post(serviceUrl, params);
    return menuRes;
  }

  contanPage(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'pages/index';
    let pagesRes = this.Http.post(serviceUrl, params);
    return pagesRes;
  }

  announcements(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'news/index';
    let newsRes = this.Http.post(serviceUrl, params);
    return newsRes;
  }

  newsDetails(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'news/getDetails';
    let newsDetailsRes = this.Http.post(serviceUrl, params);
    return newsDetailsRes;
  }

  notifications(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'news/index';
    let notificationsRes = this.Http.post(serviceUrl, params);
    return notificationsRes;
  }

  submitFeedback(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'feedbacks/add';
    let feedbackRes = this.Http.post(serviceUrl, params);
    return feedbackRes;
  }

  aboutDetails(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'pages/index';
    let aboutRes = this.Http.post(serviceUrl, params);
    return aboutRes;
  }

  getIfscCode(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getBankDist';
    let ifscRes = this.Http.post(serviceUrl, params);
    return ifscRes;
  }

  getifscDetails(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getIfscDetails';
    let ifscDetailsRes = this.Http.post(serviceUrl, params);
    return ifscDetailsRes;
  }

  getSearchDetails(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'masterdata/searchContent';
    let getSearchDetailsres = this.Http.post(serviceUrl, params);
    return getSearchDetailsres;
  }

  getApplicationTrack(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'appliedSchemeList';
    let getApplicationTrackRes = this.Http.post(serviceUrl, params);
    return getApplicationTrackRes;
  }

  getDirectorates(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getDirectorates';
    let getApplicationTrackRes = this.Http.post(serviceUrl, params);
    return getApplicationTrackRes;
  }

  getTahasil(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getTahasil';
    let tahasilRes = this.Http.post(serviceUrl, params);
    return tahasilRes;
  }

  getRevenueCircle(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getRevenueCircle';
    let tahasilRes = this.Http.post(serviceUrl, params);
    return tahasilRes;
  }

  getRevenueVillage(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getRevenueVillage';
    let tahasilRes = this.Http.post(serviceUrl, params);
    return tahasilRes;
  }
  searchBhulekhLand(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'searchBhulekhLand';
    let tahasilRes = this.Http.post(serviceUrl, params);
    return tahasilRes;
  }
  getFaqs(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getFaqs';
    let getAFaqs = this.Http.post(serviceUrl, params);
    return getAFaqs;
  }
  getFaqTypes(params: any): Observable<any> {
    let websiteserviceUrl = environment.websiteserviceURL + 'getFaqTypes';
    let getAFaqs = this.Http.post(websiteserviceUrl, params);
    return getAFaqs;
  }
  getBanks(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getAllBanks';
    let getAllBanks = this.Http.post(websiteserviceURL, params);
    return getAllBanks;
  }
  getDPRs(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getAllDpr';
    let getAllDPRs = this.Http.post(serviceUrl, params);
    return getAllDPRs;
  }
  getBranches(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getAllBranch';
    let getAllBanks = this.Http.post(serviceUrl, params);
    return getAllBanks;
  }
  getBlock(params: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getAllBlock';
    let getAllBanks = this.Http.post(serviceUrl, params);
    return getAllBanks;
  }
  getBank(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getBank';
    let getAllBanks = this.Http.post(serviceUrl, params);
    return getAllBanks;
  }
  getLoanDetails(): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getAllBankLoans';
    let getAllLoan = this.Http.get(serviceUrl);
    return getAllLoan;
  }
  getImportantLink(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getImportantLink';
    let getAllLoan = this.Http.post(serviceUrl, params);
    return getAllLoan;
  }

  /**
   * Function Name: getAllPolicies
   * Description: Fetch All policies
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 05th May 2023
   */
  getAllPolicies(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getPolicyDetails';
    let getAllPolicies = this.Http.get(serviceUrl);
    return getAllPolicies;
  }
  /* Diptirekha start Application Count 26/02/2024 */
  getAllApplicationCount(params: any): Observable<any> {
    let serviceUrl =
      environment.websiteserviceURL + 'getAllApplicationCountDetails';
    let getAllApplicationCount = this.Http.post(serviceUrl, params);
    return getAllApplicationCount;
  }
  /* Diptirekha end Application Count 26/02/2024 */
  footerMenu(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'menu/index';
    let menuRes = this.Http.post(serviceUrl, params);
    return menuRes;
  }
  /**
   * Function Name: getAllPolicies
   * Description: Fetch All policies
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 05th May 2023
   */
  getAllPoliciesDet(): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'getPolicyContent';
    let getAllPolicies = this.Http.get(serviceUrl);
    return getAllPolicies;
  }
  setSelectedValue(value: number) {
    this.selectedValueSubject.next(value);
  }
  /**
   * Function Name: getSignupDetails
   * Description: Fetch All sign up details
   * Created By: Bindurekha Nayak
   * Created On: 17-04-2024
   * */
  getSignupDetails(params: any): Observable<any> {
    let serviceUrl = environment.websiteserviceURL + 'compSignupDetail';
    let getSignupDetails = this.Http.post(serviceUrl,params);
    return getSignupDetails;
  }
}
