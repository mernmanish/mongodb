import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CitizenSchemeService {
  getApplicationTrack(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  constructor(private Http: HttpClient) { }
  // get scheme list
  schemeList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllServiceList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

   // get scheme section list
   schemeMainSctns(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchemeMainSection';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // get scheme controls
  schemeDynCtrls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDynmCntrls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // get scheme controls
  dprDynCtrls(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDprDynmCntrls';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // get scheme controls
  getDprDynmCntrlsPreview(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDprDynmCntrlsPreview';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  // apply for scheme
  schemeApply(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemeApply';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }

  // apply for dpr
  previewDprApplication(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'previewDprApplication';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }

  // get scheme document list
  getSchmDocList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchmDocList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }  
  // for final scheme submit
  schemeFnlSubmit(schemeParam:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemeFnlSubmit';
    let serviceRes = this.Http.post(serviceUrl,schemeParam);
    return serviceRes;
  }

   // get scheme applied list
   getAppldSchmLst(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'appliedSchemeList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
    // get IFSC Code list
    getIfscCode(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'getBankDist';
      let ifscRes = this.Http.post(serviceUrl,params);
      return ifscRes;
    }

 // get IFSC Details
    getifscDetails(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'ifsc_branch';
      let ifscDetailsRes = this.Http.post(serviceUrl,params);
      return ifscDetailsRes;
    }

// get application track status
    getTrackApplication(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'appliedSchemeList';
      let getApplicationTrackRes = this.Http.post(serviceUrl,params);
      return getApplicationTrackRes;
    }
  // get application Activity status
  getApplicationActivityStatus(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getApplicationActivityStatus';
    let getApplicationActivity = this.Http.post(serviceUrl,params);
    return getApplicationActivity;
  }
  // update application Activity status
  updateSchmActivitySts(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'updateActivity';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  // update payment receipt
  updatePaymentReceipt(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'updatePaymentReceipt';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  async getApplicationActivityStatusNew(params:any):Promise<any>{
    let serviceUrl = environment.serviceURL+'getApplicationActivityStatus';
    let getApplicationActivity = await this.Http.post(serviceUrl,params).toPromise();
    return getApplicationActivity;
  }

  getDirectorates(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDirectorates';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  }
  getRedirectQueryAPI(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getRedirectQueryAPI';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  schemeFnlSubmitSujog(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemeFnlSubmitSujog';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }

  getSchmPayList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSchmPayList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }  

  schemePaySubmit(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'schemePaySubmit';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  } 
  getAllBanks(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllBanks';
    let getApplicationTrackRes = this.Http.post(serviceUrl,params);
    return getApplicationTrackRes;
  } 
  getBankProducts(params:any):Observable<any>{
    let websiteserviceURL = environment.websiteserviceURL+'getBankProducts';
    let serviceRes = this.Http.post(websiteserviceURL,params);
    return serviceRes;
  }  
  applicationNoWithOtpSend(params: any): Observable<any> {
		let serviceUrl = environment.serviceURL + 'applicationNoWithOtpSend';
		let loginCheckInfoRes = this.Http.post(serviceUrl, params);
		return loginCheckInfoRes;
	}

	verifyotp(params): Observable<any> {
		let serviceURL = environment.serviceURL + 'verifyotp';
		let regRes = this.Http.post(serviceURL, params);
		return regRes;
	}
  sendotp(params): Observable<any> {
  let serviceURL = environment.serviceURL + 'sendotp';
  let regRes = this.Http.post(serviceURL, params);
  return regRes;
  }
  getNotificationList(params: any): Observable<any> {
		let serviceUrl = environment.serviceURL + 'getNotification';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
	}
  getDprSampleDownload(params: any): Observable<any> {
		let serviceUrl = environment.serviceURL + 'getAllDpr';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
	}
  applicationwithdrawAction(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'applicationwithdrawAction';
    let regRes = this.Http.post(serviceURL, params);
    return regRes;
    }
    getAllBankProducts(params:any):Observable<any>{
      let serviceUrl = environment.serviceURL+'getAllBankProducts';
      let serviceRes = this.Http.post(serviceUrl,params);
      return serviceRes;
    }  
    applicationReSubmitAction(params): Observable<any> {
      let serviceURL = environment.serviceURL + 'schemeFnlReSubmit';
      let regRes = this.Http.post(serviceURL, params);
      return regRes;
      }
    getNotificationListHeader(params): Observable<any> {
    let serviceURL = environment.serviceURL + 'getNotifications';
    let regRes = this.Http.post(serviceURL, params);
    return regRes;
    }
    getNotificationListHeaderCount(params): Observable<any> {
      let websiteserviceURL = environment.websiteserviceURL + 'getNotificationCounts';
      let regRes = this.Http.post(websiteserviceURL, params);
      return regRes;
      }

    downloadAction(params): Observable<any> {
      let serviceURL = environment.serviceURL + 'getDocuments';
      let regRes = this.Http.post(serviceURL, params);
      return regRes;
    }

    getRegistrationCount(params): Observable<any> {
      let websiteserviceURL = environment.websiteserviceURL + 'getRegistrationCount';
      let regRes = this.Http.post(websiteserviceURL, params);
      return regRes;
    }

    applicationStatus(params): Observable<any> {
      let websiteserviceURL = environment.websiteserviceURL + 'applicationStatus';
      let regRes = this.Http.post(websiteserviceURL, params);
      return regRes;
    }
    
    getUserDetails(params): Observable<any> {
      let websiteserviceURL = environment.websiteserviceURL + 'getUserDetails';
      let regRes = this.Http.post(websiteserviceURL, params);
      return regRes;
    }

    /**
     * Service Name: getIncentiveList
     * Created By: Bibhuti Bhusan Sahoo
     * Created On: 10th Apr 2023 
     */
    getIncentiveList(params:any):Observable<any>{
      let websiteserviceURL = environment.websiteserviceURL+'getAllIncentives';
      let serviceRes = this.Http.post(websiteserviceURL,params);
      return serviceRes;
    }

    /**
     * Service Name: getIncentiveList
     * Created By: Bibhuti Bhusan Sahoo
     * Created On: 22th Mar 2024 
     */
    getIncentivePolicyDetails(params:any):Observable<any>{
      let websiteserviceURL = environment.websiteserviceURL+'getIncentivePolicyDetails';
      let serviceRes = this.Http.post(websiteserviceURL,params);
      return serviceRes;
    }

    getRegistrationStatus(params): Observable<any> {
      let websiteserviceURL = environment.websiteserviceURL + 'getRegistrationStatus';
      let regRes = this.Http.post(websiteserviceURL, params);
      return regRes;
    }
        
      
}


