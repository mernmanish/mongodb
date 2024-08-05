import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebcommonservicesService {

  constructor(private router: Router, private http: HttpClient) { }

  getFormDetails(ruleParams:any):Observable<any>{
    let serviceUrl = environment.serviceAdminURL+'getFormDetails';
    let serviceRes = this.http.get(serviceUrl,ruleParams);
    return serviceRes;
  }

   schemeDynCtrl(formParams:any):Observable<any>{
    let serviceURL = environment.serviceAdminURL +'getSchemeApplyDetails';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  schemeApply(formParams:any):Observable<any>{
    let serviceURL = environment.serviceAdminURL +'schemeApply';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  loadDynamicBindDetails(formParams:any):Observable<any>{
    let serviceURL = environment.serviceAdminURL +'tableColumnFetch';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }
  previewDynamicForm(formParams:any):Observable<any>{
    let serviceURL = environment.serviceAdminURL +'previewDynamicForm';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  applyForProcess(formParams:any):Observable<any>{
    let serviceURL = environment.serviceAdminURL +'applyForProcess';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  saveFileToTemp(formParams:any):Observable<any>{
    let serviceURL = environment.serviceAdminURL +'saveFileToTemp';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }

  getLogo(formParams:any):Observable<any>{
    let serviceURL = environment.serviceAdminURL +'websitPreviewLogo';
    let moduleResponse = this.http.post(serviceURL, formParams);
    return moduleResponse;
  }
  /*Chunk file upload by Sibananda sahu :: On:02-jul-2024) */
  chunkFileUpload(formData: FormData): Observable<any> {
    let serviceURL = environment.serviceAdminURL +'upload-chunk';
      let moduleResponse = this.http.post(serviceURL, formData);
      return moduleResponse;
  }
  /*get Organisation types for website by Ashok Kumar Samal :: On:27-03-2023) */
  getOrgTypes(ruleParams:any):Observable<any>{
    let serviceUrl = environment.serviceAdminURL+'getOrgTypes';
    let serviceRes = this.http.get(serviceUrl,ruleParams);
    return serviceRes;
  }


}
