import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CitizenSchemeService } from '../../citizen-portal/service-api/citizen-scheme.service';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { WebsiteApiService } from '../website-api.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.css']
})
export class SchemeListComponent implements OnInit {
  applicantId:any;
  respSts:any;
  respList:any;
  siteURL = environment.siteURL;
  closeResult = '';
  loginSts  = false;
  isFlag = true;
  public loading = false;
  p: number = 1;
  tab: any = 'tab1';
  filterText='';
  schemeStr;
  dirType;
  groupedDirectorate:any;
  otherDirectorate:any;

mixDirectorate:any=[];
  
  directorateId:any;
  fullDirectorate:any;

  searchForm: any;
  language;
  constructor(private router:Router, 
   private route:ActivatedRoute,
    private objSchm:CitizenSchemeService,
    private encDec: EncryptDecryptService,
    public authService:CitizenAuthService,
    private servicesList:WebsiteApiService,) {

  }



  ngOnInit(): void {
    this.language=localStorage.getItem('locale')
    this.loginSts = this.authService.isLoggedIn();

    if(this.loginSts)
    {
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      this.applicantId = farmerInfo.USER_ID;
    }

    let encDirectorateId  = this.route.snapshot.paramMap.get('id');
   
    
    this.schemeStr = this.encDec.decText(encDirectorateId);
    let schemeArr = this.schemeStr.split(':');
    this.directorateId = schemeArr[0];
   
  this.dirType = schemeArr[1];
//console.log(this.dirType)
console.log(this.directorateId)
this.searchForm = new FormGroup({
  'vchSector': new FormControl('', []),
  'vchType': new FormControl('',  [] ),
  'vchScmText': new FormControl('',  [] )
});


    this.getDirectorates();
    if(this.directorateId === ''){
     
      this.getSchemeList(0); 
    }
    else{
      this.getSchemeList(this.directorateId); 
      
     
    }
       
  }

  doSchemeApply(schemeStr: any, scheme: any) {
    let schmSesnArr = {};
    let schemeName = scheme.vchProcessName;
    let schemeSrvName = scheme.strSchmServNm;
    let schemeSvrId = scheme.intSchmServType;
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = schemeSrvName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schemeSvrId;

    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/profile-update', encSchemeStr]);
  }

  viewAppliedScheme(schemeStr : any)
  {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-applied',encSchemeStr]);
  }


  getDirectorates(){
    let params = {
     
    };
    this.loading = true;
    this.servicesList.getDirectorates(params).subscribe(res=>{
      if(res['status']==200){
  
      this.respSts  = res.status;
      this.groupedDirectorate =res.result['schemService'];
      let other = res.result['other'];
   this.mixDirectorate =this.groupedDirectorate
    // this.groupedDirectorate.push(this.otherDirectorate)
    for(var i=0; i<other.length; ++i) {
      this.groupedDirectorate.push(other[i])
    }
    this.searchForm.patchValue({'vchSector':this.directorateId});
      this.loading = false;
    //console.log(this.groupedDirectorate);
    
   
      }
      else{
        this.loading = true;
      }
      
    });
   }
   get j(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }
   searchSchemeList(){
   
    let params = { 
      "schemeId":0,
      "schmSerType":this.searchForm.value.vchType,
      "dirctType":this.searchForm.value.vchSector,
      "planType":0,
      "schmYear":0,
      "profileId":this.applicantId,
      "schemeServiceName":this.searchForm.value.vchScmText
     
      //distName:this.searchForm.value.vchScmText,
    }
    this.loading = true;
    this.objSchm.schemeList(params).subscribe(res=>{
      
      if(res['status']=='1' && res.result.length > 0 ){
     

       
          this.loading = false;
          this.respSts  = res.status;
          this.respList = res.result;
          this.isFlag=true;
          console.log(this.respList)

       
       
        }
        else{
          this.loading = false;
          this.isFlag=false;
        }
     
    });
   }

  getSchemeList(dirctType:any)
  {
    


    let params = {
      "schemeId":0,
      "schmSerType":this.dirType,
      "dirctType":dirctType,
      "planType":0,
      "schmYear":0,
      "profileId":this.applicantId,
      "schemeServiceName":''
    };
    this.loading = true;
    this.objSchm.schemeList(params).subscribe(res=>{
      
      if(res['status']=='1' && res.result.length > 0 ){
     

       
          this.loading = false;
          this.respSts  = res.status;
          this.respList = res.result;
          this.isFlag=true;
          //console.log(this.respList.length)

       
       
        }
        else{
          this.loading = false;
          this.isFlag=false;
        }
     
    });
  }
}
