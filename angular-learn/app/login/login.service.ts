import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
//import { CryptoJS } from "crypto-js";
import * as CryptoJS from 'crypto-js';

@Injectable({
	providedIn: 'root'
})
export class LoginService {

	constructor(private Http: HttpClient,private router: Router) { }

	/*
	  ---------------------------------
	  Function Name : farmerLoginCheckWithOtpSend 
	  Desc : Check whether aadhaar has register with mobile number and send the otp 
	  Created By : Bibhuti Bhusan Sahoo 
	  Created On :  14-06-2022
	  Return Type : send otp or mobile number is not registered
	  ---------------------------------
	  */
	farmerLoginCheckWithOtpSend(params: any): Observable<any> {
		// let requestParam = btoa(JSON.stringify(params));
		
    	// let requestToken = CryptoJS.HmacSHA256(requestParam, environment.apiHashingKey).toString();
		//console.log(requestToken);
    	// let reqData = { 'REQUEST_DATA': requestParam, 'REQUEST_TOKEN': requestToken };
		let websiteserviceURL = environment.websiteserviceURL + 'farmerLoginCheckWithOtpSend';
		//let loginCheckInfoRes = this.Http.post(serviceUrl, params);
		// let loginCheckInfoRes = this.Http.post(serviceUrl, reqData);
		let loginCheckInfoRes = this.Http.post(websiteserviceURL, params);
		return loginCheckInfoRes;
	}

	verifyotp(params): Observable<any> {
		let serviceURL = environment.serviceURL + 'verifyotp';
		let regRes = this.Http.post(serviceURL, params);
		return regRes;
	}

	public logout() {
		// localStorage.removeItem('userInfo');
		// this.router.navigateByUrl('/login');
		sessionStorage.removeItem('FFS_SESSION');
    	this.router.navigateByUrl('/home');
	}

	sendotp(params): Observable<any> {
		let serviceURL = environment.serviceURL + 'sendotp';
		let regRes = this.Http.post(serviceURL, params);
		return regRes;
	}
	
}
