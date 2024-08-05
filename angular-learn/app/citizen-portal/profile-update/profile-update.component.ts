import { Component, OnInit, Injectable, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { ValidatorchklistService } from '../../validatorchklist.service';
import { ProfileValidatorService } from '../../profile-validator.service';
import { RedirectService } from '../../redirect.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import { NgbDateParserFormatter, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { formatDate } from '@angular/common';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import FuzzySet from 'fuzzyset';

function padNumber(value: number | null) {
  if (!isNaN(value) && value !== null) {
    return `0${value}`.slice(-2);
  }
  return '';
}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');

      let dateObj: NgbDateStruct = { day: <any>null, month: <any>null, year: <any>null }
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || <any>null;
      });
      return dateObj;
    }
    return null;
  }

  static formatDate(date: NgbDateStruct | NgbDate | null): string {
    return date ?
      `${padNumber(date.day)}/${padNumber(date.month)}/${date.year || ''}` :
      '';
  }

  static formatDateStr(date: NgbDateStruct | NgbDate | null | ''): string {
    return date ?
      `${date.year || ''}-${padNumber(date.month)}-${padNumber(date.day)}` :
      '';
  }

  format(date: NgbDateStruct | null): string {
    return NgbDateCustomParserFormatter.formatDate(date);
  }
}


@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css'],
  providers: [CitizenProfileService, ProfileValidatorService, NgbDateCustomParserFormatter, ValidatorchklistService]
})
export class ProfileUpdateComponent implements OnInit {

  dob: NgbDateStruct;
  loading = false;
  responseSts: any;
  schemeId: any;
  applicantId: any;
  applctnId: any;
  applicantName = '';
  emailId = '';
  emailIdSts = false;
  mobileNo = '';
  aadhaarNo = '';
  gender = '';
  castCatg = '';
  fatherNm = '';
  districtId = 0;
  blockId = 0;
  gpId = 0;
  villageId = 0;
  address = '';
  redirectURL = '';
  serviceModeId = 0;
  keyArr = '';
  cityId = '';
  genderList: any[] = [];
  castCatgList: any[] = [];
  cateStatus = false;
  districtList: any[] = [];
  blockList: any[] = [];
  gpList: any[] = [];
  vlgList: any[] = [];
  redirectList: any[] = [];
  cityList: any[] = [];
  redirectKeyList = '';
  redirectFrnmName = '';
  redirectAPIDetls = '';
  mstrDt: any = new BehaviorSubject('');
  getData = this.mstrDt.asObservable();
  profImgUrl: any = '';
  profDefImgUrl: any = '';
  isProfImgUrl = false;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  directorateId = 0;
  sectorId = 0;
  branchId = 0;
  directorateList: any[] = [];
  sectorList: any[] = [];
  branchList: any[] = [];
  bankId: any;
  maxLghNm = 100;
  minLghNm = 4;
  maxLghEmail = 50;
  minLghEmail = 10;
  maxLghMob = 10;
  minLghMob = 10;
  maxLghFnm = 100;
  minLghFnm = 5;
  maxLghAdrs = 500;
  minLghAdrs = 5;
  minLghAdhno = 12;
  maxLghAdhno = 12;
  blckId: any;
  distId: any;
  minMaxList=[];


  imgExtnArr: any[] = ['jpg', 'jpeg', 'png'];
  imgFileSize = 1;

  draftSts = 1;
  saveNxtSts = 2;
  schemeName = null;
  schemeType = null;
  schemeTypeId = 0;
  tinDirectorate = 0;

  aadhrMndSts = false;
  docSectnSts = false; // document section display/ not
  serviceMode = false; // Service Mode
  baseType = false; // API TYPE Mode
  verifyOTP = true; // API TYPE Mode
  time1: NgbTimeStruct;
  txtOTP = '';
  agricultureDirectory = environment.agricultureDirectory;
  genericMsg = 'Please update your profile before applying any application !';
  addharNo: any;
  applicantSource: any;
  schmSesnInfo:any;
  moduleId:any;
  loanAmount:any;
  productName: any= '';
  resProfInfoObj:any;
  maxAmount:any;
  minAmount:any;
  intProfileStatus:any;

  // direId:any = 0;
  // sectId:any = 0;
  // branId:any = 0;
  // loanAmt:any = 0;
  
  constructor(
    private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService, private objMstr: CitizenMasterService, private objProf: CitizenProfileService, public vldChkLst: ValidatorchklistService, public profileValidator: ProfileValidatorService, private el: ElementRef, private objRedirect: RedirectService
  ) { }

  ngOnInit(): void {
    this.getSectorList();
    let schmSesnInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;
    this.schemeTypeId = schmSesnInfo.FFS_APPLY_SCHEME_TYPE_ID;
    this.moduleId = schmSesnInfo.FFS_APPLY_SCHEME_MODULE_ID;
    this.aadhrMndSts = (this.schemeTypeId == environment.constScheme) ? true : false;
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.profImgUrl= farmerInfo.USER_PROF_PIC;
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.applctnId = schemeArr[1];
    this.docSectnSts = (schemeArr[2] != undefined && schemeArr[2] > 0) ? true : false;
    this.serviceMode = (schemeArr[3] != undefined && schemeArr[3] == 2) ? true : false;
    this.baseType = (schemeArr[4] != undefined && schemeArr[4] == 1) ? true : false;
    this.productName = sessionStorage.getItem('BankProductName');
    this.distId = (sessionStorage.getItem('userFilterDistrict') == null) ? 0 : sessionStorage.getItem('userFilterDistrict');
    this.blckId = (sessionStorage.getItem('userFilterBlock') == null) ? 0 : sessionStorage.getItem('userFilterBlock');
    // this.direId = (sessionStorage.getItem('userFilterDirectoriate') == null) ? 0 : JSON.parse(sessionStorage.getItem('userFilterDirectoriate'));
    // this.sectId = (sessionStorage.getItem('userFilterSector') == null) ? 0 : JSON.parse(sessionStorage.getItem('userFilterSector'));
    // this.branId = (sessionStorage.getItem('userFilterBranch') == null) ? 0 : JSON.parse(sessionStorage.getItem('userFilterBranch'));
    // this.loanAmt = (sessionStorage.getItem('userFilterLoanAmount') == null) ? 0 : JSON.parse(sessionStorage.getItem('userFilterLoanAmount'));
    // sessionStorage.removeItem('userFilterDirectoriate');
    // sessionStorage.removeItem('userFilterSector');
    // sessionStorage.removeItem('userFilterBranch');
    // sessionStorage.removeItem('userFilterLoanAmount');
    if (this.serviceMode && this.baseType) {
      let apiParam = {
        "processId": this.schemeId,
        "applicantId": this.applicantId
      }
      this.objProf.getRedirectAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          this.redirectList = res.result.redirectInfo;
          this.redirectKeyList = res.result.redirectInfo.apiKeyDtls;
          this.redirectURL = res.result.redirectInfo.redirectURL;
          this.redirectAPIDetls = res.result.redirectInfo.redirectAPIDetls;
          this.tinDirectorate = res.result.redirectInfo.tinDirectorate;
          this.serviceModeId = 2;
        }
      });
    } else {
      this.serviceModeId = 1;
    }
    // if(this.schemeId==36){
    //     let apiParam = {
    //       "schemeId":this.schemeId
    //     }
    //     this.objProf.getRedirectCityAPI(apiParam).subscribe(res => {
    //       if (res.status == 1) {
    //         this.cityList = res.result.resultInfo;
    //       }
    //     });
    //   }else{
    //     this.cityList   = [];
    //   }



    setTimeout(() => {
      this.getFarmrInfo();
    }, 1000);


    this.time1 = { hour: 15, minute: 58, second: 55 };


    // let todayDt = new Date();
    // this.minDate = { year: 1900, month: 1, day: 1 }
    // this.maxDate = { year: todayDt.getFullYear(), month: todayDt.getMonth() + 1, day: (todayDt.getDate() - 1) }

    const currentYear = new Date();
    const pastDate = new Date(currentYear.getFullYear() - 18, currentYear.getMonth() + 1, currentYear.getDate());
    this.minDate = { year: 1900, month: 1, day: 1 }
    this.maxDate = { year: pastDate.getFullYear(), month: pastDate.getMonth() + 1, day: pastDate.getDate() }
    // this.getDatetime();
    ///this.getTime();
    this.getLoanProductMaxMinAmount();
  }

  // getTime() {
  //   let value = null;

  //     if (!this.time){
  //       value = new Date().getHours() +':'+ new Date().getMinutes();
  //      // alert(value)
  //     }

  //     else
  //     {
  //       value = new Date().getHours() +':'+ new Date().getMinutes();
  //     }
  //   if (!value) {
  //     value = new Date(
  //       this.time ? this.time.hour : 0,
  //       this.time ? this.time.minute : 0
  //     );
  //     this._value=value;
  //   } else 
  //     this._value=null
  //   this.form.get("control").setValue(this._value);
  //   this.label=value;
  // }
  // form = new FormGroup({
  //   control: new FormControl()
  // });
  goToBack() {
    // let bckUrl = '/citizen-portal/scheme-list';
    // this.router.navigate([bckUrl]);
    window.history.back();
  }

  getGenderList(constKey: any) {
    let currObj = this;
    this.getMasterList(constKey);
    this.mstrDt.subscribe(res => {
      currObj.genderList = res;
    })
  }
  getMasterList(constKey: any) {
    let param = {
      "constKey": constKey
    }
    let mstrData = [];
    this.objMstr.getMstrConstList(param).subscribe(res => {
      if (res.status == 1) {
        this.mstrDt.next(res.result)
      }
    },
      error => {
        mstrData = [];
        this.mstrDt.next(mstrData)
      });
    this.mstrDt.next;
  }

  getCatgList(constKey: any) {
    let param = {
      "constKey": constKey
    }
    this.objMstr.getMstrConstList(param).subscribe(res => {
      if (res.status == 1) {
        this.castCatgList = res.result;
      }
    },
      error => {
        this.castCatgList = [];
      });
  }
  getDistList() {
    this.loading = true;
    this.blockList = [];
    this.gpList = [];
    this.vlgList = [];
    let param = {
      "parentId": 1,
      "subLevelId": 1
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.districtList = res.result;
       // this.loading = false;
      }
    },
      error => {
        this.districtList = [];
        this.loading = false;
      });
  }

  getBlockList(eVlue: any, eSts: any) {
    this.loading = true;
    this.gpList = [];
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 2
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.blockList = res.result;
        //this.loading = false;
      }
    },
    error => {
      this.loading = false;
      this.blockList = [];
    });
    if (eSts == 1) {
      this.blockId = 0;
      this.gpId = 0;
      this.villageId = 0;
    }
  }

  getBlockLists(eVlue: any, eSts: any) {
    this.loading = true;
    this.gpList = [];
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 2
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.blockList = res.result;
        //this.loading = false;
      }
    },
    error => {
      this.blockList = [];
      this.loading = false;
    });
    if (eSts == 1) {
      this.blckId = 0;
    }
  }

  getGpList(eVlue: any, eSts: any) {
    this.loading = true;
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 3
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.gpList = res.result;
        //this.loading = false;
      }
    },
      error => {
        this.gpList = [];
        this.loading = false;
      });

    if (eSts == 1) {
      this.gpId = 0;
      this.villageId = 0;
    }
  }

  getVlgList(eVlue: any, eSts: any) {
    this.loading = true;
    let param = {
      "parentId": eVlue,
      "subLevelId": 4
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.vlgList = res.result;
        //this.loading = false;
      }
    },
      error => {
        this.vlgList = [];
        this.loading = false;
      });
    if (eSts == 1) {
      this.villageId = 0;
    }
  }

  getDirectorateList() {
    this.loading = true;
    this.directorateList = [];
    let param = {
    }
    this.objMstr.getDirectorate(param).subscribe(res => {
      if (res.status == 200) {
        this.directorateList = res.result.directorate;
       this.loading = false;
      }
    },
    error => {
      this.directorateList = [];
      this.loading = false;
    });
  }

  getSectorList() {
    this.loading = true;
    this.sectorList = [];
    let param = {
      "parentId": this.directorateId,
      "selSector": this.sectorId,
    }
    this.objMstr.getSector(param).subscribe(res => {
      if(res != null){
        if (res.status == 1) {
          this.sectorList = res.result;
          this.loading = false;
        }
      }
    },
    error => {
      this.sectorList = [];
      this.loading = false;
    });
  }

  getBranchList() {
    this.loading = true;
    //alert(this.moduleId);
    this.branchList = [];
    let param = {
      "bankId": this.moduleId,
      "districtId": this.distId,
      "blockId": 0
    }
     this.objMstr.getBranch(param).subscribe(res => {
      if (res.status == 200) {
        this.branchList = res.result.branch;
        this.loading = false;
      }
    },
    error => {
      this.branchList = [];
      this.loading = false;
    });
  }
  // get farmer  basic info
  getFarmrInfo() {
    let params = {
      "profileId": this.applicantId,
      "loanId": this.schemeId,
    };
    this.loading = true;
    this.objProf.profileBuild(params).subscribe(res => {
      this.responseSts = res.status;
      if (res.status > 0) {
        this.getGenderList('GENDER_LIST');
        this.getCatgList('CASTE_CATEGORY');
        this.getDistList();
        this.getDirectorateList();
        let resProfInfo = res.result['profileInfo'];
        this.resProfInfoObj=resProfInfo;
        this.sectorId=(resProfInfo['intSectorId'])?resProfInfo['intSectorId']:0;
        this.directorateId=(resProfInfo['intDirectorateId'])?resProfInfo['intDirectorateId']:0;
        this.loanAmount=(resProfInfo['loanAmount'])?resProfInfo['loanAmount']:0;
        this.getSectorList();
        // get profile info
        this.applicantId = resProfInfo['applicantId'];
        this.applicantName = resProfInfo['applicantName'];
        this.emailId = resProfInfo['emailId'];
        this.emailIdSts = (resProfInfo['emailId'] != '') ? true : false;
        this.mobileNo = resProfInfo['mobileNo'];
        this.aadhaarNo = resProfInfo['aadhaarNo'];
        if (this.aadhaarNo != '') {
          this.verifyOTP = false;
          this.aadhrMndSts = false;
        }
        this.fatherNm = resProfInfo['fatherNm'];
        this.gender = resProfInfo['gender'];
        this.castCatg = resProfInfo['castCatg'];
        let dobV = resProfInfo['dob'];

        const dateArr = dobV.split('-');
        const ngbDate: NgbDateStruct = {
          year: parseInt(dateArr[0]),
          month: parseInt(dateArr[1]),
          day: parseInt(dateArr[2]),
        }
        this.dob = resProfInfo['dob'];
        this.districtId = resProfInfo['districtId'];
        this.blockId = resProfInfo['blockId'];
        if(this.distId == 0)
          this.distId = (resProfInfo['AppliDistId']) ? resProfInfo['AppliDistId']:resProfInfo['districtId'];
        if(this.blckId == 0)
          this.blckId = (resProfInfo['AppliBlckId']) ? resProfInfo['AppliBlckId']:resProfInfo['blockId'];
        this.gpId = resProfInfo['gpId'];
        this.villageId = resProfInfo['villageId'];
        this.branchId = resProfInfo['intBranchId'];
        this.address = resProfInfo['address'];
        this.profImgUrl = resProfInfo['profPic'];
        this.isProfImgUrl = (this.profImgUrl != '') ? true : false;
        this.profDefImgUrl = resProfInfo['defProfPic'];
        this.cityId = resProfInfo['cityId'];
        if (this.distId > 0) {
          this.getBlockList(this.distId, 2);
        }
        if (this.blckId > 0) {
          this.getGpList(this.blockId, 2);
        }
        if (this.gpId > 0) {
          this.getVlgList(this.gpId, 2);
        }
        this.bankId = sessionStorage.getItem('bankID');
        
        if(this.districtId > 0 && this.blockId > 0 && this.bankId != ''){
          this.getBranchList();
        }
        this.intProfileStatus = resProfInfo['intProfileStatus'];
        //this.loading = false;
      }
    },
      error => {
        Swal.fire({
          icon: 'error',
          text: environment.errorMsg
        });
        this.loading = false;
      });
  }

  // update farmer basic info
  updFarmerInfo(vType: any) {
     let profIdP = this.applicantId;
    let applicantNmP = this.applicantName;
    let emailIdP = this.emailId;
    let mobileNoP = this.mobileNo;
    let genderP = this.gender;
    // let dobP = NgbDateCustomParserFormatter.formatDateStr(this.dob);
    // dobP = (dobP == '--') ? '' : dobP;
    let dobP = this.dob;
    let castCatgP = this.castCatg;
    let fatherNmP = this.fatherNm;
    let aadhaarNoP = this.aadhaarNo;
    let districtIdP = this.districtId;
    let blockIdP = this.blockId;
    let districtIdA = this.distId;
    let blockIdA = this.blckId;
    let branchId = this.branchId;
    let directorateId = this.directorateId;
    let sectorId = this.sectorId;
    let gpIdP = this.gpId;
    let villageIdP = this.villageId;
    let addressP = this.address;
    let profSts = 0;
    let serviceModeId = this.serviceModeId;
    let redirectURL = this.redirectURL;
    let redirectArr = this.redirectKeyList;
    let arrayOfUrl = [];
    let arrayRedUrl: any = [];
    let redirectFrnmName = '';
    let fuzzyResult = [];
    let schemeId = this.schemeId;
    let cityId = this.cityId;
    let loanAmount = this.loanAmount;
    let profImgUrl = this.profImgUrl;
    let replaceArr = { "[frmname]": applicantNmP, "[frmmob]": mobileNoP, "[frmmail]": emailIdP, "[frmfather]": fatherNmP, "[frmaadhar]": aadhaarNoP, "[frmgender]": genderP, "[frmdob]": dobP, "[frmcity]": cityId };
    let sujogArr = { "apiId": "Rainmaker", "ver": ".01", "ts": "", "action": "_send", "did": "1", "key": "", "msgId": "20170310130900|en_IN", "authToken": null };
    //let replaceArr={"[frmname]":applicantNmP,"[frmmob]":mobileNoP,"[frmmail]":emailIdP};
    if (serviceModeId == 2) {
      for (let i = 0; i < redirectArr.length; i++) {
        let key = redirectArr[i]['key'];
        let value = (document.getElementById(key) as HTMLTextAreaElement).value;
        arrayOfUrl.push({ key: key, value: value });
        arrayRedUrl.push({ [key]: value });

        let fieldValue = replaceArr[value];
        if (typeof (fieldValue) != 'undefined' && fieldValue != '') {
          arrayRedUrl[i] = { [key]: fieldValue };
        }
      }

      arrayRedUrl = arrayRedUrl.reduce(((r, c) => Object.assign(r, c)), {});
     } else {
      let arrayOfUrl = '';
    }
    let sessinoInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantSource = sessinoInfo.USER_SOURCE;
    if(this.applicantSource == 1)
    this.aadhrMndSts = false;
    let vSts = true;
    // if (this.aadhrMndSts && !this.profileValidator.blankCheck(aadhaarNoP, this.genericMsg)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.validAadhar(aadhaarNoP)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.maxLength(aadhaarNoP, this.maxLghAdhno, this.genericMsg)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.minLength(aadhaarNoP, this.minLghAdhno, this.genericMsg)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.blankCheck(applicantNmP, this.genericMsg)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.maxLength(applicantNmP, this.maxLghNm, this.genericMsg)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.minLength(applicantNmP, this.minLghNm, this.genericMsg)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.validEmail(emailIdP)) {
    //   vSts = false;
    // }
    // else if (!this.profileValidator.maxLength(emailIdP, this.maxLghNm, this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.minLength(emailIdP, this.minLghNm,this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.blankCheck(mobileNoP, this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.validMob(mobileNoP)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.maxLength(mobileNoP, this.maxLghMob, this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.minLength(mobileNoP, this.minLghMob, this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.blankCheckRdo("gender", this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.blankCheck(dobP, this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.selectDropdown(castCatgP, this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    // else if (!this.profileValidator.blankCheck(fatherNmP, this.genericMsg)) {
    //   vSts = false;
    //   this.router.navigate(['/citizen-portal/applicant-profile']);
    // }
    if (vType == this.saveNxtSts) {
      
      // if (!this.profileValidator.blankImgCheck(profImgUrl, this.genericMsg)) {
      //   vSts = false;
      //   this.router.navigate(['/citizen-portal/applicant-profile']);
      // }
      // if (!this.profileValidator.selectDropdown(districtIdP, this.genericMsg)) {
      //   vSts = false;
      //   //this.router.navigate(['/citizen-portal/applicant-profile']);
      // }
      // else if (!this.profileValidator.selectDropdown(blockIdP, this.genericMsg)) {
      //   vSts = false;
      //   //this.router.navigate(['/citizen-portal/applicant-profile']);
      // }
      // else if (!this.profileValidator.selectDropdown(gpIdP, this.genericMsg)) {
      //   vSts = false;
      //   //this.router.navigate(['/citizen-portal/applicant-profile']);
      // }
      // else if (!this.profileValidator.selectDropdown(villageIdP, this.genericMsg)) {
      //   vSts = false;
      //   //this.router.navigate(['/citizen-portal/applicant-profile']);
      // }
       
      if (!this.vldChkLst.profileStatusCheck(this.intProfileStatus)){
        vSts = false;
        this.router.navigate(['/citizen-portal/applicant-profile']);
      }
      else if (!this.vldChkLst.selectDropdown(directorateId, "Sector")) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(sectorId, "Project Type")) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(districtIdA, "District")) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(blockIdA, "Block")) {
        vSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(branchId, "Branch")) {
        vSts = false;
      }
      else if (!this.vldChkLst.blankCheck(loanAmount, 'Loan Amount')) {
        vSts = false;
      }else if (!this.vldChkLst.maxMinAmountLength(loanAmount, this.maxAmount, this.minAmount, 'Loan Amount')) {
        vSts = false;
      }
    }
    else {
      vSts = true;
    }

    if (!vSts) {
      return vSts;
    }
    else {
      this.loading = true;
      let profParam = {
        "profId": profIdP,
        "fullName": applicantNmP,
        "emailId": emailIdP,
        "gender": genderP,
        "dob": dobP,
        "castCatg": castCatgP,
        "aadhaarNo": aadhaarNoP,
        "aadhrMndSts": this.aadhrMndSts,
        "fatherNm": fatherNmP,
        "districtId": districtIdP,
        "blockId": blockIdP,
        "gpId": gpIdP,
        "villageId": villageIdP,
        "address": addressP,
        "profImgUrl": this.profImgUrl,
        "draftSts": vType,
        "redirectURL": redirectURL,
        "serviceModeId": serviceModeId,
        "arrayOfUrl": arrayRedUrl,
        "schemeId": schemeId
      };
      // update(searchInput: string) {
      //   setTimeout(() => {
      //     this.myService.search(searchInput)
      //     .subscribe((res) => {
      //       this.myArray.content = res;
      //     });
      //   }, 400);
      // }
      this.objProf.profileUpdate(profParam).subscribe(res => {
        if (res.status == 1) {
          profSts = 1;
          // set profile pic url in session
          let profPicUrl = res.profPicUrl;
          let applicationId = res.applicationId;
          let regStatus = res.regStatus;
          if (profPicUrl != '') {
            let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
            farmerInfo['USER_PROF_PIC'] = profPicUrl;
            sessionStorage.removeItem('FFS_SESSION');
            sessionStorage.setItem('FFS_SESSION', JSON.stringify(farmerInfo));
          }

          if (serviceModeId == 2) {
            arrayRedUrl.applicationId = applicationId;
            arrayRedUrl.profPicUrl = profPicUrl;
            let redirectArr = [];
            redirectArr.push(arrayRedUrl);
            let sujogReq = {};
            if (schemeId == environment.sujogPortal) {
              let RequestInfo = { ['RequestInfo']: sujogArr };
              let otpdtl = { ['otp']: arrayRedUrl };
              sujogReq = {
                ...RequestInfo,
                ...otpdtl
              };

            }
            
            if (arrayOfUrl.filter(e => e.key === 'Farmer_ID').length > 0) {
              this.loading = true;
              let ind = arrayOfUrl.findIndex(e => e.key === 'Farmer_ID');
              let indValue = arrayOfUrl[ind]['value'];
              let txtFarmerId = (document.getElementById('Farmer_ID') as HTMLTextAreaElement).value;
              if (!this.vldChkLst.blankCheck(txtFarmerId, "Farmer Id.If does not have farmer ID, approach AAO to create Farmer ID")) {
                return false
              }
              let apiParam = {
                "farmerID": txtFarmerId
              }
              this.objProf.getRedirectFarmerAPI(apiParam).subscribe(res => {
               // this.loading = false;
                if (res.status == 1) {
                  let redirectFrnmName = res.result.resultInfo.farmerName;
                  let a = FuzzySet();
                  a.add(applicantNmP);
                  let fuzzyResults = a.get(redirectFrnmName);
                  if (fuzzyResults != null && fuzzyResults[0][0] > environment.constMatchValue) {
                    //this.objRedirect.post(redirectArr,redirectURL);
                    Swal.fire({
                      text: environment.redirectMsg,
                      showDenyButton: true,
                      //showCancelButton: true,
                      confirmButtonText: 'Yes',
                      denyButtonText: `No`,
                    }).then((result) => {
                      /* Read more about isConfirmed, isDenied below */
                      if (result.isConfirmed) {
                        this.objRedirect.post(redirectArr, redirectURL);
                      } else if (result.isDenied) {
                        //Swal.fire('Changes are not saved', '', 'info')
                      }
                    })
                  } else {
                    Swal.fire({
                      icon: 'error',
                      text: 'Farmer name mismatch'
                    });
                    this.loading = false;

                  }
                }

              });

            } else {
              if (schemeId == environment.sujogPortal) {
                if (regStatus == 0) {
                  let apiParam = {
                    "name": applicantNmP,
                    "permanentCity": cityId,
                    "mobileNumber": mobileNoP
                  }
                  this.objProf.getRedirectSujogRegAPI(apiParam).subscribe(res => {
                    if (res.status == 1) {
                      let resStatus = res.result.resultInfo;

                      if (resStatus == true) {
                        this.emailNotification()

                      } else {
                        Swal.fire({
                          icon: 'error',
                          text: resStatus
                        });
                        this.loading = false;

                      }
                    }
                  });
                } else {
                  let apiParam = {
                    "mobileNo": mobileNoP
                  }
                  this.objProf.getRedirectSujogLoginAPI(apiParam).subscribe(res => {
                    if (res.status == 1) {
                      let resStatus = res.result.resultInfo;
                      if (resStatus == true) {
                        this.emailNotification1()

                      } else {
                        Swal.fire({
                          icon: 'error',
                          text: resStatus
                        });
                        this.loading = false;

                      }
                    }
                  });
                }

              } else {
                Swal.fire({
                  text: environment.redirectMsg,
                  showDenyButton: true,
                  showCancelButton: true,
                  confirmButtonText: 'Yes',
                  denyButtonText: `No`,
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.objRedirect.post(redirectArr, redirectURL);
                  } else if (result.isDenied) {
                    //Swal.fire('Changes are not saved', '', 'info')
                  }
                })

                //this.objRedirect.post(redirectArr,redirectURL);
              }
            }
            return false;
          }else if (vType == this.saveNxtSts) {
            sessionStorage.setItem('userFilterDirectoriate', JSON.stringify(this.directorateId));
            sessionStorage.setItem('userFilterSector', JSON.stringify(this.sectorId));
            sessionStorage.setItem('userFilterBranch', JSON.stringify(this.branchId));
            sessionStorage.setItem('userFilterLoanAmount', JSON.stringify(this.loanAmount));
            let docSecAvl = (this.docSectnSts) ? 1 : 0;
            let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':' + docSecAvl+ ':' + this.branchId+ ':' + this.directorateId+ ':' + this.sectorId+':' + this.distId+':' + this.blckId+':' + this.gpId+':' + this.villageId+':' + this.moduleId+':' + this.loanAmount+':' + this.productName).toString());
            this.router.navigate(['/citizen-portal/scheme-apply', encAppCtnId]);
          }
          else {
            Swal.fire({
              icon: 'success',
              text: res.msg
            });
          }
          //this.loading = false;
        }

        else {
          profSts = 0;
          this.loading = false;
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      },
        error => {
          profSts = 0;
          Swal.fire({
            icon: 'error',
            text: environment.errorMsg
          });
          this.loading = false;
        });

    }
    return profSts;
  }

  // profile image upload
  profImgUpld(e: any) {
    let file = e.target.files;
    let fileToUpload: any = '';
    let ext = file[0].name.substring(file[0].name.lastIndexOf('.') + 1);
    let upFlSiz = file[0].size;
    let upFlSizCnvs = Math.round((upFlSiz / 1024));
    if (this.imgExtnArr.includes(ext.toLowerCase()) == true) {

      if (upFlSizCnvs <= (this.imgFileSize * 1024)) {
        fileToUpload = file.item(0);
        //Show image preview
        let reader = new FileReader();
        reader.onload = (event: any) => {
          this.profImgUrl = event.target.result;
        }
        reader.readAsDataURL(fileToUpload);
        this.isProfImgUrl = true;
      }
      else {
        Swal.fire({
          icon: 'error',
          text: 'Upload image should be < ' + this.imgFileSize + ' MB'
        });
        fileToUpload = '';
        this.profImgUrl = '';
        this.isProfImgUrl = false;
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Upload only (jpg, jpeg, png) files'
      });
      fileToUpload = '';
      this.profImgUrl = '';
      this.isProfImgUrl = false;
    }
  }

  // go to that tab section
  goToSectn(sectnType: any) {
    let sectnUrl = '/citizen-portal/scheme-list';
    let sectnEncStr = this.route.snapshot.paramMap.get('id');
    switch (sectnType) {
      case "1":
        sectnUrl = '/citizen-portal/profile-update';
        break;
      case "2":
        sectnUrl = '/citizen-portal/scheme-apply';
        break;
      case "3":
        sectnUrl = '/citizen-portal/scheme-document';
        break;
    }
    this.router.navigate([sectnUrl, sectnEncStr]);
  }

  async emailNotification() {
    const { value: text } = await Swal.fire({
      //position: 'bottom-end',                          
      title: 'Enter OTP',
      input: 'text',
      inputAttributes: {
        id: "txtOTP",
        name: "txtOTP"
      },
      inputPlaceholder: 'Enter The text'
    })
    //cityId,mobileNoP                     
    if (text) {
      //Swal.fire(`Entered Text: ${text}`)  
      let otpReference = (`${text}`);
      let mobileNoS = this.mobileNo;
      let appName = this.applicantName;
      let cityName = this.cityId;
      let scheme = this.schemeId;
      let apiParam = {
        "otpReference": otpReference,
        "mobileNo": mobileNoS,
        "name": appName,
        "permanentCity": cityName,
        "schemeId": scheme
      }
      this.objProf.getRedirectSujogRegOTPAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          let resStatus = res.result.resultInfo;

          if (resStatus == true) {
            //alert("success1");
            this.emailNotification1()

          } else {
            Swal.fire({
              icon: 'error',
              text: resStatus
            });
            this.loading = false;

          }
        }
      });

    }
    else {
      Swal.fire(`Please Entered OTP`)
    }
  }

  async emailNotification1() {
    const { value: text } = await Swal.fire({
      //position: 'bottom-end',                          
      title: 'Enter Login OTP',
      input: 'text',
      inputAttributes: {
        id: "txtOTP",
        name: "txtOTP"
      },
      inputPlaceholder: 'Enter The text'
    })
    //cityId,mobileNoP                     
    if (text) {
      //Swal.fire(`Entered Text: ${text}`)  
      let otpReference = (`${text}`);
      let mobileNoS = this.mobileNo;
      let appName = this.applicantName;
      let cityName = this.cityId;
      let apiParam = {
        "otpReference": otpReference,
        "mobileNo": mobileNoS,
        "name": appName,
        "permanentCity": cityName
      }
      this.objProf.getRedirectSujogLoginOTPAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          let resStatus = res.result.resultInfo.resStatus;
          localStorage.setItem("sujogLoginDtls", res.result.resultInfo.res);

          if (resStatus == true) {
            //this.objRedirect.post('https://www.google.com','');                   
            // alert('Successfully Login');
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Login Failed'
            });
            this.loading = false;

          }
        }
      });

    }
    else {
      Swal.fire(`Please Entered OTP`)
    }
  }
  verifyAadhaarKyc() {
    this.loading = true;
    let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
    let apiParam = {
      "aadharNo": Adharvalue,
    }
    if (Adharvalue != '') {
      this.objProf.getAadharOTP(apiParam).subscribe(res => {
        this.loading = false;
        if (res.status == 1) {
          let resStatus = res.result.resultInfo.msgStstus;
          let resStatusMsg = res.result.resultInfo.errMsg;
          let transNo = res.result.resultInfo.transNo;

          if (resStatus == 'SUCCESS') {
            this.aadharOTPValidate(transNo)
          } else {
            Swal.fire({
              icon: 'error',
              text: resStatusMsg
            });
            this.loading = false;

          }
        }
      });
    }
  }

  async aadharOTPValidate(transNo) {
    const { value: text } = await Swal.fire({
      //position: 'bottom-end',                          
      title: 'Enter OTP',
      input: 'text',
      inputAttributes: {
        id: "txtOTP",
        name: "txtOTP"
      },
      inputPlaceholder: 'Enter The text'
    })
    //cityId,mobileNoP                     
    if (text) {
      this.loading = true;
      //Swal.fire(`Entered Text: ${text}`)  
      let otpReference = (`${text}`);
      let Adharvalue = (document.getElementById('aadhaarNo') as HTMLTextAreaElement).value;
      //let transNo = transNo;

      let apiParam = {
        "aadharNo": Adharvalue,
        "otp": otpReference,
        "transNo": transNo
      }
      this.objProf.getAadharDetails(apiParam).subscribe(res => {
        this.loading = false;
        if (res.status == 1) {
          let resStatus = res.result.resultInfo.msgStstus;
          let errMsg = res.result.resultInfo.errMsg;
          let UIDname = res.result.resultInfo.UIDname;
          let UIDdob = res.result.resultInfo.UIDdob;
          let UIDgender = res.result.resultInfo.UIDgender;
          const dateArr = UIDdob.split('-');
          let ngUIDDate: NgbDateStruct = {
            year: parseInt(dateArr[2]),
            month: parseInt(dateArr[1]),
            day: parseInt(dateArr[0]),
          }

          if (resStatus == 'SUCCESS') {
            this.aadhrMndSts = false;
            this.verifyOTP = false;
            this.applicantName = UIDname;
            this.dob = ngUIDDate;
            this.gender = UIDgender;
          } else {
            Swal.fire({
              icon: 'error',
              text: errMsg
            });
            this.loading = false;

          }
        }
      });

    }
    else {
      Swal.fire({
        icon: 'error',
        text: '`Please Entered OTP'
      });
      //Swal.fire(`Please Entered OTP`) 
    }
  }
  getLoanProductMaxMinAmount() {
   this.loading = true;
    this.minMaxList = [];
    let params = { "intProcessId": this.schemeId };
    this.objMstr.getLoanProductMaxMinAmount(params).subscribe(res => {
      if(res != null){
        if (res.status == 200) {
          this.minMaxList = res.result;
          this.maxAmount=res.result.products.decMaxAmount;
          this.minAmount=res.result.products.decMinAmount;
          this.loading = false;
        }
      }
    },
    error => {
      this.minMaxList = [];
      this.loading = false;
    });
    
  }
  
}
