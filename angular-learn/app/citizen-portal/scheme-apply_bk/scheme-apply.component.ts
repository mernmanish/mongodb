import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NG_ASYNC_VALIDATORS, Validators, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import Swal from 'sweetalert2';
import { isNumber } from 'util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebsiteApiService } from '../../website/website-api.service';
import { empty, of } from 'rxjs';


@Component({
  selector: 'app-scheme-apply',
  templateUrl: './scheme-apply.component.html',
  styleUrls: ['./scheme-apply.component.css'],
  providers: [CitizenProfileService, ValidatorchklistService]

})
export class SchemeApplyComponent implements OnInit {
  loading = false;
  schemeDmgForm = new FormGroup({});
  schemeForm = new FormGroup({});
  schemeId: any;
  respSts: any;
  respDynm: any;
  applctnSts: any;
  dynElement: any = [];
  empRadioValue: any[] = [];
  applicantId: any;
  applctnId: any;
  mainSectnId: any;
  controlTypeArr: any = [];
  responseSts: any;
  responseDynm: any;
  responseInfo: any;
  isDraft = false;
  Banks: any[];
  BankNames: any;
  ifscForm: any;
  DistrictNames: any;
  appDraftSts = environment.constDrftSts;
  appPrevwSts = environment.constPrevwSts;
  ifscSubmitted = false;
  isIFSCFlag = false;
  error: any;
  searchform = new FormGroup({});

  schemeName = null;
  schemeType = null;

  districtId = 0;
  blockId = 0;
  districtList: any[] = [];
  blockList: any[] = [];
  scmFrmAdmObj: any = {};

  @ViewChild('someModal') someModalRef: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private objSchmCtrl: CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private apilist: WebsiteApiService,
    public vldChkLst: ValidatorchklistService,
    private el: ElementRef,
    private modalService: NgbModal,
    private objMstr: CitizenMasterService,
    private fb:FormBuilder) { }

  ngOnInit(): void {
    let schmSesnInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.applctnId = schemeArr[1];
    this.getSchmDmgCtrls();
    this.getSchmDynmCtrls();
  }

  getSchmDmgCtrls() {
    let scmDmgFrmObj: any = {};
    scmDmgFrmObj["selDistrict"] = new FormControl('');
    scmDmgFrmObj["selBlock"] = new FormControl('');
    this.schemeDmgForm = new FormGroup(scmDmgFrmObj);
  }

  getSchmDynmCtrls() {
    let scmFrmObj: any = {};
    let params = {
      "schemeId": this.schemeId,
      "profileId": this.applicantId,
      "applicationId": this.applctnId,
      "mainSectionId": 0
    };
    this.loading = true;
    this.objSchmCtrl.schemeDynCtrls(params).subscribe(res => {
      console.log(res);
      this.respSts = res.status;
      this.respDynm = res.result['ctrlArr'];
      this.applctnSts = res.result['applctnSts'];
      if (res.status > 0) {
        this.getDistList();
        let schmHrDt = res.result['schmSrvArr'];
        this.districtId = (schmHrDt.hasOwnProperty('districtId')) ? schmHrDt.districtId : 0;
        this.blockId = (schmHrDt.hasOwnProperty('blockId')) ? schmHrDt.blockId : 0;
        this.schemeDmgForm.patchValue({
          'selDistrict': this.districtId,
          'selBlock': this.blockId
        });
        if (this.districtId > 0) {
          this.getBlockList(this.districtId);
        }
        // start get dynamic ctrl value
        
        for (let sectnInfo in this.respDynm) {
          
          for (let ctrlInfo in this.respDynm[sectnInfo]['sectionCtrls']) {
            let ctrlArr = this.respDynm[sectnInfo]['sectionCtrls'][ctrlInfo];
            let ctrlNm = ctrlArr['jsnControlArray'][0]['ctrlName'];
            if (ctrlArr['tinControlType'] == 8) {
              let ctrlAddMore = ctrlArr['jsnControlArray'][0]['ctrlAddMore'];              
              scmFrmObj[ctrlNm] = new FormArray([]);
              let addMrObj = this.fb.array([]);
              let addMrow = 0;
              let addMcol = 0;              
              for (let addMoreInfo in ctrlAddMore){
                let addMrVr = ctrlNm+'_'+addMrow+'_'+addMcol;
                addMrObj[addMrVr] = new FormControl('');
                addMcol++;
              }
              (scmFrmObj[ctrlNm]).push(addMrObj);              
            }
            else {
              let ctrlVal = ctrlArr['jsnControlArray'][0]['ctrlValue'];
              let finlFldVal = ctrlArr['vchFieldValue'] != '' ? ctrlArr['vchFieldValue'] : ctrlVal != '' ? ctrlVal : '';
              this.dynElement[ctrlNm] = { "val": finlFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0], "cscdTagArr": ctrlArr['jsnOptionArray'][0] };
              scmFrmObj[ctrlNm] = new FormControl('');              
            }
            this.controlTypeArr[ctrlNm] = ctrlArr;
          }
        }
        // end get dynamic ctrl value
        this.scmFrmAdmObj = scmFrmObj;
        this.schemeForm = new FormGroup(scmFrmObj);
        this.setDynamicVal();
        this.loading = false;
      }
    });
  }

  setDynamicVal() {
    for (let secKey in this.dynElement) {
      let elmVal = this.dynElement[secKey]["val"];
      this.schemeForm.patchValue({ [secKey]: elmVal });
      //start for dynamic event functionality
      let dispTagArr = this.dynElement[secKey]["dispTagArr"];
      if (Object.keys(dispTagArr).length > 0) {
        let ctrlTagSts = dispTagArr['tagFieldSts'];
        let ctrlTagFldId = dispTagArr['tagFieldId'];
        let ctrlTagFldVlArr = dispTagArr['tagFieldArr'];
        if (ctrlTagSts == 1) {
          let ctrlPrntVal = this.dynElement[ctrlTagFldId]["val"];
          let ctrlTypeId = this.dynElement[ctrlTagFldId]["ctrlType"];
          if (ctrlPrntVal != '') {
            this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 1, ctrlPrntVal);
          }
          else {
            this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 0, '');
          }
        }
      }
      // end for dynamic event functionality

      //start for cascading event functionality
      let cscdTagArr = this.dynElement[secKey]["cscdTagArr"];
      if (Object.keys(cscdTagArr).length > 0) {
        let ctrlCdTagSts = cscdTagArr['tagFieldSts'];
        let ctrlCdTagFldId = cscdTagArr['tagFieldId'];
        let ctrlCdTagFldVlArr = cscdTagArr['optionArr'];
        if (ctrlCdTagSts == 1) {
          let ctrlPrntTypeId = this.dynElement[ctrlCdTagFldId]["ctrlType"];
          if (ctrlPrntTypeId == 2) {
            this.setDynamicCscdEvnt(ctrlCdTagFldId, secKey, ctrlCdTagFldVlArr);
          }

        }
      }
      // end for cascading event functionality

    }
  }
  // start of dynamic event functionality
  setDynamicEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any, loadFlg: any, ctrlPrntVal: any) {
    let curObj = this;
    if (loadFlg == 1) {
      setTimeout(function () {
        curObj.onDynamicValChanged(ctrlPrntVal, chldCtrlId, ctrlSelValArr);
      }, 1000)
    }

    this.schemeForm.get(ctrlId).valueChanges
      .subscribe(f => {
        this.onDynamicValChanged(f, chldCtrlId, ctrlSelValArr);
      })
  }

  onDynamicValChanged(value: any, chldCtrlId: any, ctrlSelValArr: any) {

    let parntDiv = document.querySelector('.clsDiv_' + chldCtrlId);
    if (ctrlSelValArr.includes(value)) {
      parntDiv.classList.remove("d-none");
    }
    else {
      parntDiv.classList.add("d-none");
      this.schemeForm.patchValue({ [chldCtrlId]: '' });
    }
  }
  // end of dynamic event functionality

  // start of cascading event functionality
  setDynamicCscdEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any) {
    this.schemeForm.get(ctrlId).valueChanges
      .subscribe(f => {
        this.onDynamicCscdValChanged(f, chldCtrlId, ctrlSelValArr);
      })
  }

  onDynamicCscdValChanged(value: any, chldCtrlId: any, ctrlSelValArr: any) {
    ctrlSelValArr = ctrlSelValArr.filter(item => item.tagFldValue === value);
    this.setDynmTagOpnVal(chldCtrlId, ctrlSelValArr);
  }
  setDynmTagOpnVal(chldCtrlId: any, optionArr: any) {
    let dd = document.getElementById(chldCtrlId);
    dd.innerHTML = '';
    dd.appendChild(new Option('Select', ''));
    optionArr.forEach(element => {
      let option = document.createElement("option");
      option.text = element.optionText;
      option.value = element.optionValue;
      dd.appendChild(option);
    });
  }
  // end of cascading event functionality

  onSaveAsDraftClick() {
    this.isDraft = true;
  }

  onSaveNextClick() {
    this.isDraft = false;
  }

  enableDisable(controlName, className) {
    if (className.includes('ifsc_code') || className.includes('ifsc_dist') || className.includes('ifsc_branch') || className.includes('ifsc_bank')) {

      return true;
    }
    else {
      return false;
    }
  }

  // scheme apply
  doSchemeApply() {
    let valSts = true;
    let ctrlParam: any = [];
    let profCnt = 0;

    let districtIdP = 0;
    let blockIdP = 0;
    if (this.schemeDmgForm.status === 'VALID') {
      districtIdP = this.schemeDmgForm.controls["selDistrict"].value;
      blockIdP = this.schemeDmgForm.controls["selBlock"].value;
      if (!this.vldChkLst.selectDropdown(districtIdP, "District")) {
        valSts = false;
      }
      else if (!this.vldChkLst.selectDropdown(blockIdP, "Block/ ULB")) {
        valSts = false;
      }
    }
    if (valSts) {
      let controlKeys = Object.keys(this.schemeForm.controls);

      for (let key of controlKeys) {
        let elmVal = this.schemeForm.controls[key].value;
        let lblName = this.controlTypeArr[key]['vchLabelName'];
        let secType = this.controlTypeArr[key]['tinSectionType'];
        let frmConfgId = this.controlTypeArr[key]['intFormConfigId'];
        let ctrlType = this.controlTypeArr[key]['tinControlType'];
        // for label
        if (ctrlType == 4) {
          elmVal = this.controlTypeArr[key]['jsnControlArray'][0]['labelText'];
        }
        let dispNnSts =false; // for mandatory validation
        // for addmore
        if (ctrlType == 8) {
          let adMrArr = this.schemeForm.controls[key] as FormArray;
          for (let adMrCtrlRw = 0; adMrCtrlRw < adMrArr.controls.length;++adMrCtrlRw) {
            let adMrClArr = (adMrArr.controls[adMrCtrlRw]) as FormArray; 
          }
          dispNnSts =false;
        }
        else{
          dispNnSts = this.el.nativeElement.querySelector('.clsDiv_' + key).classList.contains('d-none');
        }

        let ctrlDtls = '';
        let ctrlValParam = { "dynDataObj": this.controlTypeArr[key], "ctrlVal": elmVal, "drftSts": this.isDraft, "dispNnSts": dispNnSts };
        if (this.schemeForm.status === 'VALID') {
          if (!this.vldChkLst.dynCtrlVal(ctrlValParam, this.el)) {
            valSts = false;
            this.el.nativeElement.querySelector('.cls_' + key).focus();
            break;
          }
          else {
            if (dispNnSts === false) {
              ctrlParam[profCnt] = {
                "profileId": this.applicantId,
                "secTypeId": secType,
                "lblName": lblName,
                "fldVal": elmVal,
                "ctrlDtls": ctrlDtls,
                "formConfgId": frmConfgId,
                "createdBy": this.applicantId,
                "ctrlTypeId": ctrlType
              }
              profCnt++;
            }

          }
        }
      }
    }
    if (valSts) {
      let schemeParam = {
        "profileId": this.applicantId,
        "schemeId": this.schemeId,
        "dynCtrlParm": ctrlParam,
        "drftSts": this.isDraft,
        "districtId": districtIdP,
        "blockId": blockIdP
      }
      
      this.objSchmCtrl.schemeApply(schemeParam).subscribe(res => {
        if (res.status == 1) {
          if (this.isDraft) {
            Swal.fire({
              icon: 'success',
              text: res.msg
            });
          }
          else {
            this.applctnId = res.appCtnId;
            let encAppCtnId = this.encDec.encText((this.schemeId + ':' + res.appCtnId).toString());
            this.router.navigate(['/citizen-portal/scheme-document', encAppCtnId]);
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
      },
        error => {
          Swal.fire({
            icon: 'error',
            text: environment.errorMsg
          });
        });

    }
  }

  goToBack() {
    let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
    this.router.navigate(['/citizen-portal/profile-update', encAppCtnId]);
  }

  keyPressEvt(type: any, evt: any) {
    let sts: any;
    if (type == 1) {
      sts = this.vldChkLst.isNumberKey(evt);
    }
    if (type == 2) {
      sts = this.vldChkLst.isCharKey(evt);
    }
    if (type == 3) {
      sts = this.vldChkLst.isAlphaNumeric(evt);
    }
    return sts;
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

  getIFSC() {

    this.Banks = [];
    this.ifscForm = new FormGroup({
      'vchBankName': new FormControl('',
        [
          Validators.required,
        ]
      ),
      'vchDistrictName': new FormControl('',
        [
          Validators.required,
        ]
      )
    });

    let params = {};
    this.apilist.getIfscCode(params).subscribe(res => {

      this.BankNames = res.result['bankDetails'];
      this.DistrictNames = res.result['districtDetails'];
    },
      error => {
        this.error = error
        this.BankNames = []
        this.DistrictNames = []
      }

    );
    this.open(this.someModalRef);


  }
  get j(): { [key: string]: AbstractControl } {
    return this.ifscForm.controls;
  }

  searchIFSC() {
    this.ifscSubmitted = true;
    if (this.ifscForm.invalid) {
      return;
    }
    let params = {
      bankName: this.ifscForm.value.vchBankName,
      distName: this.ifscForm.value.vchDistrictName
    }
    this.apilist.getifscDetails(params)
      .subscribe(
        (data: any) => {
          if (data.status == '1') {
            this.Banks = data.result;
            this.isIFSCFlag = true;
            console.log(data.result)
          } else {
            this.isIFSCFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.errMsg
            });
          }

        },
        error => {
          this.error = error
          this.Banks = [];
          // console.log(error);
          Swal.fire({
            icon: 'error',
            text: 'No Records Found!'
          });
        }

      );
  }
  open(content: any) {

    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  selectIFSC(branchName, ifscCode) {
    let distName = this.ifscForm.value.vchDistrictName;
    let bankName = this.ifscForm.value.vchBankName;
    if (document.getElementsByClassName("ifsc_dist").length > 0) {
      let ifsc_dist_field: any = document.getElementsByClassName("ifsc_dist")[0];
      let ifsc_dist_name = ifsc_dist_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_dist_name]: distName });
    }
    if (document.getElementsByClassName("ifsc_bank").length > 0) {
      let ifsc_bank_field: any = document.getElementsByClassName("ifsc_bank")[0];
      let ifsc_bank_name = ifsc_bank_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_bank_name]: bankName });
    }
    if (document.getElementsByClassName("ifsc_branch").length > 0) {
      let ifsc_branch_field: any = document.getElementsByClassName("ifsc_branch")[0];
      let ifsc_branch_name = ifsc_branch_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_branch_name]: branchName });
    }
    if (document.getElementsByClassName("ifsc_code").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("ifsc_code")[0];
      let ifsc_code_name = ifsc_code_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_code_name]: ifscCode });
    }
    this.modalService.dismissAll();
  }

  getDistList() {
    this.blockList = [];
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

  getBlockList(eVlue: any) {
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
  }

  // start add/ remove row
  addRow(adMrSctn:any,adMrRow:any,adMrCol:any){
    let addMrExObj = this.schemeForm.get(adMrSctn) as FormArray;
    let addMrObj = this.fb.array([]);
    for(let clm=0;clm<adMrCol;clm++){
      let addMrVr = adMrSctn+'_'+(adMrRow)+'_'+clm;
      addMrObj[addMrVr] = new FormControl('');
    }
    addMrExObj.push(addMrObj);
    this.scmFrmAdmObj[adMrSctn]=addMrExObj;
  }
  removeRow(adMrSctn:any,adMrRow:any) {
    if(adMrRow>0)
    {
      let addMrExObj = this.schemeForm.get(adMrSctn) as FormArray;
      addMrExObj.removeAt(adMrRow);
    }
    else{
      Swal.fire({
        icon: 'error',
        text: '1st row we cant remove it'
      });
    }
  }
  // end add/ remove row

}
