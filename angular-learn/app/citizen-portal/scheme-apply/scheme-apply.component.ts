import { Component, OnInit, ElementRef, Injectable, ViewChild } from '@angular/core';
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
import { trigger } from '@angular/animations';
import { NgbDateParserFormatter, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'app-scheme-apply',
  templateUrl: './scheme-apply.component.html',
  styleUrls: ['./scheme-apply.component.css'],
  providers: [CitizenProfileService, ValidatorchklistService, NgbDateCustomParserFormatter]

})
export class SchemeApplyComponent implements OnInit {
  loading = false;
  schemeDmgForm = new FormGroup({});
  schemeForm = new FormGroup({});
  schemeId: any;
  branchId: any;
  directorateId: any;
  sectorId: any;
  respSts: any;
  respDynm: any;
  applctnSts: any;
  apprRsmSts: any;
  dynElement: any = [];
  dynAddMoreElement: any = [];
  dynClass: any = [];
  empRadioValue: any[] = [];
  applicantId: any;
  applctnId: any =0;
  currentRow: any =0;
  mainSectnId: any;
  controlTypeArr: any = [];
  responseSts: any;
  responseDynm: any;
  BhulekhLandInfo: any;
  responseInfo: any;
  isDraft = false;
  Banks: any[];
  loanBanks: any[];
  bhulekhLands: any[];
  BankNames: any;
  TahasilNames: any;
  RevenueCircleNames: any;
  RevenueVillageNames: any;
  ifscForm: any;
  ifscLoanForm: any;
  bhulekhLandForm: any;
  DistrictNames: any;
  distdataNew: any;
  appDraftSts = environment.constDrftSts;
  appPrevwSts = environment.constPrevwSts;
  sujogPortal = environment.sujogPortal;
  ifscSubmitted = false;
  ifscLoanSubmitted = false;
  bhulekhLandSubmitted = false;
  isIFSCFlag = false;
  isBhulekhLandFlag = false;
  isLoanIFSCFlag = false;
  error: any;
  searchform = new FormGroup({});
  intdirectorate =0;
  schemeName = null;
  schemeType = null;

  districtId:any;
  blockId = 0;
  gpId = 0;
  villageId = 0;
  tahasilId: any = '';
  ror: any = '';
  vtOfcrId = 0;
  districtList: any[] = [];
  blockList: any[] = [];
  vlgList: any[] = [];
  gpList: any[] = [];
  vtofcrList: any[] = [];
  scmFrmAdmObj: any = {};
  isServcFlg: boolean = false;
  addmoreArr: any[] = [];
  jsnFormulaCalculation: any[] = [];
  lang = '';
  marineType = 0;
  distLabel = 'District';
  blockLabel = 'Block / ULB';
  gpLabel = 'GP / Ward';
  schemeTypeId = 0;
  loantype = 0;
  BankId = 0;
  removeOption = ["bhulekh_tahasil"];
  @ViewChild('someModal') someModalRef: ElementRef;
  @ViewChild('someLoanModal') someLoanModalRef: ElementRef;
  @ViewChild('someBhulekhModal') someBhulekhModalRef: ElementRef;
  docSectnSts = false; // document section display/ not
  isMobile = false;
  verifySts=0;
  verifyFinalSubmit=1;
  schmServType=0;
  regStatus=0;
  cityList: any[] = [];
  loanAmount: any;
  productName: any;
  distId: any;
  maxAmount:any;
  minAmount:any;
  block: any;
  gp: any;
  village: any;
  blockdata: any=[];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private objSchmCtrl: CitizenSchemeService,
    private encDec: EncryptDecryptService,
    private apilist: WebsiteApiService,
    public vldChkLst: ValidatorchklistService,
    private el: ElementRef,
    private modalService: NgbModal,
    private objMstr: CitizenMasterService,
    private objProf: CitizenProfileService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isMobile = this.mobileCheck();
    let schmSesnInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME'));
    this.schemeName = schmSesnInfo.FFS_APPLY_SCHEME_NAME;
    this.schemeType = schmSesnInfo.FFS_APPLY_SCHEME_TYPE;
    this.schemeTypeId = schmSesnInfo.FFS_APPLY_SCHEME_TYPE_ID;
    this.maxAmount = schmSesnInfo.FFS_APPLY_SCHEME_MAX_AMOUNT;
    this.minAmount = schmSesnInfo.FFS_APPLY_SCHEME_MIN_AMOUNT;
    

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    let schemeStr = this.encDec.decText(encSchemeId);
    let schemeArr = schemeStr.split(':');
    this.schemeId = schemeArr[0];
    this.branchId = schemeArr[3];
    this.directorateId = schemeArr[4];
    this.sectorId = schemeArr[5];
    this.applctnId = schemeArr[1];
    this.directorateId = schemeArr[4];
    
    this.getSchmDmgCtrls();
    this.getSchmDynmCtrls();
    this.lang = localStorage.getItem('locale');
    this.districtId = farmerInfo.USER_DISTRICT_ID;
    this.blockId = farmerInfo.USER_BLOCK_ID;
    this.gpId = farmerInfo.USER_GP_ID;
    this.villageId = farmerInfo.USER_VILLAGE_ID;
    this.BankId =schemeArr[10];
    this.loanAmount =schemeArr[11];
  }
  mobileCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
  };
  getSchmDmgCtrls() {
    let scmDmgFrmObj: any = {};
    scmDmgFrmObj["selDistrict"] = new FormControl('');
    scmDmgFrmObj["selBlock"] = new FormControl('');
    scmDmgFrmObj["selGp"] = new FormControl('');
    scmDmgFrmObj["selVillage"] = new FormControl('');
    scmDmgFrmObj["selVtOfcr"] = new FormControl('');
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
      this.respSts = res.status;
      this.respDynm = res.result['ctrlArr'];
      this.applctnSts = res.result['applctnSts'];
      if (res.status > 0) {
        this.getDistList();
        let schmHrDt = res.result['schmSrvArr'];
        this.schmServType = (schmHrDt.hasOwnProperty('schmServType')) ? schmHrDt.schmServType : 0;
        this.regStatus = (schmHrDt.hasOwnProperty('regStatus')) ? schmHrDt.regStatus : 0;
        this.apprRsmSts = (schmHrDt.hasOwnProperty('apprRsmSts')) ? schmHrDt.apprRsmSts : 0;
        this.vtOfcrId = (schmHrDt.hasOwnProperty('vtOfcrId')) ? schmHrDt.vtOfcrId : 0;
        this.marineType = (schmHrDt.hasOwnProperty('marineType')) ? schmHrDt.marineType : 0;
        this.docSectnSts = (schmHrDt.hasOwnProperty('schmServDocSctn')) ? schmHrDt.schmServDocSctn : 0;
        let directorate = (schmHrDt.hasOwnProperty('directorate')) ? schmHrDt.directorate : 0;
        this.intdirectorate = directorate;
        this.isServcFlg = (this.schemeTypeId == environment.constService && directorate == 2) ? true : false;
        if (schmHrDt.hasOwnProperty('sector')) {
          if (schmHrDt.sector == 1) {
            this.marineType = 1;
            this.distLabel = 'Marine Jurisdiction';
            this.blockLabel = 'Marine Extension';
            this.gpLabel = 'FLC / FH';
          }
          else if (schmHrDt.sector == 3) {
            this.marineType = 2;
            this.distLabel = 'District / Marine Jurisdiction';
            this.blockLabel = 'Block / ULB / Marine Extension';
            this.gpLabel = 'GP / Ward / FLC / FH';
          }

        }
        let distData: any;
        if (this.districtId == 0) {
          distData = '0';
        }
        else {
          distData = { "val": this.districtId, "type": this.marineType };
          distData = JSON.stringify(distData);
        }
        this.distdataNew = distData;
        this.schemeDmgForm.patchValue({
          'selDistrict': distData,
          'selBlock': this.blockId,
          'selGp': this.gpId,
          'selVillage': this.villageId,
          'selVtOfcr': this.vtOfcrId,
        });
        if (this.districtId > 0) {

          this.getBlockList(distData);
        }
        if (this.blockId > 0) {
          this.getVtOfcrList(this.blockId);
          this.getGpList(this.blockId);
        }
        if (this.gpId > 0) {
          this.getVlgList(this.gpId);
        }
        if(this.schemeId==environment.sujogPortal){
          //this.loading=true;
          let apiParam = {
            "schemeId":this.schemeId
          }
          this.objProf.getRedirectCityAPI(apiParam).subscribe(res => {
            if (res.status == 1) {              
              //this.loading=false;
              this.cityList = res.result.resultInfo;
              //console.log(this.cityList);
            }
          });
        }else{
          this.cityList   = [];
        }
        // start get dynamic ctrl value

        for (let sectnInfo in this.respDynm) {

          for (let ctrlInfo in this.respDynm[sectnInfo]['sectionCtrls']) {
            let ctrlArr = this.respDynm[sectnInfo]['sectionCtrls'][ctrlInfo];
            let ctrlNm = ctrlArr['jsnControlArray'][0]['ctrlName'];
            let ctrlClass = ctrlArr['jsnControlArray'][0]['ctrlClass'];
            if(ctrlArr['jsnFormulaCalculation']!=''){
              let  calculationArr = ctrlArr['jsnFormulaCalculation']['0']['inputVar'];
              var cnt = 0;
              let newCalArr = [];
              for (let  calculation in calculationArr) {
                newCalArr[cnt] = calculationArr[calculation].selFieldVar
               
                cnt++;
                // console.log(calculationArr[calculation].selFieldVar);
               
              }
              this.jsnFormulaCalculation[ctrlNm] = newCalArr
              //
               //console.log(newCalArr);
            }
            if (ctrlClass == 'bhulekh_tahasil') {
              this.tahasilId = ctrlNm;
            }
            
            if (ctrlClass == 'bhulekh_ror') {
              this.ror = ctrlNm;
            }

            if (ctrlClass == 'cls_selDistrict') {
              this.distId = ctrlNm;
            }
            // this.dynClass[ctrlNm] = ctrlClass;
            // start of ctrl add more type
            if (ctrlArr['tinControlType'] == 8) {

              let addCtrlVal = ctrlArr['jsnControlArray'][0]['ctrlValue'];
              let addMoreFldVal = ctrlArr['vchFieldValue'] != '' ? ctrlArr['vchFieldValue'] : addCtrlVal != '' ? addCtrlVal : '';
              this.dynAddMoreElement[ctrlNm] = { "val": addMoreFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0] };


              let ctrlVal = (ctrlArr['vchFieldValue'] != '') ? ctrlArr['vchFieldValue'] : [];
              if (Object.keys(ctrlVal).length > 0) {

                let ctrlAddMore = ctrlVal['addMoreData'];
                scmFrmObj[ctrlNm] = new FormArray([]);
                for (let addMoreInfo in ctrlAddMore) {
                  let addMrowInfo = ctrlAddMore[addMoreInfo];
                  let addMrObj = this.fb.array([]);
                  for (let addMcolInfo in addMrowInfo) {
                    let addMrVrNm = addMrowInfo[addMcolInfo]['elementId'];
                    let addMrVrVal = addMrowInfo[addMcolInfo]['elementVal'];
                    let addMrVrColTp = addMrowInfo[addMcolInfo]['colType'];
                    addMrObj.controls[addMrVrNm] = new FormControl('');
                    let ctrlDtAddMore = ctrlArr['jsnControlArray'][0]['ctrlAddMore'][addMcolInfo];
                    let cscdTagArr = { 'tagFieldSts': ctrlDtAddMore['isDependent'], 'tagFieldId': ctrlDtAddMore['parentId'], 'optionArr': ctrlDtAddMore['optionArr'], 'staticDepData': ctrlDtAddMore['staticDepData'] };
                    this.dynElement[addMrVrNm] = { "val": addMrVrVal, "ctrlType": addMrVrColTp, "dispTagArr": [], "cscdTagArr": cscdTagArr, "secCtrlType": ctrlArr['tinControlType'], "addMoreCtrlName": ctrlNm };


                  }
                  (scmFrmObj[ctrlNm]).push(addMrObj);
                }
              }
              else {
                let ctrlAddMore = ctrlArr['jsnControlArray'][0]['ctrlAddMore'];
                scmFrmObj[ctrlNm] = new FormArray([]);
                let addMrObj = this.fb.array([]);
                let addMrow = 0;
                let addMcol = 0;
                for (let addMoreInfo in ctrlAddMore) {
                  let addMrVr = ctrlNm + '_' + addMrow + '_' + addMcol;
                  addMrObj.controls[addMrVr] = new FormControl('');
                  let addMrVrColTp = ctrlAddMore[addMcol]['columnType'];
                  let cscdTagArr = { 'tagFieldSts': ctrlAddMore[addMcol]['isDependent'], 'tagFieldId': ctrlAddMore[addMcol]['parentId'], 'optionArr': ctrlAddMore[addMcol]['optionArr'], 'staticDepData': ctrlAddMore[addMcol]['staticDepData'] };
                  this.dynElement[addMrVr] = { "val": '', "ctrlType": addMrVrColTp, "dispTagArr": [], "cscdTagArr": cscdTagArr, "secCtrlType": ctrlArr['tinControlType'], "addMoreCtrlName": ctrlNm };
                  addMcol++;
                }
                (scmFrmObj[ctrlNm]).push(addMrObj);
              }
            }
            // end of ctrl add more type
            else {
              let ctrlVal = ctrlArr['jsnControlArray'][0]['ctrlValue'];
              
              let finlFldVal = ctrlArr['vchFieldValue'] != '' ? ctrlArr['vchFieldValue'] : ctrlVal != '' ? ctrlVal : '';
              //console.log(finlFldVal);
              //console.log(ctrlArr['vchLabelName']+"===="+finlFldVal);
              this.dynElement[ctrlNm] = { "val": finlFldVal, "ctrlType": ctrlArr['tinControlType'], "dispTagArr": ctrlArr['jsnDispTagArray'][0], "cscdTagArr": ctrlArr['jsnOptionArray'][0], "secCtrlType": ctrlArr['tinControlType'],'vchLabelName':ctrlArr['vchLabelName'] };
              scmFrmObj[ctrlNm] = new FormControl('');
            }
            this.controlTypeArr[ctrlNm] = ctrlArr;
          }
        }
        //console.log(this.jsnFormulaCalculation);
        // end get dynamic ctrl value
        this.scmFrmAdmObj = scmFrmObj;
        this.schemeForm = new FormGroup(scmFrmObj);
        let curObj = this;
        setTimeout(function () {

          curObj.setDynamicVal();
        }, 1000);
        this.loading = false;
      }
    });
  }

  setDynamicVal() {
    let dynObjKey = Object.keys(this.dynElement); //console.log(this.dynElement); console.log(this.dynAddMoreElement);

    let addMoreCtrl = [];
    dynObjKey.forEach((field: any) => {
      if (this.dynElement[field].secCtrlType == 8) {
        /* Changes done by Sugam team for value not found issue in console */
        if(this.dynElement[field].val!='')
        {
          (<HTMLInputElement>document.getElementById(field)).value = this.dynElement[field].val!=''?this.dynElement[field].val:'';  
        }
        /* Changes done by Sugam team for value not found issue in console */
        if (!addMoreCtrl.includes(this.dynElement[field].addMoreCtrlName)) {
          addMoreCtrl.push(this.dynElement[field].addMoreCtrlName);
        }
      }
    });

    // if (this.tahasilId != '' && this.tahasilId != 'undefined') {
    //   let tahasilVal = this.dynElement[this.tahasilId]["val"];
    //   if (this.districtId > 0) {
    //     this.fillTahasil(this.distdataNew, tahasilVal);
    //   }
    // }
    

    for (let secKey in this.dynAddMoreElement) {
      let dispTagArr = this.dynAddMoreElement[secKey]["dispTagArr"];


      if (Object.keys(dispTagArr).length > 0) {

        let ctrlTagSts = dispTagArr['tagFieldSts'];
        let ctrlTagFldId = dispTagArr['tagFieldId'];
        let ctrlTagFldVlArr = dispTagArr['tagFieldArr'];
        if (ctrlTagSts == 1) {
          if(this.dynElement[ctrlTagFldId] != undefined){
            let ctrlPrntVal = this.dynElement[ctrlTagFldId]["val"];
            if (ctrlPrntVal != '') {
              this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 1, ctrlPrntVal, 'addMore');
            }
            else {
              this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 0, '', 'addMore');
            }
          }
        }
      }
    }
    
    for (let secKey in this.dynElement) {
      /* Changes done by Sugam team for innerHtml issue in console */
      if(secKey == null)
      {
        continue;
      }
       /* Changes done by Sugam team for innerHtml issue in console */
      let elmVal = this.dynElement[secKey]["val"];
     
      if (this.dynElement[secKey]["ctrlType"] == 9) {
        let dateArr = elmVal.split('-');
        let ngbDate: NgbDateStruct = {
          year: parseInt(dateArr[0]),
          month: parseInt(dateArr[1]),
          day: parseInt(dateArr[2]),
        }
        elmVal = ngbDate;
      }

      this.schemeForm.patchValue({ [secKey]: elmVal });
      //start for dynamic event functionality
      let dispTagArr = this.dynElement[secKey]["dispTagArr"];
      

      if (Object.keys(dispTagArr).length > 0) {

        let ctrlTagSts = dispTagArr['tagFieldSts'];
        let ctrlTagFldId = dispTagArr['tagFieldId'];
        let ctrlTagFldVlArr = dispTagArr['tagFieldArr'];
        if (ctrlTagSts == 1) {
          if(this.dynElement[ctrlTagFldId] != undefined){
            let ctrlPrntVal = this.dynElement[ctrlTagFldId]["val"];
            let ctrlTypeId = this.dynElement[ctrlTagFldId]["ctrlType"];
            if (ctrlPrntVal != '') {

              this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 1, ctrlPrntVal, '');
            }
            else {
              this.setDynamicEvnt(ctrlTagFldId, secKey, ctrlTagFldVlArr, 0, '', '');
            }
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
          let ctrlPrntSecId = this.dynElement[secKey].secCtrlType;
          let ctrlSelVal = this.dynElement[secKey].val;
          let pSelVal ='0';
          let param = {
            "cscdTagArr": cscdTagArr,
            "value": pSelVal,
            "ctrlSelVal": ctrlSelVal
          }
          
          let dd = document.getElementById(secKey);
          /* Changes done by Sugam team for innerHtml issue in console */
          if(dd == null)
          {
            continue;
          }
           /* Changes done by Sugam team for innerHtml issue in console */
          if (ctrlSelVal != '0' && ctrlSelVal!='' &&  ctrlSelVal!='null') {
            this.objMstr.grapCalDemoBhulekh(param).subscribe(res => {
              let dd = document.getElementById(secKey);
              //console.log(secKey);
              if (res.status == 1) {
                dd.innerHTML = res.result.optionStr;
                if (this.distId != '' && this.distId != 'undefined') {
                  this.fillBlock(); 
                }
              } else {
                let dd = document.getElementById(secKey);
                dd.innerHTML = '<option value="">Select</option>';
              }
            },
              error => {
                let dd = document.getElementById(secKey);
                dd.innerHTML = '<option value="">Select</option>';
              });
          } else {
            dd.innerHTML = '<option value="">Select</option>';
          }

          if (ctrlPrntSecId == 8) {
            let ctrlCdTagPrntFldVlArr = cscdTagArr['staticDepData'];
            this.setAddMrCscdEvnt(ctrlCdTagFldId, secKey, ctrlCdTagFldVlArr, ctrlCdTagPrntFldVlArr, ctrlSelVal);
          }
          else {
            if(this.dynElement[ctrlCdTagFldId] != undefined){
              let ctrlPrntTypeId = this.dynElement[ctrlCdTagFldId]["ctrlType"];
              if (ctrlPrntTypeId == 2) {
                this.setDynamicCscdEvnt(ctrlCdTagFldId, secKey, ctrlCdTagFldVlArr, cscdTagArr);
              }
            }
          }
        }
      }
      // end for cascading event functionality

    }
    let cls_declaration = <HTMLElement>document.querySelector(".cls_declaration");
    if(cls_declaration!=null ){
      let cls_declaration_id = cls_declaration.getAttribute('name');
      $('label[for="'+cls_declaration_id+'"]').html('');
    }
    if (this.ror != '' && this.ror != 'undefined') {
      let rorVal = this.dynElement[this.ror]["val"];
      let btContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
      let bhulekh_tahasil_id = btContainer.id;
      let bhulekh_tahasil = this.dynElement[bhulekh_tahasil_id].val;

      let rcContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_circle");
      let bhulekh_revenue_circle_id = rcContainer.id;
      let bhulekh_revenue_circle = this.dynElement[bhulekh_revenue_circle_id].val;

      let rvContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_village");
      let bhulekh_revenue_village_id = rvContainer.id;
      let bhulekh_revenue_village = this.dynElement[bhulekh_revenue_village_id].val;


      let knContainer = <HTMLElement>document.querySelector(".bhulekh_khata_no");
      let bhulekh_khata_no_id = knContainer.id;
      let bhulekh_khata_no = this.dynElement[bhulekh_khata_no_id].val;



      let pnContainer = <HTMLElement>document.querySelector(".bhulekh_plot_no");
      let bhulekh_plot_no_id = pnContainer.id;
      let bhulekh_plot_no = this.dynElement[bhulekh_plot_no_id].val;
      if (bhulekh_tahasil > 0 && bhulekh_revenue_circle > 0 && bhulekh_revenue_village > 0 && bhulekh_plot_no > 0) {
        let param = {
          "bhulekh_tahasil": bhulekh_tahasil,
          "bhulekh_revenue_circle": bhulekh_revenue_circle,
          "bhulekh_revenue_village": bhulekh_revenue_village,
          "bhulekh_khata_no": bhulekh_khata_no,
          "bhulekh_plot_no": bhulekh_plot_no,
          "selVal": rorVal
        }
        let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
        this.objMstr.grapCalBhulekh(param).subscribe(res => {
          let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
          let bhulekh_area = <HTMLElement>document.querySelector(".bhulekh_area");
          let bhulekh_area_id = bhulekh_area.id;
          if (res.result.status == 1) {
            bhulekh_ror.innerHTML = res.result.optionStr;
          } else {
            bhulekh_ror.innerHTML = '<option value="">Select</option>';
          }
        },
          error => {
            bhulekh_ror.innerHTML = '<option value="">Select</option>';
          }
        );
      }
    }
    let ctrlElement = document.getElementsByClassName('sum_item');
    let sumClassLength = ctrlElement.length;
    for (let i = 0; i < sumClassLength; i++) {
      let sumCtrlId = ctrlElement[i].getAttribute('id');
      let curObj = this;
      document.getElementById(sumCtrlId).addEventListener("keyup", function () { curObj.calculateSum() }, false);
    }
    this.loadBasicInfo();
  }
  calculateSum() {
    let ctrlElement = document.getElementsByClassName('sum_item');
    let totalElement = document.getElementsByClassName('sum_total');
    let sumTotalCtrlId = totalElement[0].getAttribute('id');
    let sumClassLength = ctrlElement.length;
    let totalSum = 0;
    for (let i = 0; i < sumClassLength; i++) {
      let sumCtrlId = ctrlElement[i].getAttribute('id');
      let sumCtr = (<HTMLInputElement>document.getElementById(sumCtrlId)).value;
      totalSum += Number(sumCtr);
    }
    this.schemeForm.patchValue({ [sumTotalCtrlId]: totalSum });
  }
  // start of dynamic event functionality
  setDynamicEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any, loadFlg: any, ctrlPrntVal: any, type: any) {
    let curObj = this;
    if (loadFlg == 1) {
      setTimeout(function () {
        curObj.onDynamicValChanged(ctrlPrntVal, chldCtrlId, ctrlSelValArr, type);
      }, 1000)
    }
  this.schemeForm.get(ctrlId).valueChanges
      .subscribe(f => {

        this.onDynamicValChanged(f, chldCtrlId, ctrlSelValArr, type);
      })
    
  }

  onDynamicValChanged(value: any, chldCtrlId: any, ctrlSelValArr: any, type: any) {

    let parntDiv = document.querySelector('.clsDiv_' + chldCtrlId);
    let parntDiv2 = document.querySelector('.test22');
    if (ctrlSelValArr.includes(value)) {
      parntDiv.classList.remove("d-none");
    }
    else {
      parntDiv.classList.add("d-none");
      if (type != 'addMore') {
        this.schemeForm.patchValue({ [chldCtrlId]: '' });
      }

    }
  }
  // end of dynamic event functionality

  // start of cascading event functionality
  setDynamicCscdEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any, cscdTagArr: any) {
    this.schemeForm.get(ctrlId).valueChanges
      .subscribe(f => {
        this.onDynamicCscdValChanged(f, chldCtrlId, ctrlSelValArr, cscdTagArr);
      })
  }

  onDynamicCscdValChanged(value: any, chldCtrlId: any, ctrlSelValArr: any, cscdTagArr: any) {
    ctrlSelValArr = ctrlSelValArr.filter(item => item.tagFldValue === value);
    this.setDynmTagOpnVal(chldCtrlId, ctrlSelValArr, cscdTagArr, value);
  }
  setDynmTagOpnVal(chldCtrlId: any, optionArr: any, cscdTagArr: any, value: any) {
    let ctrlCdTagSts = cscdTagArr['tagFieldSts'];
    let dataBindType = cscdTagArr['dataBindType'];
    if (ctrlCdTagSts == '1' && chldCtrlId != '' && dataBindType == 2) {
      let param = {
        "cscdTagArr": cscdTagArr,
        "value": value
      }
      let dd = document.getElementById(chldCtrlId);
      if (value != '0' && value!='' &&  value!='null') {
        this.objMstr.grapCalDemoBhulekh(param).subscribe(res => {
          let dd = document.getElementById(chldCtrlId);
          if (res.status == 1) {
            dd.innerHTML = res.result.optionStr;
            if (this.distId != '' && this.distId != 'undefined') {
              // setTimeout(function () {
              //   this.fillBlock();
              // }, 1000)
              this.fillBlock(); 
            }
          } else {
            let dd = document.getElementById(chldCtrlId);
            dd.innerHTML = '<option value="">Select</option>';
          }
        },
          error => {
            let dd = document.getElementById(chldCtrlId);
            dd.innerHTML = '<option value="">Select</option>';
          });
        //let myContainer = <HTMLElement> document.querySelector(".tahasil");
      } else {
        dd.innerHTML = '<option value="">Select</option>';
      }
    } else {
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
  }
  // end of cascading event functionality

  // start of addmore cascading event functionality
  setAddMrCscdEvnt(ctrlId: any, chldCtrlId: any, ctrlSelValArr: any, ctrlPrntSelValArr: any, ctrlSelVal: any) {
    let selectElement = document.getElementById(chldCtrlId).closest('tr').querySelector('.' + ctrlId);
    selectElement.addEventListener('change', (event: any) => {
      let prntIndxArr = this.getAddMrAllIndexes(ctrlPrntSelValArr, event.target.value);
      let chldOptnArr = this.getAddMrAllChldArr(ctrlSelValArr, prntIndxArr, ctrlSelVal);
      document.querySelector('#' + chldCtrlId).innerHTML = chldOptnArr;
    });
    selectElement.dispatchEvent(
      new Event("change")
    );
  }
  getAddMrAllIndexes(arr: any, val: any) {
    var indexes = [], i: any;
    for (i = 0; i < arr.length; i++)
      if (arr[i] === val)
        indexes.push(i);
    return indexes;
  }
  getAddMrAllChldArr(chldArr: any, prntIndxArr: any, selectedVal: any) {
    let chldOptnArr = '<option value="">Select</option>';
    for (let i = 0; i < chldArr.length; i++)
      if (prntIndxArr.includes(i)) {
        let selected = (selectedVal == chldArr[i].optionValue) ? 'selected="selected"' : '';
        chldOptnArr += '<option value="' + chldArr[i].optionValue + '" ' + selected + '>' + chldArr[i].optionText + '</option>';
      }
    return chldOptnArr;
  }
  // end of addmore cascading event functionality

  onSaveAsDraftClick() {
    this.isDraft = true;
  }

  onSaveNextClick() {
    this.isDraft = false;
  }

  enableDisable(controlName, className) {
    if (className.includes('loan_bank_branch') || className.includes('loan_bank_name') || className.includes('loan_bank_ifsc') || className.includes('ifsc_code') || className.includes('ifsc_dist') || className.includes('ifsc_branch') || className.includes('ifsc_bank') || className.includes('sum_total')) {

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
    
    // let vtOfcrIdP = 0;
    // let cityId='';
    // if (this.schemeDmgForm.status === 'VALID' && this.schemeId!=environment.sujogPortal) {
      // let districtIdObj: any = (<HTMLInputElement>document.getElementById('selDistrict')).value;
      // console.log(districtIdObj);
      // if (districtIdObj != '0') {
      //   districtIdObj = JSON.parse(districtIdObj);
      //   districtIdP = districtIdObj.val;
      // }


      // blockIdP = this.schemeDmgForm.controls["selBlock"].value;
      // gpIdP = this.schemeDmgForm.controls["selGp"].value;
      // vlgIdP = this.schemeDmgForm.controls["selVillage"].value;
      // vtOfcrIdP = this.schemeDmgForm.controls["selVtOfcr"].value;
      // vlgIdP = (vlgIdP > 0) ? vlgIdP : 0;
      // if (!this.vldChkLst.selectDropdown(districtIdP, "District")) {
      //   valSts = false;
      // }
      // if (!this.vldChkLst.selectDropdown(blockIdP, "Block/ ULB")) {
      //   valSts = false;
      // }
      // else if (!this.vldChkLst.selectDropdown(gpIdP, "GP/ Ward")) {
      //   valSts = false;
      // }
      // else {
      //   if (this.marineType == 0) {
      //     if (!this.vldChkLst.selectDropdown(vlgIdP, "Village")) {
      //       valSts = false;
      //     }
      //   }

      //   if (this.isServcFlg) {
      //     if (!this.vldChkLst.selectDropdown(vtOfcrIdP, "Veterinary Officer")) {
      //       valSts = false;
      //     }
      //   }
      // }

    // }else if(this.schemeId==environment.sujogPortal){	
    //   cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;	
    //   if (!this.vldChkLst.blankCheck(cityId, "City")) {	
    //     return false	
    //   }	
    //   let label11=document.getElementsByClassName("sujog_locality");	
    //   let labelId11 = label11[0].getAttribute('id');	
    //   let locality=(document.getElementById(labelId11) as HTMLTextAreaElement).value;	
    //   if (!this.vldChkLst.blankCheck(locality, "Locality")) {	
    //     return false	
    //   }	
    //   let label12=document.getElementsByClassName("sujog_ward");	
    //   let labelId12 = label12[0].getAttribute('id');	
    //   let ward=(document.getElementById(labelId12) as HTMLTextAreaElement).value;	
    //   if (!this.vldChkLst.blankCheck(ward, "Ward")) {	
    //     return false	
    //   }	
    // }
    
    if (valSts) {
      let controlKeys = Object.keys(this.schemeForm.controls);
      
      for (let key of controlKeys) {
        let elmVal = this.schemeForm.controls[key].value;
        let lblName = this.controlTypeArr[key]['vchLabelName'];
        let secType = this.controlTypeArr[key]['tinSectionType'];
        let frmConfgId = this.controlTypeArr[key]['intFormConfigId'];
        let ctrlType = this.controlTypeArr[key]['tinControlType'];
        // console.log(this.schemeForm.controls);
        // console.log(ctrlType);
        if (ctrlType == 9) {
          elmVal = NgbDateCustomParserFormatter.formatDateStr(elmVal);
        }
        // for label
        if (ctrlType == 4) {
          elmVal = this.controlTypeArr[key]['jsnControlArray'][0]['labelText'];
        }
        let dispNnSts = false; // for mandatory validation
        // for addmore
        if (ctrlType == 8) {
          let tagFieldSts =this.controlTypeArr[key]['jsnDispTagArray']['0']['tagFieldSts'];
          //console.log(tagFieldSts); 
          let addmoreFlagDep = 0;
          if(tagFieldSts=='1'){
            let tagFieldArr =this.controlTypeArr[key]['jsnDispTagArray']['0']['tagFieldArr'];
            let tagFieldId =this.controlTypeArr[key]['jsnDispTagArray']['0']['tagFieldId'];
            let tagFieldIdVal = (<HTMLInputElement>document.getElementById(tagFieldId)).value;
            if(tagFieldArr.includes(tagFieldIdVal)){
              addmoreFlagDep = 1;
            }else{
              addmoreFlagDep = 0;
            }
          }else{
            addmoreFlagDep = 1;
          }
          // console.log(addmoreFlagDep);return;
          let classCheckFlag = false;
          let objAddMr = { "addMoreData": [], "columnData": [] };
          let obChldjColAddMr = [];
          let adMrArr = this.schemeForm.controls[key] as FormArray;
          let AddMoreCount = 0;
          let adMrClmNmame = '';
          // console.log(adMrArr.controls.length); return;
          for (let adMrCtrlRw = 0; adMrCtrlRw < adMrArr.controls.length; ++adMrCtrlRw) {
           
            let adMrClArr = (adMrArr.controls[adMrCtrlRw]) as FormArray;
            let objCtrlKey = Object.keys(adMrClArr.controls);
            let obChldjAddMr = [];
            AddMoreCount++;
            // console.log(adMrClArr); return;
            for (let adMrCtrlCl = 0; adMrCtrlCl < objCtrlKey.length; ++adMrCtrlCl) {
              let adMrCTrlVal = (<HTMLInputElement>document.getElementById(key + '_' + adMrCtrlRw + '_' + adMrCtrlCl)).value;
              let adMrCTrlType = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnType;
              let adMrClmNm = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnName;
              adMrClmNmame = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnName;
              let adMrClmCls = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnId;
              let columnCls = this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl].columnCls;
              if(columnCls =='cls_group_enterprise'){
                classCheckFlag = true;
              }
              // for validation
              // console.log(columnCls);
              if(addmoreFlagDep==1){
                let adMrValParam = { "dynDataObj": this.controlTypeArr[key].jsnControlArray[0].ctrlAddMore[adMrCtrlCl], "ctrlVal": adMrCTrlVal, "drftSts": this.isDraft, "dispNnSts": dispNnSts, "ctrlType": ctrlType };
                if (!this.vldChkLst.dynCtrlVal(adMrValParam, this.el)) {
                  valSts = false;
                  this.el.nativeElement.querySelector('.' + adMrClmCls).focus();
                  return false;
                }
              
                else {
                  let arrAddMr = {
                    "elementId": key + '_' + adMrCtrlRw + '_' + adMrCtrlCl,
                    "elementVal": adMrCTrlVal,
                    "colName": adMrClmNm,
                    "colType": adMrCTrlType,
                    "slno": (adMrCtrlCl + 1)
                  };
                  obChldjAddMr.push(arrAddMr);
                  if (adMrCtrlRw == 0) {
                    let arrAddColMr = {
                      "colName": adMrClmNm,
                      "colType": adMrCTrlType,
                      "slno": (adMrCtrlCl + 1)
                    };
                    obChldjColAddMr.push(arrAddColMr);
                  }
                }
              }
              // end for validation    
              // adMrClArr.clear();                  
            }
            //  adMrArr.clear(); 
            // console.log(obChldjAddMr); return;
            (objAddMr.addMoreData).push(obChldjAddMr);
            // console.log(objAddMr); return;
            // return false;
          }
        
          // if(AddMoreCount<2 && this.isDraft==false && addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate && classCheckFlag){
          //   Swal.fire({
          //     icon: 'error',
          //     text: ' Minimum 2 group member details required'
          //   });
          //   return false;
          // }else if(AddMoreCount>20 && this.isDraft==false && addmoreFlagDep==1 && this.intdirectorate==environment.APICOL_Directorate && classCheckFlag){
          //   Swal.fire({
          //     icon: 'error',
          //     text: 'Maximum 20 group member details required'
          //   });
          //   return false;
          // }
          objAddMr.columnData = obChldjColAddMr;
          dispNnSts = false;
          elmVal = JSON.stringify(objAddMr);
          // console.log(elmVal); return;
        }
        else {
          dispNnSts = this.el.nativeElement.querySelector('.clsDiv_' + key).classList.contains('d-none');
        }
        let ctrlDtls = '';
        let ctrlValParam = { "dynDataObj": this.controlTypeArr[key], "ctrlVal": elmVal, "drftSts": this.isDraft, "dispNnSts": dispNnSts, "ctrlType": ctrlType };
       
        let ctrlClass = this.controlTypeArr[key]['jsnControlArray'][0]['ctrlClass'];
        // if (this.schemeForm.status === 'VALID') {
          // if (!this.vldChkLst.dynCtrlVal(ctrlValParam, this.el)) {
            
          //   valSts = false;
          //   this.el.nativeElement.querySelector('.cls_' + key).focus();
          //   break;
          // }if(ctrlClass=='valid_aadhar' && this.isDraft==false && !this.vldChkLst.validAadhar(elmVal) ){
          //   valSts = false;
          //   Swal.fire({
          //     icon: 'error',
          //     text: 'Please Enter a Valid '+lblName
          //   });
          //   return false;
          // }
          // else {
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

          // }
        // }
      }
    }
    // console.log(ctrlParam); return;
    if (valSts) {
      let schemeParam = {
        "profileId": this.applicantId,
        "schemeId": this.schemeId,
        "branchId": this.branchId,
        "directorateId": this.directorateId,
        "sectorId": this.sectorId,
        "applctnId":this.applctnId,
        "dynCtrlParm": ctrlParam,
        "drftSts": this.isDraft,
        "districtId": this.districtId,
        "blockId": this.blockId,
        "gpId": this.gpId,
        "vlgId": this.villageId,
        "connectionCat":'',
        "connectionType":'',  
        "usageType": '',
        "holderMob": '',
        "holderName": '',
        "holderGender": '',
        "holderGName": '',
        "holderRelation": '',
        "holderAddress": '',
        "holderCat":'',
        "access_token":'',
        "connectionCity":'',
        "locality":'',
        "ward":'',
        "BankId":this.BankId,
        "loanAmount": this.loanAmount     
      }

      if(this.schemeId==environment.sujogPortal){        
        let connectionCity=(document.getElementById('cityId') as HTMLTextAreaElement).value;
        let label=document.getElementsByClassName("sujog_connCat");
        let labelId = label[0].getAttribute('id');
        let connectionCat=(document.getElementById(labelId) as HTMLTextAreaElement).value;

        let label2=document.getElementsByClassName("sujog_connType");
        let labelId2 = label2[0].getAttribute('id');
        let connectionType=(document.getElementById(labelId2) as HTMLTextAreaElement).value;

        let label3=document.getElementsByClassName("sujog_usageType");
        let labelId3 = label3[0].getAttribute('id');
        let usageType=(document.getElementById(labelId3) as HTMLTextAreaElement).value;

        let label4=document.getElementsByClassName("sujog_holderMob");
        let labelId4 = label4[0].getAttribute('id');
        let holderMob=(document.getElementById(labelId4) as HTMLTextAreaElement).value;

        let label5=document.getElementsByClassName("sujog_holderName");
        let labelId5 = label5[0].getAttribute('id');
        let holderName=(document.getElementById(labelId5) as HTMLTextAreaElement).value;

        let label6=document.getElementsByClassName("sujog_holderGender");
        let labelId6 = label6[0].getAttribute('id');
        let holderGender=(document.getElementById(labelId6) as HTMLTextAreaElement).value;

        let label7=document.getElementsByClassName("sujog_holderGName");
        let labelId7 = label7[0].getAttribute('id');
        let holderGName=(document.getElementById(labelId7) as HTMLTextAreaElement).value;

        let label8=document.getElementsByClassName("sujog_holderRelation");
        let labelId8 = label8[0].getAttribute('id');
        let holderRelation=(document.getElementById(labelId8) as HTMLTextAreaElement).value;

        let label9=document.getElementsByClassName("sujog_holderAddress");
        let labelId9 = label9[0].getAttribute('id');
        let holderAddress=(document.getElementById(labelId9) as HTMLTextAreaElement).value;

        let label10=document.getElementsByClassName("sujog_holderCat");
        let labelId10 = label10[0].getAttribute('id');
        let holderCat=(document.getElementById(labelId10) as HTMLTextAreaElement).value;
        
        let label11=document.getElementsByClassName("sujog_locality");
        let labelId11 = label11[0].getAttribute('id');
        let locality=(document.getElementById(labelId11) as HTMLTextAreaElement).value;

        let label12=document.getElementsByClassName("sujog_ward");
        let labelId12 = label12[0].getAttribute('id');
        let ward=(document.getElementById(labelId12) as HTMLTextAreaElement).value;
        
        schemeParam = {  
          "profileId": this.applicantId,
          "schemeId": this.schemeId,
          "branchId": this.branchId,
          "directorateId": this.directorateId,
          "sectorId": this.sectorId,
          "applctnId":this.applctnId,
          "dynCtrlParm": ctrlParam,
          "drftSts": this.isDraft,
          "districtId": this.districtId,
          "blockId": this.blockId,
          "gpId": this.gpId,
          "vlgId": this.villageId,
          // "vtOfcrId": vtOfcrIdP,         
          "connectionCat": connectionCat,
          "connectionType": connectionType,
          "usageType": usageType,
          "holderMob": holderMob,
          "holderName": holderName,
          "holderGender": holderGender,
          "holderGName": holderGName,
          "holderRelation": holderRelation,
          "holderAddress": holderAddress,
          "holderCat":holderCat,
          "access_token":localStorage.getItem("sujogaccess_token"),  
          "connectionCity":connectionCity,  
          "locality":locality,
          "ward":ward,
          "BankId":this.BankId,
          "loanAmount": this.loanAmount     
      }
    }
      this.loading =true;
      this.objSchmCtrl.schemeApply(schemeParam).subscribe(res => {

        if (res.status == 1) {
          sessionStorage.removeItem('userFilterDistrict');
          sessionStorage.removeItem('userFilterBlock');
          if (this.isDraft) {
            //console.log(res);
            this.applctnId = res.appCtnId;
            let applicationRefNo = res.applicationRefNo;
            let message = '';
            if(applicationRefNo != '')
            message = 'Your reference ID is: '+applicationRefNo;
            Swal.fire({
              icon: 'success',
              html: res.msg+'<br>'+message
            })
            .then(()=> {
              this.router.navigate(['/citizen-portal/dashboard']);
            });
          }
          else {
            this.applctnId = res.appCtnId;
            if (this.docSectnSts) {
              let encAppCtnId = this.encDec.encText((this.schemeId + ':' + res.appCtnId + ':' + this.apprRsmSts+ ':' + this.branchId+ ':' + this.directorateId+ ':' + this.sectorId).toString());
              this.router.navigate(['/citizen-portal/scheme-document', encAppCtnId]);
            }
            else {
              let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':1'+ ':' + this.branchId+ ':' + this.directorateId+ ':' + this.sectorId).toString());
              this.router.navigate(['/citizen-portal/scheme-preview', encAppCtnId]);
            }
          }
        }
        else {
          Swal.fire({
            icon: 'error',
            text: res.msg
          });
        }
        this.loading =false;
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
    let docSecAvl = (this.docSectnSts) ? 1 : 0;
    let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId + ':' + docSecAvl+ ':' + this.branchId+ ':' + this.directorateId+ ':' + this.sectorId).toString());
    this.router.navigate(['/citizen-portal/profile-update', encAppCtnId]);
  }

  keyPressEvt(type: any, evt: any, crtId: any) {

    let sts: any;
    // let dashslashnumber = <HTMLElement> document.querySelector(".dashslashnumber");
    let classname = document.getElementById(crtId).className;
    let classnameArr = classname.split(" ");
    if (classnameArr.indexOf("dashslashnumber") > -1) {
      sts = this.vldChkLst.isDashSlashNumeric(evt);
    } else {
      sts = this.vldChkLst.isAlphaNumeric(evt);
      if (type == 1) {
        sts = this.vldChkLst.isNumberKey(evt);
      }
      if (type == 2) {
        sts = this.vldChkLst.isCharKey(evt);
      }
      if (type == 3) {
        sts = this.vldChkLst.isAlphaNumeric(evt);
      }
      if (type == 4) {
        sts = this.vldChkLst.isDecimal(evt);
      }
    }
    
    

    return sts;
  }
//srichandan start
/*for addmore inplace of id class is comming for that this function will use for only addmore field*/

  keyPressEvent(type: any,contrilType: any, evt: any, crtId: any) {

    let sts: any;
    // let dashslashnumber = <HTMLElement> document.querySelector(".dashslashnumber");
    let classname = crtId;
    let classnameArr = classname.split(" ");
    if (classnameArr.indexOf("dashslashnumber") > -1) {
      sts = this.vldChkLst.isDashSlashNumeric(evt);
    } else {
      sts = this.vldChkLst.isAlphaNumeric(evt);
      if (type == 1) {
        sts = this.vldChkLst.isNumberKey(evt);
      }
      if (type == 2) {
        sts = this.vldChkLst.isCharKey(evt);
      }
      if (type == 3) {
        sts = this.vldChkLst.isAlphaNumeric(evt);
      }
      if (type == 4) {
        sts = this.vldChkLst.isDecimal(evt);
      }
    }
    
    

    return sts;
  }

//srichandan ends

  keyPressEvtMob(type: any, evt: any, crtId: any) {
    let sts: any;

    // let dashslashnumber = <HTMLElement> document.querySelector(".dashslashnumber");
    let classname = document.getElementById(crtId).className;
    let fieldVal = ((<HTMLInputElement>document.getElementById(crtId)).value);
    let classnameArr = classname.split(" ");
    if (classnameArr.indexOf("dashslashnumber") > -1) {
      sts = this.vldChkLst.isDashSlashNumericMob(fieldVal);
    } else {
      sts = this.vldChkLst.isAlphaNumeric(evt);
      if (type == 1) {
        sts = this.vldChkLst.isNumberKeyMob(fieldVal);
      }
      if (type == 2) {
        sts = this.vldChkLst.isCharKeyMob(fieldVal);
      }
      if (type == 3) {
        sts = this.vldChkLst.isAlphaNumericMob(evt);
        //sts = this.vldChkLst.isDecimalMob(fieldVal);
      }
      if (type == 4) {
        sts = this.vldChkLst.isDecimalMob(fieldVal);
      }
    }


   return sts;

  }
  
  keyUpEvt(type: any, evt: any, crtId: any) {
    if (this.isMobile) {
      this.keyPressEvtMob(type, evt, crtId);
    }
    for(let cal in this.jsnFormulaCalculation){
      let calArr = this.jsnFormulaCalculation[cal];
        if(calArr.includes(crtId)){
          let str = '';
            for(let c1 in calArr){
                if(parseInt(c1)%2==0){
                  let v1 = (<HTMLInputElement>document.getElementById(calArr[c1])).value!=''?parseFloat((<HTMLInputElement>document.getElementById(calArr[c1])).value):0;
                  str = str+v1;
                }else{
                  str = str+calArr[c1];
                }
            }
            // New code added by Bindurekha Nayak //
            if(str == 'NaN'){
              (<HTMLInputElement>document.getElementById(cal)).value = (<HTMLInputElement>document.getElementById(calArr)).value;//string value
              this.schemeForm.patchValue({ [cal]: (<HTMLInputElement>document.getElementById(calArr)).value });  
            }else{
              (<HTMLInputElement>document.getElementById(cal)).value = eval(str);//numeric value 
              this.schemeForm.patchValue({ [cal]: eval(str) });
            }
            // End code added by Bindurekha Nayak //
          document.getElementById(cal).setAttribute("readonly","readonly");
          $('#'+ cal).parents('.form-group').find("small").remove();
          $('#'+ cal).parents('.form-group').append('<small class="d-block mt-1">'+this.vldChkLst.price_in_words((<HTMLInputElement>document.getElementById(cal)).value)+'</small>');
        }
    }
    var li = document.getElementById(crtId);
    let cls = li.className;
    if (cls.search("cls_word") > 0) {
      $('#'+ crtId).parents('.form-group').find("small").remove();
      $('#'+ crtId).parents('.form-group').append('<small class="d-block mt-1">'+this.vldChkLst.price_in_words((<HTMLInputElement>document.getElementById(crtId)).value)+'</small>');
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
        let sectnDecStr = this.encDec.decText(sectnEncStr);
        sectnEncStr = this.encDec.encText((sectnDecStr + ':' + this.apprRsmSts).toString());
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
          } else {
            this.isIFSCFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.msg
            });
          }

        },
        error => {
          this.error = error
          this.Banks = [];
          Swal.fire({
            icon: 'error',
            text: 'No Record Found!'
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
  selectIFSC(branchName, ifscCode, int_Min_Account_No, int_Max_Account_No) {
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
    if (document.getElementsByClassName("ifsc_account").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("ifsc_account")[0];
      ifsc_code_field.setAttribute("minlength", int_Min_Account_No);
      ifsc_code_field.setAttribute("maxlength", int_Max_Account_No);

    }
    this.modalService.dismissAll();
  }

  getDistList() {
    this.blockList = [];
    let param = {
      "parentId": 1,
      "subLevelId": 1,
      "processId": this.schemeId
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
  // End Add more dropdown selection for dependent fields
  getBlock(distId :any,parm:any,e){
    let selectdId = e.target.id;
    let classAttr = e.target.attributes.class;    
    let classVal = classAttr.nodeValue;
    if(classVal.includes('cls_selAddmoreDist')){
      let params = {"districtId":distId};
      let war = <HTMLElement> document.getElementById(selectdId).parentNode.nextSibling;
      let wardOPT = war.querySelector('.cls_selAddmoreBlock');
      if(distId>0){
        setTimeout(function () {
          this.block = JSON.parse(localStorage.getItem("BLOCK_SESSION"));
          let filterBlocks = this.block.filter(district => district.districtId == distId);
          wardOPT.innerHTML = '';
          wardOPT.appendChild(new Option('Select', ''));
          filterBlocks.forEach(element => {
            let option = document.createElement("option");
            option.text = element.blockName;
            option.value = element.blockId;
            wardOPT.appendChild(option);
          });
        }, 1000);
      }
    }
  }

  getGp(blockId :any,e){
    let selectdId = e.target.id;
    let classAttr = e.target.attributes.class;    
    let classVal = classAttr.nodeValue;
    if(classVal.includes('cls_selAddmoreBlock')){
      let params = {"blok":blockId};
      let war = <HTMLElement> document.getElementById(selectdId).parentNode.nextSibling;
      let wardOPT = war.querySelector('.cls_selAddmoreGp');
      if(blockId>0){
        setTimeout(function () {
          this.gp = JSON.parse(localStorage.getItem("GP_SESSION"));
          let filterGps = this.gp.filter(block => block.blockId == blockId);
          wardOPT.innerHTML = '';
          wardOPT.appendChild(new Option('Select', ''));
          filterGps.forEach(element => {
            let option = document.createElement("option");
            option.text = element.gpName;
            option.value = element.gpId;
            wardOPT.appendChild(option);
          });
        }, 1000);
      }
    }
  }

  getVillage(gpId :any,e){
    let selectdId = e.target.id;
    let classAttr = e.target.attributes.class;
    
    let classVal = classAttr.nodeValue;
    if(classVal.includes('cls_selAddmoreGp')){
      let params = {"gp":gpId};
      //let wardOPT = <HTMLElement> document.querySelector(".cls_selAddmoreBlock");
      let war = <HTMLElement> document.getElementById(selectdId).parentNode.nextSibling;
      let wardOPT = war.querySelector('.cls_selAddmoreVillage');
      //console.log(war);
      if(gpId>0){
        setTimeout(function () {
          this.village = JSON.parse(localStorage.getItem("VILLAGE_SESSION"));
          let filterVillages = this.village.filter(gp => gp.gpId == gpId);
          wardOPT.innerHTML = '';
          wardOPT.appendChild(new Option('Select', ''));
          filterVillages.forEach(element => {
            let option = document.createElement("option");
            option.text = element.villageName;
            option.value = element.villageId;
            wardOPT.appendChild(option);
          });
        }, 1000);
      }
    }
  }
  // End Add more dropdown selection for dependent fields

  getBlockList(eVlue: any) {
    if (eVlue != '0') {
      let distData = JSON.parse(eVlue);
      let parentId = distData.val;
      let marType = distData.type;
      if (marType == 0) {
        this.marineType = 0;
      }
      else {
        this.marineType = 1;
      }
      let param = {
        "parentId": parentId,
        "subLevelId": 2,
        "processId": this.schemeId
      }
      this.objMstr.grapCalHirarchy(param).subscribe(res => {
        if (res.status == 1) {
          this.blockList = res.result;
          //console.log(this.blockList);
        }
      },
        error => {
          this.blockList = [];
        });
    }
    else {
      this.blockList = [];
    }
  }

  getGpList(eVlue: any) {
    this.vlgList = [];
    let param = {
      "parentId": eVlue,
      "subLevelId": 3,
      "processId": this.schemeId
    }
    this.objMstr.grapCalHirarchy(param).subscribe(res => {
      if (res.status == 1) {
        this.gpList = res.result;
      }
    },
      error => {
        this.gpList = [];
      });
  }

  getVlgList(eVlue: any) {
    if (eVlue > 0) {
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
    }
    else {
      this.vlgList = [];
    }
  }

  getVtOfcrList(eVlue: any) {
    if (this.isServcFlg) {
      let param = {
        "blockId": eVlue
      }
      this.objMstr.getVtOfcrList(param).subscribe(res => {
        if (res.status == 1) {
          this.vtofcrList = res.result;
        }
      },
        error => {
          this.vtofcrList = [];
        });
    }
  }

  // start add/ remove row
  addRow(adMrSctn: any, adMrRow: any, adMrCol: any, adMrArr: any) {
    // for validation
    let valSts = true;
    for (let vrw = 0; vrw <= adMrRow; vrw++) {
      for (let vclm = 0; vclm < adMrCol; vclm++) {
        let adMrCTrlVal = (<HTMLInputElement>document.getElementById(adMrSctn + '_' + vrw + '_' + vclm)).value;
        let adMrClmCls = adMrArr[vclm].columnId;
        let adMrValParam = { "dynDataObj": adMrArr[vclm], "ctrlVal": adMrCTrlVal, "drftSts": this.isDraft, "dispNnSts": false, "ctrlType": 8 };
        if (!this.vldChkLst.dynCtrlVal(adMrValParam, this.el)) {
          valSts = false;
          this.el.nativeElement.querySelector('.' + adMrClmCls).focus();
          break;
        }
      }
    }
    if (valSts) {
      let curObj = this;
      let addMrExObj = this.schemeForm.get(adMrSctn) as FormArray;
      let addMrObj = this.fb.array([]);
      for (let clm = 0; clm < adMrCol; clm++) {
        let addMrVr = adMrSctn + '_' + (Number(adMrRow) + 1) + '_' + clm;
        addMrObj.controls[addMrVr] = new FormControl('');
        let addMrVrColTp = adMrArr[clm]['columnType'];
        let cscdTagArr = { 'tagFieldSts': adMrArr[clm]['isDependent'], 'tagFieldId': adMrArr[clm]['parentId'], 'optionArr': adMrArr[clm]['optionArr'], 'staticDepData': adMrArr[clm]['staticDepData'] };
        this.dynElement[addMrVr] = { "val": '', "ctrlType": addMrVrColTp, "dispTagArr": [], "cscdTagArr": cscdTagArr, "secCtrlType": 8 };
      }
      addMrExObj.push(addMrObj);


      for (let clm = 0; clm < adMrCol; clm++) {
        let addMrVr = adMrSctn + '_' + (Number(adMrRow) + 1) + '_' + clm;
        let addPrvMrVr = adMrSctn + '_' + (Number(adMrRow)) + '_' + clm;
        //start for cascading event functionality
        let cscdTagArr = this.dynElement[addPrvMrVr]["cscdTagArr"];
        if (Object.keys(cscdTagArr).length > 0) {
          let ctrlCdTagSts = cscdTagArr['tagFieldSts'];
          let ctrlCdTagFldId = cscdTagArr['tagFieldId'];
          let ctrlCdTagFldVlArr = cscdTagArr['optionArr'];
          if (ctrlCdTagSts == 1) {
            let ctrlPrntSecId = this.dynElement[addPrvMrVr].secCtrlType;
            if (ctrlPrntSecId == 8) {
              let ctrlCdTagPrntFldVlArr = cscdTagArr['staticDepData'];
              setTimeout(function () {
                curObj.setAddMrCscdEvnt(ctrlCdTagFldId, addMrVr, ctrlCdTagFldVlArr, ctrlCdTagPrntFldVlArr, '');
              }, 0);
            }
          }
        }
        // end for cascading event functionality              
      }
    }


  }
  removeRow(adMrSctn: any, adMrRow: any, e) {
    if (adMrRow > 0) {
      let addMrExObj = this.schemeForm.get(adMrSctn) as FormArray;
      addMrExObj.removeAt(adMrRow);
      let curObj = this;
      setTimeout(function () {
        curObj.getDynamicSelect(e);
      }, 1000);
    }
    else {
      Swal.fire({
        icon: 'error',
        text: '1st row we cant remove it'
      });
    }
  }
  checkClassExist(cls: any) {
    if (cls.search("bhulekh_tahasil") == 0) {
      return false;
    }
    if (cls.search("bhulekh_ror") == 0) {
      return false;
    }

    return true;
  }

  fillTahasil(eVlue: any, ctrlSelVal: any) {
    let myContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
    if (eVlue != '0') {
      let distData = JSON.parse(eVlue);
      let parentId = distData.val;
      let marType = distData.type;
      if (marType == 0) {
        this.marineType = 0;
      }
      else {
        this.marineType = 1;
      }

      // myContainer.innerHTML = '<option value="1">1</option><option value="2">2</option>';
      let param = {
        "parentId": parentId,
        "processId": this.schemeId,
        "ctrlSelVal": ctrlSelVal,
      }
      this.objMstr.grapCalTahasil(param).subscribe(res => {
        // console.log(res);
        let myContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
        if (res.status == 1) {
          myContainer.innerHTML = res.result.optionStr;
        } else {
          myContainer.innerHTML = '<option value="">Select</option>';
        }
      },
        error => {
          myContainer.innerHTML = '<option value="">Select</option>';
        });
    }
    else {
      myContainer.innerHTML = '<option value="">Select</option>';
    }
  }
  getArea() {
    let valSts = true;
    let btContainer = <HTMLElement>document.querySelector(".bhulekh_tahasil");
    let bhulekh_tahasil_id = btContainer.id;
    let bhulekh_tahasil = (<HTMLInputElement>document.getElementById(bhulekh_tahasil_id)).value;
    if (!this.vldChkLst.selectDropdown(bhulekh_tahasil, "Tahasil")) {
      return false
    }


    let rcContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_circle");
    let bhulekh_revenue_circle_id = rcContainer.id;
    let bhulekh_revenue_circle = (<HTMLInputElement>document.getElementById(bhulekh_revenue_circle_id)).value;
    if (!this.vldChkLst.selectDropdown(bhulekh_revenue_circle, "Revenue Circle")) {
      return false
    }


    let rvContainer = <HTMLElement>document.querySelector(".bhulekh_revenue_village");
    let bhulekh_revenue_village_id = rvContainer.id;
    let bhulekh_revenue_village = (<HTMLInputElement>document.getElementById(bhulekh_revenue_village_id)).value;
    if (!this.vldChkLst.selectDropdown(bhulekh_revenue_village, "Revenue Village")) {
      return false
    }

    let knContainer = <HTMLElement>document.querySelector(".bhulekh_khata_no");
    let bhulekh_khata_no_id = knContainer.id;
    let bhulekh_khata_no = (<HTMLInputElement>document.getElementById(bhulekh_khata_no_id)).value;
    if (!this.vldChkLst.blankCheck(bhulekh_khata_no, "Khata No")) {
      return false
    }


    let pnContainer = <HTMLElement>document.querySelector(".bhulekh_plot_no");
    let bhulekh_plot_no_id = pnContainer.id;
    let bhulekh_plot_no = (<HTMLInputElement>document.getElementById(bhulekh_plot_no_id)).value;
    if (!this.vldChkLst.blankCheck(bhulekh_plot_no, "Plot No")) {
      return false
    }

    let param = {
      "bhulekh_tahasil": bhulekh_tahasil,
      "bhulekh_revenue_circle": bhulekh_revenue_circle,
      "bhulekh_revenue_village": bhulekh_revenue_village,
      "bhulekh_khata_no": bhulekh_khata_no,
      "bhulekh_plot_no": bhulekh_plot_no,
      "selVal": 0
    }
    let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
    let bhulekh_area = <HTMLElement>document.querySelector(".bhulekh_area");
    let bhulekh_area_id = bhulekh_area.id;
    let bhulekh_ror_id = bhulekh_ror.id;
    this.objMstr.grapCalBhulekh(param).subscribe(res => {
      let bhulekh_ror = <HTMLElement>document.querySelector(".bhulekh_ror");
      let bhulekh_area = <HTMLElement>document.querySelector(".bhulekh_area");
      let bhulekh_area_id = bhulekh_area.id;
      if (res.result.status == 1) {
        bhulekh_ror.innerHTML = res.result.optionStr;
        //console.log($("#"+bhulekh_ror_id).val());
        (<HTMLInputElement>document.getElementById(bhulekh_area_id)).value = res.result.Area_Acre;
        this.schemeForm.patchValue({ [bhulekh_area_id]: res.result.Area_Acre });
        this.schemeForm.patchValue({ [bhulekh_ror_id]: $("#"+bhulekh_ror_id).val() });
      } else {
        bhulekh_ror.innerHTML = '<option value="">Select</option>';
        (<HTMLInputElement>document.getElementById(bhulekh_area_id)).value = '';
        this.schemeForm.patchValue({ [bhulekh_area_id]: '' });
        Swal.fire({
          icon: 'error',
          text: 'Invalid Land Details'
        });
      }
    },
      error => {
        bhulekh_ror.innerHTML = '<option value="">Select</option>';
        (<HTMLInputElement>document.getElementById(bhulekh_area_id)).value = '';
        this.schemeForm.patchValue({ [bhulekh_area_id]: '' });
        Swal.fire({
          icon: 'error',
          text: 'Invalid Land Details'
        });
      }
    );
  }
  // end add/ remove row
  getLoanIFSC() {
    //this.loantype=1;
    this.loanBanks = [];
    this.ifscLoanForm = new FormGroup({
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

    let params = {
      loantype :1
    };
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
    this.open(this.someLoanModalRef);


  }

  searchLoanIFSC() {
    this.ifscLoanSubmitted = true;
    if (this.ifscLoanForm.invalid) {
      return;
    }
    let params = {
      bankName: this.ifscLoanForm.value.vchBankName,
      distName: this.ifscLoanForm.value.vchDistrictName
    }
    this.apilist.getifscDetails(params)
      .subscribe(
        (data: any) => {
          if (data.status == '1') {
            this.loanBanks = data.result;
            this.isLoanIFSCFlag = true;
          } else {
            this.isLoanIFSCFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.msg
            });
          }

        },
        error => {
          this.error = error
          this.loanBanks = [];
          Swal.fire({
            icon: 'error',
            text: 'No Record Found!'
          });
        }

      );
  }
  get k(): { [key: string]: AbstractControl } {
    return this.ifscLoanForm.controls;
  }

  selectLoanIFSC(Ifsc_Id,branchName, ifscCode, int_Min_Account_No, int_Max_Account_No) {
    let distName = this.ifscLoanForm.value.vchDistrictName;
    let bankName = this.ifscLoanForm.value.vchBankName;
    this.BankId = Ifsc_Id;
    if (document.getElementsByClassName("ifsc_dist").length > 0) {
      let ifsc_dist_field: any = document.getElementsByClassName("ifsc_dist")[0];
      let ifsc_dist_name = ifsc_dist_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_dist_name]: distName });
    }
    if (document.getElementsByClassName("loan_bank_name").length > 0) {
      let ifsc_bank_field: any = document.getElementsByClassName("loan_bank_name")[0];
      let ifsc_bank_name = ifsc_bank_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_bank_name]: bankName });
    }
    if (document.getElementsByClassName("loan_bank_branch").length > 0) {
      let ifsc_branch_field: any = document.getElementsByClassName("loan_bank_branch")[0];
      let ifsc_branch_name = ifsc_branch_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_branch_name]: branchName });
    }
    if (document.getElementsByClassName("loan_bank_ifsc").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("loan_bank_ifsc")[0];
      let ifsc_code_name = ifsc_code_field.getAttribute('name')
      this.schemeForm.patchValue({ [ifsc_code_name]: ifscCode });
    }
    if (document.getElementsByClassName("loan_bank_account").length > 0) {
      let ifsc_code_field: any = document.getElementsByClassName("loan_bank_account")[0];
      ifsc_code_field.setAttribute("minlength", int_Min_Account_No);
      ifsc_code_field.setAttribute("maxlength", int_Max_Account_No);

    }
    this.modalService.dismissAll();
  }

  verifySujog(){
    //let cityId=document.getElementById('cityId');
    let cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;
    if (!this.vldChkLst.blankCheck(cityId, "City")) {
      return false
    }
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let applicantName = farmerInfo.USER_FULL_NAME;
    let applicantMob = farmerInfo.USER_MOBILE;
    let regStatus=this.regStatus;
    if(regStatus==0){
      let apiParam = {
        "name":applicantName,
        "permanentCity":cityId,
        "mobileNumber":applicantMob
      } 
      this.objProf.getRedirectSujogRegAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          let resStatus=res.result.resultInfo;
          
          if(resStatus==true){
            this.emailNotification()                 
              
          }else{
            Swal.fire({
              icon: 'error',
              text: resStatus
            });
            this.loading = false;
            
          }
        }
      });
    }else{
      let apiParam = {
        "mobileNo":applicantMob
      } 
      this.objProf.getRedirectSujogLoginAPI(apiParam).subscribe(res => {
        if (res.status == 1) {
          let resStatus=res.result.resultInfo;
          //console.log(res);
          
          if(resStatus==true){
            this.emailNotification1()                   
              
          }else{
            Swal.fire({
              icon: 'error',
              text: resStatus
            });
            this.loading = false;
            
          }
        }
      });
    }
  }

  async emailNotification(){
    const { value: text } = await Swal.fire({                          
    //position: 'bottom-end',                          
    title: 'Enter OTP',                          
    input: 'text', 
    inputAttributes: {
      id: "txtOTP",
      name:"txtOTP"
    },                  
    inputPlaceholder: 'Enter The text'                          
    })  
    //cityId,mobileNoP                     
    if (text) {                          
    //Swal.fire(`Entered Text: ${text}`)  
    let otpReference=(`${text}`);
    // console.log(otpReference);
    let cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let applicantName = farmerInfo.USER_FULL_NAME;
    let applicantMob = farmerInfo.USER_MOBILE;
    let mobileNoS = applicantMob; 
    let appName = applicantName; 
    let cityName = cityId; 
    let scheme=this.schemeId;
    let apiParam={
      "otpReference":otpReference,
      "mobileNo":mobileNoS,
      "name":appName,
      "permanentCity":cityName,
      "schemeId":scheme
    }
    this.objProf.getRedirectSujogRegOTPAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        let resStatus=res.result.resultInfo.resStatus;        
        let access_token=res.result.resultInfo.access_token;
        localStorage.setItem("sujogaccess_token", access_token);
        //console.log(localStorage.getItem("sujogaccess_token"));
        
        if(resStatus==true){
          this.verifySts=1;
          this.verifyFinalSubmit=0;
          //this.emailNotification1() 
          let apiParam = {
            "cityId":cityName,
            "acces_token":localStorage.getItem("sujogaccess_token")
          } 
          this.objProf.getRedirectLocationAPI(apiParam).subscribe(res => {
            let localityOPT = <HTMLElement> document.querySelector(".sujog_locality");
            if (res.status == 1) {
              let localityList=res.result.resultInfo;
              localityOPT.innerHTML = localityList;
            }
          });
          this.objProf.getRedirectWardAPI(apiParam).subscribe(res => {
            let wardOPT = <HTMLElement> document.querySelector(".sujog_ward");
            if (res.status == 1) {
              let wardList=res.result.resultInfo;
              wardOPT.innerHTML = wardList;
            }
          });                       
            
        }else{
          Swal.fire({
            icon: 'error',
            text: resStatus
          });
          this.loading = false;
          
        }
      }
    });

    }     
    else{
      Swal.fire({
        icon: 'error',
        text: '`Please Entered OTP'
      });
      //Swal.fire(`Please Entered OTP`) 
    }                     
  }

  async emailNotification1(){
    const { value: text } = await Swal.fire({                          
    //position: 'bottom-end',                          
    title: 'Enter OTP',                          
    input: 'text', 
    inputAttributes: {
      id: "txtOTP",
      name:"txtOTP"
    },                  
    inputPlaceholder: 'Enter The text'                          
    })  
    //cityId,mobileNoP                     
    if (text) {                          
    //Swal.fire(`Entered Text: ${text}`)  
    let otpReference=(`${text}`);
    let cityId=(document.getElementById('cityId') as HTMLTextAreaElement).value;
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let applicantName = farmerInfo.USER_FULL_NAME;
    let applicantMob = farmerInfo.USER_MOBILE;
    let mobileNoS = applicantMob; 
    let appName = applicantName; 
    let cityName = cityId; 
    let apiParam={
      "otpReference":otpReference,
      "mobileNo":mobileNoS,
      "name":appName,
      "permanentCity":cityName
    }
    this.objProf.getRedirectSujogLoginOTPAPI(apiParam).subscribe(res => {
      if (res.status == 1) {
        let resStatus=res.result.resultInfo.resStatus;        
        let access_token=res.result.resultInfo.access_token;
        localStorage.setItem("sujogaccess_token", access_token);
        //console.log(localStorage.getItem("sujogaccess_token"));
        
        if(resStatus==true){
          this.verifySts=1;
          this.verifyFinalSubmit=0;
            let apiParam = {
              "cityId":cityName,
              "acces_token":localStorage.getItem("sujogaccess_token")
            } 
            this.objProf.getRedirectLocationAPI(apiParam).subscribe(res => {
              let localityOPT = <HTMLElement> document.querySelector(".sujog_locality");
              if (res.status == 1) {
                let localityList=res.result.resultInfo;
                localityOPT.innerHTML = localityList;
              }
            });
            this.objProf.getRedirectWardAPI(apiParam).subscribe(res => {
              let wardOPT = <HTMLElement> document.querySelector(".sujog_ward");
              if (res.status == 1) {
                let wardList=res.result.resultInfo;
                wardOPT.innerHTML = wardList;
              }
            });

        }else{
          Swal.fire({
            icon: 'error',
            text: 'Login Failed'
          });
          this.loading = false;
          
        }
      }
    });

    }     
    else{
      Swal.fire(`Please Entered OTP`) 
        // Swal.showValidationMessage(
        //   `Please Entered OTP`
        // )
      
    }                     
  }

  enableAddMoreDisable(controlName, className) {
    // console.log(className);
    if(typeof className!=='undefined'){
      if (className.includes('bhulekh_readonly') ) {

        return true;
      }
      else {
        return false;
      }
    }
  }

  getBhulekhArea(adRowCtr:any){
    this.isBhulekhLandFlag = false;
    this.bhulekhLandSubmitted = false;
    this.currentRow =adRowCtr;
    let districtIdP = 0;
    let districtIdObj: any = (<HTMLInputElement>document.getElementById('selDistrict')).value;
    if (districtIdObj != '0') {
      districtIdObj = JSON.parse(districtIdObj);
      districtIdP = districtIdObj.val;
    }
    if(districtIdP==0){
      Swal.fire({
        icon: 'error',
        text: 'Select district'
      });
      return false;
    }
   
    // console.log(districtIdP);
    this.bhulekhLands = [];
    this.bhulekhLandForm = new FormGroup({
      'vchBhulekhTahasil': new FormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhRevenueCircle': new FormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhRevenueVillage': new FormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhKhataNo': new FormControl('',
        [
          Validators.required,
        ]
      ),
      'vchBhulekhPlotNo': new FormControl('',
        [
          Validators.required,
        ]
      )
    });

    let params = {
      "parentId": districtIdP
    }
    this.apilist.getTahasil(params).subscribe(res => {

      this.TahasilNames = res.result['tahasilDetails'];
      // console.log(this.TahasilNames);
    },
      error => {
        this.error = error
        this.TahasilNames = []
      }

    );
    this.open(this.someBhulekhModalRef);
    
  }

  get l(): { [key: string]: AbstractControl } {
    return this.bhulekhLandForm.controls;
  }

  getRevenueCircle(eVlue: any) {
    let params = {
      "parentId": eVlue
    }
    this.apilist.getRevenueCircle(params).subscribe(res => {
      this.RevenueCircleNames = res.result['RevenueCircleDetails'];
      // console.log(this.RevenueCircleNames);
    },
      error => {
        this.error = error
        this.RevenueCircleNames = []
      }

    );
  }

  getRevenueVillage(eVlue: any) {
    let params = {
      "parentId": eVlue
    }
    this.apilist.getRevenueVillage(params).subscribe(res => {
      this.RevenueVillageNames = res.result['RevenueVillageDetails'];
    },
      error => {
        this.error = error
        this.RevenueVillageNames = []
      }

    );
  }

  searchBhulekhLand() {
    this.bhulekhLandSubmitted = true;
    if (this.bhulekhLandForm.invalid) {
      return;
    }
    let params = {
      bhulekh_tahasil: this.bhulekhLandForm.value.vchBhulekhTahasil,
      bhulekh_revenue_circle: this.bhulekhLandForm.value.vchBhulekhRevenueCircle,
      bhulekh_revenue_village: this.bhulekhLandForm.value.vchBhulekhRevenueVillage,
      bhulekh_khata_no: this.bhulekhLandForm.value.vchBhulekhKhataNo,
      bhulekh_plot_no: this.bhulekhLandForm.value.vchBhulekhPlotNo,
    }
    this.apilist.searchBhulekhLand(params)
      .subscribe(
        (data: any) => {
          // console.log(data)
          if (data.result.status == '1') {
            this.BhulekhLandInfo= data.result.landInfo;
            this.isBhulekhLandFlag = true;
          } else {
            this.isBhulekhLandFlag = false;
            Swal.fire({
              icon: 'error',
              text: data.result.message
            });
          }

        },
        error => {
          this.isBhulekhLandFlag = false;
          this.error = error
          this.BhulekhLandInfo = [];
          Swal.fire({
            icon: 'error',
            text: 'No Record Found!'
          });
        }

      );
  }
  selectBhulekhLand(BhulekhLandData:any){
    // console.log(BhulekhLandData);
    let CurRow = this.currentRow
    var bhulekh_more_tahasil = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_tahasil').attr('id');
    $("#"+bhulekh_more_tahasil).val(BhulekhLandData.vch_tahsil);
    this.schemeForm.patchValue({ [bhulekh_more_tahasil]:BhulekhLandData.vch_tahsil });

    var bhulekh_more_revenue_circle = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_revenue_circle ').attr('id');
    $("#"+bhulekh_more_revenue_circle).val(BhulekhLandData.vch_revenue_circle);
    this.schemeForm.patchValue({ [bhulekh_more_revenue_circle]:BhulekhLandData.vch_revenue_circle });
    
    var bhulekh_more_revenue_village  = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_revenue_village').attr('id');
    $("#"+bhulekh_more_revenue_village).val(BhulekhLandData.vch_village);
    this.schemeForm.patchValue({ [bhulekh_more_revenue_village]:BhulekhLandData.vch_village });

    var bhulekh_more_khata_no   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_khata_no').attr('id');
    $("#"+bhulekh_more_khata_no).val(BhulekhLandData.khata_no);
    this.schemeForm.patchValue({ [bhulekh_more_khata_no]:BhulekhLandData.khata_no });

    var bhulekh_more_plot_no   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_plot_no').attr('id');
    $("#"+bhulekh_more_plot_no ).val(BhulekhLandData.plot_no);
    this.schemeForm.patchValue({ [bhulekh_more_plot_no]:BhulekhLandData.plot_no});

    var bhulekh_more_area   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_area').attr('id');
    $("#"+bhulekh_more_area).val(BhulekhLandData.Area_Hect);
    this.schemeForm.patchValue({ [bhulekh_more_area]:BhulekhLandData.Area_Hect});

    var bhulekh_more_ror   = $("#btnArea"+CurRow).closest('tr').find('.bhulekh_more_ror').attr('id');
    $("#"+bhulekh_more_ror).val(BhulekhLandData.TenantName);
    this.schemeForm.patchValue({ [bhulekh_more_ror]:BhulekhLandData.TenantName});

    this.modalService.dismissAll();
  }
  loadBasicInfo(){  
    let applicantName = $('.cls_txtApplicantName').val();
    let applicantGender = $('input:radio.cls_rbnGender:checked').val();
    let applicantDob = $('.cls_dteDob').val();
    let applicantMobile = $('.cls_txtMobile').val();
    let applicantEmail = $('.cls_txtEmail').val();
    let applicantAadharNo = $('.cls_txtAadharNo').val();
    let bankName = $('.cls_txtBankName').val();
    let bankBranchName = $('.cls_txtBankBranchName').val();
    let ifscCode = $('.cls_txtIfscCode').val();
    let bankAccNo = $('.cls_bankAccNo').val();
    let bankAccHolderName = $('.cls_txtBankHolderName').val();
    let selCategory = $('.cls_selSocCategory').val();
    let selMaritalStatus = $('.cls_selMaritalStatus').val();
    let applicantAddress = $('.cls_txtCurrentAddress').val();
    let applicantDistrict = $('.cls_selDistrict').val();
    let applicantBlock = $('.cls_selBlock').val();
    let applicantGp = $('.cls_selGp').val();
    let applicantVillage = $('.cls_selVillage').val();
    let selGender = $('.cls_rbnGender').val();
    let applicantPerDistrict = $('.cls_per_selDistrict').val();
    
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    if(applicantName == ''){
      $('.cls_txtApplicantName').val(farmerInfo['USER_FULL_NAME']);
      $('.cls_txtApplicantName').attr('readonly', 'true');
      let applicantName=< HTMLElement > document.querySelector(".cls_txtApplicantName");
      let applicantNameId = applicantName.id;
      this.schemeForm.patchValue({ [applicantNameId]: farmerInfo['USER_FULL_NAME'] });
    }
    //if(applicantGender == '')
    //let gender = farmerInfo['USER_GENDER'];
    //$('.cls_rbn1656313469963_3_4').filter("value=" + gender + "").prop("checked", true);
    if(applicantDob == ''){
      //alert(farmerInfo['USER_DOB']);
      $('.cls_dteDob').val(farmerInfo['USER_DOB']);
      $('.cls_dteDob').attr('readonly', 'true');
      let applicantDob=< HTMLElement > document.querySelector(".cls_dteDob");
      let applicantDobId = applicantDob.id;
      this.schemeForm.patchValue({ [applicantDobId]: farmerInfo['USER_DOB'] });
    }
    if(applicantAadharNo == ''){
      $('.cls_txtAadharNo').val(farmerInfo['USER_AADHAR']);
      let applicantAadharNo=< HTMLElement > document.querySelector(".cls_txtAadharNo");
      let applicantAadharNoId = applicantAadharNo.id;
      this.schemeForm.patchValue({ [applicantAadharNoId]: farmerInfo['USER_AADHAR'] });
    }
    if(applicantMobile == ''){
      $('.cls_txtMobile').val(farmerInfo['USER_MOBILE']);
      $('.cls_txtMobile').attr('readonly', 'true');
      let applicantMobile=< HTMLElement > document.querySelector(".cls_txtMobile");
      let applicantMobileId = applicantMobile.id;
      this.schemeForm.patchValue({ [applicantMobileId]: farmerInfo['USER_MOBILE'] });
    } 
    if(bankName == ''){
      $('.cls_txtBankName').val(farmerInfo['USER_BANK_NAME']);
      let bankName=< HTMLElement > document.querySelector(".cls_txtBankName");
      let bankNameId = bankName.id;
      this.schemeForm.patchValue({ [bankNameId]: farmerInfo['USER_BANK_NAME'] });
    }
    if(bankBranchName == ''){
      $('.cls_txtBankBranchName').val(farmerInfo['USER_BANK_BRANCH']);
      let bankBranchName=< HTMLElement > document.querySelector(".cls_txtBankBranchName");
      let bankBranchNameId = bankBranchName.id;
      this.schemeForm.patchValue({ [bankBranchNameId]: farmerInfo['USER_BANK_BRANCH'] });
    }
    if(ifscCode == ''){
      $('.cls_txtIfscCode').val(farmerInfo['USER_IFSC_CODE']);
      let ifscCode=< HTMLElement > document.querySelector(".cls_txtIfscCode");
      let ifscCodeId = ifscCode.id;
      this.schemeForm.patchValue({ [ifscCodeId]: farmerInfo['USER_IFSC_CODE'] });
    }
    if(bankAccNo == ''){
      $('.cls_bankAccNo').val(farmerInfo['USER_BANK_ACC_NO']);
      let bankAccNo=< HTMLElement > document.querySelector(".cls_bankAccNo");
      let bankAccNoId = bankAccNo.id;
      this.schemeForm.patchValue({ [bankAccNoId]: farmerInfo['USER_BANK_ACC_NO'] });
    }
    if(bankAccHolderName == ''){
      $('.cls_txtBankHolderName').val(farmerInfo['USER_BANK_ACC_HOLDER_NAME']);
      let bankAccHolderName=< HTMLElement > document.querySelector(".cls_txtBankHolderName");
      let bankAccHolderNameId = bankAccHolderName.id;
      this.schemeForm.patchValue({ [bankAccHolderNameId]: farmerInfo['USER_BANK_ACC_HOLDER_NAME'] });
    }
    if(selCategory == ''){
      let selCat = '';
      if(farmerInfo['USER_CATEGORY'] == 1)
        selCat = 'GEN';
      else if(farmerInfo['USER_CATEGORY'] == 2)
        selCat = 'OBC';
      else if(farmerInfo['USER_CATEGORY'] == 3)
        selCat = 'SC';
      else if(farmerInfo['USER_CATEGORY'] == 4)
        selCat = 'ST';
      $('.cls_selSocCategory').val(selCat);
      let selCategoryName=< HTMLElement > document.querySelector(".cls_selSocCategory");
      let selCategoryNameId = selCategoryName.id;
      this.schemeForm.patchValue({ [selCategoryNameId]: selCat }); 
    }
    if(selGender == ''){
      let selGen = '';
      if(farmerInfo['USER_GENDER'] == 'M')
        selGen = 'Male';
      else if(farmerInfo['USER_GENDER'] == 'F')
        selGen = 'Female';
      else if(farmerInfo['USER_GENDER'] == 'O')
        selGen = 'Other';
      $('.cls_rbnGender').val(selGen);
      let selGenderName=< HTMLElement > document.querySelector(".cls_rbnGender");
      let selGenderNameId = selGenderName.id;
      this.schemeForm.patchValue({ [selGenderNameId]: selGen }); 
    }
    if(selMaritalStatus == ''){
      let selMarSta = '';
      if(farmerInfo['USER_MARITAL_STATUS'] == 1)
        selMarSta = 'Unmarried';
      else if(farmerInfo['USER_MARITAL_STATUS'] == 2)
        selMarSta = 'Married';
      else if(farmerInfo['USER_MARITAL_STATUS'] == 3)
        selMarSta = 'Widowed';
      else if(farmerInfo['USER_MARITAL_STATUS'] == 4)
        selMarSta = 'Divorced';
      $('.cls_selMaritalStatus').val(selMarSta);
      let selMaritalStatus=< HTMLElement > document.querySelector(".cls_selMaritalStatus");
      let selMaritalStatusId = selMaritalStatus.id;
      this.schemeForm.patchValue({ [selMaritalStatusId]: selMarSta }); 
    }
    if(applicantAddress == ''){
      $('.cls_txtCurrentAddress').val(farmerInfo['USER_ADDRESS']);
      let address=< HTMLElement > document.querySelector(".cls_txtCurrentAddress");
      let addressId = address.id;
      this.schemeForm.patchValue({ [addressId]: farmerInfo['USER_ADDRESS'] });
    }
    if(applicantDistrict == ''){
      //console.log(farmerInfo['USER_DISTRICT_ID']);
      $('.cls_selDistrict').val(farmerInfo['USER_DISTRICT_ID']);
      let selDistrict=< HTMLElement > document.querySelector(".cls_selDistrict");
      let selDistrictId = selDistrict.id;
      this.schemeForm.patchValue({ [selDistrictId]: farmerInfo['USER_DISTRICT_ID'] });
    }
    if(applicantPerDistrict == ''){
      $('.cls_per_selDistrict').val(farmerInfo['USER_DISTRICT_ID']);
      let selDistrict=< HTMLElement > document.querySelector(".cls_per_selDistrict");
      let selDistrictId = selDistrict.id;
      this.schemeForm.patchValue({ [selDistrictId]: farmerInfo['USER_DISTRICT_ID'] });
    }
    // if(applicantBlock == ''){
    //   $('.cls_selBlock').val(farmerInfo['USER_BLOCK_ID']);
    //   let selBlock=< HTMLElement > document.querySelector(".cls_selBlock");
    //   let selBlockId = selBlock.id;
    //   this.schemeForm.patchValue({ [selBlockId]: farmerInfo['USER_BLOCK_ID'] }); 
    // }
    // if(applicantGp == ''){
    //   $('.cls_selGp').val(farmerInfo['USER_GP_ID']);
    //   let selGp=< HTMLElement > document.querySelector(".cls_selGp");
    //   let selGpId = selGp.id;
    //   this.schemeForm.patchValue({ [selGpId]: farmerInfo['USER_GP_ID'] }); 
    // }
    // if(applicantVillage == ''){
    //   $('.cls_selVillage').val(farmerInfo['USER_VILLAGE_ID']);
    //   let selVillage=< HTMLElement > document.querySelector(".cls_selVillage");
    //   let selVillageId = selVillage.id;
    //   this.schemeForm.patchValue({ [selVillageId]: farmerInfo['USER_VILLAGE_ID'] }); 
    // }
  }

  fillBlock(){
    
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let applicantBlock = $('.cls_selBlock').val();
    //console.log(applicantBlock);

    if(applicantBlock == 0 || applicantBlock == ''){
      //console.log(applicantBlock+'//');
      //console.log(farmerInfo['USER_BLOCK_ID']);
      $('.cls_selBlock').val(farmerInfo['USER_BLOCK_ID']);
      let selBlock= < HTMLElement > document.querySelector(".cls_selBlock");
      let selBlockId = selBlock.id;
      this.schemeForm.patchValue({ [selBlockId]: farmerInfo['USER_BLOCK_ID'] }); 
    }
    let applicantGp = $('.cls_selGp').val();
    if(applicantGp == '' || applicantGp == 0){
      $('.cls_selGp').val(farmerInfo['USER_GP_ID']);
      let selGp=< HTMLElement > document.querySelector(".cls_selGp");
      let selGpId = selGp.id;
      this.schemeForm.patchValue({ [selGpId]: farmerInfo['USER_GP_ID'] }); 
    }
    let applicantVillage = $('.cls_selVillage').val();
    if(applicantVillage == '' || applicantVillage == 0){
      $('.cls_selVillage').val(farmerInfo['USER_VILLAGE_ID']);
      let selVillage=< HTMLElement > document.querySelector(".cls_selVillage");
      let selVillageId = selVillage.id;
      this.schemeForm.patchValue({ [selVillageId]: farmerInfo['USER_VILLAGE_ID'] }); 
    }
    let applicantPerBlock = $('.cls_per_selBlock').val();
    if(applicantPerBlock == 0 || applicantPerBlock == ''){
      $('.cls_per_selBlock').val(farmerInfo['USER_BLOCK_ID']);
      let selBlock= < HTMLElement > document.querySelector(".cls_per_selBlock");
      let selBlockId = selBlock.id;
      this.schemeForm.patchValue({ [selBlockId]: farmerInfo['USER_BLOCK_ID'] }); 
    }
    let applicantPerGp = $('.cls_per_selGp').val();
    if(applicantPerGp == '' || applicantPerGp == 0){
      $('.cls_per_selGp').val(farmerInfo['USER_GP_ID']);
      let selGp=< HTMLElement > document.querySelector(".cls_per_selGp");
      let selGpId = selGp.id;
     this.schemeForm.patchValue({ [selGpId]: farmerInfo['USER_GP_ID'] }); 
    }
    let applicantPerVillage = $('.cls_per_selVillage').val();
    if(applicantPerVillage == '' || applicantPerVillage == 0){
      $('.cls_per_selVillage').val(farmerInfo['USER_VILLAGE_ID']);
      let selVillage=< HTMLElement > document.querySelector(".cls_per_selVillage");
      let selVillageId = selVillage.id;
      this.schemeForm.patchValue({ [selVillageId]: farmerInfo['USER_VILLAGE_ID'] }); 
    }
  }
  getDynamicSelect(e){
    
    let classAttr = e.target.attributes.class;
    
    let classVal = classAttr.nodeValue;

    if(classVal.includes('cls_total_income') || classVal.includes('removeAddMore')){
      let sum = 0;
      $('.cls_total_income').each(function(){ 
        let data:any = $($(this)).val();
        if($.isNumeric(data)){
          sum += parseFloat(data);
        }
      });
      let txtIncome=< HTMLElement > document.querySelector(".cls_all_income");
      let txtIncomeId = txtIncome.id;
      this.schemeForm.patchValue({ [txtIncomeId]: sum });
    }
    if(classVal.includes('cls_total_income1') || classVal.includes('removeAddMore')){
      let sum = 0;
      $('.cls_total_income1').each(function(){ 
        let data:any = $($(this)).val();
        if($.isNumeric(data)){
          sum += parseFloat(data);
        }
      });
      let txtIncome=< HTMLElement > document.querySelector(".cls_all_income1");
      let txtIncomeId = txtIncome.id;
      this.schemeForm.patchValue({ [txtIncomeId]: sum });
    }
    if(classVal.includes('cls_total_income2') || classVal.includes('removeAddMore')){
      let sum = 0;
      $('.cls_total_income2').each(function(){ 
        let data:any = $($(this)).val();
        if($.isNumeric(data)){
          sum += parseFloat(data);
        }
      });
      let txtIncome=< HTMLElement > document.querySelector(".cls_all_income2");
      let txtIncomeId = txtIncome.id;
      this.schemeForm.patchValue({ [txtIncomeId]: sum });
    }
    if(classVal.includes('cls_total_income3') || classVal.includes('removeAddMore')){
      let sum = 0;
      $('.cls_total_income3').each(function(){ 
        let data:any = $($(this)).val();
        if($.isNumeric(data)){
          sum += parseFloat(data);
        }
      });
      let txtIncome=< HTMLElement > document.querySelector(".cls_all_income3");
      let txtIncomeId = txtIncome.id;
      this.schemeForm.patchValue({ [txtIncomeId]: sum });
    }
    if(classVal.includes('cls_total_income4') || classVal.includes('removeAddMore')){
      let sum = 0;
      $('.cls_total_income4').each(function(){ 
        let data:any = $($(this)).val();
        if($.isNumeric(data)){
          sum += parseFloat(data);
        }
      });
      let txtIncome=< HTMLElement > document.querySelector(".cls_all_income4");
      let txtIncomeId = txtIncome.id;
      this.schemeForm.patchValue({ [txtIncomeId]: sum });
    }
    if(classVal.includes('cls_total_income5') || classVal.includes('removeAddMore')){
      let sum = 0;
      $('.cls_total_income5').each(function(){ 
        let data:any = $($(this)).val();
        if($.isNumeric(data)){
          sum += parseFloat(data);
        }
      });
      let txtIncome=< HTMLElement > document.querySelector(".cls_all_income5");
      let txtIncomeId = txtIncome.id;
      this.schemeForm.patchValue({ [txtIncomeId]: sum });
    }
  }
}
