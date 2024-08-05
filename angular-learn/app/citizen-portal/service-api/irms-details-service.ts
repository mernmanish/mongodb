// Created By : Mrutunjay Pani || Date : 22-11-2022

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IrmsDetailsService {
  getApplicationTrack(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  constructor(private Http: HttpClient,private router: Router) { }
  //Get Incentive Details || Created By : Mrutunjay Pani || Date : 22-11-2022
  getIncentiveDetails(params): Observable<any> {
      let websiteserviceURL = environment.websiteserviceURL + 'getIncentiveDetails';
      let regRes = this.Http.post(websiteserviceURL, params);
      return regRes;
    }

    //Get Registration Details || Created By : Deepak Kumar Nanda || Date : 05-12-2022
    getRegistrationDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getUserRegistrationDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get Company Details || Created By : Bibhuti Bhusan Sahoo || Date : 05-04-2023
  getCompanyDetails(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getCompanyDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
   //getOperationLocationDetails || Created By : Bibhuti Bhusan Sahoo || Date : 05-04-2023
   getOperationLocationDetails(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getOperationLocationDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //getMarketingPrevClaimedExpenses || Created By : Bibhuti Bhusan Sahoo || Date : 11-05-2023
  getMarketingPrevClaimedExpenses(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getMarketingPrevClaimDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

   //getPrevPatentRegdClaimDetails || Created By : Bibhuti Bhusan Sahoo || Date : 15-05-2023
   getPrevPatentRegdClaimDetails(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPrevPatentRegdClaimDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //getPrevPatentRegdClaimDetails || Created By : Bibhuti Bhusan Sahoo || Date : 16-05-2023
  getPrevInternetClaimDetails(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPrevInternetClaimDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //getFounderPercentageValue || Created By : Bindurekha Nayak || Date : 22-12-2023
  getFounderPercentageValue(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getFounderPercentageValue';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get Incentive Details || Created By : Mrutunjay Pani || Date : 22-11-2022
  saveIncentiveDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'saveIncentiveDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Create Approval Process for Registration || Created By : Gopinath Jena || Date : 24-11-2022
  createApprovalProcess(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'createApprovalProcess';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }


  //Create Clone Record for Edit Application || Created By : Gopinath Jena || Date : 15-12-2022
  createCloneApplication(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'createCloneApplication';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getSingleRegdDetails || Created By : Gopinath Jena || Date : 06-01-2022
  getSingleRegdDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getSingleRegdDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getRegEmpTotal || Created By : Bibhuti Bhusan Sahoo || Date : 17-10-2023
  getRegEmpTotal(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getRegEmpTotal';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getFormAppliedCount || Created By : Bibhuti Bhusan Sahoo || Date : 01-11-2023
  getSingleFormAppliedCount(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getSingleFormAppliedCount';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getPastRecordEmpTotal || Created By : Bibhuti Bhusan Sahoo || Date : 06-11-2023
  getPastRecordEmpTotal(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPreviousIncentiveDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getRegCompanyDetails || Created By : Bibhuti Bhusan Sahoo || Date : 07-11-2023
  getRegCompanyDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getRegCompanyDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get thisYearEmployeeDetails || Created By : Bibhuti Bhusan Sahoo || Date : 20-12-2023
  thisYearEmployeeDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'thisYearEmployeeDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get prevYearEmployeeDetails || Created By : Bibhuti Bhusan Sahoo || Date : 20-12-2023
  prevYearEmployeeDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'prevYearEmployeeDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getPtsPastRecorddetails || Created By : Bibhuti Bhusan Sahoo || Date : 13-11-2023
  getPtsPastRecorddetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPtsPastRecorddetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getCompanyVfxDetails || Created By : Sibananda Sahu || Date : 13-11-2023
  getCompanyVfxDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getCompanyVfxDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get getPastRecordTwoYears || Created By : Bindurekha Nayak || Date : 26-11-2023
  getPastRecordTwoYears(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPastRecordTwoYears';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get threeYearAppTack || Created By : Bibhuti Bhusan Sahoo || Date : 29-12-2023
  threeYearAppTack(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'threeYearAppTack';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get getElectronicsPrevRecord || Created By : Bindurekha Nayak || Date : 04-01-2024
  getElectronicsPrevRecord(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getElectronicsPrevRecord';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get getInternStipendPrevRecord || Created By : Bindurekha Nayak || Date : 05-01-2024
  getInternStipendPrevRecord(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getInternStipendPrevRecord';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
   //Get getInvestmentDetails || Created By : Sibananda sahu || Date : 05-01-2024
   getInvestmentDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getInvestmentDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get fiveYearEligibility || Created By : Bibhuti Bhusan Sahoo || Date : 05-01-2024
  fiveYearEligibility(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'fiveYearEligibility';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //getFounderPercentageValue || Created By : Bindurekha Nayak || Date : 09-01-2024
  getEleEpfEsiPrevRecord(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getEleEpfEsiPrevRecord';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //getFounderPercentageValue || Created By : Bindurekha Nayak || Date : 09-01-2024
  getEleReaWrkAssPrevRecord(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getEleReaWrkAssPrevRecord';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //yearWithDateEligibility || Created By : Bindurekha Nayak || Date : 31-01-2024
  yearWithDateEligibility(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'yearWithDateEligibility';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
   //checkPreviousInterst Subsidy Applied || Created By : Manish Kumar || Date : 15-05-2024
   checkPreviousDateIncentive(params: any):Observable<any>{
    let websiteserviceURL = environment.websiteserviceURL + 'checkPreviousDateIncentive';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //getPtsPastRecorddetailsIncubation || Created By : Bindurekha Nayak || Date : 24-04-2024
  getPtsPastRecorddetailsIncubation(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPtsPastRecorddetailsIncubation';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get patentClaimHistory || Created By : Bibhuti Bhusan Sahoo || Date : 05-01-2024
  patentClaimHistory(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'patentClaimHistory';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get totalCmpEmpCount || Created By : Bindurekha Nayak || Date : 16-02-2024
  totalCmpEmpCount(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'totalCmpEmpCount';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get capitalInvFixedAmount || Created By : Bindurekha Nayak || Date : 16-02-2024
  capitalInvFixedAmount(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'capitalInvFixedAmount';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
   //Get industrialbackwardCheck || Created By : Bindurekha Nayak || Date : 19-02-2024
   industrialbackwardCheck(): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'industrialbackwardCheck';
    let regRes = this.Http.post(websiteserviceURL, {});
    return regRes;
  }
  
   //yearWithDateEligibility || Created By : Bindurekha Nayak || Date : 31-01-2024
   getPolicyElgibilityWithDate(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPolicyElgibilityWithDate';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
   //checkPreviousDateCheckDetails || Created By : Bindurekha Nayak || Date : 05-07-2024
   checkPreviousDateCheckDetails(params: any): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'checkPreviousDateCheckDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get getHumanCapitalPastRecorddetails || Created By : Bindurekha Nayak || Date : 27-02-2024
  getHumanCapitalPastRecorddetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getHumanCapitalPastRecorddetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get getRentalSpaceRecorddetails || Created By : Diptirekha || Date : 04-03-2024
  getRentalSpaceRecorddetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getRentalSpaceRecorddetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
   //Get getPolicyCommencementDetails || Created By : Bindurekha Nayak || Date : 07-03-2024
   getPolicyCommencementDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getPolicyCommencementDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }

  //Get getPastAppliedYears || Created By : Sibananda sahu || Date : 08-may-2024
  getElecEpfAppliedYears(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'getElecEpfAppliedYears';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get yearCheckIncubationRental || Created By : Bindurekha Nayak || Date : 25-jun-2024
  getyearCheckIncubationRental(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'yearCheckIncubationRental';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get financialYearDetails || Created By : Bindurekha Nayak || Date : 05-june-2024
  financialYearDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'financialYearDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
  //Get financialYearEmpDetails || Created By : Bindurekha Nayak || Date : 07-06-2024
  financialYearEmpDetails(params): Observable<any> {
    let websiteserviceURL = environment.websiteserviceURL + 'financialYearEmpDetails';
    let regRes = this.Http.post(websiteserviceURL, params);
    return regRes;
  }
}


