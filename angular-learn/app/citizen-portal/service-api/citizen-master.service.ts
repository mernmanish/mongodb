import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class CitizenMasterService {
  constructor(private Http: HttpClient) { }
  // get demographical hierarchy
  grapCalHirarchy(params:any):Observable<any>{
    let websiteserviceUrl = environment.websiteserviceURL+'getMstrDmogHirarchy';
    let serviceRes = this.Http.post(websiteserviceUrl,params);
    return serviceRes;
  }
  getTaggedFormId(params:any):Observable<any>{
    let websiteserviceUrl = environment.websiteserviceURL+'getTaggedFormId';
    let serviceRes = this.Http.post(websiteserviceUrl,params);
    return serviceRes;
  }
  // get master constant list
  getMstrConstList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrConstants';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }  
  // get Veterinary officer list
  getVtOfcrList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrVtOfcrList';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  grapCalTahasil(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrDmogTahasil';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  } 
  grapCalDemoBhulekh(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrDmogBhulekh';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  grapCalBhulekh(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getMstrBhulekh';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getMstrDirectorate(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllDirectorate';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getSectors(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllSector';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getDirectorate(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllDirectorate';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  } 
  getSector(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getSector';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getBranch(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllBranch';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  getBanks(params:any):Observable<any>{
    let websiteserviceUrl = environment.websiteserviceURL+'getAllBanks';
    let getAllBanks = this.Http.post(websiteserviceUrl,params);
    return getAllBanks;
  }
  getBank(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getBank';
    let getAllBanks = this.Http.post(serviceUrl,params);
    return getAllBanks;
  }
  getBlock(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllBlock';
    let getAllBanks = this.Http.post(serviceUrl,params);
    return getAllBanks;
  }
  dprUpdateAction(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'dodprUpdate';
    let getAllBanks = this.Http.post(serviceUrl,params);
    return getAllBanks;
  }
  dprGetData(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getDprDetails';
    let getAllBanks = this.Http.post(serviceUrl,params);
    return getAllBanks;
  }
  getAllDprList(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllDprDet';
    let getAllDprDet = this.Http.post(serviceUrl,params);
    return getAllDprDet;
  }
  deleteDprDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'deleteDprDetails';
    let getAllDprDet = this.Http.post(serviceUrl,params);
    return getAllDprDet;
  }
  deleteDprRecDetails(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'deleteDprRecDetails';
    let getAllDprDet = this.Http.post(serviceUrl,params);
    return getAllDprDet;
  }
  deleteDprRemove(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'deleteDprRemove';
    let getAllDprDet = this.Http.post(serviceUrl,params);
    return getAllDprDet;
  }
  getAllBlockDistrict(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllBlockDistrict';
    let getAllBanks = this.Http.post(serviceUrl,params);
    return getAllBanks;
  }

  // Start Add more dropdown selection for dependent fields
  getAllGpBlock(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllGpBlock';
    let getAllGp = this.Http.post(serviceUrl,params);
    return getAllGp;
  }
  getAllVillageGp(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getAllVillageGp';
    let getAllVillage = this.Http.post(serviceUrl,params);
    return getAllVillage;
  }
  // End Add more dropdown selection for dependent fields
  //New function add by Bindurekha nayak for getLoanProductMaxMinAmount//
  getLoanProductMaxMinAmount(params:any):Observable<any>{
    let serviceUrl = environment.serviceURL+'getBankProductsMinMaxAmount';
    let serviceRes = this.Http.post(serviceUrl,params);
    return serviceRes;
  }
  //End Code add by Bindurekha nayak for getLoanProductMaxMinAmount//
}
