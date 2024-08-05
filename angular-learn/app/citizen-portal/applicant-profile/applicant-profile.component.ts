import { Component, OnInit, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { ValidatorchklistService } from '../../validatorchklist.service';
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
  selector: 'app-applicant-profile',
  templateUrl: './applicant-profile.component.html',
  styleUrls: ['./applicant-profile.component.css'],
  providers: [NgbDateCustomParserFormatter]
})
export class ApplicantProfileComponent implements OnInit {
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
  today = new Date()

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

  constructor(private router: Router, private route: ActivatedRoute, private encDec: EncryptDecryptService, private objMstr: CitizenMasterService, private objProf: CitizenProfileService, public vldChkLst: ValidatorchklistService, private objRedirect: RedirectService) { }

  ngOnInit(): void {
    let schmSesnInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    // this.schemeName = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    // this.schemeType = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;
    // this.schemeTypeId = schmSesnInfo.FFS_APPLY_SCHEME_TYPE_ID;

    this.aadhrMndSts = (this.schemeTypeId == environment.constScheme) ? true : false;

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    this.getFarmrInfo();
  }

  // profile image upload
  profImgUpld(e: any) {
    let file = e.target.files;
    let fileToUpload: any = '';
    let ext = file[0].name.substring(file[0].name.lastIndexOf('.') + 1);
    let upFlSiz = file[0].size;
    let upFlSizCnvs = Math.round((upFlSiz / 1024));
    if (this.imgExtnArr.includes(ext.toLowerCase()) == true) {

      if (upFlSiz <= 100000) {
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
          text: 'Upload image should be < 100 KB'
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

  // get farmer  basic info
  getFarmrInfo() {
    let params = {
      "profileId": this.applicantId,
      "loanId": 0,
    };
    this.loading = true;
    this.objProf.profileBuild(params).subscribe(res => {
      this.responseSts = res.status;
      if (res.status > 0) {
        this.getGenderList('GENDER_LIST');
        this.getCatgList('CASTE_CATEGORY');
        this.getDistList();
        //this.getDirectorateList();
        let resProfInfo = res.result['profileInfo'];
        this.sectorId = (resProfInfo['intSectorId']) ? resProfInfo['intSectorId'] : 0;
        this.directorateId = (resProfInfo['intDirectorateId']) ? resProfInfo['intDirectorateId'] : 0;
        //this.getSectorList();
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
        //alert(resProfInfo['gender']);
        this.castCatg = resProfInfo['castCatg'];
        let dobV = resProfInfo['dob'];

        // const dateArr = dobV.split('-');
        // const ngbDate: NgbDateStruct = {
        //   year: parseInt(dateArr[0]),
        //   month: parseInt(dateArr[1]),
        //   day: parseInt(dateArr[2]),
        // }
        this.dob = dobV;
        this.districtId = resProfInfo['districtId'];
        this.blockId = resProfInfo['blockId'];
        this.gpId = resProfInfo['gpId'];
        this.villageId = resProfInfo['villageId'];
        this.branchId = resProfInfo['intBranchId'];
        this.directorateId = resProfInfo['intDirectorateId'];
        this.sectorId = resProfInfo['intSectorId'];
        this.address = resProfInfo['address'];
        this.profImgUrl = resProfInfo['profPic'];
        //console.log(this.profImgUrl);
        this.isProfImgUrl = (this.profImgUrl != '') ? true : false;
        this.profDefImgUrl = resProfInfo['defProfPic'];
        this.cityId = resProfInfo['cityId'];
        if (this.districtId > 0) {
          this.getBlockList(this.districtId, 2);
        }
        if (this.blockId > 0) {
          this.getGpList(this.blockId, 2);
        }
        if (this.gpId > 0) {
          this.getVlgList(this.gpId, 2);
        }
        this.bankId = sessionStorage.getItem('bankID');
        // if(this.districtId > 0 && this.blockId > 0 && this.bankId != ''){
        //   this.getBranchList();
        // }
        this.loading = false;
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

  getGpList(eVlue: any, eSts: any) {
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 3
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.gpList = res.result;
      }
    },
      error => {
        this.gpList = [];
      });

    if (eSts == 1) {
      this.gpId = 0;
      this.villageId = 0;
    }
  }

  getVlgList(eVlue: any, eSts: any) {
    let param = {
      "parentId": eVlue,
      "subLevelId": 4
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.vlgList = res.result;
      }
    },
      error => {
        this.vlgList = [];
      });
    if (eSts == 1) {
      this.villageId = 0;
    }
  }

  getBlockList(eVlue: any, eSts: any) {
    this.gpList = [];
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 2
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.blockList = res.result;
      }
    },
      error => {
        this.blockList = [];
      });
    if (eSts == 1) {
      this.blockId = 0;
      this.gpId = 0;
      this.villageId = 0;
    }
  }

  getGenderList(constKey: any) {
    let currObj = this;
    this.getMasterList(constKey);
    //console.log("hello");
    this.mstrDt.subscribe(res => {
      currObj.genderList = res;
    })
    // console.log("hello");
    // console.log(currObj.genderList);
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
      }
    },
      error => {
        this.districtList = [];
      });
  }

  // update farmer basic info
  updFarmerInfo() {
    let profIdP = this.applicantId;
    let applicantNmP = this.applicantName;
    let emailIdP = this.emailId;
    let mobileNoP = this.mobileNo;
    let genderP = this.gender;
    let dobP = this.dob;
    //dobP = (dobP == '--') ? '' : dobP;
    let castCatgP = this.castCatg;
    let fatherNmP = this.fatherNm;
    let aadhaarNoP = this.aadhaarNo;
    let districtIdP = this.districtId;
    let blockIdP = this.blockId;
    let gpIdP = this.gpId;
    let villageIdP = this.villageId;
    let addressP = this.address;
    let profSts = 0;
    let vSts = true;
    if (this.aadhrMndSts && !this.vldChkLst.blankCheck(aadhaarNoP, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validAadhar(aadhaarNoP)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(aadhaarNoP, this.maxLghAdhno, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(aadhaarNoP, this.minLghAdhno, "Aadhaar Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(applicantNmP, "Applicant Name")) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(applicantNmP, this.maxLghNm, "Applicant Name")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(applicantNmP, this.minLghNm, "Applicant Name")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validEmail(emailIdP)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(emailIdP, this.maxLghNm, "Email Id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(emailIdP, this.minLghNm, "Email Id")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(mobileNoP, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.validMob(mobileNoP)) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(mobileNoP, this.maxLghMob, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(mobileNoP, this.minLghMob, "Mobile Number")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheckRdo("gender", "Gender")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(dobP, "Date of Birth")) {
      vSts = false;
    }
    else if (!this.vldChkLst.selectDropdown(castCatgP, "Category")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankImgCheck(this.profImgUrl, "Upload Image")) {
      vSts = false;
    }
    else if (!this.vldChkLst.selectDropdown(districtIdP, "District")) {
      vSts = false;
    }
    else if (!this.vldChkLst.selectDropdown(blockIdP, "Block/ ULB")) {
      vSts = false;
    }
    else if (!this.vldChkLst.selectDropdown(gpIdP, "GP/ Ward")) {
      vSts = false;
    }
    // else if (!this.vldChkLst.selectDropdown(villageIdP, "Village")) {
    //   vSts = false;
    // }
    else if (this.vldChkLst.blankCheck(addressP, "Communication Address") == false) {
      vSts = false;
    }
    else if (!this.vldChkLst.maxLength(addressP, this.maxLghAdrs, "Communication Address")) {
      vSts = false;
    }
    else if (!this.vldChkLst.minLength(addressP, this.minLghAdrs, "Communication Address")) {
      vSts = false;
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
        "draftSts": '',
        "redirectURL": '',
        "serviceModeId": 0,
        "arrayOfUrl": '',
        "schemeId": 0
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
          this.loading = false;
          // set profile pic url in session
          let profPicUrl = res.profPicUrl;
          let applicationId = res.applicationId;
          let regStatus = res.regStatus;
          let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
          farmerInfo["USER_FULL_NAME"] = applicantNmP;
          farmerInfo["USER_AADHAR"] = aadhaarNoP;
          farmerInfo["USER_GENDER"] = genderP;
          farmerInfo["USER_DOB"] = dobP;
          farmerInfo["USER_ADDRESS"] = addressP;
          farmerInfo["USER_DISTRICT_ID"] = districtIdP;
          farmerInfo["USER_BLOCK_ID"] = blockIdP;
          farmerInfo["USER_GP_ID"] = gpIdP;
          farmerInfo["USER_VILLAGE_ID"] = villageIdP;
          
          sessionStorage.removeItem('FFS_SESSION');
          sessionStorage.setItem('FFS_SESSION', JSON.stringify(farmerInfo));
          if (profPicUrl != '') {
            let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
            farmerInfo['USER_PROF_PIC'] = profPicUrl;
            sessionStorage.removeItem('FFS_SESSION');
            sessionStorage.setItem('FFS_SESSION', JSON.stringify(farmerInfo));
          }
          Swal.fire({
            icon: 'success',
            text: 'Profile Updated Successfully'
           });//.then(function () {
          //   this.router.navigateByUrl('/citizen-portal/dashboard');
          // });
          this.router.navigateByUrl('/citizen-portal/dashboard');
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
        });

    }
    return profSts;
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

}
