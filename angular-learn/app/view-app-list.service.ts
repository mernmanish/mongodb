import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewAppListService {
  constructor(private router: Router, private http: HttpClient) {}

  getApplicationList(ruleParams: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getApplication';
    let serviceRes = this.http.post(serviceUrl, ruleParams);
    return serviceRes;
  }

  getApplicationListRegd(ruleParams: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getApplicationRegd';
    let serviceRes = this.http.post(serviceUrl, ruleParams);
    return serviceRes;
  }

  getActions(param: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'getAuthAction';
    let serviceRes = this.http.post(serviceUrl, param);
    return serviceRes;
  }
  takeAction(param: any): Observable<any> {
    let serviceUrl = environment.serviceURL + 'takeAction';
    let formData = new FormData();
    let paramKeys = Object.keys(param);
    for (let paramData of paramKeys) {
      formData.append('arrParam[' + paramData + ']', param[paramData]);
    }
    let serviceRes = this.http.post(serviceUrl, formData);
    return serviceRes;
  }

  getStatus(rows: any) {
    let status = 0;
    let pendingAuths = '';
    let appStatus = '';
    let statusDate = '';
    if (rows) {
      status = rows.tinStatus;
      pendingAuths = rows.pendingAuth;
      statusDate = rows.dtmStatusDate != '' ? rows.dtmStatusDate : '';

      if (status == 8) {
        appStatus = '<div>Application Approved</div>';
        if (statusDate) {
          appStatus += '<small>On : ' + rows.dtmStatusDate + '</small>';
        }
      } else {
        appStatus = '<div>Pending at ' + pendingAuths + '</div><small>';

        if (statusDate) {
          appStatus += '<small>From : ' + rows.dtmStatusDate + '</small>';
        }
      }
    }
    return appStatus;
  }
}
