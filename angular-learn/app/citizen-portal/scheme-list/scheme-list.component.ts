import { Component, OnInit } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { environment } from 'src/environments/environment';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CitizenAuthService } from '../service-api/citizen-auth.service';

@Component({
  selector: 'app-scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.css']
})
export class SchemeListComponent implements OnInit {
  applicantId: any;
  respSts: any;
  respList: any;
  siteURL = environment.siteURL;
  closeResult = '';
  isFlag = true;
  public loading = false;
  loginSts  = false;
  tab: any = 'tab1';
  p: number = 1;
  schemeStr;
  groupedDirectorate:any;
  directorateId:any;
  directorateName:any;
  otherDirectorate:any;
  public innerWidth: any;
  sectoragency = '';
  searchForm: any;
  dirType:any;
  mixDirectorate:any=[];
  language;
  vchScmText:any = "";
  constructor(private router: Router, private route:ActivatedRoute, private objSchm: CitizenSchemeService, private encDec: EncryptDecryptService, public authService:CitizenAuthService) {

  }
  ngOnInit(): void {

    this.language=localStorage.getItem('locale')
//console.log(this.language)
    this.innerWidth = window.innerWidth;
    this.loginSts = this.authService.isLoggedIn();
    sessionStorage.removeItem('FFS_SESSION_SCHEME');
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encDirectorateId  = this.route.snapshot.paramMap.get('id');
    this.schemeStr = this.encDec.decText(encDirectorateId);
    let schemeArr = this.schemeStr.split(':');
    this.directorateId = schemeArr[0];

  
   
    this.dirType = schemeArr[1];
    //console.log(this.dirType)
    //this.getDirectorates();
  
      this.getSchemeList({}); 
      


    // this.searchForm = new FormGroup({
    //   'vchSector': new FormControl('', []),
    //   'vchType': new FormControl('',  [] ),
    //   'vchScmText': new FormControl('',  [] )
    // });

  }

  doSchemeApply(schemeStr: any, scheme: any) {
    let schmSesnArr = {};
    let schemeName = scheme.vchProcessName;
    let schemeSrvName = scheme.strSchmServNm;
    let schemeSvrId = scheme.intSchmServType;
    schmSesnArr["FFS_APPLY_SCHEME_NAME"]    = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"]    = schemeSrvName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schemeSvrId;
    //schmSesnArr["FFS_APPLY_SCHEME_MODE"] = scModeType;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/profile-update', encSchemeStr]);
  }

  viewAppliedScheme(schemeStr: any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
  }

  getSchemeList(param) {

    let params = {
      "bankId":this.directorateId,
      "intprofileId":this.applicantId,
      "vchScmText":this.vchScmText
    };
    this.loading = true;
    this.objSchm.getBankProducts(params).subscribe(res => {

      if (res['status'] == '200') {

        this.loading = false;
        this.respSts = res.status;
        this.respList = res.result['products'];
        this.isFlag = true;
       
      }
      else {
        this.isFlag = false;
        this.loading = false;
      }

    });
  }
  // getDirectorates(){
  //   let params = {
     
  //   };
  //   this.loading = true;
  //   this.objSchm.getDirectorates(params).subscribe(res=>{
  //     if(res['status']==200){
  
  //     this.respSts  = res.status;
    
   
  //     this.respSts  = res.status;
  //     this.groupedDirectorate =res.result['schemService'];
  //     let other = res.result['other'];
  //  this.mixDirectorate =this.groupedDirectorate
  //   // this.groupedDirectorate.push(this.otherDirectorate)
  //   for(var i=0; i<other.length; ++i) {
  //     this.groupedDirectorate.push(other[i])
  //   }
  //   this.searchForm.patchValue({'vchSector':this.directorateId});
  //     this.loading = false;
  //   //console.log(this.groupedDirectorate);
    
   
  //     }
  //     else{
  //       this.loading = true;
  //     }
      
  //   });
  //  }

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
    // this.loading = true;
    // this.objSchm.schemeList(params).subscribe(res=>{
      
    //   if(res['status']=='1' && res.result.length > 0 ){
     

       
    //       this.loading = false;
    //       this.respSts  = res.status;
    //       this.respList = res.result;
    //       this.isFlag=true;
    //       console.log(this.respList)

       
       
    //     }
    //     else{
    //       this.loading = false;
    //       this.isFlag=false;
    //     }
     
    // });
   }
}
