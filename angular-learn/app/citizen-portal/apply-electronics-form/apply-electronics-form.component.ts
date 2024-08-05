import { Component, Renderer2, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { NgbModal, NgbTooltip, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';
import { CitizenMasterService } from '../../citizen-portal/service-api/citizen-master.service';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { WebcommonservicesService } from 'src/app/webcommonservices.service';
import { IrmsDetailsService } from '../service-api/irms-details-service';

declare var require: any
const FileSaver = require('file-saver');
interface FinancialYear {
  year: string;
  quarters: string[];
}

@Component({
  selector: 'app-apply-electronics-form',
  templateUrl: './apply-electronics-form.component.html',
  styleUrls: ['./apply-electronics-form.component.css', './apply-electronics-form.component.scss']
})

export class ApplyElectronicsFormComponent implements OnInit {
  matchingYears:any=[];
  totalPreviousAmount:any =0;
  loginSts: any;
  public innerWidth: any;
  farmerInfo: any;
  arrSelectedCheckbox: any[] = [];
  processId: any = 0;
  dynamicCtrlDetails: any = [];
  dynamicCtrlDetKeys: any = [];
  ctrlarray: any;
  currSecTabKey: any = 0;
  currSecId: any = 0;
  onlineServiceId: any = 0;
  formName: any = '';
  arralldynVal: any[] = [];
  arrallCascadingDetails: any[] = [];
  arrallStaticDependtDetails: any[] = [];
  parentDetVal: any[] = [];
  prevdipStatus: any = 'd-none';
  editor: any = '';
  // ckEdtorCls = '';
  ckEdtorCls=environment.ckEdiorClass;
  arrckEdtorVal: any[] = [];
  arrUploadedFiles: any[] = [];
  arrDeletedUploadedFiles: any = [];
  secDisable: any = true;
  arrCalcFields: any[] = [];
  arrAddmoreDetails: any[] = [];
  arrAddmoreFilledData: any[] = [];
  arrAddmoreElemntKeys: any[] = [];
  tempurl = environment.tempUrl;
  arrAddMoreEditData: any = [];
  totalInterstClaimAmount: any = 0;
  editIndex: any = '';
  storagePath: any = environment.serviceURL + 'storage/app/uploads/';
  btnSaveNextDisableStatus = false; // if false then btn is enabled else disabled
  private _location: any;
  loading = false;
  intFormId: any = '';
  intProductId: number = 0;
  objFinancialDetails: any = []; //created by bibhuti bhusan sahoo on 13th Apr 2023
  booleanFinancialStatus = false; //created by bibhuti bhusan sahoo on 13th Apr 2023
  arrCascadingBindDependtDetails: any[] = [];
  loadDynBindAllData: any = [];
  loadDyndata = 0;
   employfinDetList: any = [];
  arr: any = [];
  intTotalEmpCount: any = 0;
  vchMdName: any = '';
  // Added by Rohit for column wise add more on 31-10-23
  arrAddMoreColumnData:any[]=[];
  arrTabularAddMoreTotData:any[]=[];
  arrColumnAddMoreTotData:any[]=[];
  arrAddmoreElemntColumnKeys: any[] = [];
  addMoreMergedColumns:any=[];
  addMoreAllMergedColumns:any=[];
  // End of column wise add more on 31-10-23

  otherAssetTotalAmount:any = 0;
  buildingCivilAmount:any = 0;
  equipmentAmount:any = 0;
  invSubTotalAssAmount:any = 0;
  certificationAmount:any = 0;
  iseCapitalExpAmount: any = 0;
  ivsSubBuildingAmount: any = 0;
  ivsSubPlantAmount: any = 0;
  ivsSubRefAmount: any = 0;
  ivsSubRndAmount: any = 0;
  ivsSubUtilityAmount: any = 0;
  ivsSubTransAmount: any = 0;

  previousClaimedSubsidy: any = [];
  previousClaimedSubsidyDet:any=[];
  totalAmount:any=0;
  ptsPrevClaimedAmount: any = 0;
  ptsToatlClaimedAmount: any = 0;
  intNoOfDateField: any = 0;
  booleanPrevClaimStatus: any = true;
  founderPercentValue: any = 0;
  diffMonth: any =0;
  claimEpfEsiAmount:any =0;
  towerDeatilsList: any = [];
  isTowerAvailable: any = 0;
  isCappingValue: number;
  empTotal:any = 0;
  noExpEmp:any = 0;
  claimAmountDet:any =0;
  fciAmount:any = 0;
  countInduBackward:any = 0;
  formEditStatus: any = 0;
  totalSkillGapAmount:any = 0;
  totalIntersetInvestment: number = 0;
  totalIntersetRePayment: number = 0;
  calculatedRepaymentAmount: number = 0;
  repaymentClaimAmount: number = 0;
  finalRepayementClaimAmount: number = 0;
  periodOfSubsidy: number = 0;
  amountAddMoreDet:any = 0;
  amountAddMore:any = 0;
  totalSkillAmountAddMore:any = 0;
  totalSkillAmount:any = 0;
  intersetSubsidyeditAssetAmount: any = 0;
  financialYearsWithQuarters: FinancialYear[] = [];
  claimLimit: any = 0;
  @ViewChild('formFile', { static: false })
  formFile: ElementRef;
   
  @ViewChild('financialDetailsModal') financialDetailsModalRef: ElementRef;
  @ViewChild('previousClaimModal') previousClaimModalRef: ElementRef;
  @ViewChild('towerDetailsModal') towerDetailsModalRef: ElementRef;
  userId: any;
  isAddMoreCtrlIds: any = [];
  constructor(public authService: CitizenAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    public vldChkLst: ValidatorchklistService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public masterService: CitizenMasterService,
    private objProf: CitizenProfileService,
    private objSchm: CitizenSchemeService,
    private el: ElementRef,
    private WebCommonService: WebcommonservicesService,
    public IrmsDetailsService: IrmsDetailsService,
    private renderer: Renderer2,
  ) {

    translate.addLangs(['English', 'Odia']);
    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translate.use(browserLang.match(/English|Odia/) ? browserLang : 'English');
    } else {
      localStorage.setItem('locale', 'English');
      translate.setDefaultLang('English');
    }
  }
  ngOnInit(): void {
    this.secDisable = false;
    let schemeArr: any = [];
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    if (encSchemeId != "") {
      let schemeStr = this.encDec.decText(encSchemeId);
      schemeArr = schemeStr.split(':');
      this.processId = schemeArr[0];
      this.onlineServiceId = schemeArr[1];
      this.currSecId = schemeArr[2];
      this.intProductId = schemeArr[3]
      this.formEditStatus = schemeArr[4];
    }
    this.intTotalEmpCount = (sessionStorage.getItem('totalEmpCount')) ? sessionStorage.getItem('totalEmpCount') : 0;
    this.vchMdName = (sessionStorage.getItem('mdName')) ? sessionStorage.getItem('mdName') : '';
    let dynSchmCtrlParms = {
      'intProcessId': this.processId,
      'intOnlineServiceId': this.onlineServiceId,
      'sectionId': this.currSecId,
      'intProductId': this.intProductId
    }
    if (this.intProductId != 0) {
      this.loading = true;
      this.masterService.getTaggedFormId(dynSchmCtrlParms).subscribe(res => {
       if (res.result?.intFormId) {
          this.intFormId = res.result.intFormId;
          this.processId = res.result.intFormId;
          dynSchmCtrlParms.intProcessId = res.result.intFormId;
          this.loadDynamicCtrls(dynSchmCtrlParms);
        }else{
          this.intFormId = 'no-data';
          this.loading = false;
        }
      });
    }
    this.objFinancialDetails = (JSON.parse(sessionStorage.getItem('financialDetails')));
    if(this.objFinancialDetails != null)
    this.booleanFinancialStatus = (this.objFinancialDetails.length > 0) ? true : false;
    let intProdId = sessionStorage.getItem('REGD_ID');
    this.getOperationLocationDetails(intProdId);
    //this.getPrevClaimedExpenses();
    let sesInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.userId = sesInfo.USER_ID;
  }

  setHtmlData(data: any, idx: any) {
    return this.encDec.decodeHtml(data);
  }
  loadDynamicCtrls(dynSchmCtrlParms: any) {
      /**
       ** Description: This is used for future date validation
        ** Created By: Bindurekha Nayak
        ** Created On: 26th May 2023
        **/
      setTimeout(() => {
        this.validateDate();
      }, 1500);
      /*End of Future Date Validation */
    let IsTotalCapitalElement = (<HTMLInputElement>document.getElementsByClassName('cls_is_totalInvestment')[0]);
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
      if (res.status == 200) {
        this.dynamicCtrlDetails = res.result;
        this.formName = res.formName;
        this.dynamicCtrlDetKeys = Object.keys(this.dynamicCtrlDetails).sort();

        let vchAssetAmountSum = 0;
        const addMoreValueDetails = res.result.sec_0.addMoreValueDetails;
        for (const key in addMoreValueDetails) {
          const addMoreDataValue = addMoreValueDetails[key].addMoreDataValue;
          if (Array.isArray(addMoreDataValue)) {
            addMoreDataValue.forEach(item => {
              if (item?.int_amount) {
                vchAssetAmountSum += parseFloat(item.int_amount);
                this.intersetSubsidyeditAssetAmount = vchAssetAmountSum;
                //console.log("asset",this.intersetSubsidyeditAssetAmount);
              }
              
            });
          }
        }

      
        

        setTimeout(() => {
          this.loadDynamicValue();
        }, 2000);
        setTimeout(() => {
          this.loadDependCtrls();
          this.setCalcFields();
          if (this.onlineServiceId > 0) {
            let dynBindType: any = document.querySelectorAll("[data-dynbindflag=true]");

            for (let dynbndtype of dynBindType) {
              let dynCtrlId = dynbndtype.getAttribute('data-id');
              let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
              let dynbindtbl = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName;
              let dynbindtxtclmname = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
              let dynbinddependflag = dynbndtype.getAttribute('data-dynbinddependflag');
              let dynbindvalclmn = this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;
              if (dynbinddependflag == 'true') {
                let parms = {
                  'tableName': dynbindtbl,
                  'columnName': dynbindtxtclmname + ',' + dynbindvalclmn,
                  'condition': dynbindconditions
                }
                this.dynmaicValApi(parms, dynCtrlId);
              }
            }

            // For Edit Case of Dependend Fields
            let prntIds: any = document.querySelectorAll("[data-parentflag=true]");

            for (let prntDet of prntIds) {
              let dependntTypeID = prntDet.getAttribute('data-typeid');
              if (dependntTypeID == 5) {
                if (prntDet.checked == true) {
                }
              }
              else if (dependntTypeID == 6) {
                if (prntDet.checked == true) {
                  prntDet.click();
                }
              }
              else if (dependntTypeID == 3) {
                var event = new Event('change');
                prntDet.dispatchEvent(event);
              }
            }
          }
          this.loading = false;
        }, 3000);
       if (this.currSecTabKey == 0 && this.currSecId == 0) {
          this.currSecTabKey = this.dynamicCtrlDetKeys[0];

          this.currSecId = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
        }
      }
    });
  }


  storeCasDetials(cascadingDetails: any, id: any) {
    this.arrallCascadingDetails[id] = cascadingDetails;
  }
  curSelectedSec(sectionKey: any) {
    this.currSecTabKey = sectionKey;
    this.currSecId = this.dynamicCtrlDetails[sectionKey]['sectionid']
    let dynSchmCtrlParms = {
      'intProcessId': this.processId,
      'sectionId': this.currSecId,
      'intOnlineServiceId': this.onlineServiceId
    }
    this.loadDynamicCtrls(dynSchmCtrlParms);
  }


  // loadDependCtrls() {
  //   let prntIds: any = document.querySelectorAll("[data-parentflag=true]");
  //   for (let prntDet of prntIds) {
  //     let dependntTypeID = prntDet.getAttribute('data-typeid');
  //     if (dependntTypeID == 6 || dependntTypeID == 5) // For Radio and checkbox
  //     {
  //       let id = prntDet.name;
  //       let chldDetls: any = document.querySelectorAll("[data-dependctrlId=" + id + "]");
  //       prntDet.addEventListener('click', () => {
  //         for (let loopChldDet of chldDetls) {
  //           let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
  //           if (prntDet.value == lopdependval) {
  //             loopChldDet.closest(".dynGridCls").classList.remove('d-none');
  //             loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');
  //             loopChldDet.classList.remove('d-none');
  //             let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
  //             lblEmnt?.classList.remove('d-none');
  //           }else {
  //             loopChldDet.closest(".dynGridCls").classList.add('d-none');
  //             loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');
  //             loopChldDet.classList.remove('d-none');
  //             loopChldDet.classList.add('d-none');
  //             let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
  //             lblEmnt?.classList.add('d-none');
  //             let tpId = loopChldDet.getAttribute('data-typeid');
  //             if (tpId == 2) {
  //               (<HTMLInputElement>document.getElementById(loopChldDet.id)).value = '';
  //             }
  //             else if (tpId == 3) {
  //               (<HTMLInputElement>document.getElementById(loopChldDet.id)).value = '0';
  //             }
  //           }
  //         }
  //       });

  //     }else{ // For Dropdown      
  //       let chldDetls: any = document.querySelectorAll("[data-dependctrlId=" + prntDet.id + "]");
  //       prntDet.addEventListener('change', () => {
  //         this.hideAllChildParent(prntDet, '');
  //         for (let loopChldDet of chldDetls) {

  //           let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
  //           lopdependval = lopdependval.split(',');
  //           if (lopdependval.includes(prntDet.value)) {
  //             if (loopChldDet.getAttribute('data-typeid') == 8) {
  //               loopChldDet.closest(".dynGridCls").classList.remove('d-none');
  //               loopChldDet.classList.remove('d-none');

  //             }else {
  //               loopChldDet.closest(".dynGridCls").classList.remove('d-none');
  //               loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');
  //               loopChldDet.classList.remove('d-none');
  //               if (loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid') == 5) {
  //                 let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
  //                 lblEmnt?.classList.remove('d-none')

  //               }

  //             }
  //             //break;
  //           }
  //         }

  //       });       
  //     }
  //   }
  // }
  //Added by : Arpita || On: 24-jul-24
  loadDependCtrls() {
  
    
    let prntIds: any = document.querySelectorAll('[data-parentflag]');
    
    for (let prntDet of prntIds) {


      let dependntTypeID = prntDet.getAttribute('data-typeid');
    
     
      if (dependntTypeID == 6 || dependntTypeID == 5) {
     
        // For Radio and checkbox
        let id = prntDet.name;

        let chldDetls: any = document.querySelectorAll(
          '[data-dependctrlId=' + id + ']'
        );
        prntDet.addEventListener('click', () => {
          for (let loopChldDet of chldDetls) {
            let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
            lopdependval = lopdependval.split(',');
            if (lopdependval.includes(prntDet.value)) {
              if (prntDet.checked) {
                loopChldDet.closest('.dynGridCls').classList.remove('d-none');
                let loopdynlabel: any = loopChldDet
                  .closest('.dynGridCls')
                  .querySelector('.dynlabel');
                if (loopdynlabel != null) {
                  loopdynlabel.classList.remove('d-none');
                }

                loopChldDet.classList.remove('d-none');
                let lblEmnt = (<HTMLInputElement>(
                  document.getElementById(loopChldDet.id)
                )).nextElementSibling;
                lblEmnt?.classList.remove('d-none');
              } else {
                loopChldDet.closest('.dynGridCls').classList.add('d-none');
                let loopdynlabel: any = loopChldDet
                  .closest('.dynGridCls')
                  .querySelector('.dynlabel');
                if (loopdynlabel != null) {
                  loopdynlabel.classList.remove('d-none');
                }

                loopChldDet
                  .closest('.dynGridCls')
                  .querySelector('.dynlabel')
                  .classList.add('d-none');
                loopChldDet.classList.remove('d-none');
                loopChldDet.classList.add('d-none');
                let lblEmnt = (<HTMLInputElement>(
                  document.getElementById(loopChldDet.id)
                )).nextElementSibling;
                lblEmnt?.classList.add('d-none');
                let tpId = loopChldDet.getAttribute('data-typeid');
                if (tpId == 2) {
                  (<HTMLInputElement>(
                    document.getElementById(loopChldDet.id)
                  )).value = '';
                } else if (tpId == 3) {
                  (<HTMLInputElement>(
                    document.getElementById(loopChldDet.id)
                  )).value = '0';
                } else if (tpId == 4) {
                  let elmle: any = <HTMLInputElement>(
                    document.getElementById(loopChldDet.id)
                  );
                  if (elmle.selectedIndex != undefined) {
                    elmle.options[elmle.selectedIndex].text = '';
                  }
                } else if (tpId == 5 || tpId == 6) {
                  let chckboxClear: any = document.getElementsByName(
                    loopChldDet.id
                  );
                  for (let dynrdobndtype of chckboxClear) {
                    if (dynrdobndtype.checked) {
                      dynrdobndtype.checked = false;
                    }
                  }
                } else {
                  (<HTMLInputElement>(
                    document.getElementById(loopChldDet.id)
                  )).value = '';
                  document
                    .getElementById('fileDownloadDiv_' + loopChldDet.id)
                    ?.querySelector('.downloadbtn')
                    ?.setAttribute('href', '');
                  document
                    .getElementById('fileDownloadDiv_' + loopChldDet.id)
                    ?.classList.add('d-none');
                  delete this.arrUploadedFiles[loopChldDet.id];
                }
              }
            } else if (dependntTypeID == 6) {
              loopChldDet.closest('.dynGridCls').classList.add('d-none');
              loopChldDet
                .closest('.dynGridCls')
                .querySelector('.dynlabel')
                .classList.add('d-none');
              loopChldDet.classList.remove('d-none');
              loopChldDet.classList.add('d-none');
              let lblEmnt = (<HTMLInputElement>(
                document.getElementById(loopChldDet.id)
              )).nextElementSibling;
              lblEmnt?.classList.add('d-none');
              let tpId = loopChldDet.getAttribute('data-typeid');
              if (tpId == 2) {
                (<HTMLInputElement>(
                  document.getElementById(loopChldDet.id)
                )).value = '';
              } else if (tpId == 3) {
                (<HTMLInputElement>(
                  document.getElementById(loopChldDet.id)
                )).value = '0';
              } else if (tpId == 4) {
                let elmle: any = <HTMLInputElement>(
                  document.getElementById(loopChldDet.id)
                );
                if (elmle.selectedIndex != undefined) {
                  elmle.options[elmle.selectedIndex].text = '';
                }
              } else if (tpId == 5 || tpId == 6) {
                let chckboxClear: any = document.getElementsByName(
                  loopChldDet.id
                );
                for (let dynrdobndtype of chckboxClear) {
                  if (dynrdobndtype.checked) {
                    dynrdobndtype.checked = false;
                  }
                }
              } else {
                (<HTMLInputElement>(
                  document.getElementById(loopChldDet.id)
                )).value = '';
                document
                  .getElementById('fileDownloadDiv_' + loopChldDet.id)
                  ?.querySelector('.downloadbtn')
                  ?.setAttribute('href', '');
                document
                  .getElementById('fileDownloadDiv_' + loopChldDet.id)
                  ?.classList.add('d-none');
                delete this.arrUploadedFiles[loopChldDet.id];
              }
            }
          }
        });
      } // For Dropdown
      else {
       

        let chldDetls: any = document.querySelectorAll(
          '[data-dependctrlId=' + prntDet.id + ']'
        );
       
        
        prntDet.addEventListener('change', () => {
      
          this.hideAllChildParent(prntDet, '');
          for (let loopChldDet of chldDetls) {
            let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
            lopdependval = lopdependval.split(',');
            if (lopdependval.includes(prntDet.value)) {
              if (loopChldDet.getAttribute('data-typeid') == 8) {
                loopChldDet.closest('.dynGridCls').classList.remove('d-none');
                loopChldDet.classList.remove('d-none');
              } else if (loopChldDet.getAttribute('data-typeid') == 10) {
                loopChldDet.closest('.dynGridCls').classList.remove('d-none');
                loopChldDet.classList.remove('d-none');
              } else {
                loopChldDet.closest('.dynGridCls').classList.remove('d-none');
                loopChldDet
                  .closest('.dynGridCls')
                  .querySelector('.dynlabel')
                  .classList.remove('d-none');
                loopChldDet.classList.remove('d-none');
                if (
                  loopChldDet.getAttribute('data-typeid') == 6 ||
                  loopChldDet.getAttribute('data-typeid') == 5
                ) {
                  let lblEmnt = (<HTMLInputElement>(
                    document.getElementById(loopChldDet.id)
                  )).nextElementSibling;
                  lblEmnt?.classList.remove('d-none');
                }
              }
              //break;
            }
          }
        });
      }
    }
  }
  loadDynamicValue() {
    let dynBindType: any = document.querySelectorAll("[data-dynbindFlag=true]");

    for (let dynbndtype of dynBindType) {
      let dynCtrlId = dynbndtype.getAttribute('data-id');
      let dynbindconditions = this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
      let dynbindtbl = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName;
      let dynbindtxtclmname = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
      let dynbinddependflag = dynbndtype.getAttribute('data-dynbinddependflag');
      let dynbindvalclmn = this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;
      if (dynbinddependflag == 'false') // if not dependent on parent
      {
        let parms = {
          'tableName': dynbindtbl,
          'columnName': dynbindtxtclmname + ',' + dynbindvalclmn,
          'condition': dynbindconditions
        }
        this.dynmaicValApi(parms, dynCtrlId);
      }
    }
    this.setAutofillUpFields();
  }
  dynmaicValApi(params: any, dynbindCtrlId: any) {
    this.WebCommonService.loadDynamicBindDetails(params).subscribe(res => {

      if (res.status == 200) {
        this.arralldynVal[dynbindCtrlId] = res.result;
      }
    });
  }
  // Modified by : Arpita || On: 24-jul-24 || for dynamic dropdown fetch
  loadDynDepend(ctrlId: any, typeId: any = 0) {
    let dynBindType: any;
    let dynBndVal: any;
    if (typeId == 5 || typeId == 6) {
      dynBindType = document.getElementsByName(ctrlId);
      for (let dynrdobndtype of dynBindType) {
        if (dynrdobndtype.checked) {
          dynBndVal = dynrdobndtype.value;
          break;
        }
      }
    } else {
      dynBindType = <HTMLInputElement>document.getElementById(ctrlId);
      dynBndVal = dynBindType.value;
    }

    let bnddpndfld: any = document.querySelectorAll(
      '[data-dynbinddependctlfldid=' + ctrlId + ']'
    );

    for (let dynbndtype of bnddpndfld) {
      let dynCtrlId = dynbndtype.getAttribute('data-id');
      let dynbindvalclmn =
        this.arrallCascadingDetails[dynCtrlId].ctrlCCbinddecldClm;
      let bindconditions = dynbindvalclmn + '=' + "'" + dynBndVal + "'";

      let dynbindconditions =
        this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
        let dynfnlBind = bindconditions;
        if (dynbindconditions.length > 0) {
          if(dynfnlBind!='')
          {
            dynfnlBind += ' and ';
          }
          dynfnlBind += dynbindconditions ;
          //dynfnlBind   = dynbindconditions + ' and ';
        }

      if (dynbndtype.getAttribute('data-dynbinddependflag') == 'true') {
        let parms = {
          tableName: this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName,
          columnName:
            this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName +
            ',' +
            this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName,
          condition: dynfnlBind,
        };
        this.dynmaicValApi(parms, dynCtrlId);
      }
    }
  }


  doSchemeApply() {
    let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let schemeWiseFormDetails = this.dynamicCtrlDetails[this.currSecTabKey]['formDetails'];
    const formData = new FormData();
    let uploadFile: any;
    let validatonStatus = true;
    let validateArray: any[] = [];
    let arrJsnTxtDet: any = [];
    for (let schemeWiseFormCtr of schemeWiseFormDetails) {
      let arrAddMoreElement: any = '';
      let ctrlTypeId = schemeWiseFormCtr.ctrlTypeId;
      let elmVal = '';
      let elmValText: any = '';
      let elmId = schemeWiseFormCtr.ctrlId;
      let elmName = schemeWiseFormCtr.ctrlName;
      let lblName = schemeWiseFormCtr.ctrlLabel;
      let mandatoryDetails = schemeWiseFormCtr.ctrlMandatory;
      let attrType = schemeWiseFormCtr.ctrlAttributeType;
      let ctrlMaxLength = schemeWiseFormCtr.ctrlMaxLength;
      let ctrlMinLength = schemeWiseFormCtr.ctrlMinLength;
      let elmClass = schemeWiseFormCtr.ctrlClass;
      let addMoreElementData = '';
      if (ctrlTypeId == 2) // For Textbox
      {
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          if (validateArray[dependElemId].ctrlValue != dependElemdCondVal) {
            continue;
          }

        }
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

        if (mandatoryDetails) // For Mandatory
        {

          if (!this.vldChkLst.blankCheck(elmVal, lblName + ' can not be left blank')) {
            validatonStatus = false;
            break;
          }

        }

        if (ctrlMaxLength != '') // For Max length
        {
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '')// For Min length
        {
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }

        }

        if (attrType == 'email') // For Valid Email
        {
          if (!this.vldChkLst.validEmail(elmVal)) {
            validatonStatus = false;
            break;
          }

        }
        else if (attrType == 'tel') // For Valid Mobile
        {
          if (!this.vldChkLst.validMob(elmVal)) {
            validatonStatus = false;
            break;
          }

        }
        else if (attrType == 'telephoneNo') // For Valid telephone no
        {
          if (!this.vldChkLst.validTel(elmVal)) {
            validatonStatus = false;
            break;
          }

        }
        else if (attrType == 'telephone') // For Valid Mobile
        {
          if (!this.vldChkLst.validMob(elmVal)) {
            validatonStatus = false;
            break;
          }

        }

        else if (attrType == 'password') // For password Validation
        {
          if (!this.vldChkLst.validPassword(elmVal)) {
            validatonStatus = false;
            break;
          }

        }

      }

      else if (ctrlTypeId == 3) // For DropDown
      {
        let elm: any = (<HTMLInputElement>document.getElementById(elmId));
        elmVal = elm.value;
        elmValText = elm.options[elm.selectedIndex].text;

        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {

          let dependElemId = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal
          if (validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId'] == 5) {
            let dependElem: any = document.getElementsByName(dependElemId);
            for (let i of dependElem) {
              if (i.checked) {
                dependElemVal = i.value;
                break;
              }

            }
          }
          else {
            dependElemVal = (<HTMLInputElement>document.getElementById(dependElemId)).value;
          }
          if (dependElemVal != dependElemdCondVal) {
            continue;
          }

        }

        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.selectDropdown(elmVal, lblName)) {
            validatonStatus = false;
            break;
          }

        }

      }

      else if (ctrlTypeId == 4) // For TextArea
      {
        if (elmClass != '' && elmClass == this.ckEdtorCls) {
          elmVal = this.arrckEdtorVal[elmId];
        }
        else {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
        }

        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal = (<HTMLInputElement>document.getElementById(dependElemId)).value;
          if (dependElemVal != dependElemdCondVal) {
            continue;
          }

        }
        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheck(elmVal, lblName + ' can not be left blank')) {
            validatonStatus = false;
            break;
          }
        }
        if (ctrlMaxLength != '') // For Max length
        {
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }


        }

        if (ctrlMinLength != '')// For Min length
        {
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }

        }
      }

      else if (ctrlTypeId == 5) // For Checkbox
      {

        let chkdVal: any = '';
        let chkdTxt: any = '';
        var checkboxes: any = document.getElementsByName(elmId);




        for (var checkbox of checkboxes) {
          if (checkbox.checked) {
            if (chkdVal.length > 0) {
              chkdVal += ',' + checkbox.value;
              let el = document.querySelector(`label[for="${checkbox.id}"]`);
              chkdTxt += ',' + el?.textContent;
            }
            else {
              chkdVal += checkbox.value;
              let el = document.querySelector(`label[for="${checkbox.id}"]`);
              chkdTxt += el?.textContent;
            }

          }
        }
        elmVal = chkdVal;
        elmValText = chkdTxt;
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];


          if (validateArray[dependElemId]['ctrlTypeId'] == 5) // For Checkbox
          {

          }
          else if (validateArray[dependElemId]['ctrlTypeId'] == 6) // For Radio
          {
            if (dependElemdCondVal != validateArray[dependElemId]['ctrlValue']) {
              continue;
            }
          }

          else {
            let dependElemVal = (<HTMLInputElement>document.getElementById(dependElemId)).value;

            if (dependElemVal != dependElemdCondVal) {
              continue;
            }
          }

        }

        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      }

      else if (ctrlTypeId == 6) // For Radio Btn
      {
        var radioBtnElmn = document.getElementsByName(elmId);

        for (var i = 0, length = radioBtnElmn.length; i < length; i++) {
          if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
            elmVal = (<HTMLInputElement>radioBtnElmn[i]).value;
            let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
            let el = document.querySelector(`label[for="${rdId}"]`);
            elmValText = el?.textContent;
          }
        }
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          //   return false;

          if (validateArray[dependElemId]['ctrlTypeId'] == 5) // For Checkbox
          {

          }
          else if (validateArray[dependElemId]['ctrlTypeId'] == 6) // For Radio
          {
            if (dependElemdCondVal != validateArray[dependElemId]['ctrlValue']) {
              continue;
            }
          }

          else {
            let dependElemVal = (<HTMLInputElement>document.getElementById(dependElemId)).value;

            if (dependElemVal != dependElemdCondVal) {
              continue;
            }
          }


        }
        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      }

      else if (ctrlTypeId == 7) {
        uploadFile = this.arrUploadedFiles[elmId];
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          if (validateArray[dependElemId].ctrlValue != dependElemdCondVal) {
            continue;
          }

        }
        if (mandatoryDetails) // For Mandatory
        {
          if(uploadFile){
            if(uploadFile['fileName'] == '' || uploadFile['fileName'] == undefined) {
              Swal.fire({
                icon: 'error',
                text: 'Please upload ' + lblName
              });
              validatonStatus = false;
              break;
            } 
          }else{
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName
            });
            validatonStatus = false;
            break;
          }
        }
      }

      else if (ctrlTypeId == 10) //For AddMore
      {
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) // For Dependent Check
        {

          let dependElemId = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal = schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal
          if (validateArray[dependElemId]['ctrlTypeId'] == 6 || validateArray[dependElemId]['ctrlTypeId'] == 5) {
            let dependElem: any = document.getElementsByName(dependElemId);
            for (let i of dependElem) {
              if (i.checked) {
                dependElemVal = i.value;
                break;
              }

            }
          }
          else {
            dependElemVal = (<HTMLInputElement>document.getElementById(dependElemId)).value;
          }
          if (dependElemVal != dependElemdCondVal) {
            continue;
          }

        }
        if (schemeWiseFormCtr['radioAddmoreviewtype'] == 'table') {
          let addMoreTbulrRes = this.addAddMoreArrTabularWise(schemeWiseFormCtr);
          if (addMoreTbulrRes.validationStatus) {
            addMoreElementData = JSON.stringify(addMoreTbulrRes.arrAddmoreFilledTabularData);
          }

          else {
            validatonStatus = false;
            break;
          }
        }
        // Added by Rohit for column wise add more on 31-10-23
        else if(schemeWiseFormCtr['radioAddmoreviewtype'] == 'column')
        {
          if(this.saveaddMoreColumnData(elmId,0))
            {
              addMoreElementData = JSON.stringify(this.arrAddmoreFilledData[elmId]);
            }
        
            else {
              validatonStatus = false;
              break;
            }
          
        }// End of column wise add more on 31-10-23

        else {
          let addmoreAllCtrlWiseData = this.arrAddmoreFilledData[elmId];
          if (addmoreAllCtrlWiseData == undefined) {
            addmoreAllCtrlWiseData = [];
          }
          if (!this.addMoreValidation(addmoreAllCtrlWiseData, schemeWiseFormCtr['addmoreDetails'])) {
            validatonStatus = false;
            break;
          }
          addMoreElementData = JSON.stringify(this.arrAddmoreFilledData[elmId]);
        }
      }
      validateArray[elmId] = {
        'ctrlValue': elmVal,
        'ctrlTypeId': ctrlTypeId
      };
      formData.append('ctrlTypeId[' + elmId + ']', ctrlTypeId);
      formData.append('ctrlId[' + elmId + ']', elmId);
      formData.append('ctrlName[' + elmId + ']', elmName);
      formData.append('lblName[' + elmId + ']', lblName);
      formData.append('ctrlValue[' + elmId + ']', elmVal);
      formData.append('ctrlValueText[' + elmId + ']', elmValText);
      formData.append('uploadedFiles[' + elmId + ']', JSON.stringify(uploadFile));
      formData.append('addMoreElementData[' + elmId + ']', addMoreElementData);
    }
    formData.append('intProfileId', sessionInfo.USER_ID);
    formData.append('processId', this.processId);
    formData.append('secId', this.currSecId);
    formData.append('intOnlineServiceId', this.onlineServiceId);
    // formData.append('optionTxtDetails', JSON.stringify(arrJsnTxtDet));
    if (validatonStatus) {
      this.loading = true;
      const finalClaimAmtField:any = (<HTMLInputElement>document.getElementsByClassName('cls_fca_d_none')[0]);
      const claimAmt:any = (<HTMLInputElement>document.getElementsByClassName('cls_fca')[0]);
      if(finalClaimAmtField && claimAmt){
        formData.set('ctrlValue[' + finalClaimAmtField.id + ']', claimAmt.value);
      }
      this.WebCommonService.schemeApply(formData).subscribe((res: any) => {
        let validationMsg = (res.result.validationMsg != '') ? res.result.validationMsg : 'error';
        if (res.status == 200) {
          this.onlineServiceId = res.result.intOnlineServiceId;
          let onlineProductId = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME')).FFS_APPLY_SCHEME_PRODUCT_ID;
          let onlineModuleId = JSON.parse(sessionStorage.getItem('FFS_SESSION_SCHEME')).FFS_APPLY_SCHEME_MODULE_ID;
          const regdId = sessionStorage.getItem('REGD_ID');

          let param = {
            "onlineServiceId": this.onlineServiceId,
            "onlineProductId": onlineProductId,
            "onlineModuleId": onlineModuleId,
            "profileId": sessionInfo.USER_ID,
            "regdId": regdId,
            "finalClaimedAmount": (claimAmt) ? claimAmt.value : 0
          }
          this.IrmsDetailsService.saveIncentiveDetails(param).subscribe((result: any) => {
            this.loading = false;
            if (this.dynamicCtrlDetKeys.length > this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey) + 1) {
              let latestDynCtlkeyIndex = Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey)) + 1
              this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
              this.currSecId = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
              this.prevdipStatus = '';
              this.secDisable = false;
              (<HTMLElement>document.getElementById("sec-tab-" + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex])).click();
              // this.secDisable   = true;
            }
            else {
              let formParms = this.processId + ':' + this.onlineServiceId + ':0:' + this.intProductId;
              let encSchemeStr = this.encDec.encText(formParms.toString());
              this.router.navigate(['/citizen-portal/preview-form', encSchemeStr]);
              //const objData = {"intProcessId":this.processId,"intProfileId":sessionInfo.USER_ID,"intOnlineServiceId":this.onlineServiceId}
              //this.router.navigate(['/citizen-portal/trackstatus']);
              // const objData = {"intProcessId":this.processId,"intProfileId":sessionInfo.USER_ID,"intOnlineServiceId":this.onlineServiceId}
              // this.IrmsDetailsService.createApprovalProcess(objData).subscribe((resData:any)=>{
              //   let formParms  = this.processId+':'+this.onlineServiceId+':'+1;
              //   let encSchemeStr = this.encDec.encText(formParms.toString());
              //   this.router.navigate(['/citizen-portal/trackstatus']);
              // });

            }
          });

        }

        else {
          Swal.fire({
            icon: 'error',
            text: validationMsg
          });
        }
      });
    }

  }

  goToPrevious() {
    if (this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey) == 0) {
      this.router.navigate(['/website/servicelisting']);
    }

    else {

      let latestDynCtlkeyIndex = Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey)) - 1
      this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
      this.currSecId = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
      this.prevdipStatus = '';
      this.secDisable = false;
      (<HTMLElement>document.getElementById("sec-tab-" + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex])).click();
      this.secDisable = true;
    }
  }

  reset() {
    if (this.currSecTabKey == 'sec_0') {
      location.reload();
      return
    }
    (<HTMLElement>document.getElementById("sec-tab-" + this.currSecTabKey)).click();
  }
  setCkedtorArr(ckVal: any, ckId: any) // To set the ck editor value in array while page submit
  {
    this.arrckEdtorVal[ckId] = ckVal;
  }
  saveFileTemp(event: any, fileId: any, fileType: any, fileSize: any, fileForApproval: any, fileSizeType: any) // This function is used to save the file in temporary Folder
  {
    const target = event.target as HTMLInputElement;
    const files: any = target.files as FileList;
    const uploadedfleSize = files[0].size;
    const uploadedfileType = files[0].type;
    let validFileStatus = true;
    if (!this.vldChkLst.validateFile(uploadedfileType, fileType)) // File Type Validation Check
    {
      validFileStatus = false;
      Swal.fire({
        icon: 'error',
        text: 'invalid file type'
      });
    }
    if (!this.vldChkLst.validateFileSize(uploadedfleSize, fileSize, fileSizeType)) // File Size Validation Check
    {
      let filesizeMsg = '';
      if (fileSizeType.toLowerCase() == 'kb') {
        filesizeMsg = 'File size exceeds ' + fileSize + 'KB.';
      }
      else {
        filesizeMsg = 'File size exceeds ' + fileSize + 'MB.';
      }
      validFileStatus = false;
      Swal.fire({
        icon: 'error',
        text: filesizeMsg
      });
    }
    if (!validFileStatus) {
      (<HTMLInputElement>document.getElementById(fileId)).value = '';
      document.getElementById('fileDownloadDiv_' + fileId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href', '');
      document.getElementById('fileDownloadDiv_' + fileId)?.classList.add('d-none');
      delete this.arrUploadedFiles[fileId];
      return false;
    }
    const fileData = new FormData();
    fileData.append("file", files[0]);
    fileData.append("fileType", fileType);
    fileData.append("fileSize", fileSize);
    fileData.append("fileSizeType", fileSizeType);
    this.btnSaveNextDisableStatus = true;
    this.WebCommonService.saveFileToTemp(fileData).subscribe((res: any) => {
      if (res.status == 200) {
        this.arrUploadedFiles[fileId] = { 'fileName': res.result.fileName, 'fileForApproval': fileForApproval, 'fileType': fileType };
        const element = document.getElementById('fileName_'+fileId);
				if (element) {
				// Set the innerHTML of the element to the fileName variable
				element.innerHTML = res.result.fileName;
				}
        document.getElementById('fileDownloadDiv_' + fileId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href', res.result.filePath);
        document.getElementById('fileDownloadDiv_' + fileId)?.classList.remove('d-none');
      }
      else {
        (<HTMLInputElement>document.getElementById(fileId)).value = '';
        Swal.fire({
          icon: 'error',
          text: 'error while uploading files'
        });
      }

      this.btnSaveNextDisableStatus = false;
    });
    return true;
  }

   /*
  * Function: removeFile
  * Description: to delete the uploaded file
  * Modified By: Sibananda Sahu
  * Date: 08-03-2024
  */
   removeFile(ctrlId: any) {
		Swal.fire({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover this file!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Delete'
		})
		.then((willDelete) => {
			if (willDelete.isConfirmed) { // Checking if the user confirmed deletion
				(<HTMLInputElement>document.getElementById(ctrlId)).value = '';
				document.getElementById('fileDownloadDiv_' + ctrlId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href', '');
				document.getElementById('fileDownloadDiv_' + ctrlId)?.classList.add('d-none');
				delete this.arrUploadedFiles[ctrlId];
				const element = document.getElementById('fileName_'+ctrlId);
				if (element) {
					// Set the innerHTML of the element to the fileName variable
					element.innerHTML = 'Browse File';
				}
				this.arrDeletedUploadedFiles.push(ctrlId);
			} else {
				// Do nothing if user cancels
				return;
			}
		});
	}

  showUploadFile(fileName: any, ctrlId: any, fileForApproval: any, fileType: any) {
    if (fileName != null && fileName != '' && !this.arrDeletedUploadedFiles.includes(ctrlId) && fileName != 'NULL' && fileName != 'null') {
      document.getElementById('fileDownloadDiv_' + ctrlId)?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href', environment.serviceURL + 'storage/app/uploads/' + fileName);
      document.getElementById('fileDownloadDiv_' + ctrlId)?.classList.remove('d-none');
      const element = document.getElementById('fileName_'+ctrlId);
				if (element) {
				// Set the innerHTML of the element to the fileName variable
				element.innerHTML = fileName;
				}
      this.arrUploadedFiles[ctrlId] = { 'fileName': fileName, 'fileForApproval': fileForApproval, 'fileType': fileType };
    }
  }

  setCalcFieldValue(ctrlCalcFieldData: any, ctrlId: any) {
    this.arrCalcFields[ctrlId] = ctrlCalcFieldData;

  }
  setCalcFields()
  {
    let dynCalc:any =document.querySelectorAll("[data-calcflag='true']");
    for(let loopdynCalc of  dynCalc)
    {
      (<HTMLInputElement>document.getElementById(loopdynCalc.id)).readOnly=false ;   //changed to false for auto-calculation field to be editable
      for(let clcloop of this.arrCalcFields[loopdynCalc.id])
      {
        if(clcloop.ctrlCalcFieldtype == 'fieldValue')
        {
          let clcElement =   (<HTMLInputElement>document.getElementById(clcloop.ctrlCalcValue));
          clcElement.addEventListener('keyup', ()=>{
            this.calculate(this.arrCalcFields[loopdynCalc.id],loopdynCalc.id);
            });
        }

      }

    }
    return;
  }

  calculate(calcDetails: any, ctrlId: any) // This function is used for Calculation purpose
  {
    let clc: any = 0;
    let valuate: any = '';
    for (let calcloop of calcDetails) {
      if (calcloop.ctrlCalcFieldtype == 'fieldValue') {
        let fldValue = (<HTMLInputElement>(document.getElementById(calcloop.ctrlCalcValue))).value
        clc = (fldValue.length > 0) ? fldValue : 0;
      }
      else {
        clc = calcloop.ctrlCalcValue;
      }
      valuate += clc;
    }
    (<HTMLInputElement>(document.getElementById(ctrlId))).value = eval(valuate);
    return;
  }

  backClicked() {
    this._location.back();
  }
  // Added by Rohit for column wise add more on 31-10-23
  setArrAddMoreDetails(ctrlId: any, addMoreparams: any,addMoreViewType:any,formctrls:any) {  // This function is used to set the configured data of Add more
  
    //this.arrAddmoreDetails[ctrlId] = addMoreparams;

    if(addMoreViewType == "table" &&  (this.arrAddmoreDetails[ctrlId]=="" || this.arrAddmoreDetails[ctrlId]==undefined))
    {

     // this.setTotCalculationForTablularAddMore(ctrlId,formctrls);
      this.storeAddMoreMergeDetails(formctrls,ctrlId); 
    }
    else if(addMoreViewType == "column" &&  (this.arrAddmoreDetails[ctrlId]==="" || this.arrAddmoreDetails[ctrlId]==undefined))
      {
    
        this.setTotCalculationForColumnAddMore(ctrlId);
        this.storeAddMoreMergeDetails(formctrls,ctrlId);

      }
      this.arrAddmoreDetails[ctrlId] = addMoreparams;
  }
  // End of column wise add more on 31-10-23
  addMoreData(addMorectrlId: any, addMorectrlClass: any) {
    //to check custom validations By:Sibananda
    const isAddmoreValid = this.customValidations(addMorectrlId);
    if (!isAddmoreValid) {
        return;
    }
    //End of custom validations
    let validateArray: any[] = [];
    let validatonStatus = true;
    let arrAddMoreElementWiseData: any[] = [];
    let uploadFile: any;
    let indx = 0;
    let clearAddMoreValue = [];
    let addMoreEleValStatus = []; 
    for (let schemeWiseFormCtr of this.arrAddmoreDetails[addMorectrlId]) {
      let ctrlTypeId = schemeWiseFormCtr.ctrlTypeId;
      let elmVal = '';
      let elmValText: any = '';
      let elmId = schemeWiseFormCtr.ctrlId;
      let elmName = schemeWiseFormCtr.ctrlName;
      let lblName = schemeWiseFormCtr.ctrlLabel;
      let mandatoryDetails = schemeWiseFormCtr.ctrlMandatory;
      let attrType = schemeWiseFormCtr.ctrlAttributeType;
      let ctrlMaxLength = schemeWiseFormCtr.ctrlMaxLength;
      let ctrlMinLength = schemeWiseFormCtr.ctrlMinLength;
      let elmClass = schemeWiseFormCtr.ctrlClass;
      let bndDataType = schemeWiseFormCtr.addmorecascadingCtrlDetails[0].ctrlCCbindDatatype;
      let bndDataTypeDpndOther = schemeWiseFormCtr.addmorecascadingCtrlDetails[0].AMctrlCCbinddepentOther

      clearAddMoreValue.push({ 'elmId': elmId, 'elmtypeId': ctrlTypeId, 'elmClass': elmClass, 'bindDataType': bndDataType, 'bndDataTypeDpndOther': bndDataTypeDpndOther });
      // Start || Code added for adding add more element value status
      let addMoreEleVal:any = (<HTMLInputElement>document.getElementById(elmId)).value;
      if(addMoreEleVal == 0 || addMoreEleVal == '' || typeof (addMoreEleVal) == undefined || addMoreEleVal == null){
        addMoreEleValStatus.push(0);
      }else{
        addMoreEleValStatus.push(1);
      }
      // End
      if (ctrlTypeId == 2) // For Textbox
      {
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

        if (mandatoryDetails) // For Mandatory
        {
          addMoreEleValStatus.push(1);
          if (!this.vldChkLst.blankCheck(elmVal, lblName + ' can not be left blank')) {
            validatonStatus = false;
            break;
          }

        }

        if (ctrlMaxLength != '') // For Max length
        {
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '')// For Min length
        {
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }

        }

        if (attrType == 'email') // For Valid Email
        {
          if (!this.vldChkLst.validEmail(elmVal)) {
            validatonStatus = false;
            break;
          }

        }

        else if (attrType == 'tel') // For Valid Mobile
        {
          if (!this.vldChkLst.validMob(elmVal)) {
            validatonStatus = false;
            break;
          }

        }
        
        else if (attrType == 'telephoneNo') // For Valid Telephone No
        {
          if (!this.vldChkLst.validTel(elmVal)) {
            validatonStatus = false;
            break;
          }

        }

        else if (attrType == 'password') // For password Validation
        {
          if (!this.vldChkLst.validPassword(elmVal)) {
            validatonStatus = false;
            break;
          }

        }

      }

      else if (ctrlTypeId == 3) // For DropDown
      {
        let elm: any = (<HTMLInputElement>document.getElementById(elmId));

        elmVal = elm.value;
        elmValText = elm.options[elm.selectedIndex].text;



        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.selectDropdown(elmVal, lblName)) {
            validatonStatus = false;
            break;
          }

        }

      }

      else if (ctrlTypeId == 4) // For TextArea
      {
        if (elmClass == this.ckEdtorCls && elmClass != '') {
          elmVal = this.arrckEdtorVal[elmId];

        }
        else {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
        }


        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheck(elmVal, lblName + ' can not be left blank')) {
            validatonStatus = false;
            break;
          }
        }
        if (ctrlMaxLength != '') // For Max length
        {
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }


        }

        if (ctrlMinLength != '')// For Min length
        {
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }

        }
      }

      else if (ctrlTypeId == 5) // For Checkbox
      {

        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }
        let chkdVal: any = '';
        let chkdTxt: any = '';
        var checkboxes: any = document.getElementsByName(elmId);
        for (var checkbox of checkboxes) {
          if (checkbox.checked) {
            if (chkdVal.length > 0) {
              chkdVal += ',' + checkbox.value;
              let el = document.querySelector(`label[for="${checkbox.id}"]`);
              chkdTxt += ',' + el?.textContent;
            }
            else {
              chkdVal += checkbox.value;
              let el = document.querySelector(`label[for="${checkbox.id}"]`);
              chkdTxt += el?.textContent;
            }



          }
        }
        elmVal = chkdVal.toString();
        elmValText = chkdTxt;

      }

      else if (ctrlTypeId == 6) // For Radio Btn
      {
        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }


        var radioBtnElmn = document.getElementsByName(elmId);

        for (var i = 0, length = radioBtnElmn.length; i < length; i++) {
          if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
            elmVal = (<HTMLInputElement>radioBtnElmn[i]).value;
            let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
            let el = document.querySelector(`label[for="${rdId}"]`);
            elmValText = el?.textContent;


          }


        }

      }

      else if (ctrlTypeId == 7) {
        uploadFile = this.arrUploadedFiles[elmId];

        if (mandatoryDetails) // For Mandatory
        {
          if (uploadFile == '' || uploadFile == undefined) {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName
            });
            validatonStatus = false;
            break;
          }
        }
      }
      validateArray[elmId] = {
        'ctrlValue': elmVal,
        'ctrlTypeId': ctrlTypeId
      };

      arrAddMoreElementWiseData.push(
        {
          'ctrlTypeId': ctrlTypeId,
          'ctrlId': elmId,
          'ctrlName': elmName,
          'lblName': lblName,
          'ctrlValue': elmVal,
          'ctrlValueText': elmValText,
          'uploadFile': uploadFile,
          'editStaus': 0
        });

      indx++;
    }
    // Start || Code for checking if add more element having some value or not
    let status = addMoreEleValStatus.includes(1);
    if(!status){
      Swal.fire({
        icon: 'error',
        text: 'Please enter atleast one field value'
      });
      return;
    }
    // End
    if (validatonStatus) {
      if (clearAddMoreValue.length > 0) { // Clear All the add More elements
        for (let addMoreClearloop of clearAddMoreValue) {
          if (addMoreClearloop['elmtypeId'] == 2) {
            (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value = ''
          }
          else if (addMoreClearloop['elmtypeId'] == 3) {
            (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value = '0';

            // if(addMoreClearloop['bindDataType'] == 'dynamic' && addMoreClearloop['bndDataTypeDpndOther'] == 0)
            //   {
            //    console.log(this.arralldynVal[addMoreClearloop['elmId']].splice(Object.keys(this.arralldynVal).indexOf(addMoreClearloop['elmId']),500));
            //    console.log(this.arralldynVal[addMoreClearloop['elmId']]);
            //   }
            //
          }
          else if (addMoreClearloop['elmtypeId'] == 4) {
            if (addMoreClearloop['elmClass'] == this.ckEdtorCls) {
              this.arrckEdtorVal[addMoreClearloop['elmId']] = '';
            }
            else {
              (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value = '';
            }
          }

          else if (addMoreClearloop['elmtypeId'] == 5) {
            var checkboxes: any = document.getElementsByName(addMoreClearloop['elmId']);
            for (var checkbox of checkboxes) {
              if (checkbox.checked) {
                (<HTMLInputElement>document.getElementById(checkbox.id)).checked = false;
              }
            }
          }

          else if (addMoreClearloop['elmtypeId'] == 6) {
            var radioBtnElmn = document.getElementsByName(addMoreClearloop['elmId']);

            for (var i = 0, length = radioBtnElmn.length; i < length; i++) {
              if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
                let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
                (<HTMLInputElement>document.getElementById(rdId)).checked = false;
              }
            }
          }

          else if (addMoreClearloop['elmtypeId'] == 7) {
            document.getElementById('fileDownloadDiv_' + addMoreClearloop['elmId'])?.closest('.form-group')?.querySelector('.downloadbtn')?.setAttribute('href', '');
            document.getElementById('fileDownloadDiv_' + addMoreClearloop['elmId'])?.classList.add('d-none');
            const element = document.getElementById('fileName_'+addMoreClearloop['elmId']);
						if (element) {
						element.innerHTML = 'Browse File';
						}
            (<HTMLInputElement>document.getElementById(addMoreClearloop['elmId'])).value = '';
          }

        }
      }

      // First store using index of add more id  in this.arrAddmoreFilledData and then push it in this.arrAddmoreFilledData
      if (this.arrAddmoreFilledData[addMorectrlId] != undefined) {
        this.arrAddmoreFilledData[addMorectrlId].push(arrAddMoreElementWiseData);

      }
      else {
        this.arrAddmoreFilledData[addMorectrlId] = [arrAddMoreElementWiseData];
      }
      this.arrAddmoreElemntKeys[addMorectrlId] = (Object.keys(arrAddMoreElementWiseData));
      this.editIndex = '';
      // By: Sibananda For:Success Message 
      var labelText = document.querySelector('#' + addMorectrlId + ' label').textContent;
      Swal.fire({
        icon: 'success',
        html: labelText + ' added to the list successfully.</br></br>' +'<div style="background-color: #626262ad; color: white; padding: 10px; border-radius: 5px;">' +
                  'To add more, please fill in the fields and click on the Add to List button' +
              '</div>',
    });
      //End for Success Message 

    //To Disable Addmore button after successfully adding to list | By:Siba
    let addMoreButton = document.getElementById('addMoreBtn_' + addMorectrlId);
    addMoreButton?.setAttribute('disabled', 'disabled');;
    addMoreButton?.classList.remove('blink');
    //End of disabling Addmore button 
    }
    let otherAssId = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][1].ctrlId;
    let prevAssId = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][0].ctrlId;
    let otherAssIddet = '';
    if(this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1].length >= 3){
      otherAssIddet = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][3].ctrlId;
    }
    let otherAssClassList = document.getElementById(otherAssId);
    let otherAssIddetList = document.getElementById(otherAssIddet);
    let prevClassList = document.getElementById(prevAssId);
    if(otherAssClassList.classList.contains("cls_iSOtherAssAmt") || otherAssClassList.classList.contains("cls_ivsOtherAsset") || otherAssClassList.classList.contains("cls_iseAmount") || otherAssIddetList.classList.contains("cls_skAmount") || otherAssClassList.classList.contains("cls_skNoEmp")) {
     this.addMoreCalculation(this.arrAddmoreFilledData, addMorectrlId, this.formName);
    }

    let interestSubsidyAmountId = '';
    let interestSubsidyClassList:any = [];
    if(this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1].length >= 8){
      interestSubsidyAmountId = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][8].ctrlId;
      interestSubsidyClassList = document.getElementById(interestSubsidyAmountId);
      if(interestSubsidyClassList.classList.contains("cls_interest_amount")){
        this.isAddMoreCtrlIds.push(addMorectrlId);
        this.interestSubsidyAddMoreCalculation(this.arrAddmoreFilledData, addMorectrlId, this.formName);
      }
    }
    if(addMorectrlClass=='cls_training_details'){
      let skillGapClassListFirst:any=[];
      let skillGapClassListTwo:any=[];
      let skillGapClassListThree:any=[];
      let skillGapClassListFour:any=[];
      
      if(this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1].length >= 4){
        let otherAssIdGap = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][1].ctrlId;
        let otherAssIdGapTwo = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][2].ctrlId;
        let otherAssIdGapThree = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][3].ctrlId;
        let otherAssIdGapFour = this.arrAddmoreFilledData[addMorectrlId][this.arrAddmoreFilledData[addMorectrlId].length - 1][4].ctrlId;
        skillGapClassListFour = document.getElementById(otherAssIdGapFour);
        skillGapClassListThree = document.getElementById(otherAssIdGapThree);
        skillGapClassListTwo = document.getElementById(otherAssIdGapTwo);
        skillGapClassListFirst = document.getElementById(otherAssIdGap);
      
        if(skillGapClassListFirst.classList.contains("cls_typeOfTraining") ||  skillGapClassListTwo.classList.contains("cls_noOfEmpMale") || skillGapClassListThree.classList.contains("cls_other_emp") || skillGapClassListFour.classList.contains("cls_perEmpAmount")){
          this.isAddMoreCtrlIds.push(addMorectrlId);
          this.skillGapAddMoreCalculation(this.arrAddmoreFilledData, addMorectrlId, this.formName);
        }
      }
    }
  }


  // editAddMore(event:any,ctrlId:any,indx:any)
  // {
  //   this.editIndex = indx;
  //  if(this.arrAddMoreEditData.length > 0)
  //  {
  //   this.arrAddMoreEditData = [];
  //  }
  //   this.arrAddMoreEditData.push(this.arrAddmoreFilledData[ctrlId][indx]);
  //   console.log(this.arrAddMoreEditData);
  // }
  setDynRadioBtn(dynSetVal: any, ctrlValue: any) {
    if (dynSetVal != null) {
      let arrRadioDetails = dynSetVal.split(',');
      return arrRadioDetails.includes(ctrlValue)
    }
    else {
      return false;
    }
  }

  deleteAddMore(event: any, ctrlId: any, indx: any) {
    //code added for interset subsidy add more calculation | by manish | date: 31-07-2024
      let removedAddMore = this.arrAddmoreFilledData[ctrlId].splice(indx, 1);
      this.customAddmoreFunction(this.intFormId, ctrlId, removedAddMore);
       //end code
      if(this.isAddMoreCtrlIds.includes(ctrlId)){
      this.skillGapAddMoreCalculation(this.arrAddmoreFilledData, ctrlId, this.formName);
      }else{
       this.arrAddmoreFilledData[ctrlId].splice(indx, 1);
      this.addMoreCalculation(this.arrAddmoreFilledData, ctrlId, this.formName);
      }
    
  }
  checkAddMoreTabularkeyExists(addMoreTabularKeySlno: any, addMoreTabularId: any, addMoreTavularColumnName: any, allAddMoreTabularData: any, tabularAddMoreTypeId: any = 0, ctrlCCStaticValue: any = '', ctrlTabularFileForApproval: any = '', ctrlTabularAddMoreFileType: any = '') {
    if (allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId] == undefined) {
      return '';
    }

    else if (tabularAddMoreTypeId == 5) // For Checkbox
    {
      return this.setDynRadioBtn(allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][addMoreTabularId]['addMoreDataValue'][addMoreTavularColumnName], ctrlCCStaticValue);
    }

    else if (tabularAddMoreTypeId == 7) // for file upload
    {

      this.showUploadFile(allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][addMoreTabularId]['addMoreDataValue'][addMoreTavularColumnName], ctrlCCStaticValue, ctrlTabularFileForApproval, ctrlTabularAddMoreFileType);
      return '';
    }

    else if (tabularAddMoreTypeId == 4 && ctrlCCStaticValue == 1) // for ckeditor  here ctrlCCStaticValue status is mantained for ckeditor
    {
      this.setHtmlData(allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][addMoreTabularId]['addMoreDataValue'][addMoreTavularColumnName], ctrlTabularFileForApproval);

      // checkAddMoreTabularkeyExists
    }
    else {

      return this.encDec.decodeHtml(allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][addMoreTabularId]['addMoreDataValue'][addMoreTavularColumnName]);
    }

  }
  fillAddMoreArray(addMorectrlId: any, addMoreFormConfigData: any, addMoreFormResult: any) // when page is loaded this function set's add more array
  {
    this.amountAddMore = 0;
    let vchTypeTrainingDet = 0;
    let vchExpPerEmpDet = 0;
    let otherAmountExpDet = 0;
    let intMaleEmpDet = 0;
    let intOtherEmpDet = 0;
    this.totalSkillAmount =0;
    if (addMoreFormResult[addMorectrlId] != undefined && !(Object.keys(this.arrAddmoreElemntKeys)).includes(addMorectrlId)) {
      let arrAddMoreElementWiseData = [];
      if (addMoreFormResult[addMorectrlId]['addMoreDataValue'] != '') {
        for (let addmoreloop of addMoreFormResult[addMorectrlId]['addMoreDataValue']) {
          let optAddMoreValue = '';
          arrAddMoreElementWiseData = [];
          if (this.processId == 94) {
            this.amountAddMore += parseFloat(addmoreloop.vch_amount);
          }
          if (this.processId == 47) {
            this.isAddMoreCtrlIds.push(addMorectrlId);
            if (addmoreloop.vch_type_training == 1) {
              vchTypeTrainingDet = parseFloat(addmoreloop.vch_type_training);
              vchExpPerEmpDet = parseFloat(addmoreloop.vch_exp_per_emp) <= 20000 ? parseFloat(addmoreloop.vch_exp_per_emp) : 20000;
            } else if (addmoreloop.vch_type_training == 2) {
              vchTypeTrainingDet = parseFloat(addmoreloop.vch_type_training);
              vchExpPerEmpDet = parseFloat(addmoreloop.vch_exp_per_emp) <= 10000 ? parseFloat(addmoreloop.vch_exp_per_emp) : 10000;
            }
            otherAmountExpDet = parseFloat(addmoreloop.vch_exp_per_emp);
            intMaleEmpDet = parseFloat(addmoreloop.int_male_emp);
            intOtherEmpDet = parseFloat(addmoreloop.int_other_emp);
            this.totalSkillAmount += (intMaleEmpDet * vchExpPerEmpDet) + (intOtherEmpDet * otherAmountExpDet);

          }
          if (addmoreloop.jsonOptTxtDetails != '' && addmoreloop.jsonOptTxtDetails != undefined) {
            optAddMoreValue = JSON.parse(addmoreloop.jsonOptTxtDetails);
            //   optVal   =
          }
          for (let addMoreConfigloop of addMoreFormConfigData) {
            let optVal = (optAddMoreValue[0] != undefined) ? optAddMoreValue[0][addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']] : '';
            arrAddMoreElementWiseData.push(
              {
                'ctrlTypeId': addMoreConfigloop.ctrlTypeId,
                'ctrlId': addMoreConfigloop.ctrlId,
                'ctrlName': addMoreConfigloop.ctrlName,
                'lblName': addMoreConfigloop.ctrlLabel,
                'ctrlValue': (addMoreConfigloop.ctrlTypeId != 7) ? addmoreloop[addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']] : '',
                'ctrlValueText': optVal,
                'uploadFile': (addMoreConfigloop.ctrlTypeId == 7) ? { 'fileName': addmoreloop[addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']], 'fileForApproval': addMoreConfigloop.ctrlForApproval, 'fileType': addMoreConfigloop.ctrlFileType }
                  : '',
                'editStaus': 1
              });
          }
          if (this.arrAddmoreFilledData[addMorectrlId] != undefined) {
            this.arrAddmoreFilledData[addMorectrlId].push(arrAddMoreElementWiseData);
          }
          else {
            this.arrAddmoreFilledData[addMorectrlId] = [arrAddMoreElementWiseData];
          }
        }
        if (this.processId == 47) {
          this.totalSkillAmountAddMore = this.totalSkillAmount;
        }
        this.amountAddMoreDet = this.amountAddMore;
        // First store using index of add more id  in this.arrAddmoreFilledData and then push it in this.arrAddmoreFilledData
        this.arrAddmoreElemntKeys[addMorectrlId] = (Object.keys(arrAddMoreElementWiseData));

      }
    }

  }

  addMoreValidation(addmoreData: any, addmoreConfiguredData: any) {
    let arrAddMoreValdiator: any[] = [];
    let addmreValidStaus = true;
    for (let addMoreConfiguredValidatorloop of addmoreConfiguredData) {
      let addMoreerrorMsg: any = '';
      if (addMoreConfiguredValidatorloop.ctrlMandatory && addmoreData.length == 0) {
        if (addMoreConfiguredValidatorloop.ctrlTypeId == 3 || addMoreConfiguredValidatorloop.ctrlTypeId == 5 || addMoreConfiguredValidatorloop.ctrlTypeId == 6) {
          addMoreerrorMsg = 'Select ' + addMoreConfiguredValidatorloop.ctrlLabel;
        }
        else {
          addMoreerrorMsg = addMoreConfiguredValidatorloop.ctrlLabel + ' can not be left blank';
        }
        Swal.fire({
          icon: 'error',
          text: addMoreerrorMsg
        });
        addmreValidStaus = false;
        break;
      }
      arrAddMoreValdiator[addMoreConfiguredValidatorloop.ctrlId] = { 'ctrlTypeId': addMoreConfiguredValidatorloop.ctrlTypeId, 'ctrlMandatory': addMoreConfiguredValidatorloop.ctrlMandatory, 'ctrlMaxLength': addMoreConfiguredValidatorloop.ctrlMaxLength, 'ctrlMinLength': addMoreConfiguredValidatorloop.ctrlMinLength, 'ctrlAttributeType': addMoreConfiguredValidatorloop.ctrlAttributeType, 'ctrlLabel': addMoreConfiguredValidatorloop.ctrlLabel }
    }
    if (addmreValidStaus && addmoreData != undefined) {
      for (let addMoreTrDataValidatorloop of addmoreData) //TR
      {
        for (let addMoreTdDataValidatorloop of addMoreTrDataValidatorloop) //TD
        {
          if (addMoreTdDataValidatorloop['ctrlTypeId'] == 2) // Textbox Validation
          {
            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
            {
              if (!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'] + ' can not be left blank')) {
                addmreValidStaus = false;
                break;
              }
            }
            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'] != '') // For Max length
            {
              if (!this.vldChkLst.maxLength(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'])) {
                addmreValidStaus = false;
                break;
              }
            }

            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'] != '')// For Min length
            {
              if (!this.vldChkLst.minLength(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'])) {
                addmreValidStaus = false;
                break;
              }
            }

            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'email') // For Valid Email
            {
              if (!this.vldChkLst.validEmail(addMoreTdDataValidatorloop['ctrlValue'])) {
                addmreValidStaus = false;
                break;
              }

            }
            else if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'tel') // For Valid Mobile
            {
              if (!this.vldChkLst.validMob(addMoreTdDataValidatorloop['ctrlValue'])) {
                addmreValidStaus = false;
                break;
              }
            }
            else if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'telephoneNo') // For Valid telephone no
            {
              if (!this.vldChkLst.validTel(addMoreTdDataValidatorloop['ctrlValue'])) {
                addmreValidStaus = false;
                break;
              }
            }

            else if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'telephone') // For Valid Mobile
            {
              if (!this.vldChkLst.validMob(addMoreTdDataValidatorloop['ctrlValue'])) {
                addmreValidStaus = false;
                break;
              }
            }

            else if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'password') // For password Validation
            {
              if (!this.vldChkLst.validPassword(addMoreTdDataValidatorloop['ctrlValue'])) {
                addmreValidStaus = false;
                break;
              }

            }
          }
          else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 3) // Dropdown Validation
          {
            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
            {
              if (!this.vldChkLst.selectDropdown(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'])) {
                addmreValidStaus = false;
                break;
              }
            }
          }
          else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 4) // Text Area and ckeditor Validation
          {
            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
            {
              if (!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'] + ' can not be left blank')) {
                addmreValidStaus = false;
                break;
              }
            }

            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'] != '') // For Max length
            {
              if (!this.vldChkLst.maxLength(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMaxLength'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'])) {
                addmreValidStaus = false;
                break;
              }
            }

            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'] != '')// For Min length
            {
              if (!this.vldChkLst.minLength(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMinLength'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'])) {
                addmreValidStaus = false;
                break;
              }
            }
          }

          else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 5) // Checkbox Validation
          {
            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
            {
              if (!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'] + ' can not be left blank')) {
                addmreValidStaus = false;
                break;
              }
            }
          }

          else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 6) // Radio Validation
          {
            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
            {
              if (!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['ctrlValue'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'] + ' can not be left blank')) {
                addmreValidStaus = false;
                break;
              }
            }
          }
          else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 7) // File Validation
          {
            if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlMandatory']) // For Mandatory
            {
              if (!this.vldChkLst.blankCheck(addMoreTdDataValidatorloop['uploadFile']['fileName'], arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlLabel'] + ' can not be left blank')) {
                addmreValidStaus = false;
                break;
              }
            }
          }
        }

      }
    }
    return addmreValidStaus
  }
  /**
  * Function Name: selectFinancialDetails
  * Description: This method is used to open Financial details modal
  * Created By: Bindurekha Nayak
  * Created On: 12th jan 2024
  */
  selectFinancialDetails() {
    this.open(this.financialDetailsModalRef);
  }

  /**
  * Function Name: selectPreviousClaimedDetails
  * Description: This method is used to open Claimed details modal
  * Created By: Bindurekha Nayak
  * Created On: 12th jan 2024
  */
  selectPreviousClaimedDetails() {
    this.open(this.previousClaimModalRef);
  }
  /**
   * Function Name: open
   * Description: This method is used open bootstarp modal
   * Created By: Bindurekha Nayak
   * Created On: 12th jan 2024
   */
  open(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }
  /**
   * Function Name: getFinancialDetails
   * Description: This method is used to set financial details fields
   * Created By: Bindurekha Nayak
   * Created On: 12th jan 2024
   * @param intId
   */
  getFinancialDetails(intId: any) {

    let index = this.objFinancialDetails.findIndex(x => x.intId === intId);
    $('.cls_institute_name').val(this.objFinancialDetails[index].vch_financial_institution_name);
    this.keyUpEvent('cls_institute_name');
    $('.cls_tl_sanc_amt').val(this.objFinancialDetails[index].vch_loan_sanctioned_amount);
    $('.cls_tl_date').val(this.objFinancialDetails[index].vch_loan_sanctioned_date);
    $('.cls_tl_tenure').val(this.objFinancialDetails[index].vch_tenure_term_loan * 12);
    $('.cls_interest_rate').val(this.objFinancialDetails[index].dcml_loan_sanctioned_interest_rate);
    this.modalService.dismissAll();
  }

  /**
   * Function Name: setAutofillUpFields
   * Description: This function is used to set Auto fill up fields data
   * Created By: Bindurekha Nayak
   * Created On: 12th jan 2024
   */
  setAutofillUpFields() {
    if (this.formEditStatus != 1) {
      let autoFillUpData = JSON.parse(sessionStorage.getItem('companyDetails'));
    let landInvestment: any = (<HTMLInputElement>document.getElementsByClassName('cls_tot_land_investment')[0]);
    if(landInvestment && (landInvestment.value == '' || landInvestment.value == undefined || landInvestment.value == null || landInvestment.value == 'NULL')){
      $('.cls_tot_land_investment').val(autoFillUpData['0'].vch_total_investment_loan);
    }
    let totalArea:any = (<HTMLInputElement>document.getElementsByClassName('cls_total_area')[0]);
    if(totalArea && (totalArea.value == '' || totalArea.value == undefined || totalArea.value == null || totalArea.value == 'NULL')){
      $('.cls_total_area').val(autoFillUpData['0'].vch_total_sqmeter);
    }
    // $('.cls_total_area').val(autoFillUpData.vch_total_sqmeter);
    let stampDutyCharges:any = (<HTMLInputElement>document.getElementsByClassName('cls_stamp_duty_charges')[0]);
    if(stampDutyCharges && (stampDutyCharges.value == '' || stampDutyCharges.value == undefined || stampDutyCharges.value == null || stampDutyCharges.value == 'NULL')){
      $('.cls_stamp_duty_charges').val(autoFillUpData['0'].vch_stamp_duty_charges);
    }
    // $('.cls_stamp_duty_charges').val(autoFillUpData.vch_stamp_duty_charges);
    let landConversionFee:any = (<HTMLInputElement>document.getElementsByClassName('cls_land_conversion_fee')[0]);
    if(landConversionFee && (landConversionFee.value == '' || landConversionFee.value == undefined || landConversionFee.value == null || landConversionFee.value == 'NULL')){
      $('.cls_land_conversion_fee').val(autoFillUpData['0'].vch_land_conversion_fee);
    }
    // $('.cls_land_conversion_fee').val(autoFillUpData.vch_land_conversion_fee);
    //let equityInvestment:any = (<HTMLInputElement>document.getElementsByClassName('cls_equity_investment')[0]);
    // if(equityInvestment && (equityInvestment.value == '' || equityInvestment.value == undefined || equityInvestment.value == null || equityInvestment.value == 'NULL')){
    //   $('.cls_equity_investment').val(autoFillUpData['0'].vch_equity_investment);
    // }
    // $('.cls_equity_investment').val(autoFillUpData.vch_equity_investment);
    let termLoanFromBank:any = (<HTMLInputElement>document.getElementsByClassName('cls_term_loan_from_bank_institution')[0]);
    if(termLoanFromBank && (termLoanFromBank.value == '' || termLoanFromBank.value == undefined || termLoanFromBank.value == null || termLoanFromBank.value == 'NULL')){
      $('.cls_term_loan_from_bank_institution').val(autoFillUpData['0'].vch_term_loan_finalcial_instituton);
    }
    // $('.cls_term_loan_from_bank_institution').val(autoFillUpData.vch_term_loan_finalcial_instituton);
    let expenditureBuildingCivilwork:any = (<HTMLInputElement>document.getElementsByClassName('cls_expenditure_building_civilwork')[0]);
    if (expenditureBuildingCivilwork && (!expenditureBuildingCivilwork.value || expenditureBuildingCivilwork.value === 'NULL')) {
      $('.cls_expenditure_building_civilwork').val(autoFillUpData['0'].vch_building_civilwork);
    }
    
    // $('.cls_expenditure_building_civilwork').val(autoFillUpData.vch_building_civilwork);
    let gstinRegdNumber:any = (<HTMLInputElement>document.getElementsByClassName('cls_gstin_regd_number')[0]);
    if(gstinRegdNumber && (gstinRegdNumber.value == '' || gstinRegdNumber.value == undefined || gstinRegdNumber.value == null || gstinRegdNumber.value == 'NULL')){
      $('.cls_gstin_regd_number').val(autoFillUpData['0'].vch_gstin_regd_number);
    }
    // $('.cls_gstin_regd_number').val(autoFillUpData.vch_gstin_regd_number);
    let instituteName:any = (<HTMLInputElement>document.getElementsByClassName('cls_institute_name')[0]);
    if(instituteName && (instituteName.value == '' || instituteName.value == undefined || instituteName.value == null || instituteName.value == 'NULL')){
      $('.cls_institute_name').val(autoFillUpData['0'].vch_company_name);
    }
    // $('.cls_institute_name').val(autoFillUpData.vch_company_name);
    let registrationNo:any = (<HTMLInputElement>document.getElementsByClassName('cls_registration_no')[0]);
    if(registrationNo && (registrationNo.value == '' || registrationNo.value == undefined || registrationNo.value == null || registrationNo.value == 'NULL')){
      $('.cls_registration_no').val(autoFillUpData['0'].vch_regd_no);
    }
    // $('.cls_registration_no').val(autoFillUpData.vch_regd_no);
    let registrationDate:any = (<HTMLInputElement>document.getElementsByClassName('cls_registration_date')[0]);
    if(registrationDate && (registrationDate.value == '' || registrationDate.value == undefined || registrationDate.value == null || registrationDate.value == 'NULL')){
      $('.cls_registration_date').val(autoFillUpData['0'].registrationDate);
    }
    }
    
    // $('.cls_registration_date').val(autoFillUpData.registrationDate);
    const claimedAmountField: any = (<HTMLInputElement>document.getElementsByClassName('cls_fca_d_none')[0]);
    if(claimedAmountField){
      const labelForClaimedAmount = claimedAmountField.parentNode.parentNode.parentNode.previousElementSibling;
      labelForClaimedAmount.style.display = 'none';
      claimedAmountField.style.display = 'none';
    }
    const internDocField: any = (<HTMLInputElement>document.getElementsByClassName('cls_intern_d_none')[0]);
    if(internDocField){
      const labelForInternDoc = internDocField.parentNode.parentNode.parentNode;
      labelForInternDoc.style.display = 'none';
      labelForInternDoc.parentNode.parentNode.style.display = 'none';
      internDocField.style.display = 'none';
    }

    this.autoCalculation();
  }



  addAddMoreArrTabularWise(arrAllAddMoreData: any) {
    let addmreTabularValidStaus = true;
    let addMreTrIndx = 0;
    let addMreTdIndx = 0;
    let addMoreTabularElmVal: any = '';
    let addMoreTabularelmValText: any = '';
    let addMoreTabularuploadFile: any = '';
    let addMrePushDetails: any = [];
    let addMoreTabularElementCtrlId;
    let arrAddmoreFilledTabularData: any[] = [];
    for (let addMoreTrTabularLoop of arrAllAddMoreData['addmorerowdata']) //TR Loop
    {

      let rowDataName = addMoreTrTabularLoop['ctrlRowdataName']
      addMreTdIndx = 0;
      addMrePushDetails = [];

      for (let addMoreTdTabularLoop of arrAllAddMoreData['addmoreDetails']) // TD Loop
      {
        addMoreTabularElmVal = '';
        addMoreTabularuploadFile = '';
        addMoreTabularelmValText = '';
        addMoreTabularElementCtrlId = addMoreTdTabularLoop['ctrlId'] + addMreTrIndx + addMreTdIndx;
        addMreTdIndx += 1;
        if (addMoreTdTabularLoop['ctrlTypeId'] == 1) // For Label
        {
          addMoreTabularElmVal = (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).innerText;
        }
        else if (addMoreTdTabularLoop['ctrlTypeId'] == 2) // Textbox Validation
        {
          addMoreTabularElmVal = (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).value;

          if (addMoreTdTabularLoop['ctrlMandatory']) // For Mandatory
          {
            if (!this.vldChkLst.blankCheck(addMoreTabularElmVal, addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ') can not be left blank')) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (addMoreTdTabularLoop['ctrlMaxLength'] != '' && Number(addMoreTdTabularLoop['ctrlMaxLength']) > 0) // For Max length
          {
            if (!this.vldChkLst.maxLength(addMoreTabularElmVal, addMoreTdTabularLoop['ctrlMaxLength'], addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')')) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (addMoreTdTabularLoop['ctrlMinLength'] != '' && Number(addMoreTdTabularLoop['ctrlMinLength']) > 0)// For Min length
          {
            if (!this.vldChkLst.minLength(addMoreTabularElmVal, addMoreTdTabularLoop['ctrlMinLength'], addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')')) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (addMoreTdTabularLoop['ctrlAttributeType'] == 'email') // For Valid Email
          {
            if (!this.vldChkLst.validEmail(addMoreTabularElmVal)) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }

          }
          else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'tel') // For Valid Mobile
          {
            if (!this.vldChkLst.validMob(addMoreTabularElmVal)) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }
          else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'telephoneNo') // For Valid Telephone No
          {
            if (!this.vldChkLst.validTel(addMoreTabularElmVal)) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }
          else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'telephone') // For Valid Mobile
          {
            if (!this.vldChkLst.validMob(addMoreTabularElmVal)) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'password') // For password Validation
          {
            if (!this.vldChkLst.validPassword(addMoreTabularElmVal)) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }

          }



          else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'date' && addMoreTabularElmVal.length > 0) {
            let elmValDate: any = addMoreTabularElmVal.split('-');
            addMoreTabularElmVal = elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];
          }
        }
        else if (addMoreTdTabularLoop['ctrlTypeId'] == 3) // Dropdown Validation
        {
          let elm: any = (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId));
          addMoreTabularElmVal = elm.value;
          addMoreTabularelmValText = elm.options[elm.selectedIndex].text;
          if (addMoreTdTabularLoop['ctrlMandatory']) // For Mandatory
          {
            if (!this.vldChkLst.selectDropdown(addMoreTabularElmVal, addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')')) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }
        }
        else if (addMoreTdTabularLoop['ctrlTypeId'] == 4) // Text Area and ckeditor Validation
        {

          if (addMoreTdTabularLoop['ctrlClass'] == this.ckEdtorCls) {
            addMoreTabularElmVal = (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).getAttribute("ng-reflect-model");
          }
          else {
            addMoreTabularElmVal = (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).value;
          }

          if (addMoreTdTabularLoop['ctrlMandatory']) // For Mandatory
          {
            if (!this.vldChkLst.blankCheck(addMoreTabularElmVal, addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')' + ' can not be left blank')) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (addMoreTdTabularLoop['ctrlMaxLength'] != '' && Number(addMoreTdTabularLoop['ctrlMaxLength']) > 0) // For Max length
          {
            if (!this.vldChkLst.maxLength(addMoreTabularElmVal, addMoreTdTabularLoop['ctrlMaxLength'], addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')')) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (addMoreTdTabularLoop['ctrlMinLength'] != '' && Number(addMoreTdTabularLoop['ctrlMinLength']) > 0) // For Min length
          {
            if (!this.vldChkLst.minLength(addMoreTabularElmVal, addMoreTdTabularLoop['ctrlMinLength'], addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')')) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }
        }

        else if (addMoreTdTabularLoop['ctrlTypeId'] == 5) // Checkbox Validation
        {
          if (addMoreTdTabularLoop['ctrlMandatory']) // For Mandatory
          {
            if (!this.vldChkLst.blankCheckRdoDynamic(addMoreTabularElementCtrlId, addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')')) {
              addmreTabularValidStaus = false;
              break;
            }
          }
          let chkdVal: any = '';
          let chkdTxt: any = '';
          const checkboxes: any = document.getElementsByName(addMoreTabularElementCtrlId);
          for (let checkbox of checkboxes) {
            if (checkbox.checked) {
              if (chkdVal.length > 0) {
                chkdVal += ',' + checkbox.value;
                let el = document.querySelector(`label[for="${checkbox.id}"]`);
                chkdTxt += ',' + el?.textContent;
              }
              else {
                chkdVal += checkbox.value;
                let el = document.querySelector(`label[for="${checkbox.id}"]`);
                chkdTxt += el?.textContent;
              }



            }
          }
          addMoreTabularElmVal = chkdVal.toString();
          addMoreTabularelmValText = chkdTxt;

        }

        else if (addMoreTdTabularLoop['ctrlTypeId'] == 6) // Radio Validation
        {
          if (addMoreTdTabularLoop['ctrlMandatory']) // For Mandatory
          {
            if (!this.vldChkLst.blankCheckRdoDynamic(addMoreTabularElementCtrlId, addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')')) {
              addmreTabularValidStaus = false;
              break;
            }
          }

          const radioBtnElmn = document.getElementsByName(addMoreTabularElementCtrlId);
          for (let i = 0, length = radioBtnElmn.length; i < length; i++) {
            if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
              addMoreTabularElmVal = (<HTMLInputElement>radioBtnElmn[i]).value;
              let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
              let el = document.querySelector(`label[for="${rdId}"]`);
              addMoreTabularelmValText = el?.textContent;
            }
          }
        }
        else if (addMoreTdTabularLoop['ctrlTypeId'] == 7) // File Validation
        {

          addMoreTabularuploadFile = this.arrUploadedFiles[addMoreTabularElementCtrlId];
          if (addMoreTdTabularLoop['ctrlMandatory']) // For Mandatory
          {
            if (addMoreTabularuploadFile == '' || addMoreTabularuploadFile == undefined || addMoreTabularuploadFile['fileName'] == '' || addMoreTabularuploadFile['fileName'] == undefined) {
              (<HTMLInputElement>document.getElementById(addMoreTabularElementCtrlId)).focus();
              Swal.fire({
                icon: 'error',
                text: ('Please upload') + ' ' + addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              });
              addmreTabularValidStaus = false;
              break;
            }
          }
          if (addMoreTabularuploadFile == '' || addMoreTabularuploadFile == undefined || addMoreTabularuploadFile['fileName'] == '' || addMoreTabularuploadFile['fileName'] == undefined) {
            addMoreTabularuploadFile = '';
          }

        }

        addMrePushDetails.push(
          {
            'ctrlTypeId': addMoreTdTabularLoop['ctrlTypeId'],
            'ctrlId': addMoreTdTabularLoop['ctrlId'],
            'ctrlName': addMoreTdTabularLoop['ctrlName'],
            'lblName': addMoreTdTabularLoop['ctrlLabel'],
            'ctrlValue': this.encDec.escapeHtml(addMoreTabularElmVal),
            'ctrlText': this.encDec.escapeHtml(addMoreTabularelmValText),
            'uploadFile': addMoreTabularuploadFile,
            'addMoreslNo': addMoreTrTabularLoop.ctrlRowdataSlNo,
            'addMoreTabularCtrlId': addMoreTabularElementCtrlId,
            'addMoreTabularCtrlLblName': addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
          });
      }


      if (!addmreTabularValidStaus) {
        break;
      }
      addMreTrIndx += 1;
      arrAddmoreFilledTabularData.push(addMrePushDetails);

    }


    return { 'validationStatus': addmreTabularValidStaus, arrAddmoreFilledTabularData: arrAddmoreFilledTabularData }

  }

  /**
   * Function Name: getOperationLocationDetails
   * Description: This function is used to fetch all operation location from Common Application form and Preview it.
   * Created By: Bindurekha Nayak
   * Created On: 11th jan 2024
   */
  getOperationLocationDetails(intProdId) {
    this.loading = true;
    let regParam = {
      'intId': intProdId
    };

    this.IrmsDetailsService.getOperationLocationDetails(regParam).subscribe(res => {
      if (res.status == 1) {
        this.loading = false;
        this.towerDeatilsList = res.result;
        if(this.towerDeatilsList.length > 0){
          this.isTowerAvailable = 1;
        }
      }
      else {
        this.loading = false;
      }
    });
  }


  /**
   * Function Name: getPrevClaimedExpenses
   * Description: This function is used to fetch all previously claimed expenses.
   * Created By: Bindurekha Nayak
   * Created On: 10th jan 2024
   */
  getPrevClaimedExpenses() {
    this.loading = true;
    let intProdId = sessionStorage.getItem("intProfileId");
    let regParam = {
      'intProfileId': intProdId
    };
    this.IrmsDetailsService.getMarketingPrevClaimedExpenses(regParam).subscribe(res => {
      if (res.status == 1 && Object.keys(res.result).length > 0) {
        setTimeout(() => {
          let bindData = '<table class="table table-striped">';
          if (Object.keys(res.result).length > 0) {
            for (let data of res.result) {
              bindData += '<tr>';
              bindData += '<td><input class="form-control" type="text" value="' + data.prevClaimAmount + '" readonly></td>';
              bindData += '<td><input class="form-control" type="text" value="' + data.prevClaimDate + '" readonly></td>';
              bindData += '</tr>';
            }
            bindData += '</table>';
            $('.cls_marketing_prev_claim_history').after(bindData);
            $('.cls_marketing_prev_claim_amount').parent().parent().parent().parent().find("label").hide();
            $('.cls_marketing_prev_claim_amount').hide();
            $('.cls_marketing_prev_claim_date').parent().parent().parent().parent().find("label").hide();
            $('.cls_marketing_prev_claim_date').hide();
            this.loading = false;
          }
        }, 1000);
      }
      else {
        this.loading = false;
      }
    });
    this.IrmsDetailsService.getPrevPatentRegdClaimDetails(regParam).subscribe(res => {
      if (res.status == 1 && Object.keys(res.result).length > 0) {
        setTimeout(() => {
          let bindData = '<table class="table table-striped">';
          if (Object.keys(res.result).length > 0) {
            for (let data of res.result) {
              bindData += '<tr>';
              bindData += '<td><input class="form-control" type="text" value="' + data.prevClaimAmount + '" readonly></td>';
              bindData += '<td><input class="form-control" type="text" value="' + data.prevClaimDate + '" readonly></td>';
              bindData += '</tr>';
            }
            bindData += '</table>';
            $('.cls_patent_regd_cost_history').after(bindData);
            $('.cls_patent_regd_cost_claim_amount').parent().parent().parent().parent().find("label").hide();
            $('.cls_patent_regd_cost_claim_amount').hide();
            $('.cls_patent_regd_claim_date').parent().parent().parent().parent().find("label").hide();
            $('.cls_patent_regd_claim_date').hide();
            this.loading = false;
          }
        }, 1000);
      }
      else {
        this.loading = false;
      }
    });
    this.IrmsDetailsService.getPrevInternetClaimDetails(regParam).subscribe(res => {
      if (res.status == 1 && Object.keys(res.result).length > 0) {
        setTimeout(() => {
          let bindData = '<table class="table table-striped">';
          if (Object.keys(res.result).length > 0) {
            for (let data of res.result) {
              bindData += '<tr>';
              bindData += '<td><input class="form-control" type="text" value="' + data.prevClaimAmount + '" readonly></td>';
              bindData += '<td><input class="form-control" type="text" value="' + data.prevClaimStartDate + '" readonly></td>';
              bindData += '<td><input class="form-control" type="text" value="' + data.prevClaimEndDate + '" readonly></td>';
              bindData += '</tr>';
            }
            bindData += '</table>';
            $('.cls_internet_connectivity_claim_history').after(bindData);
            $('.cls_internet_connectivity_claim_amount').parent().parent().parent().parent().find("label").hide();
            $('.cls_internet_connectivity_claim_amount').hide();
            $('.cls_internet_connectivity_claim_start_date').parent().parent().parent().parent().find("label").hide();
            $('.cls_internet_connectivity_claim_start_date').hide();
            $('.cls_internet_connectivity_claim_end_date').parent().parent().parent().parent().find("label").hide();
            $('.cls_internet_connectivity_claim_end_date').hide();
            this.loading = false;
          }
        }, 1000);
      }
      else {
        this.loading = false;
      }
    });
  }
  setStaticDependBindArr(casDetails: any, parentCtrlId: any) // Set the static array if depended Static Details exists
  {

    if (!Object.keys(this.arrallStaticDependtDetails).includes(parentCtrlId)) {

      this.arrallStaticDependtDetails[parentCtrlId] = casDetails;

    }
  }

  loadStaticDetails(ctrlId: any, ctrlTypeId: any) // Load The depended Static Details if exist
  {
    if (Object.keys(this.arrallStaticDependtDetails).includes(ctrlId)) {
      let parnetStaticValue = ''
      if (ctrlTypeId == 6) {
        const radioBtnElmn = document.getElementsByName(ctrlId);
        for (let i = 0, length = radioBtnElmn.length; i < length; i++) {
          if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
            parnetStaticValue = (<HTMLInputElement>radioBtnElmn[i]).value;
          }
        }
      }
      else {
        parnetStaticValue = (<HTMLInputElement>document.getElementById(ctrlId)).value;
      }

      if (this.arrCascadingBindDependtDetails[ctrlId] != undefined) {


        this.arrCascadingBindDependtDetails[ctrlId].splice(0, this.arrCascadingBindDependtDetails[ctrlId].length);

      }

      for (let staticCasLoop of this.arrallStaticDependtDetails[ctrlId]) {
        if (staticCasLoop['ctrlCCStaticFieldValue'] == parnetStaticValue) {
          if (this.arrCascadingBindDependtDetails[ctrlId] == undefined) {
            this.arrCascadingBindDependtDetails[ctrlId] = [{ 'ctrlCCStaticName': staticCasLoop['ctrlCCStaticName'], 'ctrlCCStaticValue': staticCasLoop['ctrlCCStaticValue'] }];
          }
          else {
            this.arrCascadingBindDependtDetails[ctrlId].push({ 'ctrlCCStaticName': staticCasLoop['ctrlCCStaticName'], 'ctrlCCStaticValue': staticCasLoop['ctrlCCStaticValue'] });
          }
        }

      }

    }
  }


  setArrhAllchildOfParent(ids: any) {
    const allParms: any = document.querySelectorAll("[data-dynbinddependctlfldid=" + ids + "]");
    // attr.data-dependctrlId
    let loadDynchldDetls: any = document.querySelectorAll("[data-dependctrlId=" + ids + "]");
    if (loadDynchldDetls.length > 0) {
      this.loadDynBindAllData[ids] = loadDynchldDetls;
    }


    if (allParms.length == 0) {
      return;
    }
    else {
      for (let allParmsLoop of allParms) {
        let allRecurChildID: any = allParmsLoop.getAttribute('data-typeid');
        if (allRecurChildID == 5 || allRecurChildID == 6) {
          this.parentDetVal.push(allParmsLoop.name);
          this.setArrhAllchildOfParent(allParmsLoop.name);
        }

        this.parentDetVal.push(allParmsLoop.id);
        this.setArrhAllchildOfParent(allParmsLoop.id);
      }
    }
  }

  hideAllChildParent(parentDetails: any, dpndval: any) {

    let parentId = parentDetails.id;
    this.setArrhAllchildOfParent(parentId);
    if (this.loadDynBindAllData[parentId] != '' && this.loadDynBindAllData[parentId] != undefined && this.loadDynBindAllData[parentId].length > 0) {
      this.hideAllDependTData(this.loadDynBindAllData[parentId]);
    }
    for (let allChilds of this.parentDetVal) {

      let childEle: any = document.getElementById(allChilds);
      if (childEle) {
        let tpId = childEle.getAttribute('data-typeid');



        if (tpId == 2 && this.loadDyndata == 1) {

          (<HTMLInputElement>document.getElementById(childEle.id)).value = '';


        }
        else if (tpId == 3 && this.loadDyndata == 1) {
          this.arralldynVal[childEle.id] = [];

          // (<HTMLInputElement>document.getElementById(childEle.id))
          (<HTMLInputElement>document.getElementById(childEle.id)).value = '0';
        }

        else if (tpId == 4 && this.loadDyndata == 1) {

          let elmle: any = (<HTMLInputElement>document.getElementById(childEle.id));
          if (elmle.selectedIndex != undefined) {
            elmle.options[elmle.selectedIndex].text = '';
          }


        }
        else if ((tpId == 5 || tpId == 6) && this.loadDyndata == 1) {

          let chckboxClear: any = (document.getElementsByName(childEle.name));
          for (let dynrdobndtype of chckboxClear) {
            if (dynrdobndtype.checked) {
              dynrdobndtype.checked = false;
            }
            if (dynrdobndtype.getAttribute('data-dbStatus') == true) {
              dynrdobndtype.checked = true;
              dynrdobndtype.setAttribute('data-dbStatus', false);

            }

          }

        }


        else if (this.loadDyndata == 1) {
          (<HTMLInputElement>document.getElementById(childEle.id)).value = '';
          document.getElementById('fileDownloadDiv_' + childEle.id)?.querySelector('.downloadbtn')?.setAttribute('href', '');
          document.getElementById('fileDownloadDiv_' + childEle.id)?.classList.add('d-none');
          delete this.arrUploadedFiles[childEle.id];
        }

      }
    }
    this.parentDetVal.splice(0, this.parentDetVal.length);

  }
  hideAllDependTData(arrAllDependtData: any) {


    for (let allChildsa of arrAllDependtData) {
      if (allChildsa.getAttribute('data-dependflagstatus') == 'true') {
        let tpId = allChildsa.getAttribute('data-typeid');
        allChildsa.closest(".dynGridCls").classList.add('d-none');
        if (tpId != 8) {
          allChildsa.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');
        }
        allChildsa.classList.add('d-none');
      }
    }

  }
  /**
   * function name: autoCalculation
   * function description: used to calculate and auto fill the form.
   */
  autoCalculation() {
    let companyData = JSON.parse(sessionStorage.getItem('companyDetails'));
    const incorporationdate = companyData[0].dtm_incorporation_date;
    const gender = companyData[0].int_gender;
    const socialcategory = companyData[0].int_social_category;
    const disabled = companyData[0].int_physically_handicapped;
    const empcount = companyData[0].int_total_emp;
    //let empcount: any = 41;
    let totalSubsidableSpace: any = 0;
    let expense: any = 0;
    let subsidy: number = 0;
    let subsidyCapping: number = 0;
    let finalsubsidy: any = 0;
    let total: any = 0;
    

    let h4Text: any = document.getElementsByTagName('h4')[0].innerText;
    console.log(h4Text +'--' +'[ProcessId=='+this.processId+']');
    this.processId = parseInt(this.processId);
    switch (this.processId) {
      /*Start of calculation for Lease Rental Reimbursement Developed By Bindurekha Nayak*/
      case 31:{
        this.getOperationLocationDetails(sessionStorage.getItem('REGD_ID'));
          let leaseStartDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rental_start ')[0]);
          let leaseEndDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rental_end')[0]);
          let feePaidAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_paid_rental')[0]);
          let totalRentalAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_subsidy_amount')[0]);
          let monthlyPaymentAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_lRLeaMonPayment')[0]);
          let claimPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
          let param = {
            "intId": sessionStorage.getItem('REGD_ID')
          }
          this.IrmsDetailsService.getFounderPercentageValue(param).subscribe(res => {
            this.founderPercentValue = res.result;
              if(this.founderPercentValue.int_gender==1){
                for (let i = 0; i < 3; i++) {
                  claimPeriodElement.remove(claimPeriodElement.options.length - 1);
                }
                this.claimLimit = 2;
              }else{
                this.claimLimit = 5;
              }
          });
          let previousClaimPeriod = parseInt(claimPeriodElement.value);
          claimPeriodElement.addEventListener('change', function () {
              let claimPeriod = parseInt(claimPeriodElement.value);
              if (claimPeriod !== previousClaimPeriod) {
                  previousClaimPeriod = claimPeriod; 
                  
                  if (claimPeriod <= 0) {
                      Swal.fire({
                          icon: 'error',
                          text: 'Please select a valid Claim period!'
                      });
                      leaseStartDate.value = '';
                      leaseEndDate.value = '';
                  } else {
                    leaseStartDate.value = '';
                    leaseEndDate.value = '';
                  }
              }
          });
          leaseStartDate.addEventListener('change', () => {
            let claimPeriod = parseInt(claimPeriodElement.value);
            feePaidAmount.value='';
            leaseEndDate.value='';
            totalRentalAmount.value='';
            if(claimPeriod <= 0){
              Swal.fire({
                icon: 'error',
                text: 'Please select Claim period first!'
              })
              leaseStartDate.value = '';
              leaseEndDate.value ='';
            }else{
              let startDate = new Date(leaseStartDate.value);
              let endDate = new Date(leaseEndDate.value);
                if(endDate < startDate){
                  leaseEndDate.value = '';
                  Swal.fire({
                    icon: 'error',
                    text: 'End date can not be less than start date'
                  });
                } else {
                  let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
                  let prvParam = {
                    "intId": sessionStorage.getItem('REGD_ID'),
                    "onlineProcessId": this.processId,
                    "profileId": sessionInfo.USER_ID,
                    "incStartDate": leaseStartDate.value,
                    "claimLimit": this.claimLimit,
                };
                this.loading = true;
                  this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
                  this.loading = false;
                  let claimedPeriod = parseInt(res.claimedPeriod);
                  let lastIncentiveDate = res.lastIncDate;
                  if(res.status == 2){
                    if(claimedPeriod >= this.claimLimit){
                      leaseEndDate.value = '';
                      Swal.fire({
                        icon: 'error',
                        text: 'You have already claimed for the maximum period i.e ' + this.claimLimit + ' Years!'
                      });
                    } else{
                      Swal.fire({
                        icon: 'error',
                        title: 'Date Ineligibility',
                        html: "You have already applied until '<b>" + lastIncentiveDate + "</b>' ! </br> Please apply after this date",
                      });
                    }
                    leaseStartDate.value = '';
                  } else {
                    let ClaimablePeriod = this.claimLimit - claimedPeriod;
                    if(claimPeriod > ClaimablePeriod){
                      Swal.fire({
                        icon: 'error',
                        text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                      });
                      leaseStartDate.value = '';
                      leaseEndDate.value = '';
                    } else {
                    let fromDate      = new Date(leaseStartDate.value);
                    let toDate        = new Date(fromDate);
                    let currentDate   = new Date();
                    toDate.setFullYear(fromDate.getFullYear() + claimPeriod);
                    // Validating if toDate is less than or equal to current date
                    if (toDate <= currentDate) {
                        let formattedToDate    = toDate.toISOString().slice(0, 10);
                        leaseEndDate.value    = formattedToDate;
                        leaseEndDate.readOnly = true;
                        leaseEndDate.dispatchEvent(new Event('change'));
                    } else {
                      Swal.fire({
                        icon: 'error',
                        text: 'As of current date, you are not eligible for ' + (claimPeriod > 1 ? claimPeriod + ' years' : claimPeriod + ' year') + ' of subsidy'
          
                      })
                    }
                  }
                  }
                  });
                }
              }
          });
          leaseEndDate.readOnly = true;
          leaseEndDate.addEventListener('change', () => {
              let startDate = new Date(leaseStartDate.value);
              let endDate = new Date(leaseEndDate.value);
              if (endDate < startDate) {
                leaseEndDate.value = '';
                Swal.fire({
                  icon: 'error',
                  text: 'End date can not be less than start date'
                });
              }else{
                let policyEndDateCheck = this.eligibilityEndDateCheck('cls_rental_end');
                if(policyEndDateCheck==0){
                  let startDate = new Date(leaseStartDate.value);
                  let endDate = new Date(leaseEndDate.value);
                  
                  let diffMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

                    if (diffMonth < 0) {
                      diffMonth = 0; // Handle negative differences if needed
                    }
                    if(monthlyPaymentAmount.value > 0){
                      feePaidAmount.value = monthlyPaymentAmount.value * diffMonth;
                      feePaidAmount.dispatchEvent(new Event('input'));
                    } else {
                      leaseEndDate.value = '';
                      leaseStartDate.value =''; 
                      Swal.fire({
                        icon: 'error',
                        text: 'Please calculate the monthly lease/rental payment before fee paid amount!'
                      });
                    }
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Ineligibility Notification',
                    html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date by one year.',
                  });
                  leaseEndDate.value = '';
                }
              }
          });
          monthlyPaymentAmount.addEventListener('input', function() {
            feePaidAmount.value='';
            leaseStartDate.value='';
            leaseEndDate.value='';
            totalRentalAmount.value='';
          });
          const updateRentalAmount = () => {
            if (feePaidAmount.value > 0) {
              let param = {
                "intId": sessionStorage.getItem('REGD_ID')
              };
              this.IrmsDetailsService.getFounderPercentageValue(param).subscribe(res => {
                //if (res.status == 1) {
                  this.founderPercentValue = res.result;
                  let finalInputVal, cappingVal = claimPeriodElement.value * 1000000;
                  
                  if (this.founderPercentValue.int_gender == 2 || 
                      this.founderPercentValue.int_category == 2 || 
                      this.founderPercentValue.int_category == 3 || 
                      this.founderPercentValue.int_handicapped == 1) {
                    finalInputVal = feePaidAmount.value * 65 / 100;
                  } else {
                    finalInputVal = feePaidAmount.value * 40 / 100;
                  }
          
                  totalRentalAmount.value = (finalInputVal > cappingVal) ? cappingVal : finalInputVal;
                //}
              });
            }
          };
          
        feePaidAmount.addEventListener('input', updateRentalAmount);
        totalRentalAmount.addEventListener('input', updateRentalAmount);
        let towerElement: any = (<HTMLInputElement>document.getElementsByClassName('custom_hd')[0]);
        let towerSelectButton = document.createElement('button');
        towerSelectButton.textContent = 'Select Tower';
        towerSelectButton.classList.add('btn','btn-outline-primary','custom-dynamic-button');
        towerElement.insertAdjacentElement('afterEnd',towerSelectButton);
        let hrElement = document.createElement('hr');
        towerSelectButton.insertAdjacentElement('afterend', hrElement);
        towerSelectButton.addEventListener('click', () => {
          this.open(this.towerDetailsModalRef);
        });
         
        this.fillUpMdInfo('cls_lrrName', 'cls_lrrDesg');
        this.fromToDateValidation();
        this.fromAlphaNumericValidation();
       }
        break;
        /*End of calculation for Lease Rental Reimbursement */

      /*Start of calculation for Interest Subsidy IT Policy */
      case 40:
        //let policyDataStr = sessionStorage.getItem('SCHEME_POLICY_DET');
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDegn');
        let checkPrevClaimParams = {
          "intProfId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID'),
          "onlineProcessId": this.processId,
        };
        let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
        // this.isCappingValue = 100000000;
        // let enterprenureParam = {
        //   "intId": sessionStorage.getItem('REGD_ID')
        // }
        // this.IrmsDetailsService.getFounderPercentageValue(enterprenureParam).subscribe(res => {
        //   if(res.eligible == 1){
        //     this.isCappingValue = this.isCappingValue + (this.isCappingValue * 0.01);
        //   }
        // });
        let param = {
          "onlineProcessId": this.processId,
          "profileId": farmerInfo.USER_ID,
          "intId": sessionStorage.getItem('REGD_ID')
        }
       
        this.IrmsDetailsService.getPastRecordEmpTotal(param).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
          }
        });

        
        let financialTxtElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_iRFinancialDetails')[0]);
        let button = document.createElement('button');
        button.textContent = 'Select Details';
        button.classList.add('btn','btn-outline-primary','custom-dynamic-button');
        let h6Element = financialTxtElement?.closest('.h6');
        if( h6Element == null){
        let parentElement = financialTxtElement.closest('div[id^="ctrl_"]');
        let headingBtnDiv = parentElement.querySelector('.heading-btn');
        h6Element = headingBtnDiv?.querySelector('.h6');
        }
        if (h6Element) {
            h6Element.insertAdjacentElement('afterend', button);
        }
        button.addEventListener('click', () => {
          this.selectFinancialDetails();
        });
        this.fillUpPrevDetails('cls_isPreviousClaimAmount');
        //calculation added by Manish Kumar | date of 13-05-2024
        let totalInvestmentElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_is_totalInvestment')[0]);
        const inputs = this.el.nativeElement.querySelectorAll('.cls_total_sum_calc') as NodeListOf<HTMLInputElement>;
        const values = Array.from(inputs).map(input => Number(input.value) || 0);
        this.totalIntersetInvestment = values.reduce((acc, currentValue) => acc + currentValue, 0);
        const totalInvestmentWithAsset = this.totalIntersetInvestment + this.intersetSubsidyeditAssetAmount;
        // console.log("totalInvestmentWithAsset", totalInvestmentWithAsset);
        this.interestSubsidyCalculation(totalInvestmentWithAsset);
        inputs.forEach(input => {
          input.addEventListener('input', () => {
              // Recalculate the total sum whenever the input value changes
              const updatedValues = Array.from(inputs).map(input => Number(input.value) || 0);
              this.totalIntersetInvestment = updatedValues.reduce((acc, currentValue) => acc + currentValue, 0);
              totalInvestmentElement.value = this.totalIntersetInvestment
              this.interestSubsidyCalculation(totalInvestmentElement.value);
          });
        });

        // totalInvestmentElement.value =  totalInvestmentWithAsset;
        // this.interestSubsidyCalculation(totalInvestmentElement.value);

        totalInvestmentElement.addEventListener('input', () =>{
          this.interestSubsidyCalculation(totalInvestmentElement.value);
        });
        // totalInvestmentElement.value =  totalInvestmentWithAsset;
        // this.interestSubsidyCalculation(totalInvestmentElement.value);

        //this.interestSubsidyCalculation(totalInvestmentElement.value);
        //console.log(this.totalIntersetInvestment);

        let periodMonth = 0;
        let SubsidyPeriodElement : any = (<HTMLInputElement>document.getElementsByClassName('cls_epfSubsidyPeriod')[0]);
        let fromDateInputElement : any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimFrom')[0]);
        let toDateInputElement : any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTo')[0]);
        let claimIncentiveInputElement : any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTotal')[0]);
        let repaymentElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isTotRepayment')[0]);
       
        let previousValueOfTotalInventment = totalInvestmentElement.value;
        //this.repaymentClaimIncentiveCalculation(repaymentElement.value);
        totalInvestmentElement.addEventListener('input', (event) => {
          totalInvestmentElement.value = previousValueOfTotalInventment;
        });
        
        repaymentElement.addEventListener('input', (event) => {
         // event.preventDefult();
          repaymentElement.value = '';
          repaymentElement.value = this.totalIntersetRePayment;
          //this.repaymentClaimIncentiveCalculation(this.totalIntersetRePayment);
        });


        claimIncentiveInputElement.addEventListener('input', (event) => {
          claimIncentiveInputElement.value = '';
          claimIncentiveInputElement.value = this.finalRepayementClaimAmount.toFixed(2)
        });

        SubsidyPeriodElement.addEventListener('change', () => {
          toDateInputElement.readOnly = true;
          this.periodOfSubsidy = SubsidyPeriodElement.value;
          this.loading = true;
          this.IrmsDetailsService.checkPreviousDateIncentive(checkPrevClaimParams).subscribe((res: any) => {
            this.loading = false;
            //console.log("claimTo",res.result.dtm_claim_to);
            if (res.status == 1) {
              let prevClaimDuration = res.result.total_subsidy_period;
              let currentClaimDuration: number = parseInt(prevClaimDuration) + parseInt(SubsidyPeriodElement.value);
              if(currentClaimDuration > 5) {
                Swal.fire({
                  icon: 'error',
                  text: 'You have already applied for '+res.result.total_subsidy_period+' years and this incentive is applicable for total 5 years!'
                });
                //this.periodOfSubsidy = 0;
                SubsidyPeriodElement.value = 0;
                fromDateInputElement.value = '';
                toDateInputElement.value = '';
                claimIncentiveInputElement.value = '';
              }
            }
          });
          let totalSubsidyValue = this.finalRepayementClaimAmount * this.periodOfSubsidy;
          if(this.periodOfSubsidy > 0){
            claimIncentiveInputElement.value = totalSubsidyValue.toFixed(2);
          }
          else {
            claimIncentiveInputElement.value = this.finalRepayementClaimAmount;
          }
          
          const fromDate = moment(fromDateInputElement.value, 'YYYY-MM-DD');
          const formattedDate = fromDate.clone().add(this.periodOfSubsidy, 'years').format('YYYY-MM-DD');
          toDateInputElement.value = formattedDate;

        });
        //this.totalIntersetRePayment = repaymentElement.value/this.periodOfSubsidy;
        this.totalIntersetRePayment = repaymentElement.value;
        this.repaymentClaimIncentiveCalculation(repaymentElement.value);
        fromDateInputElement.addEventListener('input', () => {
          let policyEndDateCheck = this.eligibilityEndDateCheck('cls_isPisClaimTo');
          console.log("policyEndDateCheck",policyEndDateCheck);
          if(policyEndDateCheck==1){
            
              Swal.fire({
                icon: 'error',
                title: 'Ineligibility Notification',
                html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date by year.',
              });
              fromDateInputElement.value = '';
              toDateInputElement.value = '';
              
          }
      
          
    
          // let periodInterestSubsidy: number = parseInt(SubsidyPeriodElement.value);
          if (this.periodOfSubsidy == 0) {
            Swal.fire({
              icon: 'error',
              text: 'Please Select Subsidy Period'
            });
            this.loading = false;
            fromDateInputElement.value = '';
            return;
          }
    
          // let fromDate = moment(fromDateInputElement.value, 'YYYY-MM-DD');
          const fromDate = moment(fromDateInputElement.value, 'YYYY-MM-DD');
          const formattedDate = fromDate.clone().add(this.periodOfSubsidy, 'years').format('YYYY-MM-DD');
          toDateInputElement.value = formattedDate;
          this.loading = true;
          this.IrmsDetailsService.checkPreviousDateIncentive(checkPrevClaimParams).subscribe((res: any) => {
          
            //console.log("claimTo",res.result.dtm_claim_to);
            if (res.status == 1) {
              this.loading = false;
              const fromDateMoment = moment(fromDateInputElement.value, 'YYYY-MM-DD');
              const resultToDate = moment(res.result.dtm_claim_to, 'YYYY-MM-DD');
              if (fromDateMoment.isValid() && resultToDate.isValid()) {
                if (resultToDate.isSameOrAfter(fromDateMoment)) {
                    Swal.fire({
                        icon: 'error',
                        text: "Can't Apply, You have already Applied for this time period"
                    });  
                    fromDateInputElement.value='';
                    toDateInputElement.value='';
                    claimIncentiveInputElement.value ='';
                }
              }
            }
          });
        });

        let amountOfTermLoanSanctionEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_tl_sanc_amt')[0]);
        let termLoanReleasedEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_termLoan')[0]);
        let repaymentPrincipleAmountEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_princ_amount')[0]);
        let tenureTermLoanElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_tl_tenure')[0]);
        
        amountOfTermLoanSanctionEle.addEventListener('input', () => {
          if(amountOfTermLoanSanctionEle.value > 0){
            amountOfTermLoanSanctionEle.value = amountOfTermLoanSanctionEle.value;
          } else {
            amountOfTermLoanSanctionEle.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Amount of Term Loan sanctioned should be greater than 0'
            });
          } 
        });

        termLoanReleasedEle.addEventListener('input', () => {
          let amountofLoanSanction : number = amountOfTermLoanSanctionEle.value;
          let termLoanReleasedValue : number = termLoanReleasedEle.value;
          if (Number(amountofLoanSanction) < Number(termLoanReleasedValue)) {
            termLoanReleasedEle.value = '';
            Swal.fire({
              icon: 'error',
              text: "Term loan released amount can't be greater than Amount of term loan sanctioned"
            });
          }
        });

        repaymentPrincipleAmountEle.addEventListener('input', () => {
          let amountofLoanrelesed : number = termLoanReleasedEle.value;
          let repaymentPrincipleAmountValue : number = repaymentPrincipleAmountEle.value;
          if (Number(amountofLoanrelesed) < Number(repaymentPrincipleAmountValue)) {
            repaymentPrincipleAmountEle.value = '';
            Swal.fire({
              icon: 'error',
              text: "Repayment of Principle Amount can't be greater than Amount of Term loan released"
            });
          }
        });

        // tenureTermLoanElement.addEventListener('input', () => {
        //   if(tenureTermLoanElement.value > 60) {
        //     tenureTermLoanElement.value = '';
        //     Swal.fire({
        //       icon: 'error',
        //       text: "Tenure for Term Loan maximum available for 60 Months"
        //     });
        //   }
        // });

        // let buildAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_iSBuildCivil')[0]);
        // let equipmentAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_iSNewEqip')[0]);
        // buildAmountElement.addEventListener('input', () => {
        //   this.buildingCivilAmount = parseFloat(buildAmountElement.value);
        //   this.calculateTotalCapital();
        // });
        // equipmentAmountElement.addEventListener('input', () => {
        //   this.equipmentAmount = parseFloat(equipmentAmountElement.value);
        //   this.calculateTotalCapital();
        // });
        // let repaymentElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isTotRepayment')[0]);
        // repaymentElement.addEventListener('keyup', () =>{
        //     let repaymentValue = repaymentElement.value;
        //     this.interestSubsidyCalculation(repaymentValue);

        // });
        // let totalRepaymentelement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTotal')[0]);
        let repaymentDateelement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimFrom')[0]);

        // repaymentElement.addEventListener('keyup', () =>{
        //   let repaymentValue = repaymentElement.value;
        //   totalRepaymentelement.value = repaymentValue * 0.05;
        //   totalRepaymentelement.value = (totalRepaymentelement.value > this.isCappingValue) ? this.isCappingValue : totalRepaymentelement.value;
        // });

        // totalRepaymentelement.addEventListener('keyup', () => {
        //   totalRepaymentelement.value = (totalRepaymentelement.value > this.isCappingValue) ? this.isCappingValue : totalRepaymentelement.value;
        // });

        // let isPisClaimToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTo ')[0]);
        // isPisClaimToDate.addEventListener('change', () => {
        //     let res = this.eligibilityDateCheck('cls_isPisClaimFrom ','cls_isPisClaimTo ');
        //     if(res == 1){
        //       this.loading = true;
        //       let param = {
        //         "intProfId": this.userId,
        //         "intId": sessionStorage.getItem('REGD_ID'),
        //         "onlineProcessId": this.processId,
        //         "fromdate": repaymentDateelement.value,
        //         "todate": isPisClaimToDate.value,
        //         "yearLimit": 5,    
        //       }
        //       this.IrmsDetailsService.yearWithDateEligibility(param).subscribe(res => {
        //         this.loading = false;
        //         if(res.status == 0){
        //           isPisClaimToDate.value = '';
        //           Swal.fire({
        //             icon: 'error',
        //             text: res.msg
        //           });
        //         }
        //       });
        //     }
        //   });
          this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Interest Subsidy IT Policy */

      /*Start of calculation for Investment Subsidy Developed By Bindurekha Nayak*/
      case 94:
        this.fromToDateValidation();
        let ivsSubAmount: any = document.getElementsByClassName('cls_iseAmount')[0];
        let ivsSubTotal: any = document.getElementsByClassName('cls_iseTotalAmount')[0];
        let ivsClaimedElement: any = document.getElementsByClassName('cls_claim_amount')[0];
        let iseCapitalExp: any = document.getElementsByClassName('cls_iseCapitalExp')[0];
        let expBuildingCivilwork: any = document.getElementsByClassName('cls_building_civilwork')[0];
        let isePlantMach: any = document.getElementsByClassName('cls_isePlantMach')[0];
        let iseRefurPlant: any = document.getElementsByClassName('cls_iseRefurPlant')[0];
        let iseRandD: any = document.getElementsByClassName('cls_iseRandD')[0];
        let cls_iseUtilities: any = document.getElementsByClassName('cls_iseUtilities')[0];
        let cls_iseTransferTech: any = document.getElementsByClassName('cls_iseTransferTech')[0];
        this.fillUpMdInfo('cls_iseName', 'cls_isedesn');
        this.iseCapitalExpAmount = (iseCapitalExp.value == '') ? 0 : parseFloat(iseCapitalExp.value);
        this.ivsSubBuildingAmount = (expBuildingCivilwork.value == '') ? 0 : parseFloat(expBuildingCivilwork.value);
        this.ivsSubPlantAmount = (isePlantMach.value == '') ? 0 : parseFloat(isePlantMach.value);
        this.ivsSubRefAmount = (iseRefurPlant.value == '') ? 0 : parseFloat(iseRefurPlant.value);
        this.ivsSubRndAmount = (iseRandD.value == '') ? 0 : parseFloat(iseRandD.value);
        this.ivsSubUtilityAmount = (cls_iseUtilities.value == '') ? 0 : parseFloat(cls_iseUtilities.value);
        this.ivsSubTransAmount = (cls_iseTransferTech.value == '') ? 0 : parseFloat(cls_iseTransferTech.value);
        this.invSubTotalAssAmount = (this.amountAddMoreDet == '') ? 0 : parseFloat(this.amountAddMoreDet);
        this.invSubCapitalAmount();
        if(ivsSubTotal.value>0){
          this.getFounderPercentageValue();
        }
       
        iseCapitalExp.addEventListener('input', () => {
          this.iseCapitalExpAmount = (iseCapitalExp.value == '') ? 0 : parseFloat(iseCapitalExp.value);
          this.invSubCapitalAmount();
        });
        expBuildingCivilwork.addEventListener('input', () => {
          this.ivsSubBuildingAmount = (expBuildingCivilwork.value == '') ? 0 : parseFloat(expBuildingCivilwork.value);
          this.invSubCapitalAmount();
        });
        isePlantMach.addEventListener('input', () => {
          this.ivsSubPlantAmount = (isePlantMach.value == '') ? 0 : parseFloat(isePlantMach.value);
          this.invSubCapitalAmount();
        });
        iseRefurPlant.addEventListener('input', () => {
          this.ivsSubRefAmount = (iseRefurPlant.value == '') ? 0 : parseFloat(iseRefurPlant.value);
          this.invSubCapitalAmount();
        });
        iseRandD.addEventListener('input', () => {
          this.ivsSubRndAmount = (iseRandD.value == '') ? 0 : parseFloat(iseRandD.value);
          this.invSubCapitalAmount();
        });
        cls_iseUtilities.addEventListener('input', () => {
          this.ivsSubUtilityAmount = (cls_iseUtilities.value == '') ? 0 : parseFloat(cls_iseUtilities.value);
          this.invSubCapitalAmount();
        });
        cls_iseTransferTech.addEventListener('input', () => {
          this.ivsSubTransAmount = (cls_iseTransferTech.value == '') ? 0 : parseFloat(cls_iseTransferTech.value);
          this.invSubCapitalAmount();
        });
        ivsSubTotal.addEventListener('input', () => {
          
          this.getFounderPercentageValue();
          
        });
        
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Investment Subsidy */


      /*Start of calculation for Quality Certification Fee Reimbursement Developed By Bindurekha Nayak*/
      case 39:
        this.fromToDateValidation();
        let qscfParam = {
            "onlineProcessId": this.processId,
            "profileId": this.userId,
            "intId": sessionStorage.getItem('REGD_ID')
          }
          this.IrmsDetailsService.getPastRecordEmpTotal(qscfParam).subscribe(res => {
            if(res.status == 200){
              this.previousClaimedSubsidy = res.result;
            }
          });
          this.intNoOfDateField = 1;
          this.fillUpPrevDetails('cls_qscfrAmount');
          this.fillUpMdInfo('cls_qscfrName', 'cls_qscfrDegn');
  
          subsidyCapping = 500000;
          let totalexpenditure: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expenditure')[0]);
          let finalSubsidy: any = (<HTMLInputElement>document.getElementsByClassName('cls_subsidy')[0]);
          let expenditureinputs: any = document.getElementsByClassName('cls_expenditure');
          let totalAmount: any = 0
          for (let button of expenditureinputs) {
            button.addEventListener("input", () => {
              total = 0;
              for (let i = 0; i < expenditureinputs.length; i++) {
                let data: any = $($(expenditureinputs[i])).val();
                if ($.isNumeric(data)) {
                  total += parseFloat(data);
                }
              }
              totalexpenditure.value = String(total);
              totalAmount = totalexpenditure.value;
              subsidy = totalAmount;
              subsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
              finalSubsidy.value = String(subsidy);
            });
          }
          totalexpenditure.addEventListener('input', ()=>{
            totalAmount = totalexpenditure.value;
            subsidy = totalAmount;
            subsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            finalSubsidy.value = String(subsidy);
          });
          finalSubsidy.addEventListener('input', ()=>{
            totalAmount = totalexpenditure.value;
            subsidy = totalAmount;
            subsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            finalSubsidy.value = String(subsidy);
          });
          this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Quality Certification Fee Reimbursement*/

      /*Start of calculation for State Component of Net GST Developed By Bindurekha Nayak*/
      case 98:
      this.fromToDateValidation();
      let sgstParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(sgstParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_sgstAmount');
        this.fillUpMdInfo('cls_sgstName', 'cls_sgstDegn');
        let sgstGstinElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_gstin_regd_number')[0]);
        let sgstSubsidyFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstFromDate')[0]);
        let sgstSubsidyToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstToDate')[0]);
        this.loading = true;
        let sgstRegParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(sgstRegParam).subscribe(res => {
           this.loading = false;
          if(res.status == 200){
            if(res.result.companyDetails){
              sgstGstinElement.value = res.result.companyDetails.gstNo;
            }
          }
        });
        sgstSubsidyFromDate.addEventListener('input', ()=>{
          sgstSubsidyToDate.value="";
        });
        let fciRegParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.capitalInvFixedAmount(fciRegParam).subscribe(res => {
           this.loading = false;
          if(res.status == 200){
           this.fciAmount = res.result;
          }
        });
        if(this.fciAmount<=5000000){
          let sgstToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstToDate')[0]);
          sgstToDate.addEventListener('input', () => {
            let sgstStartValue = sgstSubsidyFromDate.value;
            let sgstEndValue = sgstToDate.value;
            let policyEndDateCheck = this.eligibilityEndDateCheck('cls_sgstToDate');
            if(policyEndDateCheck==0){
              if(sgstStartValue && sgstEndValue){
                let diffInMonths = (new Date(sgstEndValue).getMonth() - new Date(sgstStartValue).getMonth()) + (new Date(sgstEndValue).getFullYear() - new Date(sgstStartValue).getFullYear()) * 12;
                let diffYear = diffInMonths / 12;
                if(diffYear > 5){
                  ptsToDate.value = '';
                  Swal.fire({
                    icon: 'error',
                    text: 'Can not claim more than 5 Years!'
                  });
                }else{
                  let param = {
                    "fromDate": sgstStartValue,
                    "toDate": sgstEndValue,
                    "intId": sessionStorage.getItem('REGD_ID'),
                    "yearLimit": 5,
                    "onlineProcessId": this.processId,
                    "profileId": this.userId
                  } 
                  this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
                    this.loading = false;
                    if(res.status == 200){
                      if(res.isApplicable==0){
                        Swal.fire({
                          icon: 'error',
                          text: 'You have already applied untill the selected date.Please try with another latest date.'
                        }).then((result) => {
                        sgstSubsidyFromDate.value = '';
                        sgstToDate.value = '';
                        });
                      }else if(res.isApplicable==1){
                      let yearLimitDet = res.result;
                      let appliedYear = parseFloat(yearLimitDet)/12;
                      let claimPeriod =5;
                      let ClaimablePeriod = claimPeriod - appliedYear;
                      if(diffYear > ClaimablePeriod){
                          Swal.fire({
                            icon: 'error',
                            text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                          });
                          sgstToDate.value = '';
                        } 
                      }
                      }
                  });
                }
              
              }
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ineligibility Notification',
                html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date.',
              });
              sgstToDate.value = '';
            }
              
          });
         
        }else{
          let sgstToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstToDate')[0]);
          sgstToDate.addEventListener('input', () => {
            let sgstStartValue = sgstSubsidyFromDate.value;
            let sgstEndValue = sgstToDate.value;
            let policyEndDateCheck = this.eligibilityEndDateCheck('cls_sgstToDate');
            if(policyEndDateCheck==0){
              if(sgstStartValue && sgstEndValue){
                let diffInMonths = (new Date(sgstEndValue).getMonth() - new Date(sgstStartValue).getMonth()) + (new Date(sgstEndValue).getFullYear() - new Date(sgstStartValue).getFullYear()) * 12;
                let diffYear = diffInMonths / 12;
                if(diffYear > 7){
                  ptsToDate.value = '';
                  Swal.fire({
                    icon: 'error',
                    text: 'Can not claim more than 7 Years!'
                  });
                }else{
                  let param = {
                    "fromDate": sgstStartValue,
                    "toDate": sgstEndValue,
                    "intId": sessionStorage.getItem('REGD_ID'),
                    "yearLimit": 7,
                    "onlineProcessId": this.processId,
                    "profileId": this.userId
                  } 
                  this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
                    this.loading = false;
                    if(res.status == 200){
                      if(res.isApplicable==0){
                        Swal.fire({
                          icon: 'error',
                          text: 'You have already applied untill the selected date.Please try with another latest date.'
                        }).then((result) => {
                        sgstSubsidyFromDate.value = '';
                        sgstToDate.value = '';
                        });
                      }else if(res.isApplicable==1){
                      let yearLimitDet = res.result;
                      let appliedYear = parseFloat(yearLimitDet)/12;
                      let claimPeriod =7;
                      let ClaimablePeriod = claimPeriod - appliedYear;
                      if(diffYear > ClaimablePeriod){
                          Swal.fire({
                            icon: 'error',
                            text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                          });
                          sgstToDate.value = '';
                        } 
                      }
                      }
                  });
                }
              
              }
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ineligibility Notification',
                html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date.',
              });
              sgstToDate.value = '';
            }
              
          });
        }
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for State Component of Net GST */

      /*Start of calculation for Marketing Assistance (Unit) Developed By Bindurekha Nayak*/
      case 117:
        this.fromToDateValidation();
        let mauParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(mauParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 1;
        this.fillUpPrevDetails('cls_prevAmount');
        this.fillUpMdInfo('cls_mauName', 'cls_mauDegn');
        //calculation of total expenses
        subsidyCapping = 300000;
        let subsidyCapping2 = 600000;
        expense = document.getElementsByClassName('cls_expenses');
        let totalExpenses: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expenses')[0]);
        let subsidyEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_subsidy')[0]);
        let subsidyAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_mauEventClaimAmount')[0]);
        let eventLocation: any = (<HTMLInputElement>document.getElementsByClassName('cls_event_location')[0]).value;
        let eventCheck : any = (<HTMLInputElement>document.getElementsByClassName('cls_event_location')[0]);
        eventCheck.addEventListener('change', () => {
          eventLocation = eventCheck.value;
        })

        for (let button of expense) {
          button.addEventListener("input", () => {
            total = 0;
            for (let i = 0; i < expense.length; i++) {
              if (i == 0) { continue } //adding to skip first iteration as the first used for location change trigger
              let data: any = $($(expense[i])).val();
              if ($.isNumeric(data)) {
                total += parseFloat(data);
              }
            }
            eventLocation = eventCheck.value;
            totalExpenses.value = subsidyEle.value= String(total);
            subsidyEle.readOnly = true;
            if (eventLocation == "" || eventLocation == undefined || eventLocation == 0) {
              Swal.fire({
                icon: 'error',
                text: 'Please first select event location'
              });
              expense.value = '0';
            }
            else {
              if (eventLocation == 1) {
                subsidy = total * 0.50;
                finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
              }
              else if (eventLocation == 2) {
                subsidy = total * 0.50;
                finalsubsidy = (subsidy <= subsidyCapping2) ? subsidy : subsidyCapping2;
              }

            }
            subsidyAmount.value = String(finalsubsidy);
          });
        }
        totalExpenses.addEventListener('input', () => {
          if (eventLocation == "" || eventLocation == undefined || eventLocation == 0) {
            subsidyAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select event location'
            });
          }else{
            let totExpense = totalExpenses.value;
            subsidyEle.value = totalExpenses.value;
            if (eventLocation == 1) {
              subsidy = totExpense * 0.50;
              finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            }
            else if (eventLocation == 2) {
              subsidy = totExpense * 0.50;
              finalsubsidy = (subsidy <= subsidyCapping2) ? subsidy : subsidyCapping2;
            }
            subsidyAmount.value = String(finalsubsidy);
          }
        });
        subsidyAmount.addEventListener('input', () => {
          if (eventLocation == "" || eventLocation == undefined || eventLocation == 0) {
            subsidyAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select event location'
            });
          }else{
            if (eventLocation == 1) {
              subsidy = subsidyAmount.value;
              finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            }
            else if (eventLocation == 2) {
              subsidy = subsidyAmount.value;
              finalsubsidy = (subsidy <= subsidyCapping2) ? subsidy : subsidyCapping2;
            }
            subsidyAmount.value = String(finalsubsidy);
          }
        });
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Marketing Assistance (Unit)*/

      /*Start of calculation for Marketing Assistance (Association) Developed By Bindurekha Nayak*/
      case 99:{
        this.fromToDateValidation();
        let maaContactName = (<HTMLInputElement>document.getElementsByClassName('cls_miaContPersonName')[0]);
        let maaContactDesg = (<HTMLInputElement>document.getElementsByClassName('cls_commDesg')[0]);
        let maaTelNo = (<HTMLInputElement>document.getElementsByClassName('cls_miaTeleNo')[0]);
        let maaMobNo = (<HTMLInputElement>document.getElementsByClassName('cls_miaMobNo')[0]);
        let maaEmailId = (<HTMLInputElement>document.getElementsByClassName('cls_miaEmailId')[0]);
        let maaGstNo = (<HTMLInputElement>document.getElementsByClassName('cls_miaGstIn')[0]);
       let maaPanNo = (<HTMLInputElement>document.getElementsByClassName('cls_miaPanNo')[0]);
       let maaCmpName = (<HTMLInputElement>document.getElementsByClassName('cls_cmpName')[0]);
       let maaRegNo = (<HTMLInputElement>document.getElementsByClassName('cls_regNo')[0]);
       let maaRegDate= (<HTMLInputElement>document.getElementsByClassName('cls_regDate')[0]);
       let maaRegAddress= (<HTMLInputElement>document.getElementsByClassName('cls_miaContAddress')[0]);
        this.loading = true;
        let marketingAssParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(marketingAssParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.communicationDetails){
              maaContactName.value = res.result.communicationDetails.empName;
              maaContactDesg.value = res.result.communicationDetails.empDegn;
              maaTelNo.value = res.result.communicationDetails.empTeleNo;
              maaMobNo.value = res.result.communicationDetails.empMobNo;
              maaEmailId.value = res.result.communicationDetails.empEmail;
              
            }
            if(res.result.companyDetails){
              maaGstNo.value = res.result.companyDetails.gstNo;
              maaPanNo.value = res.result.companyDetails.panNo;
              // maaRegNo.value = res.result.companyDetails.regNo;
              // maaCmpName.value = res.result.companyDetails.cmpName;
              maaRegAddress.value = res.result.companyDetails.cmpAddress;
            }
            if(res.result.dateDetails){
              //maaRegDate.value = res.result.dateDetails.commencementDate;
            } 
          }
        });
        let maaParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(maaParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 1;
        this.fillUpPrevDetails('cls_prevAmount');
        this.fillUpMdInfo('cls_miaName', 'cls_miaDegn');
        //calculation of total expenses
        subsidyCapping = 300000;
        let subsidyCapping3 = 600000;
        expense = document.getElementsByClassName('cls_expense');
        let maaTotalExpenses:any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expense')[0]);
        let maaSubsidyAmount:any = (<HTMLInputElement>document.getElementsByClassName('cls_miaTotalMarktEventAmount')[0]);
        let maaEventLocation:any = (<HTMLInputElement>document.getElementsByClassName('cls_location')[0]).value;
        let maaEventCheck = (<HTMLInputElement>document.getElementsByClassName('cls_location')[0]);
        let subsidyEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_subsidy')[0]);
        maaEventCheck.addEventListener('change', () => {
          maaEventLocation = maaEventCheck.value;
        })

        for (let button of expense) {
          button.addEventListener("input", () => {
            total = 0;
            for (let i = 0; i < expense.length; i++) {
              if (i == 0) { continue } //adding to skip first iteration as the first used for location change trigger
              let data: any = $($(expense[i])).val();
              if ($.isNumeric(data)) {
                total += parseFloat(data);
              }
            }
            maaEventLocation = maaEventCheck.value;
            maaTotalExpenses.value = subsidyEle.value= String(total);
            subsidyEle.readOnly = true;
            if (maaEventLocation == "" || maaEventLocation == undefined || maaEventLocation == 0) {
              Swal.fire({
                icon: 'error',
                text: 'Please first select event location'
              });
              expense.value = '0';
             }
            else {
              if (maaEventLocation == 1) {
                subsidy = total * 0.50;
                finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
              }
              else if (maaEventLocation == 2) {
                subsidy = total * 0.50;
                finalsubsidy = (subsidy <= subsidyCapping3) ? subsidy : subsidyCapping3;
              }
            }
            maaSubsidyAmount.value = String(finalsubsidy);
          });
        }
        maaTotalExpenses.addEventListener('input', () => {
          if (maaEventLocation == "" || maaEventLocation == undefined || maaEventLocation == 0) {
            maaSubsidyAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select event location'
            });
          }else{
            let totExpense = maaTotalExpenses.value;
            subsidyEle.value = maaTotalExpenses.value;
            if (maaEventLocation == 1) {
              subsidy = totExpense * 0.50;
              finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            }
            else if (maaEventLocation == 2) {
              subsidy = totExpense * 0.50;
              finalsubsidy = (subsidy <= subsidyCapping3) ? subsidy : subsidyCapping3;
            }
            maaSubsidyAmount.value = String(finalsubsidy);
          }
        });
        maaSubsidyAmount.addEventListener('input', () => {
          if (maaEventLocation == "" || maaEventLocation == undefined || maaEventLocation == 0) {
            maaSubsidyAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select event location'
            });
          }else{
            if (maaEventLocation == 1) {
              subsidy = maaSubsidyAmount.value;
              finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            }
            else if (maaEventLocation == 2) {
              subsidy = maaSubsidyAmount.value;
              finalsubsidy = (subsidy <= subsidyCapping3) ? subsidy : subsidyCapping3;
            }
          }
        });
        let participantCount: any = (<HTMLInputElement>document.getElementsByClassName('cls_participants')[0]);

        participantCount.addEventListener('change', () =>{
          if(participantCount.value){
            if(participantCount.value < 5){
              participantCount.value = '';
              Swal.fire({
                icon: 'error',
                text: "Number of participating units can't be less then 5"
              });
              }
            }
          });
          this.fromAlphaNumericValidation();
          this.loadAccCustomValidation();
        }
        break;
      /*End of calculation for Marketing Assistance (Association)*/

      /*start of calculation for Patent Registration Developed By Bindurekha Nayak*/
      case 102:
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        expense = document.getElementsByClassName('cls_expenses');
        let patParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(patParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 1;
        this.fillUpPrevDetails('cls_claim_amount');
        //calculation of total expenses
        let patentSubsidyCapping: any = 200000;
        let patentSubsidyCapping2:any = 500000;
        expense = document.getElementsByClassName('cls_expenses');
        let totalPatentExpenses: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expenses')[0]);
        let subsidyPatentAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expence_claim')[0]);
        let patentEventLocation: any = (<HTMLInputElement>document.getElementsByClassName('cls_event_location')[0]).value;
        let patentEventCheck : any = (<HTMLInputElement>document.getElementsByClassName('cls_event_location')[0]);
        let subsidyAmountDet : any = (<HTMLInputElement>document.getElementsByClassName('cls_subsidy_amount')[0]);
        for (let button of expense) {
          button.addEventListener("input", () => {
            total = 0;
            for (let i = 0; i < expense.length; i++) {
              if (i == 0) { continue } //adding to skip first iteration as the first used for location change trigger
              let data: any = $($(expense[i])).val();
              if ($.isNumeric(data)) {
                total += parseFloat(data);
              }
            }
            patentEventLocation = patentEventCheck.value;
            totalPatentExpenses.value = String(total);
            if (patentEventLocation == "" || patentEventLocation == undefined || patentEventLocation == 0) {
              // console.log(patentEventLocation);
              Swal.fire({
                icon: 'error',
                text: 'Please first select Type of Patent Filed'
              });
              expense.value = '0';
              // console.log(patentEventLocation.value);
            }
            else {
              if (patentEventLocation == 1) {
                subsidy = total * 0.75;
                finalsubsidy = (subsidy <= patentSubsidyCapping) ? subsidy : patentSubsidyCapping;
              }
              else if (patentEventLocation == 2) {
                subsidy = total * 0.75
                finalsubsidy = (subsidy <= patentSubsidyCapping2) ? subsidy : patentSubsidyCapping2;
              }

            }
            subsidyAmountDet.value = String(finalsubsidy);
          });
        }
        totalPatentExpenses.addEventListener('input', () => {
          if (patentEventLocation == "" || patentEventLocation == undefined || patentEventLocation == 0) {
            subsidyPatentAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select Type of Patent Filed'
            });
          }else{
            let totExpense = totalPatentExpenses.value;
            
            if (patentEventLocation == 1) {
              subsidy = totExpense * 0.75;
              finalsubsidy = (subsidy <= patentSubsidyCapping) ? subsidy : patentSubsidyCapping;
            }
            else if (patentEventLocation == 2) {
              subsidy = totExpense * 0.75;
              finalsubsidy = (subsidy <= patentSubsidyCapping2) ? subsidy : patentSubsidyCapping2;
            }
            subsidyAmountDet.value = String(finalsubsidy);
          }
        });
        subsidyPatentAmount.readOnly = true;
        subsidyAmountDet.addEventListener('change', () => {
          if (patentEventLocation == "" || patentEventLocation == undefined || patentEventLocation == 0) {
            subsidyPatentAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select Type of Patent Filed'
            });
          }else{
            let totExpense = totalPatentExpenses.value;
            
            if (patentEventLocation == 1) {
              subsidy = totExpense * 0.75;
              finalsubsidy = (subsidy <= patentSubsidyCapping) ? subsidy : patentSubsidyCapping;
            }
            else if (patentEventLocation == 2) {
              subsidy = totExpense * 0.75;
              finalsubsidy = (subsidy <= patentSubsidyCapping2) ? subsidy : patentSubsidyCapping2;
            }
            subsidyAmountDet.value = String(finalsubsidy);
          }
        });
        patentEventCheck.addEventListener('change', () => {
          this.loading = true;
          patentEventLocation = patentEventCheck.value;
          if(patentEventCheck.value>0){
            let patentParam = {
              "onlineProcessId": this.processId,
              "profileId": this.userId,
              "intRegId": sessionStorage.getItem('REGD_ID'),
              "vchPatentType": patentEventCheck.value
            }
            this.IrmsDetailsService.patentClaimHistory(patentParam).subscribe(res => {
              this.loading = false;
              subsidyPatentAmount.value=parseFloat(res.result.dcm_total_patent_expense);
              if(res.status == 200){
                if(patentEventCheck.value == 1 && parseFloat(res.result.dcm_total_patent_expense) < 1000000){
                  let previousValueTotal = 1000000 - parseFloat(res.result.dcm_total_patent_expense);
                  patentSubsidyCapping = (patentSubsidyCapping > previousValueTotal) ? previousValueTotal : patentSubsidyCapping;
                }else if(patentEventCheck.value == 2 && res.result.dcm_total_patent_expense < 2500000){
                  let previousValueTotal = 2500000 - parseFloat(res.result.dcm_total_patent_expense);
                  patentSubsidyCapping2 = (patentSubsidyCapping2 > previousValueTotal) ? previousValueTotal : patentSubsidyCapping2;
                 }else if((patentEventCheck.value == 1 && parseFloat(res.result.dcm_total_patent_expense) >= 1000000) || (patentEventCheck.value == 2 && res.result.dcm_total_patent_expense >=2500000)){
                  patentEventCheck.value = 0;
                  Swal.fire({
                    icon: 'error',
                    text: 'You have reached your maximum subsidy claim limit.'
                  });
                }
              }
            });
          }
          
        })
        this.fromAlphaNumericValidation();
        break;
        /*start of calculation for Patent Registration*/
      /*start of calculation for Technical Know-How Assistance Developed By Bindurekha Nayak*/
      case 45:
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.fillUpPrevDetails('cls_prevAmount');
        let techParams = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(techParams).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
          }
        });
        this.intNoOfDateField = 1;
        let presentAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_preAmount')[0]);
        let techAmountTotalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_techAmountTotal')[0]);
        let iciAmountVal:any = 0;
        let iciTotalAmountVal:any = 0;
        let iciCappingVal:any = 100000000;
        presentAmountElement.addEventListener('input', () => {
          iciAmountVal = (50/100) * presentAmountElement.value;
          iciTotalAmountVal = (iciAmountVal <= iciCappingVal) ? iciAmountVal : iciCappingVal;
          techAmountTotalElement.value = iciTotalAmountVal;
          
        });
        techAmountTotalElement.addEventListener('input', () => {
          iciTotalAmountVal = String(presentAmountElement.value);
          iciTotalAmountVal = (iciTotalAmountVal <= iciCappingVal) ? iciTotalAmountVal : iciCappingVal;
          techAmountTotalElement.value = iciTotalAmountVal;
         });
        break;
      /*End of calculation for Technical Know-How Assistance*/

      /*start of calculation for Municipal Tax in Local Backward Area*/
      case 44:{
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.fillUpPrevDetails('cls_prevAmount');
        let munParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(munParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        let epfBdaElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfBda')[0]);
        let preAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_preAmount')[0]);
        let esdmFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_esdmFromDate')[0]);
        let esdmToDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_esdmToDate')[0]);
        let induBackwardAreaElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_induBackwardArea')[0]);
        let finalAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_finalAmount')[0]);
        let claimPeriodElement: any   = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
        let previousClaimPeriod = parseInt(claimPeriodElement.value);
        claimPeriodElement.addEventListener('change', function () {
            let claimPeriod = parseInt(claimPeriodElement.value);
            if (claimPeriod !== previousClaimPeriod) {
                previousClaimPeriod = claimPeriod; 
                
                if (claimPeriod <= 0) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Please select a valid Claim period!'
                    });
                    esdmFromDateElement.value = '';
                    esdmToDateElement.value = '';
                }else if(eeBdaValues == "" || eeBdaValues == undefined || eeBdaValues == 0){
                  preAmountElement.value = '';
                  esdmToDateElement.value = '';
                  esdmFromDateElement.value='';
                  claimPeriodElement.value=0;
                  Swal.fire({
                    icon: 'error',
                    text: 'Please select the BDA approved or not'
                  });
                  
                } else {
                  esdmFromDateElement.value = '';
                  esdmToDateElement.value = '';
                }
            }
        });  
        let eeBdaValues: any = 0;
        epfBdaElement.addEventListener('change', () => {
          eeBdaValues = epfBdaElement.value;
          if(eeBdaValues == "" || eeBdaValues == undefined || eeBdaValues == 0){
            preAmountElement.value = '';
            esdmToDateElement.value = '';
            esdmFromDateElement.value='';
            Swal.fire({
              icon: 'error',
              text: 'Please select the BDA approved or not'
            });
            
          }else if(eeBdaValues == 1){
            preAmountElement.addEventListener('input', () => {
              finalAmountElement.value = String(preAmountElement.value);;
              
            });
            finalAmountElement.addEventListener('input', () => {
               finalAmountElement.value = String(preAmountElement.value);;
            });
          }else if(eeBdaValues == 2){
            preAmountElement.addEventListener('input', () => {
              finalAmountElement.value = String(preAmountElement.value);;
              
            });
            finalAmountElement.addEventListener('input', () => {
               finalAmountElement.value = String(preAmountElement.value);;
            });
            
           
            esdmFromDateElement.addEventListener('change', () => {
              let claimPeriod = parseInt(claimPeriodElement.value);
              if(claimPeriod <= 0){
                Swal.fire({
                  icon: 'error',
                  text: 'Please select Claim period first!'
                })
              }
              let startDate = new Date(esdmFromDateElement.value);
              let endDate = new Date(esdmToDateElement.value);
              if (endDate < startDate) {
                esdmToDateElement.value = '';
                  Swal.fire({
                    icon: 'error',
                    text: 'End date can not be less than start date'
                  });
                } else {
                  let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
                  let prvParam = {
                    "intId": sessionStorage.getItem('REGD_ID'),
                    "onlineProcessId": this.processId,
                    "profileId": sessionInfo.USER_ID,
                    "incStartDate": esdmFromDateElement.value,
                    "claimLimit": 3,
                  };
                  this.loading = true;
                  this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
                    this.loading = false;
                    let claimedPeriod = parseInt(res.claimedPeriod);
                    let lastIncentiveDate = res.lastIncDate;
                    if (res.status == 2) {
                      if (claimedPeriod >= 3) {
                        esdmToDateElement.value = '';
                        Swal.fire({
                          icon: 'error',
                          text: 'You have already claimed for the maximum period i.e  3 Years!'
                        });
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Date Ineligibility',
                          html: "You have already applied until '<b>" + lastIncentiveDate + "</b>' ! </br> Please apply after this date",
                        });
                      }
                      esdmFromDateElement.value = '';
                    } else {
                      let ClaimablePeriod = 3 - claimedPeriod;
                      if (claimPeriod > ClaimablePeriod) {
                        Swal.fire({
                          icon: 'error',
                          text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                        });
                        esdmFromDateElement.value = '';
                        esdmToDateElement.value = '';
                      } else {
                        let fromDate = new Date(esdmFromDateElement.value);
                        let toDate = new Date(fromDate);
                        let currentDate = new Date();
                        toDate.setFullYear(fromDate.getFullYear() + claimPeriod);
                        // Validating if toDate is less than or equal to current date
                        if (toDate <= currentDate) {
                          let formattedToDate = toDate.toISOString().slice(0, 10);
                          esdmToDateElement.value = formattedToDate;
                          esdmToDateElement.readOnly = true;
                          esdmToDateElement.dispatchEvent(new Event('change'));
                        } else {
                          Swal.fire({
                            icon: 'error',
                            text: 'As of current date, you are not eligible for ' + (claimPeriod > 1 ? claimPeriod + ' years' : claimPeriod + ' year') + ' of subsidy'
          
                          })
                        }
                      }
                    }
                  });
                }
            });
            
            esdmToDateElement.addEventListener('change',  () => {
              let startDate = new Date(esdmFromDateElement.value);
              let endDate = new Date(esdmToDateElement.value);
              if (endDate < startDate) {
                esdmToDateElement.value = '';
                Swal.fire({
                  icon: 'error',
                  text: 'End date can not be less than start date'
                });
              }else{
                let policyEndDateCheck = this.eligibilityEndDateCheck('cls_esdmToDate');
                if(policyEndDateCheck==0){
                  let startDate = new Date(esdmFromDateElement.value);
                  let endDate = new Date(esdmToDateElement.value);
                  
                  let diffMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

                    if (diffMonth < 0) {
                      diffMonth = 0; // Handle negative differences if needed
                    }
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Ineligibility Notification',
                    html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date by one year.',
                  });
                  esdmToDateElement.value = '';
                }
              }
            
          });
          
          }
        })
        let induBackwardAreaElementDet: any = 0;
        induBackwardAreaElement.addEventListener('change', () => {
          induBackwardAreaElementDet = induBackwardAreaElement.value;
          if(induBackwardAreaElementDet == "" || induBackwardAreaElementDet == undefined || induBackwardAreaElementDet == 0){
            preAmountElement.value = '';
            esdmToDateElement.value = '';
            esdmFromDateElement.value='';
            finalAmountElement.value='';
            Swal.fire({
              icon: 'error',
              text: 'Please select the Industrially Backward Area as defined under IPR'
            });
            
          }else if(induBackwardAreaElementDet == 1){
            this.IrmsDetailsService.industrialbackwardCheck().subscribe(res => {
              if(res.status == 200){
                this.countInduBackward = res.result;
              }
            });
            if(this.countInduBackward>0){
              finalAmountElement.value='';
              induBackwardAreaElement.value =0;
              Swal.fire({
                icon: 'error',
                text: "Sorry, the yes option 'Industrially Backward Area' cannot be applied at the moment. Please select another option."
              });
            }else{
              let iciCappingVal:any = 5000000;
              let iciAmountVal:any = 0;
              let iciTotalAmountVal:any = 0;
            preAmountElement.addEventListener('input', () => {
              iciAmountVal = String(preAmountElement.value);
              iciTotalAmountVal = (iciAmountVal <= iciCappingVal) ? iciAmountVal : iciCappingVal;
              finalAmountElement.value = iciTotalAmountVal;
              
            });
            finalAmountElement.addEventListener('input', () => {
              iciTotalAmountVal = String(preAmountElement.value);
              iciTotalAmountVal = (iciTotalAmountVal <= iciCappingVal) ? iciTotalAmountVal : iciCappingVal;
              finalAmountElement.value = iciTotalAmountVal;
            });

            }
           

          }else if(induBackwardAreaElement == 2){
            preAmountElement.addEventListener('input', () => {
              finalAmountElement.value = String(preAmountElement.value);;
              
            });
            finalAmountElement.addEventListener('input', () => {
               finalAmountElement.value = String(preAmountElement.value);;
            });
            
          }
        })
        this.fromAlphaNumericValidation();
      }
        break;
      /*End of calculation for Municipal Tax in Local Backward Area*/

      /*start of calculation for Incentives for Local Enterprises Developed By Bindurekha Nayak*/
      case 46:
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        let locTotalEmpElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_locTotalEmp')[0]);
        let locNoExeEmpElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_locNoExeEmp')[0]);
        let locPerExeEmpElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_locPerExeEmp')[0]);
        let locAmoutClaimElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_locAmoutClaim')[0]);
        let localParams = {
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.loading = true;
        this.IrmsDetailsService.totalCmpEmpCount(localParams).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
           this.empTotal = res.result;
            locTotalEmpElement.value = this.empTotal;
            this.claimAmountDet = String((50/100) * this.empTotal);
            locPerExeEmpElement.value = this.claimAmountDet;
          }
          locTotalEmpElement.addEventListener('input', () => {
            let locTotalAmount = locTotalEmpElement.value;
            locPerExeEmpElement.value = String((50/100) * locTotalAmount);

          });
          locPerExeEmpElement.addEventListener('input', () => {
            let locTotalAmount = locTotalEmpElement.value;
            locPerExeEmpElement.value = String((50/100) * locTotalAmount);

          });
          locNoExeEmpElement.addEventListener('input', () => {
            this.noExpEmp = locNoExeEmpElement.value;
          });
        
        locAmoutClaimElement.addEventListener('input', () => {
            if (this.claimAmountDet >= this.noExpEmp) {
                Swal.fire({
                    icon: 'error',
                    text: 'No. of executive employees of Odisha domicile can not be less than Percentage of executive employees with domicile of Odisha'
                });
                locNoExeEmpElement.value = ''; 
                locAmoutClaimElement.value ='';
            }
        });
          
        });
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Incentives for Local Enterprises*/
      /*start of calculation for ESDM Park Developed By Bindurekha Nayak*/
      case 73:
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for ESDM Park*/

      /*start of calculation for Center of Excellence(CoE) Developed By Bindurekha Nayak*/
      case 72:
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Center of Excellence(CoE)*/

     

      /*start of calculation for Sponsored Research Work Assistance Developed By Bindurekha Nayak*/
      case 43:
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.fillUpPrevDetails('cls_prev_amount');
        let reaAssParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(reaAssParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        let rdPrevAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdPreClaimAmount')[0]);
        let rdTotalClaimAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdEpTotalAmount ')[0]);
        let finalCappingAmountDet:any = 5000000;
        let totalRdAmountDet:any = 0;
        let finalClaimAmountDet:any = 0;
        rdPrevAmount.addEventListener('input', () => {
          totalRdAmountDet = String(rdPrevAmount.value);
          let claimAmount = String((50/100) * totalRdAmountDet);
          finalClaimAmountDet = (claimAmount <= finalCappingAmountDet) ? claimAmount : finalCappingAmountDet;
          rdTotalClaimAmount.value = finalClaimAmountDet;
        });
        rdTotalClaimAmount.addEventListener('input', () => {
          totalRdAmountDet = String(rdPrevAmount.value);
          let claimAmount = String((50/100) * totalRdAmountDet);
          finalClaimAmountDet = (claimAmount <= finalCappingAmountDet) ? claimAmount : finalCappingAmountDet;
          rdTotalClaimAmount.value = finalClaimAmountDet;
        });
        let rdFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdFromDate')[0]);
        let rdToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdToDate')[0]);
        rdToDate.addEventListener('input', () =>{
          let startDate = rdFromDate.value;
          let endDate = rdToDate.value;
          let fromDate = new Date(startDate);
          let toDate = new Date(endDate);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          if(toDate < fromDate){
            rdToDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'To date can not be less than From date'
            });
          }else if(diffYear > 5){
            rdToDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Can not claim more than 5 Years!'
            });
          }else{
            let param = {
              "fromDate": startDate,
              "toDate": endDate,
              "intId": sessionStorage.getItem('REGD_ID'),
              "yearLimit": 5,
              "onlineProcessId": this.processId,
              "profileId": this.userId
            } 
            this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
              this.loading = false;
              if(res.status == 200){
                if(res.isApplicable==0){
                  rdToDate.value = '';
                  rdFromDate.value='';
                  Swal.fire({
                    icon: 'error',
                    text: 'You have already applied untill the selected date.Please try with another latest date.'
                  });
                }else if(res.isApplicable==1){
                let yearLimitDet = res.result;
                let appliedYear = parseFloat(yearLimitDet)/12;
                let claimPeriod =5;
                let ClaimablePeriod = claimPeriod - appliedYear;
                 if(diffYear > ClaimablePeriod){
                    Swal.fire({
                      icon: 'error',
                      text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                    });
                    rdToDate.value = '';
                  } 
                 }
                }
            });
          }
        });
        
        rdFromDate.addEventListener('input', ()=>{
          rdToDate.value="";
        });
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Sponsored Research Work Assistance*/

      /*start of calculation for Incubation Rental Developed By Bindurekha Nayak*/
      case 30:
        this.fillUpMdInfo('cls_irName', 'cls_irDesg');
        this.fromToDateValidation();
        let leaseArea: any            = (<HTMLInputElement>document.getElementsByClassName('cls_iRLeaArea')[0]);
        let leaseStartDate: any       = (<HTMLInputElement>document.getElementsByClassName('cls_iRStDate')[0]);
        let leaseEndDate: any         = (<HTMLInputElement>document.getElementsByClassName('cls_iREnDate')[0]);
        let feePaidAmount: any        = (<HTMLInputElement>document.getElementsByClassName('cls_iRFeePaidRen')[0]);
        let totalRentalAmount: any    = (<HTMLInputElement>document.getElementsByClassName('cls_iRTotIncRental')[0]);
        let monthlyPaymentAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_iRLeaMonPayment')[0]);
        let intTotalEmpCount: any     = (sessionStorage.getItem('totalEmpCount')) ? sessionStorage.getItem('totalEmpCount') : 0;
        let subsidyPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
        let govtOwnedCheckBoxes: any  = document.querySelectorAll('.cls_iRGovt_owned');
        let isGovtOwned: any          = '';
        leaseArea.addEventListener('input', function () {
          leaseEndDate.value          = '';
          feePaidAmount.value         = '';
          totalRentalAmount.value     = '';
        });
        let previousClaimPeriod = parseInt(subsidyPeriodElement.value);
        subsidyPeriodElement.addEventListener('change', () => {
          let claimPeriod = parseInt(subsidyPeriodElement.value);
          if (claimPeriod !== previousClaimPeriod) {
              previousClaimPeriod = claimPeriod; 
              if(claimPeriod <= 0){
                Swal.fire({
                  icon: 'error',
                  text: 'Please select Claim period first!'
                })
                leaseStartDate.value = '';
                leaseEndDate.value = '';
                feePaidAmount.value ='';
                totalRentalAmount.value='';
              }else {
              leaseStartDate.value = '';
              leaseEndDate.value = '';
              feePaidAmount.value ='';
              totalRentalAmount.value='';
              }
          }
        });  
        leaseStartDate.addEventListener('change', () => {
          feePaidAmount.value='';
          leaseEndDate.value='';
          totalRentalAmount.value='';
          let subsidyPeriod = parseInt(subsidyPeriodElement.value);
          let monthlyPayment = parseInt(monthlyPaymentAmount.value);
          if(subsidyPeriod <= 0){
            Swal.fire({
              icon: 'error',
              text: 'Please select subsidy period first!'
            })
            leaseStartDate.value = '';
          } else {
            let startDate = new Date(leaseStartDate.value);
            let endDate = new Date(leaseEndDate.value);
            if(endDate < startDate){
              leaseEndDate.value = '';
              Swal.fire({
                icon: 'error',
                text: 'End date can not be less than start date'
              });
            } else {
              let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
              let prvParam = {
                "intId": sessionStorage.getItem('REGD_ID'),
                "onlineProcessId": this.processId,
                "profileId": sessionInfo.USER_ID,
                "incStartDate": leaseStartDate.value,
                "claimLimit": 2,
              };
              this.loading = true;
              this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
              this.loading = false;
              let claimedPeriod = parseInt(res.claimedPeriod);
              let lastIncentiveDate = res.lastIncDate;
              if(res.status == 2){
                if(claimedPeriod >= 2){
                  leaseEndDate.value = '';
                  Swal.fire({
                    icon: 'error',
                    text: 'You have already claimed for the maximum period i.e 2 Years!'
                  });
                } else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Date Ineligibility',
                    html: "You have already applied until '<b>" + lastIncentiveDate + "</b>' ! </br> Please apply after this date",
                  });
                }
                leaseStartDate.value = '';
              } else {
                let ClaimablePeriod = 2 - claimedPeriod;
                if(subsidyPeriod > ClaimablePeriod){
                  Swal.fire({
                    icon: 'error',
                    text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                  });
                  leaseStartDate.value = '';
                  leaseEndDate.value = '';
                } else {
                let fromDate      = new Date(leaseStartDate.value);
                let toDate        = new Date(fromDate);
                let currentDate   = new Date();
                toDate.setFullYear(fromDate.getFullYear() + subsidyPeriod);
                // Validating if toDate is less than or equal to current date
                if (toDate <= currentDate) {
                    let formattedToDate    = toDate.toISOString().slice(0, 10);
                    leaseEndDate.value    = formattedToDate;
                    leaseEndDate.readOnly = true;
                    leaseEndDate.dispatchEvent(new Event('change'));
                } else {
                  Swal.fire({
                    icon: 'error',
                    text: 'As of current date, you are not eligible for ' + (subsidyPeriod > 1 ? subsidyPeriod + ' years' : subsidyPeriod + ' year') + ' of subsidy'

                  })
                }
              }
              }
              });
            }
          }
        });
        leaseEndDate.readOnly = true;    
        leaseEndDate.addEventListener('change', () =>  {
            let policyEndDateCheck = this.eligibilityEndDateCheck('cls_iREnDate');
            if(policyEndDateCheck==0){
            let startDate = new Date(leaseStartDate.value);
            let endDate = new Date(leaseEndDate.value);
            let diffMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
              if (diffMonth < 0) {
                diffMonth = 0; // Handle negative differences if needed
              }
              if(monthlyPaymentAmount.value > 0){
                feePaidAmount.value = monthlyPaymentAmount.value * diffMonth;
                feePaidAmount.dispatchEvent(new Event('input'));
              } else {
                leaseEndDate.value = '';
                leaseStartDate.value =''; 
                Swal.fire({
                  icon: 'error',
                  text: 'Please calculate the monthly lease/rental payment before fee paid amount!'
                });
              }
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ineligibility Notification',
                html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date by one year.',
              });
              leaseEndDate.value = '';
            }
        });
        monthlyPaymentAmount.addEventListener('input', function() {
          feePaidAmount.value='';
          leaseStartDate.value='';
          leaseEndDate.value='';
          totalRentalAmount.value='';
        });
        feePaidAmount.addEventListener('input', function() {
          let area = leaseArea.value;
           if (area <= 250) {
                 if (feePaidAmount.value > 0) {
                    totalRentalAmount.value = (80 / 100) * feePaidAmount.value;
                }
            } else if (area >= 251 && area < 500) {
                 if (feePaidAmount.value > 0) {
                    totalRentalAmount.value = (70 / 100) * feePaidAmount.value;
                }
            } else if (area >= 500) {
                if (feePaidAmount.value > 0) {
                    totalRentalAmount.value = (60 / 100) * feePaidAmount.value;
                }
            }
        });
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Incubation Rental*/
      
      /*start of calculation for Power tariff subsidy Developed By Bindurekha Nayak*/
      case 103:
        let ptsCommDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptfCommDate')[0]);
        let ptsCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsCompName')[0]);
        let ptsCompanyAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsAddress')[0]);
        let ptsContactAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsContactAddress')[0]);
        let ptsContactName: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsContactName')[0]);
        let ptsContactDesg: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsDegn')[0]);
        let ptsContactTel: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsTeleNo')[0]);
        let ptsContactMob: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsMobNo')[0]);
        let ptsContactEmail: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsEmail')[0]);
        let ptseTypeofUnit: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptseTypeofUnit')[0]);
        let mdName: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsMdName')[0]);
        let ptsFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsFromDate')[0]);
        let ptsToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsToDate')[0]);
        let ptsTariffClaimed: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsClaimed')[0]);
        let ptsIncentiveClaimed: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsIncentiveClaimed')[0]);
        this.loading = true;
        let powerParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(powerParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.companyDetails){
              ptsCompanyName.value = (ptsCompanyName.value) ? ptsCompanyName.value : res.result.companyDetails.cmpName;
              ptsCompanyAddress.value = (ptsCompanyAddress.value) ? ptsCompanyAddress.value: res.result.companyDetails.cmpAddress;
              ptsContactAddress.value = (ptsContactAddress.value) ? ptsContactAddress.value: res.result.companyDetails.cmpAddress;
            }
            if(res.result.communicationDetails){
              ptsContactName.value = (ptsContactName.value) ? ptsContactName.value : res.result.communicationDetails.empName;
              ptsContactDesg.value = (ptsContactDesg.value) ? ptsContactDesg.value : res.result.communicationDetails.empDegn;
              ptsContactTel.value = (ptsContactTel.value) ? ptsContactTel.value : res.result.communicationDetails.empTeleNo;
              ptsContactMob.value = (ptsContactMob.value) ? ptsContactMob.value : res.result.communicationDetails.empMobNo;
              ptsContactEmail.value = (ptsContactEmail.value) ? ptsContactEmail.value : res.result.communicationDetails.empEmail;
            } 
            if(res.result.unitDetails){
              ptseTypeofUnit.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : ptseTypeofUnit.value;
            } 
            if(res.result.dateDetails){
              ptsCommDate.value = (ptsCommDate.value) ? ptsCommDate.value : res.result.dateDetails.commencementDate;
            }
          }
        });
        ptsTariffClaimed.addEventListener('keyup', () => {
          let tariffClaimedValue:any = isNaN(ptsTariffClaimed.value) ? 0 : ptsTariffClaimed.value;
          let totalValue = (.30) * tariffClaimedValue;
          if(this.ptsPrevClaimedAmount>0){
            let restAmount = 5000000 - this.ptsPrevClaimedAmount;
            if((totalValue) > restAmount ){
              let totalValueFormatted = totalValue.toLocaleString();
              let restAmountFormatted = restAmount.toLocaleString();
              Swal.fire({
                icon: 'error',
                text: 'You are not eligible to claim Rs. '+totalValueFormatted+ '; which is  more than the rest eligible amount of Rs. ' +restAmountFormatted+ ' !'
              }).then(() => {
                 ptsIncentiveClaimed.value = '';
                 ptsTariffClaimed.value ='';
              });
            }else{
              ptsIncentiveClaimed.value = totalValue;
            }
          }else if(totalValue > 5000000){
            ptsIncentiveClaimed.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Incentive amount can not be more than 5000000 /- !'
            });
          }else{
            ptsIncentiveClaimed.value = totalValue;
          }
        });
        ptsIncentiveClaimed.addEventListener('keyup', () => {
          let tariffClaimedValue:any = isNaN(ptsTariffClaimed.value) ? 0 : ptsTariffClaimed.value;
          let totalValue = (.30) * tariffClaimedValue;
          if(this.ptsPrevClaimedAmount>0){
            let restAmount = 5000000 - this.ptsPrevClaimedAmount;
            if((totalValue + this.ptsPrevClaimedAmount) > 5000000 ){
              ptsIncentiveClaimed.value = restAmount;
              Swal.fire({
                icon: 'error',
                text: 'Incentive amount cannot be more than ' +restAmount+ '!'
              });
            }else{
              ptsIncentiveClaimed.value = totalValue;
            }
          }else if(totalValue > 5000000){
            ptsIncentiveClaimed.value = 5000000;
            Swal.fire({
              icon: 'error',
              text: 'Incentive amount can not be more than 5000000 /- !'
            });
          }else{
            ptsIncentiveClaimed.value = totalValue;
          }
        });
        ptsToDate.addEventListener('change', () => {
          if(ptsFromDate.value == ''){
            Swal.fire({
              icon: 'error',
              text: 'Please enter the from date first'
            });
          }else{
            this.ptsDateValidation(ptsFromDate, ptsToDate, ptsIncentiveClaimed);
          }
          
        });
        this.fillUpMdInfo('cls_ptsName', 'cls_ptsDesg');
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Power tariff subsidy*/
      /*start of calculation for Energy Audit fee Developed By Bindurekha Nayak*/
      case 92:
        let eafCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafNameOfCmp')[0]);
        let eeafTypeOfUnit: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafTypeOfUnit')[0]);
        let eafCompanyAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafAddUnit')[0]);
        let eafContactName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafNameContactPerson')[0]);
        let eafContactDesg: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafPersonDesn')[0]);
        let eeafContactAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafContactAddress')[0]);
        let eeafMobNo: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafMobNo')[0]);
        let eafContactTel: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafTeleNo')[0]);
        let eafContactEmail: any = (<HTMLInputElement>document.getElementsByClassName('cls_eeafEmailId')[0]);
        let eafDateOfIncorporation: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafDateOfIncorporation')[0]);
        let eafTotalEnergy: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafTotalAuditFee')[0]);
        let eafEnergySubsidy: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafEnergySubsidy')[0]);
        let eafEnergyStartDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimFromDate')[0]);
        let eafEnergyEndDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimToDate')[0]);
        this.fillUpMdInfo('cls_eeafName', 'cls_eeafMdDesn');
        this.loading = true;
        let eafParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(eafParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.companyDetails){
              eafCompanyName.value = res.result.companyDetails.cmpName;
              eafCompanyAddress.value = res.result.companyDetails.cmpAddress;
              eeafContactAddress.value = res.result.companyDetails.cmpAddress;
            }
            if(res.result.communicationDetails){
              eafContactName.value = res.result.communicationDetails.empName;
              eafContactDesg.value = res.result.communicationDetails.empDegn;
              eeafMobNo.value = res.result.communicationDetails.empMobNo;
              eafContactTel.value = res.result.communicationDetails.empTeleNo;
              eafContactEmail.value = res.result.communicationDetails.empEmail;
            }
            if(res.result.unitDetails){
              eeafTypeOfUnit.value = res.result.unitDetails.unitId;
            }
            if(res.result.dateDetails){
              eafDateOfIncorporation.value = res.result.dateDetails.incorporationDate;
            }
          }
        });
        eafTotalEnergy.addEventListener('input', () => {
          let cappingAmount = 200000;
          let totalEnergyVal = parseFloat(eafTotalEnergy.value);
          let energySubsidyVal = (75/100) * totalEnergyVal;
          let totalAmountVal = (energySubsidyVal <= cappingAmount) ? energySubsidyVal : cappingAmount;
          eafEnergySubsidy.value = totalAmountVal;
        });
        eafEnergySubsidy.addEventListener('input', () => {
          let cappingAmount = 200000;
          let totalEnergyVal = parseFloat(eafTotalEnergy.value);
          let energySubsidyVal = (75/100) * totalEnergyVal;
          let totalAmountVal = (energySubsidyVal <= cappingAmount) ? energySubsidyVal : cappingAmount;
          eafEnergySubsidy.value = totalAmountVal;
        });
        eafEnergyEndDate.addEventListener('input', () =>{
          let startDate = eafEnergyStartDate.value;
          let endDate = eafEnergyEndDate.value;
          let fromDate = new Date(startDate);
          let toDate = new Date(endDate);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          if(toDate < fromDate){
            eafEnergyEndDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'To date can not be less than From date'
            });
          }else if(diffYear > 5){
            eafEnergyEndDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Can not claim more than 5 Years!'
            });
          }else{
            let param = {
              "fromDate": startDate,
              "toDate": endDate,
              "intId": sessionStorage.getItem('REGD_ID'),
              "yearLimit": 5,
              "onlineProcessId": this.processId,
              "profileId": this.userId
            } 
            this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
              this.loading = false;
              if(res.status == 200){
                if(res.isApplicable==0){
                  eafEnergyEndDate.value = '';
                  eafEnergyStartDate.value='';
                  Swal.fire({
                    icon: 'error',
                    text: 'You have already applied untill the selected date.Please try with another latest date.'
                  });
                }else if(res.isApplicable==1){
                let yearLimitDet = res.result;
                let appliedYear = parseFloat(yearLimitDet)/12;
                let claimPeriod =5;
                let ClaimablePeriod = claimPeriod - appliedYear;
                 if(diffYear > ClaimablePeriod){
                    Swal.fire({
                      icon: 'error',
                      text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                    });
                    eafEnergyEndDate.value = '';
                  } 
                 }
                }
            });
          }
        });
        
        eafEnergyStartDate.addEventListener('input', ()=>{
          eafEnergyEndDate.value="";
        });
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Energy Audit fee*/ 
      /*Start of calculation for Conversion Charges Electronics Developed By Bindurekha Nayak*/
      case 93 :
        this.fromAlphaNumericValidation();
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.fromAlphaNumericValidation();
      break;
        /*End of calculation for Conversion Charges Electronics*/ 
      /*Start of calculation for Cost of Cleaner / Greener Production Measuree Developed By Bindurekha Nayak*/
      case 101 :
        this.fromToDateValidation();
        let cocTotalEnergy: any = (<HTMLInputElement>document.getElementsByClassName('cls_cocRegUnit')[0]);
        let cocInvestment: any = (<HTMLInputElement>document.getElementsByClassName('cls_cocInvestment')[0]);
        let cocTotalSubsidy: any = (<HTMLInputElement>document.getElementsByClassName('cls_cocSubsidy')[0]);
        let cocCapping:any = 2000000;
        let cocFinalVal: any = 0;
        cocInvestment.addEventListener('keyup', () =>{
          let investmentVal = isNaN(cocInvestment.value) ? 0 : cocInvestment.value;
          cocFinalVal = (25/100) * investmentVal;
          cocTotalSubsidy.value = (cocFinalVal > cocCapping) ? cocCapping : cocFinalVal;
        });
        cocTotalSubsidy.addEventListener('keyup', () =>{
          let finalInputVal = isNaN(cocTotalSubsidy.value) ? 0 : cocTotalSubsidy.value;
          cocTotalSubsidy.value = (finalInputVal > cocCapping) ? cocCapping : finalInputVal;
        });
        this.loading = true;
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.loading = true;
        let cocParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(cocParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.unitDetails){
              cocTotalEnergy.value = res.result.unitDetails.unitType;
            }
          }
        });
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Cost of Cleaner / Greener Production Measuree */
       /*Start of calculation for Skill Certifications Fee Developed By Bindurekha Nayak*/
       case 48 :{
        this.fromToDateValidation();
        let skisParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(skisParam).subscribe(res => {
          if(res.status == 200){
            let totalAmountPre = 0;
           res.result.forEach(record => {
            totalAmountPre += parseInt(record.total_int_prev_cia_amt, 10);
           });
           this.previousClaimedSubsidy = res.result;
           this.totalPreviousAmount = totalAmountPre;
           this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
           skTotalSkillAmount.value = this.totalPreviousAmount;
          }
        });
        
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_skisPrevClaimAmount');
        let skTotalSkillAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_skTotalSkillAmount')[0]);
        let invtotalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_skTotalValue')[0]);
        let skillAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_skPeriodAmount')[0]);
        let claimPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
        let skillFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_skillCrtFromDate')[0]);
        let skillToDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_skillCrtToDate ')[0]);
        
        let previousClaimPeriod = parseInt(claimPeriodElement.value);
         claimPeriodElement.addEventListener('change', function () {
             let claimPeriod = parseInt(claimPeriodElement.value);
             if (claimPeriod !== previousClaimPeriod) {
                 previousClaimPeriod = claimPeriod; 
                 
                 if (claimPeriod <= 0) {
                     Swal.fire({
                         icon: 'error',
                         text: 'Please select a valid Claim period!'
                     });
                     skillFromDateElement.value = '';
                     skillToDateElement.value = '';
                 } else {
                  skillFromDateElement.value = '';
                  skillToDateElement.value = '';
                  
                }
             }
         });
         skillFromDateElement.addEventListener('change', () => {
          let claimPeriod = parseInt(claimPeriodElement.value);
          if(claimPeriod <= 0){
            Swal.fire({
              icon: 'error',
              text: 'Please select Claim period first!'
            })
          }
          let startDate = new Date(skillFromDateElement.value);
          let endDate = new Date(skillToDateElement.value);
          if (endDate < startDate) {
            skillToDateElement.value = '';
             Swal.fire({
               icon: 'error',
               text: 'End date can not be less than start date'
             });
           } else {
             let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
             let prvParam = {
               "intId": sessionStorage.getItem('REGD_ID'),
               "onlineProcessId": this.processId,
               "profileId": sessionInfo.USER_ID,
               "incStartDate": skillFromDateElement.value,
               "claimLimit": 5,
             };
             this.loading = true;
             this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
               this.loading = false;
               let claimedPeriod = parseInt(res.claimedPeriod);
               let lastIncentiveDate = res.lastIncDate;
               if (res.status == 2) {
                 if (claimedPeriod >= 5) {
                  skillToDateElement.value = '';
                   Swal.fire({
                     icon: 'error',
                     text: 'You have already claimed for a maximum period of  5 years!'
                   });
                 } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Date Ineligibility',
                    html: "You have already applied until '<b>" + lastIncentiveDate + "</b>' ! </br> Please apply after this date",
                  });
                 }
                 skillFromDateElement.value = '';
               } else {
                 let ClaimablePeriod = 5 - claimedPeriod;
                 if (claimPeriod > ClaimablePeriod) {
                   Swal.fire({
                     icon: 'error',
                     text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                   });
                   skillFromDateElement.value = '';
                   skillToDateElement.value = '';
                 } else {
                   let fromDate = new Date(skillFromDateElement.value);
                   let toDate = new Date(fromDate);
                   let currentDate = new Date();
                   toDate.setFullYear(fromDate.getFullYear() + claimPeriod);
                   // Validating if toDate is less than or equal to current date
                   if (toDate <= currentDate) {
                     let formattedToDate = toDate.toISOString().slice(0, 10);
                     skillToDateElement.value = formattedToDate;
                     skillToDateElement.readOnly = true;
                     skillToDateElement.dispatchEvent(new Event('change'));
                   } else {
                     Swal.fire({
                       icon: 'error',
                       text: 'As of current date, you are not eligible for ' + (claimPeriod > 1 ? claimPeriod + ' years' : claimPeriod + ' year') + ' of subsidy'
      
                     })
                   }
                 }
               }
             });
           }
        }); 
        skTotalSkillAmount.readOnly = true;
        skillToDateElement.readOnly = true;
        skillToDateElement.addEventListener('change',  () => {
          skillToDateElement.readOnly = true;
           let startDate = new Date(skillFromDateElement.value);
           let endDate = new Date(skillToDateElement.value);
           if (endDate < startDate) {
            skillToDateElement.value = '';
             Swal.fire({
               icon: 'error',
               text: 'End date can not be less than start date'
             });
           }else{
             let policyEndDateCheck = this.eligibilityEndDateCheck('cls_skillCrtToDate');
             if(policyEndDateCheck==0){
               let startDate = new Date(skillFromDateElement.value);
               let endDate = new Date(skillToDateElement.value);
               
               let diffMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
 
                 if (diffMonth < 0) {
                   diffMonth = 0; // Handle negative differences if needed
                 }
             }else{
               Swal.fire({
                 icon: 'error',
                 title: 'Ineligibility Notification',
                 html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date by one year.',
               });
               skillToDateElement.value = '';
             }
           }
          let claimPeriod = (parseInt(claimPeriodElement.value)>0) ? parseInt(claimPeriodElement.value) : 0;
          let isCappingValueDet = claimPeriod*300000;
          let ivsCapitalTotal = invtotalCapitalElement.value;
          let invtotalCapitalElementAmount = (50/100) * ivsCapitalTotal;
          skillAmountElement.value = (invtotalCapitalElementAmount <= isCappingValueDet) ? invtotalCapitalElementAmount : isCappingValueDet;
        });
        invtotalCapitalElement.addEventListener('input', () => {
          skillAmountElement.value="";
          skillFromDateElement.value="";
          skillToDateElement.value="";
          claimPeriodElement.value=0;
        });
        skillAmountElement.addEventListener('input', () => {
          let claimPeriod = (parseInt(claimPeriodElement.value)>0) ? parseInt(claimPeriodElement.value) : 0;
          let isCappingValueDet = claimPeriod*300000;
          let ivsCapitalTotal = invtotalCapitalElement.value;
          let invtotalCapitalElementAmount = (50/100) * ivsCapitalTotal;
          skillAmountElement.value = (invtotalCapitalElementAmount <= isCappingValueDet) ? invtotalCapitalElementAmount : isCappingValueDet;
        });
        this.fillUpMdInfo('cls_skMdName', 'cls_skMdDegn');
        this.fromAlphaNumericValidation();
      }
      break;
      /*End of calculation for Skill Certifications Fee */
      /*Start of calculation for Skill Gap Training Assistance  Developed By Bindurekha Nayak*/
      case 47:
        this.fromToDateValidation();
        let sgtadParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(sgtadParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        let totalAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_totalAmount')[0]);
        let totalAmountSkillGapElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_totalSkillGap')[0]);
        let skillGapFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_skillGapFromDate')[0]);
        let skillGapToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_skillGapToDate')[0]);
        
        this.totalSkillGapAmount = (this.totalSkillAmountAddMore =='') ? 0 : parseFloat(this.totalSkillAmountAddMore);
        this.skillGapAddMoreCalculationDet();
        let  totalAmountSkillGap = (50/100) * parseFloat(totalAmountElement.value);
        let cappingValue = 3000000;
        totalAmountSkillGapElement.value = (totalAmountSkillGap <= cappingValue) ? totalAmountSkillGap : cappingValue;
          
        totalAmountElement.addEventListener('input', () => {
            let totalClaimAmount = totalAmountElement.value;
            let totalAmountSkillGap = (50/100) * parseFloat(totalClaimAmount);
            totalAmountSkillGapElement.value = (totalAmountSkillGap <= cappingValue) ? totalAmountSkillGap : cappingValue;
         });
        totalAmountSkillGapElement.addEventListener('input', () => {
          let totalClaimAmount = totalAmountElement.value;
            let totalAmountSkillGap = (50/100) * parseFloat(totalClaimAmount);
            totalAmountSkillGapElement.value = (totalAmountSkillGap <= cappingValue) ? totalAmountSkillGap : cappingValue;
        });
        skillGapToDate.addEventListener('input', () =>{
          let startDate = skillGapFromDate.value;
          let endDate = skillGapToDate.value;
          let fromDate = new Date(startDate);
          let toDate = new Date(endDate);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          let policyEndDateCheck = this.eligibilityEndDateCheck('cls_skillGapToDate');
          if(toDate < fromDate){
            skillGapToDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'To date can not be less than From date'
            });
          }else if(diffYear > 5){
            skillGapToDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Can not claim more than 5 Years!'
            });
          }else{
            if(policyEndDateCheck==0){
              let param = {
                "fromDate": startDate,
                "toDate": endDate,
                "intId": sessionStorage.getItem('REGD_ID'),
                "yearLimit": 5,
                "onlineProcessId": this.processId,
                "profileId": this.userId
              } 
              this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
                this.loading = false;
                if(res.status == 200){
                  if(res.isApplicable==0){
                    skillGapFromDate.value = '';
                    skillGapToDate.value='';
                    Swal.fire({
                      icon: 'error',
                      text: 'You have already applied untill the selected date.Please try with another latest date.'
                    });
                  }else if(res.isApplicable==1){
                  let yearLimitDet = res.result;
                  let appliedYear = parseFloat(yearLimitDet)/12;
                  let claimPeriod =5;
                  let ClaimablePeriod = claimPeriod - appliedYear;
                  if(diffYear > ClaimablePeriod){
                      Swal.fire({
                        icon: 'error',
                        text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                      });
                      skillGapToDate.value = '';
                    } 
                  }
                  }
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ineligibility Notification',
                html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date.',
              });
              skillGapToDate.value = '';
            }
          }
        });
        
        skillGapFromDate.addEventListener('input', ()=>{
          skillGapToDate.value="";
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_sgtaPrevAmount');
        this.fillUpMdInfo('cls_mdName', 'cls_mdDegn');
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Skill Gap Training Assistance */
       /*start of calculation for Exemption of Electricity Duty Developed By Bindurekha Nayak*/
       case 58:
        let unitTypeDet: any = (<HTMLInputElement>document.getElementsByClassName('cls_unitType')[0]);
        let prcrCompanyNameE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfCompany')[0]);
        let prcrCompanyAddressE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifCmpAddress')[0]);
        let prcrContactNameE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfPerson')[0]);
        let prcrContactDesgE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDegn')[0]);
        let prcrContactMobE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifMobNo')[0]);
        let prcrDateOfCommercialE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfCommercial')[0]);
        let prcrContactAdressE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifAddress')[0]);
        let prcrDateOfIncorporationE: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfIncorporation')[0]);
        
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.loading = true;
        let prcrEParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(prcrEParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.companyDetails){
              prcrCompanyNameE.value = res.result.companyDetails.cmpName;
              prcrCompanyAddressE.value = res.result.companyDetails.cmpAddress;
              prcrContactAdressE.value = res.result.companyDetails.cmpAddress;
            }
            if(res.result.communicationDetails){
              prcrContactNameE.value = res.result.communicationDetails.empName;
              prcrContactDesgE.value = res.result.communicationDetails.empDegn;
              prcrContactMobE.value = res.result.communicationDetails.empMobNo;
            }
            if(res.result.dateDetails){
              prcrDateOfIncorporationE.value = res.result.dateDetails.incorporationDate;
              prcrDateOfCommercialE.value = res.result.dateDetails.commencementDate;
            }
            if(res.result.unitDetails){
              unitTypeDet.value = res.result.unitDetails.unitId;
            }
          }
        });
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Exemption of Electricity Duty*/
       /*start of calculation for Electricity Inspection Fee Electronics Developed By Bindurekha Nayak*/
       case 91:
        this.fromToDateValidation();
        let unitTypeDetDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_unitType')[0]);
        let prcrCompanyNameDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfCompany')[0]);
        let prcrCompanyAddressDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifCmpAddress')[0]);
        let prcrContactNameDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfPerson')[0]);
        let prcrContactDesgDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDegn')[0]);
        let prcrContactMobDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifMobNo')[0]);
        let prcrContactEmailDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifEmailId')[0]);
        let prcrDateOfIncorporationDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfIncorporation')[0]);
        let prcrDateOfCommercialDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfCommercial')[0]);
        let prcrContactAdressDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifAddress')[0]);
        
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        this.loading = true;
        let prcrDcParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(prcrDcParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.companyDetails){
              prcrCompanyNameDc.value = res.result.companyDetails.cmpName;
              prcrCompanyAddressDc.value = res.result.companyDetails.cmpAddress;
              prcrContactAdressDc.value = res.result.companyDetails.cmpAddress;
            }
            if(res.result.communicationDetails){
              prcrContactNameDc.value = res.result.communicationDetails.empName;
              prcrContactDesgDc.value = res.result.communicationDetails.empDegn;
              prcrContactMobDc.value = res.result.communicationDetails.empMobNo;
              prcrContactEmailDc.value = res.result.communicationDetails.empEmail;
            }
            if(res.result.dateDetails){
              prcrDateOfIncorporationDc.value = res.result.dateDetails.incorporationDate;
              prcrDateOfCommercialDc.value = res.result.dateDetails.commencementDate;
            }
            if(res.result.unitDetails){
              unitTypeDetDc.value = res.result.unitDetails.unitId;
            }
          }
        });
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Electricity Inspection Fee Electronics*/
        /*start of calculation for Employment Undertaking Developed By Bindurekha Nayak*/
        case 71:
          this.fromToDateValidation();
          this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
          this.fromAlphaNumericValidation();
        break;
        /*End of calculation for Employment Undertaking*/
      /*Start of calculation for Intern Stipend Reimbursement Developed By Bindurekha Nayak*/
      case 97:
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_isrName', 'cls_isrDesg');
        let isrParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(isrParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_isrPrevAmount_hd');
        
        let totalInternEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrTotalIntern')[0]);
        let sdteEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrTotalSdteIntern')[0]);
        let stipendPeriodEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrPeriod')[0]);
        let stipendPaidPerEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrStipend')[0]);
        let totalStipenedClaimEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrPrevTotalElgibleAmount')[0]);
        let stipened:any = document.getElementsByClassName('cls_isrCmnStpTotal');
        let fixedSdteIntern:any = 20;
        let sdteRemIntern:any = 0;
        let considerNonSdteIntern:any = 0;
        let considerSdteIntern:any = 0;
        let totralStipenedAmount:any = 0;
        let stipendPeriodDet:any=0;
        stipendPeriodEle.addEventListener('input', () => {
          let stipenedPeriod = isNaN(stipendPeriodEle.value) ? 0 : stipendPeriodEle.value;
          if (stipenedPeriod <= 6) {
              stipendPeriodDet = stipendPeriodEle.value;
          } else {
              stipendPeriodDet = 6;
          }
          if (Number(totalInternEle.value) <= Number(sdteEle.value)) {
            Swal.fire({
                icon: 'error',
                text: 'Total Number of Interns Hired must be greater than or equal to the Number of Interns Selected through SDTE/OSDA.'
            });
            totalInternEle.value = '';
            sdteEle.value = '';
            stipendPeriodEle.value ='';
          }
         })
        for (let item of stipened){
          item.addEventListener('input', () => {
            let totalIntern = isNaN(totalInternEle.value) ? 0 : totalInternEle.value;
            let totalSdteIntern = isNaN(sdteEle.value) ? 0 : sdteEle.value;
            let stipenedPaidPerMonth = isNaN(stipendPaidPerEle.value) ? 0 : stipendPaidPerEle.value;
            if(totalSdteIntern < 20){
              considerSdteIntern = totalSdteIntern;
              sdteRemIntern = fixedSdteIntern - totalSdteIntern;
              considerNonSdteIntern = (sdteRemIntern >= totalIntern) ? totalIntern : sdteRemIntern;
            }else{
              considerSdteIntern = fixedSdteIntern;
              considerNonSdteIntern = 0;
            }
            if(considerNonSdteIntern != 0){
              totralStipenedAmount = (considerSdteIntern*stipendPeriodDet*stipenedPaidPerMonth) + ((considerNonSdteIntern*stipendPeriodDet*stipenedPaidPerMonth)/2)
            }else{
              totralStipenedAmount = (considerSdteIntern*stipendPeriodDet*stipenedPaidPerMonth)
            }
            totalStipenedClaimEle.value = totralStipenedAmount;
          })
        }
        totalStipenedClaimEle.addEventListener('input', () => {
          totalStipenedClaimEle.value = totralStipenedAmount;
        });
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Intern Stipend Reimbursement */
      /*Start of calculation for EPF and ESI Developed By Bindurekha Nayak Modified By Sibananda Sahu*/
      case 120: 
        let epfesiParams = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getEleEpfEsiPrevRecord(epfesiParams).subscribe(res => {
          if(res.status == 1){
            this.previousClaimedSubsidy = res.results;
            this.booleanPrevClaimStatus = ((res.results).length) ? true : false;
            this.claimEpfEsiAmount = res.claimAmount;
          }
        });

        let maxUpdatedOn = new Date();
        console.log(maxUpdatedOn);
        let eeParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(eeParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = !!((res.result).length);
            if(this.previousClaimedSubsidy.length > 0){
            let minCreatedOn = this.previousClaimedSubsidy[0].dtmCreatedOn;
            maxUpdatedOn = this.previousClaimedSubsidy[0].stmUpdatedOn;

            this.previousClaimedSubsidy.forEach(element => {
              if (new Date(element.dtmCreatedOn) < new Date(minCreatedOn)) {
                minCreatedOn = element.dtmCreatedOn;
            }
            if (new Date(element.stmUpdatedOn) > new Date(maxUpdatedOn)) {
                maxUpdatedOn = element.stmUpdatedOn;
            }
            });
          }
          }
        });
        this.fillUpPrevDetails('cls_epfEsiAmount');            //show previous details button
        this.fillUpMdInfo('cls_epfEsiName', 'cls_epfEsiDegn'); //fill up md info
        this.fromToDateValidation();                           //from and to date validation
        this.fromAlphaNumericValidation();                     //to validate special characters
        let eeBdaElement: any           = (<HTMLInputElement>document.getElementsByClassName('cls_epfBda')[0]);
        let eeSubsidyPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfSubsidyPeriod')[0]);
        let eeAmountElementDet: any     = (<HTMLInputElement>document.getElementsByClassName('cls_epfClaimAmount')[0]);
        let eeBdaTotalElement: any      = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiClaimAmount ')[0]);
        let fromDateElement: any        = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiFromdate')[0]);
        let toDateElement: any          = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiTodate')[0]);
        let eeBdaValue: any             = 0
        let eeBdaCapingValue: any       = 10000000;
        this.intNoOfDateField           = 2;
        eeBdaElement.addEventListener('change', () => {
          eeBdaValue = eeBdaElement.value;
          //showing and hiding options
          if (eeBdaValue == 1) {
            eeSubsidyPeriodElement.options[eeSubsidyPeriodElement.options.length - 1].style.display = 'none';
            eeSubsidyPeriodElement.options[eeSubsidyPeriodElement.options.length - 2].style.display = 'none';
          } else {
            for (let i = 0; i < eeSubsidyPeriodElement.options.length; i++) {
                eeSubsidyPeriodElement.options[i].style.display = '';
            }
          }
          //End of sshowing and hiding options
          eeBdaValue = eeBdaElement.value;
          eeAmountElementDet.value      = '';
          eeSubsidyPeriodElement.value  = 0;
          eeBdaTotalElement.value       =0;
        })
        eeSubsidyPeriodElement.addEventListener('input', () => {
          if(eeBdaValue == "" || eeBdaValue == undefined || eeBdaValue == 0){
            Swal.fire({
              icon: 'error',
              text: 'Please Select Whether Under BDA or Not'
            });
            eeSubsidyPeriodElement.value = 0;
          } else if (eeBdaValue == 1 && eeSubsidyPeriodElement.value > 3) {
            Swal.fire({
              icon: 'error',
              text: 'For Under BDA subsidy period should be less than or equal to 3 years'
            });
            eeSubsidyPeriodElement.value = 0;
          }
          fromDateElement.value    = '';
          toDateElement.value      = '';
          eeAmountElementDet.value = '';
          eeBdaTotalElement.value  = 0;
        })
        fromDateElement.addEventListener('change', () => {
          if ((this.previousClaimedSubsidy.length > 0) && (new Date(maxUpdatedOn) > new Date(fromDateElement.value))) {
            Swal.fire({
                icon: 'error',
                text: 'You have already applied subsidy for the date selected'
            });
            fromDateElement.value = '';
            return;
          }
          let subsidyPeriod = parseInt(eeSubsidyPeriodElement.value);
          let fromDate      = new Date(fromDateElement.value);
          let toDate        = new Date(fromDate);
          let currentDate   = new Date();
          toDate.setFullYear(fromDate.getFullYear() + subsidyPeriod);
          // Validating if toDate is less than or equal to current date
          if (toDate <= currentDate) {
              let formattedToDate    = toDate.toISOString().slice(0, 10);
              toDateElement.value    = formattedToDate;
              toDateElement.readOnly = true;
              if(eeBdaValue == "" || eeBdaValue == undefined || eeBdaValue == 0){
                eeBdaTotalElement.value = '';
                toDateElement.value     = '';
                fromDateElement.value   ='';
                Swal.fire({
                  icon: 'error',
                  text: 'Please select the BDA approved or not'
                });
              } else {
                let rdParam = {
                  "onlineProcessId" : this.processId,
                  "profileId"       : this.userId,
                  "intRegId"        : sessionStorage.getItem('REGD_ID')
                }
                this.IrmsDetailsService.getElecEpfAppliedYears(rdParam).subscribe(res => {
                  if(res.status == 200){
                    let availedSubsidyYears = res.result;
                    if(eeBdaValue == 1) {
                      let applicableSubsidyPeriod = 3 - availedSubsidyYears;
                      if(applicableSubsidyPeriod <= 0 ) {
                        eeBdaCapingValue = 0;
                        Swal.fire({
                          icon: 'error',
                          text: 'You have already claimed ' + availedSubsidyYears + ' years of subsidy'
                        });
                        eeSubsidyPeriodElement.value = 0;
                        fromDateElement.value = '';
                        toDateElement.value = '';
                      } else if(subsidyPeriod > applicableSubsidyPeriod) {
                        Swal.fire({
                          icon: 'error',
                          text: 'For Under BDA subsidy period You can apply less than or equal to ' + applicableSubsidyPeriod + ' years'
                        });
                        eeSubsidyPeriodElement.value = 0;
                        fromDateElement.value        = '';
                        toDateElement.value          = '';
                        eeBdaCapingValue             = 0;
                      } else {
                        eeBdaCapingValue = 10000000 * subsidyPeriod;
                      }
                    } else if(eeBdaValue == 2) {
                      let applicableSubsidyPeriod = 5 - availedSubsidyYears;
                      applicableSubsidyPeriod = (subsidyPeriod <= applicableSubsidyPeriod) ? subsidyPeriod : applicableSubsidyPeriod;
                      eeBdaCapingValue = 10000000 * applicableSubsidyPeriod;
                    } else {
                      eeBdaCapingValue = 10000000;
                    }
                  } else {
                    eeBdaCapingValue = 10000000 * subsidyPeriod;
                  }
                });
              }
          } else {
              Swal.fire({
                icon: 'error',
                text: 'As of current date, you are not eligible for ' + (subsidyPeriod > 1 ? subsidyPeriod + ' years' : subsidyPeriod + ' year') + ' of subsidy'

              })
              eeBdaCapingValue = 0;
          }
      });

      // let eeBdaCapingValue: any = 10000000;
      eeBdaTotalElement.addEventListener('input', () => { 
        eeBdaTotalElement.value = (eeBdaTotalElement.value <= eeBdaCapingValue) ?  eeBdaTotalElement.value : eeBdaCapingValue;
      })
      eeAmountElementDet.addEventListener('input', () => {
          if (eeBdaValue == "" || eeBdaValue == undefined || eeBdaValue == 0) {
            eeBdaTotalElement.value = '';
            toDateElement.value = '';
            fromDateElement.value='';
            Swal.fire({
              icon: 'error',
              text: 'Please select the BDA approved or not'
            }); 
          } else if(eeSubsidyPeriodElement.value == undefined || eeSubsidyPeriodElement.value == "" || parseInt(eeSubsidyPeriodElement.value) <= 0 ){
            eeBdaTotalElement.value = '';
            eeAmountElementDet.value = '';
            toDateElement.value = '';
            fromDateElement.value='';
            Swal.fire({
              icon: 'error',
              text: 'Please select the subsidy period'
            });
          } else if(eeBdaValue == 1) {
            eeBdaTotalElement.value = (eeAmountElementDet.value <= eeBdaCapingValue) ?  eeAmountElementDet.value : eeBdaCapingValue;
          } else if(eeBdaValue == 2) {
            eeBdaTotalElement.value = (eeAmountElementDet.value <= eeBdaCapingValue) ?  eeAmountElementDet.value : eeBdaCapingValue;
            // eeBdaTotalElement.value = parseInt(eeAmountElementDet.value);
            let res = this.eligibilityDateCheck('cls_epfEsiFromdate','cls_epfEsiTodate');
          }
            
            
          })
      break;
      /*End of calculation for EPF and ESI */
      /*Start of calculation for R&D Incentive Developed By Bindurekha Nayak*/
      case 100:{
        this.fromToDateValidation();
        let rdParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(rdParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_rndPrevAmount');
        this.fillUpMdInfo('cls_rdName', 'cls_rdDesn');

        let rdExpensesControl:any = document.getElementsByClassName('cls_rdExpense');
        let rdTotalExpenseAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdTotalExpense')[0]);
        let rdFinalClaimAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdPreAmount')[0]);
        let rdFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdFromDate')[0]);
        let rdToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rdToDate')[0]);
        let claimPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
        let totalRdAmount:any = 0;
        let finalClaimAmount:any = 0;
        for(let control of rdExpensesControl){
          control.addEventListener('input', () => {
            totalRdAmount = 0;
            for (let i = 0; i < rdExpensesControl.length; i++) {
              let data: any = $($(rdExpensesControl[i])).val();
              if ($.isNumeric(data)) {
                totalRdAmount += parseFloat(data);
              }
            }
            rdTotalExpenseAmount.value = totalRdAmount;
            let event = new Event("input");
            rdTotalExpenseAmount.dispatchEvent(event);
          });
        }
        let previousClaimPeriod = parseInt(claimPeriodElement.value);
        claimPeriodElement.addEventListener('change', function () {
            let claimPeriod = parseInt(claimPeriodElement.value);
            if (claimPeriod !== previousClaimPeriod) {
                previousClaimPeriod = claimPeriod; 
                
                if (claimPeriod <= 0) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Please select a valid Claim period!'
                    });
                    rdFromDate.value = '';
                    rdToDate.value = '';
                 } else {
                  rdFromDate.value = '';
                  rdToDate.value = '';
                }
            }
        });
        rdFromDate.addEventListener('change', () => {
          let claimPeriod = parseInt(claimPeriodElement.value);
          if(claimPeriod <= 0){
            Swal.fire({
              icon: 'error',
              text: 'Please select Claim period first!'
            })
          }
          let startDate = new Date(rdFromDate.value);
          let endDate = new Date(rdToDate.value);
          if (endDate < startDate) {
            rdToDate.value = '';
              Swal.fire({
                icon: 'error',
                text: 'End date can not be less than start date'
              });
            } else {
              let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
              let prvParam = {
                "intId": sessionStorage.getItem('REGD_ID'),
                "onlineProcessId": this.processId,
                "profileId": sessionInfo.USER_ID,
                "incStartDate": rdFromDate.value,
                "claimLimit": 5,
              };
              this.loading = true;
              this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
                this.loading = false;
                let claimedPeriod = parseInt(res.claimedPeriod);
                let lastIncentiveDate = res.lastIncDate;
                if (res.status == 2) {
                  if (claimedPeriod >= 5) {
                    rdToDate.value = '';
                    Swal.fire({
                      icon: 'error',
                      text: 'You have already claimed for a maximum period of  5 years!'
                    });
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Date Ineligibility',
                      html: "You have already applied until '<b>" + lastIncentiveDate + "</b>' ! </br> Please apply after this date",
                    });
                  }
                  rdFromDate.value = '';
                } else {
                  let ClaimablePeriod = 5 - claimedPeriod;
                  if (claimPeriod > ClaimablePeriod) {
                    Swal.fire({
                      icon: 'error',
                      text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                    });
                    rdFromDate.value = '';
                    rdToDate.value = '';
                  } else {
                    let fromDate = new Date(rdFromDate.value);
                    let toDate = new Date(fromDate);
                    let currentDate = new Date();
                    toDate.setFullYear(fromDate.getFullYear() + claimPeriod);
                    // Validating if toDate is less than or equal to current date
                    if (toDate <= currentDate) {
                      let formattedToDate = toDate.toISOString().slice(0, 10);
                      rdToDate.value = formattedToDate;
                      rdToDate.readOnly = true;
                      rdToDate.dispatchEvent(new Event('change'));
                    } else {
                      Swal.fire({
                        icon: 'error',
                        text: 'As of current date, you are not eligible for ' + (claimPeriod > 1 ? claimPeriod + ' years' : claimPeriod + ' year') + ' of subsidy'

                      })
                    }
                  }
                }
              });
            }
        });
        rdToDate.readOnly = true;
        rdToDate.addEventListener('change',  () => {
            let startDate = new Date(rdFromDate.value);
            let endDate = new Date(rdToDate.value);
            if (endDate < startDate) {
              rdToDate.value = '';
              Swal.fire({
                icon: 'error',
                text: 'End date can not be less than start date'
              });
            }else{
              let policyEndDateCheck = this.eligibilityEndDateCheck('cls_rdToDate');
              if(policyEndDateCheck==0){
                let startDate = new Date(rdFromDate.value);
                let endDate = new Date(rdToDate.value);
                
                let diffMonth = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());

                  if (diffMonth < 0) {
                    diffMonth = 0; // Handle negative differences if needed
                  }
                  let claimPeriod = parseInt(claimPeriodElement.value);
                  let finalCappingAmount:any = claimPeriod*20000000;
                  totalRdAmount = parseFloat(rdTotalExpenseAmount.value);
                  let claimAmount = ((30/100) * totalRdAmount);
                  let totalAmount = claimPeriod * claimAmount;
                  finalClaimAmount = (totalAmount <= finalCappingAmount) ? totalAmount : finalCappingAmount;
                  rdFinalClaimAmount.value = finalClaimAmount;
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Ineligibility Notification',
                  html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date by one year.',
                });
                rdToDate.value = '';
              }
            }
          
        });
        
        rdTotalExpenseAmount.addEventListener('input', () => {
          rdFromDate.value = '';
          rdToDate.value = '';
          claimPeriodElement.value=0;
          rdFinalClaimAmount.value='';
        });
        rdFinalClaimAmount.addEventListener('input', () => {
          let claimPeriod = parseInt(claimPeriodElement.value);
          let finalCappingAmount:any = claimPeriod*20000000;
          totalRdAmount = parseFloat(rdTotalExpenseAmount.value);
          let claimAmount = ((30/100) * totalRdAmount);
          let totalAmount = claimPeriod * claimAmount;
          finalClaimAmount = (totalAmount <= finalCappingAmount) ? totalAmount : finalCappingAmount;
          rdFinalClaimAmount.value = finalClaimAmount;
        });

        this.fromAlphaNumericValidation();
      }
      break;
      /*End of calculation for R&D Incentive */
       /*Start of calculation for Recruitment Assistance IT Policy  Developed By Bindurekha Nayak*/
       /*Date format is not there so not calculate year check */
       case 95:{
       let totalBreakUpAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalClaimAmount')[0]);
        let totalBreakUp: any       = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalBrkp')[0]);
        let totalBreakUpOther: any       = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalBrkpOthers')[0]);
        totalBreakUpOther.disabled = true;
        totalBreakUp.disabled       = true;
        let netTotalEle: any = document.getElementsByClassName('net_domicile_total_emp');
        let netDisabledEle: any = document.getElementsByClassName('net_domicile_disabled');
        let netGeneralFEle: any = document.getElementsByClassName('net_domicile_general_f');
        let netDisabledFEle: any = document.getElementsByClassName('net_domicile_disabled_f');
        let financialYear: any = (<HTMLInputElement>document.getElementsByClassName('cls_financial_year')[0]);
        let thisFifQuaEle: any      = (<HTMLInputElement>document.getElementsByClassName('cls_quater')[0]);
        let prevfinancialYear: any = (<HTMLInputElement>document.getElementsByClassName('cls_prev_year')[0]);
        let prevthisFifQuaEle: any      = (<HTMLInputElement>document.getElementsByClassName('cls_prev_quarter')[0]);
        prevfinancialYear.disabled       = true;
        prevthisFifQuaEle.disabled       = true;
        let netScEle: any = document.getElementsByClassName('net_domicile_sc');
        let netStEle: any = document.getElementsByClassName('net_domicile_st');
        let netScFEle: any = document.getElementsByClassName('net_domicile_sc_f');
        let netStFEle: any = document.getElementsByClassName('net_domicile_st_f');
        let domicialScEle: any = document.getElementsByClassName('od_domicile_sc');
        let domicialStEle: any = document.getElementsByClassName('od_domicile_st');
        let netGeneralEle: any = document.getElementsByClassName('net_domicile_general');
        let domicialScFEle: any = document.getElementsByClassName('od_domicile_sc_f');
        let domicialStFEle: any = document.getElementsByClassName('od_domicile_st_f');
        let domicialTotalEle: any = document.getElementsByClassName('od_domicile_total_emp');
        let domicialGeneralEle: any = document.getElementsByClassName('od_domicile_general');
        let domicialDisabledEle: any = document.getElementsByClassName('od_domicile_disabled');
        let domicialGeneralFEle: any = document.getElementsByClassName('od_domicile_general_f');
        let domicialDisabledFEle: any = document.getElementsByClassName('od_domicile_disabled_f');
        let thisDomicialYearScEle: any = document.getElementsByClassName('od_now_domicile_sc');
        let thisDomicialYearStEle: any = document.getElementsByClassName('od_now_domicile_st');
        let thisDomicialYearStFEle: any = document.getElementsByClassName('od_now_domicile_st_f');
        let thisDomicialYearScFEle: any = document.getElementsByClassName('od_now_domicile_sc_f');
        let thisDomicialYearTotalEle: any = document.getElementsByClassName('od_now_domicile_total_emp');
        let thisDomicialYearGeneralEle: any = document.getElementsByClassName('od_now_domicile_general');
        let thisDomicialYearDisabledEle: any = document.getElementsByClassName('od_now_domicile_disabled');
        let thisDomicialYearGeneralFEle: any = document.getElementsByClassName('od_now_domicile_general_f');
        let thisDomicialYearDisabledFEle: any = document.getElementsByClassName('od_now_domicile_disabled_f');
        let isFirstChangeEvent : boolean = true;
        let policyDateDetails = sessionStorage.getItem('SCHEME_POLICY_DET');
        let policyData = JSON.parse(policyDateDetails);
        let commecStartDate: string = new Date(policyData.COMM_START_DATE).toISOString().split('T')[0];
        const startDate = new Date(commecStartDate);
        const endDate   = new Date();
        this.financialYearsWithQuarters = this.getFinancialYearWithQuarters(startDate, endDate);
        const yearsArray: string[] = [];
        this.financialYearsWithQuarters.forEach(obj => {
          if (Array.isArray(obj.year)) {
              obj.year.forEach(year => {
                  yearsArray.push(year);
              });
          }
        });
      yearsArray.push('Select');
       setTimeout(() => {
          removeOptionByText(yearsArray);
        }, 2000);
        
        function removeOptionByText(optionYear: any) {
          let dropelement = document.querySelector('select.cls_financial_year') as HTMLSelectElement;
          for (let i = dropelement.options.length - 1; i >= 0; i--) {
            if (!optionYear.includes(dropelement.options[i].innerText)) {
              dropelement.remove(i);
            }
          }
        }
        
        
        financialYear.addEventListener('change', () => {
          var selectedOption = financialYear.options[financialYear.selectedIndex];         
          var selectedOptionText = selectedOption.innerHTML;
          const quartersForYear = getQuartersByYear(selectedOptionText);
          quartersForYear.push("0");
          removeQartersByText(quartersForYear);
          if(this.formEditStatus != 1){
          thisFifQuaEle.value='0';}
          });
          let financialyear:any = this.financialYearsWithQuarters
          function getQuartersByYear(year) {
            for (const entry of financialyear) {
                if (entry.year.includes(year)) {
                    return entry.quarters;
                }
            }
            return null; 
        }

        function removeQartersByText(optionYear: any) {
          let dropelement = document.querySelector('select.cls_quater') as HTMLSelectElement;
          for (let i = dropelement.options.length - 1; i >= 0; i--) {
            if (!optionYear.includes(dropelement.options[i].value)) {
              dropelement.options[i].style.display = 'none';
            } else {
              dropelement.options[i].style.display = 'block'; 
            }
          }
        }
        //End of Removing dropdown options
        thisFifQuaEle.addEventListener('change', () => {
          if(isFirstChangeEvent && this.formEditStatus == 1){
            isFirstChangeEvent = false;
            return;
          }
          this.loading = true;
          let prevYearEmpParam = {
            "intYear": financialYear.value,
            "intQuarter": thisFifQuaEle.value,
            "intId": sessionStorage.getItem('REGD_ID'),
            "intProfId": this.userId
          }
          this.IrmsDetailsService.financialYearEmpDetails(prevYearEmpParam).subscribe(res => {
            this.loading = false;
            if(res.status == 200){
              let index = 0;
              let index1= 0;
              for(let data of res.result.thisYearEmpDetail){
                domicialDisabledFEle[index].value = data.int_disabled_female;
                domicialDisabledEle[index].value = data.int_disabled_male;
                domicialGeneralFEle[index].value = data.int_general_female;
                domicialGeneralEle[index].value = data.int_general_male;
                domicialScFEle[index].value = data.int_sc_female;
                domicialScEle[index].value = data.int_sc_male;
                domicialStFEle[index].value = data.int_st_female;
                domicialStEle[index].value = data.int_st_male;
                domicialTotalEle[index].value = data.int_total;
                index++;
              }
              prevfinancialYear.value = res.result.prevYear;
              prevthisFifQuaEle.value  = res.result.prevQuarter;
              for(let data of res.result.prevYearEmpDetail){
                thisDomicialYearDisabledFEle[index1].value = data.int_disabled_female;
                thisDomicialYearDisabledEle[index1].value = data.int_disabled_male;
                thisDomicialYearGeneralFEle[index1].value = data.int_general_female;
                thisDomicialYearGeneralEle[index1].value = data.int_general_male;
                thisDomicialYearScFEle[index1].value = data.int_sc_female;
                thisDomicialYearScEle[index1].value = data.int_sc_male;
                thisDomicialYearStFEle[index1].value = data.int_st_female;
                thisDomicialYearStEle[index1].value = data.int_st_male;
                thisDomicialYearTotalEle[index1].value = data.int_total;
                index1++;
              }
            }
          });
        });
        let finalCappingValue = 3000000;
        let netIndex = 0;
        for(let net of netGeneralEle){
          netGeneralEle[netIndex].disabled = true;
          netScEle[netIndex].disabled = true;
          netStEle[netIndex].disabled = true;
          netDisabledEle[netIndex].disabled = true;
          netGeneralFEle[netIndex].disabled = true;
          netScFEle[netIndex].disabled = true;
          netStFEle[netIndex].disabled = true;
          netDisabledFEle[netIndex].disabled = true;
          netTotalEle[netIndex].disabled = true;
          netIndex++;
        }

        let netDomicialGeneralEle: any = (<HTMLInputElement>document.getElementsByClassName('net_domicile_general')[0]);
        let calculateButton = document.createElement('button');
        calculateButton.textContent = 'Calculate Breakup';
        calculateButton.classList.add('btn');
        calculateButton.classList.add('btn-primary');
        calculateButton.classList.add('mb-2');
        let parentCalculateBtn = netDomicialGeneralEle.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        parentCalculateBtn.insertAdjacentElement('beforeBegin',calculateButton);
        let netTotalAmount = 0;
       // Initialize all input fields with a default value of zero if the value is not available
        initializeInputFields();
        function initializeInputFields() {
            let inputFields = document.querySelectorAll<HTMLInputElement>('.net_domicile_general, .net_domicile_sc, .net_domicile_st, .net_domicile_disabled, .net_domicile_general_f, .net_domicile_sc_f, .net_domicile_st_f, .net_domicile_disabled_f, .net_domicile_total_emp');
            inputFields.forEach(inputField => {
                if (!inputField.value) {
                    inputField.value = '0';
                }
            });
        }
        calculateButton.addEventListener('click', () => {
          calculateButton.disabled = true;  // Disable the button after the first click
          let calIndex = 0;
          let netTotalCount = 0;
          let netTotalGeneral = 0;
          let netTotalOthers = 0;
          let netGeneralMale = 0;
          let netScMale = 0;
          let netStMale = 0;
          let netDisabledMale = 0;
          let netGeneralFemale = 0;
          let netScFemale = 0;
          let netStFemale = 0;
          let netDisabledFemale = 0;
          let netTotalAmountBoth = 0;
          let arrFinalCnt = [];
          let totalGeneralCount = 0;
          let totalOthersCount =0;
          let totalFinalAmountTotal =0;
          for(let net of netGeneralEle){
           domicialGeneralEle[calIndex].disabled = true;
            domicialScEle[calIndex].disabled = true;
            domicialStEle[calIndex].disabled = true;
            domicialDisabledEle[calIndex].disabled = true;
            domicialGeneralFEle[calIndex].disabled = true;
            domicialScFEle[calIndex].disabled = true;
            domicialStFEle[calIndex].disabled = true;
            domicialDisabledFEle[calIndex].disabled = true;
            domicialTotalEle[calIndex].disabled = true;
            thisDomicialYearDisabledFEle[calIndex].disabled = true;
            thisDomicialYearDisabledEle[calIndex].disabled = true;
            thisDomicialYearGeneralFEle[calIndex].disabled = true;
            thisDomicialYearGeneralEle[calIndex].disabled = true;
            thisDomicialYearScFEle[calIndex].disabled = true;
            thisDomicialYearScEle[calIndex].disabled = true;
            thisDomicialYearStFEle[calIndex].disabled = true;
            thisDomicialYearStEle[calIndex].disabled = true;
            thisDomicialYearTotalEle[calIndex].disabled = true;

            netGeneralEle[calIndex].value = isNaN(parseFloat(domicialGeneralEle[calIndex].value) - parseFloat(thisDomicialYearGeneralEle[calIndex].value)) ? 0 : parseFloat(domicialGeneralEle[calIndex].value) - parseFloat(thisDomicialYearGeneralEle[calIndex].value);
            netScEle[calIndex].value = isNaN(parseFloat(domicialScEle[calIndex].value) - parseFloat(thisDomicialYearScEle[calIndex].value)) ? 0 : parseFloat(domicialScEle[calIndex].value) - parseFloat(thisDomicialYearScEle[calIndex].value);
            netStEle[calIndex].value = isNaN(parseFloat(domicialStEle[calIndex].value) - parseFloat(thisDomicialYearStEle[calIndex].value)) ? 0 : parseFloat(domicialStEle[calIndex].value) - parseFloat(thisDomicialYearStEle[calIndex].value);
            netDisabledEle[calIndex].value = isNaN(parseFloat(domicialDisabledEle[calIndex].value) - parseFloat(thisDomicialYearDisabledEle[calIndex].value)) ? 0 : parseFloat(domicialDisabledEle[calIndex].value) - parseFloat(thisDomicialYearDisabledEle[calIndex].value);
            netGeneralFEle[calIndex].value = isNaN(parseFloat(domicialGeneralFEle[calIndex].value) - parseFloat(thisDomicialYearGeneralFEle[calIndex].value)) ? 0 : parseFloat(domicialGeneralFEle[calIndex].value) - parseFloat(thisDomicialYearGeneralFEle[calIndex].value);
            netScFEle[calIndex].value = isNaN(parseFloat(domicialScFEle[calIndex].value) - parseFloat(thisDomicialYearScFEle[calIndex].value)) ? 0 : parseFloat(domicialScFEle[calIndex].value) - parseFloat(thisDomicialYearScFEle[calIndex].value);
            netStFEle[calIndex].value = isNaN(parseFloat(domicialStFEle[calIndex].value) - parseFloat(thisDomicialYearStFEle[calIndex].value)) ? 0 : parseFloat(domicialStFEle[calIndex].value) - parseFloat(thisDomicialYearStFEle[calIndex].value);
            netDisabledFEle[calIndex].value = isNaN(parseFloat(domicialDisabledFEle[calIndex].value) - parseFloat(thisDomicialYearDisabledFEle[calIndex].value)) ? 0 : parseFloat(domicialDisabledFEle[calIndex].value) - parseFloat(thisDomicialYearDisabledFEle[calIndex].value);
            netTotalEle[calIndex].value = isNaN(parseFloat(domicialTotalEle[calIndex].value) - parseFloat(thisDomicialYearTotalEle[calIndex].value)) ? 0 : parseFloat(domicialTotalEle[calIndex].value) - parseFloat(thisDomicialYearTotalEle[calIndex].value);

            netGeneralMale = (netGeneralEle[calIndex].value > 0) ? netGeneralMale + parseInt(netGeneralEle[calIndex].value) : netGeneralMale + 0;
            netScMale = (netScEle[calIndex].value > 0) ? netScMale + parseInt(netScEle[calIndex].value) : netScMale + 0;
            netStMale = (netStEle[calIndex].value > 0) ? netStMale + parseInt(netStEle[calIndex].value) : netStMale + 0;
            netDisabledMale = (netDisabledEle[calIndex].value > 0) ? netDisabledMale + parseInt(netDisabledEle[calIndex].value) : netDisabledMale + 0;
            netGeneralFemale = (netGeneralFEle[calIndex].value > 0) ? netGeneralFemale + parseInt(netGeneralFEle[calIndex].value) : netGeneralFemale + 0;
            netScFemale = (netScFEle[calIndex].value > 0) ? netScFemale + parseInt(netScFEle[calIndex].value) : netScFemale + 0;
            netStFemale = (netStFEle[calIndex].value > 0) ? netStFemale + parseInt(netStFEle[calIndex].value) : netStFemale + 0;
            netDisabledFemale = (netDisabledFEle[calIndex].value > 0) ? netDisabledFemale + parseInt(netDisabledFEle[calIndex].value) : netDisabledFemale + 0;
            netTotalGeneral = (parseFloat(netGeneralEle[calIndex].value) > 0) ? parseFloat(netGeneralEle[calIndex].value) : 0;
            netTotalCount = (netTotalEle[calIndex].value > 0) ? parseInt(netTotalEle[calIndex].value) : 0;
              const netElements = [
                parseFloat(netScEle[calIndex].value),
                parseFloat(netStEle[calIndex].value),
                parseFloat(netDisabledEle[calIndex].value),
                parseFloat(netGeneralFEle[calIndex].value),
                parseFloat(netScFEle[calIndex].value),
                parseFloat(netStFEle[calIndex].value),
                parseFloat(netDisabledFEle[calIndex].value)
              ];
              if(netTotalCount>0){
                netTotalOthers = netElements.reduce((sum, value) => sum + (value > 0 ? value : 0), 0);
               }else{
                netTotalOthers = 0;
              }
              netTotalAmountBoth = (parseFloat(netTotalEle[calIndex].value) > 0) ? parseFloat(netTotalEle[calIndex].value) : 0;
               let amtPerGenM = 8000;
              let amtPerOth = 10000;
              arrFinalCnt = this.getFinalEligibleAmount(netTotalGeneral, netTotalOthers, netTotalAmountBoth, amtPerGenM, amtPerOth);
              totalFinalAmountTotal += arrFinalCnt[2];
              totalGeneralCount +=arrFinalCnt[0];
              totalOthersCount +=arrFinalCnt[1];
              totalBreakUpAmount.value = Math.min(totalFinalAmountTotal, finalCappingValue)
              totalBreakUpOther.value = totalOthersCount;
              totalBreakUp.value = totalGeneralCount;
              calIndex++;
          }
        });
        
        totalBreakUpAmount.addEventListener('keyup', () => {
          let enteredTotalVal = totalBreakUpAmount.value;
          totalBreakUpAmount.value = (enteredTotalVal > finalCappingValue) ? finalCappingValue : netTotalAmount;
        });
        this.addMoreTotal(null);
        this.addMoreTotal2(null);
        this.fillUpMdInfo('cls_raName', 'cls_raDegn');
        this.fromAlphaNumericValidation();
        this.fromToDateValidation();
      }
      break;
      /*End of calculation for Recruitment Assistance IT Policy */
    }
    switch (this.processId) {
      case 36:
        console.log('process id based case');
      break;
    }
   
    // Function to add two strings as numbers
    function addDecimalNumbers(a, b) {
      let maxLength = Math.max(a.length, b.length);
      let [integerPartA, decimalPartA = ''] = a.split('.');
      let [integerPartB, decimalPartB = ''] = b.split('.');

      let paddedDecimalPartA = decimalPartA.padEnd(maxLength, '0');
      let paddedDecimalPartB = decimalPartB.padEnd(maxLength, '0');

      let decimalSum: any = (parseInt(paddedDecimalPartA, 10) + parseInt(paddedDecimalPartB, 10)).toString();

      let carry = Math.floor(decimalSum / (10 ** maxLength));

      let integerSum = (parseInt(integerPartA, 10) + parseInt(integerPartB, 10) + carry).toString();

      let result = integerSum;
      if (decimalSum !== '0') {
        result += '.' + decimalSum.slice(-maxLength).replace(/0+$/, '');
      }

      return result;
    }
  }
  


// Added by Rohit for column wise add more on 31-10-23
fillAddMoreColumnArray(addMorectrlId: any,addMoreFormConfigData:any,addMoreValueDetails:any)
  // when page is loaded this function set's add more array
 { 
  
  if((typeof this.arrAddMoreColumnData[addMorectrlId] =="undefined" || typeof this.arrAddMoreColumnData[addMorectrlId] == undefined)  && addMoreValueDetails[addMorectrlId]! ==undefined )
  {

   this.arrAddMoreColumnData[addMorectrlId]=[{}];
  }
  
  else if(!Object.keys(this.arrAddmoreElemntColumnKeys).includes(addMorectrlId) && addMoreValueDetails[addMorectrlId]!=undefined )
  {
    let arrAddMoreElementWiseData:any=[];
    let addMoreIndx:any=0;
    for (let addmoreloop of addMoreValueDetails[addMorectrlId][
      'addMoreDataValue'
    ]) {
      let optAddMoreValue = '';
      arrAddMoreElementWiseData = [];
      if (
        addmoreloop.jsonOptTxtDetails != '' &&
        addmoreloop.jsonOptTxtDetails != undefined
      ) {
        optAddMoreValue = JSON.parse(addmoreloop.jsonOptTxtDetails);
      }
      let addMoreConfKey: number = 0;
      for (let addMoreConfigloop of addMoreFormConfigData) {
        let finalrowdate: any;
        if (
          addMoreConfigloop.ctrlTypeId == 2 &&
          addMoreConfigloop.ctrlAttributeType == 'date'
        ) {
          let rowdate: any =
            addmoreloop[
              addMoreConfigloop['addmoretablecolDetails'][0][
                'ctrlTblColName'
              ]
            ];
          if (rowdate == environment.defaultDate) {
            finalrowdate = '';
          } else {
            let elmValDate: any = rowdate.split('-');
            finalrowdate =
              elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];
          }
        }
        let optVal =
          optAddMoreValue != undefined
            ? optAddMoreValue[
                addMoreConfigloop['addmoretablecolDetails'][0][
                  'ctrlTblColName'
                ]
              ]
            : '';
        let rowaddmorevalue: any;
        if (
          this.encDec.escapeHtml(
            addmoreloop[
              addMoreConfigloop['addmoretablecolDetails'][0][
                'ctrlTblColName'
              ]
            ]
          ) == environment.defaultDate
        ) {
          rowaddmorevalue = '';
        } else {
          rowaddmorevalue = this.encDec.escapeHtml(
            addmoreloop[
              addMoreConfigloop['addmoretablecolDetails'][0][
                'ctrlTblColName'
              ]
            ]
          );
        }
       
        arrAddMoreElementWiseData[addMoreConfigloop.ctrlId]= {
          ctrlTypeId: addMoreConfigloop.ctrlTypeId,
          ctrlId: addMoreConfigloop.ctrlId+addMoreIndx,
          ctrlName: addMoreConfigloop.ctrlName,
          lblName: addMoreConfigloop.ctrlLabel,
          // 'ctrlValue' : (addMoreConfigloop.ctrlTypeId!=7) ? this.encDec.escapeHtml(addmoreloop[addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']]) : '',
          ctrlValue:
            addMoreConfigloop.ctrlTypeId != 7 ? rowaddmorevalue : '',

          ctrlText: this.encDec.escapeHtml(optVal),
          uploadFile:
            addMoreConfigloop.ctrlTypeId == 7
              ? {
                  fileName:
                    addmoreloop[
                      addMoreConfigloop['addmoretablecolDetails'][0][
                        'ctrlTblColName'
                      ]
                    ],
                  fileForApproval: addMoreConfigloop.ctrlForApproval,
                  fileType: addMoreConfigloop.ctrlFileType,
                }
              : '',
          editStaus: 1,
          attrType: addMoreConfigloop.ctrlAttributeType,
          date: finalrowdate,
        };
      
     
        addMoreConfKey++;
   }
   addMoreIndx++;
   if (this.arrAddMoreColumnData[addMorectrlId] != undefined) {
    this.arrAddMoreColumnData[addMorectrlId].push(
      arrAddMoreElementWiseData
    );
  
  } else {
    this.arrAddMoreColumnData[addMorectrlId] = [
      arrAddMoreElementWiseData,
    ];
  }
  }
 
   // First store using index of add more id  in this.arrAddmoreFilledData and then push it in this.arrAddmoreFilledData
   this.arrAddmoreElemntColumnKeys[addMorectrlId] = Object.keys(arrAddMoreElementWiseData);

}
 }


 deleteAddMoreColumnWiseDetails(ctrlId:any,addMoreColumnCtr:any)
 {
    this.arrAddMoreColumnData[ctrlId].splice(addMoreColumnCtr,1);
    setTimeout(() => {
      this.calculateColumnWiseAddMore(ctrlId);
    }, 10);
 }

 saveaddMoreColumnData(ctrlId:any,indx:any)
{
  let currFocObj:any = this;
  let validatonStatus:any=true;
  let addMoreColumnDataPush:any=[];
   $('.addMoreColumn'+ctrlId).each(function(indx:any){
    let validateArray:any=[];
    let arrAddMoreElementWiseData:any=[];
    for (let addMoreColumnDetails of currFocObj.arrAddmoreDetails[ctrlId]) {
    
      let ctrlTypeId = addMoreColumnDetails.ctrlTypeId;
      let elmVal: any = '';
      let elmValText: any = '';
      let elmId = addMoreColumnDetails.ctrlId+indx;
      let elmName = addMoreColumnDetails.ctrlName;
      let lblName = addMoreColumnDetails.ctrlLabel;
      let mandatoryDetails = addMoreColumnDetails.ctrlMandatory;
      let attrType = addMoreColumnDetails.ctrlAttributeType;
      let ctrlMaxLength = addMoreColumnDetails.ctrlMaxLength;
      let ctrlMinLength = addMoreColumnDetails.ctrlMinLength;
      let elmClass = addMoreColumnDetails.ctrlClass;
      let uploadFile = ""
      let bndDataType =
        addMoreColumnDetails.addmorecascadingCtrlDetails[0].ctrlCCbindDatatype;
      let bndDataTypeDpndOther =
        addMoreColumnDetails.addmorecascadingCtrlDetails[0]
          .AMctrlCCbinddepentOther;
      let rowaddmoredate: any = '';
      if (ctrlTypeId == 1) {
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).innerText;
       } else if (ctrlTypeId == 2) {
       
        // For Textbox
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
       
        if (mandatoryDetails) {
         
          // For Mandatory
          if (
            !currFocObj.vldChkLst.blankCheck(
              elmVal,
              lblName + ' can not be left blank',elmId
            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
          // For Max length
          if (!currFocObj.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
          // For Min length
          if (!currFocObj.vldChkLst.minLength(elmVal, ctrlMinLength, lblName,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (attrType == 'email') {
          // For Valid Email
          if (!currFocObj.vldChkLst.validEmail(elmVal,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } 
        else if (attrType == 'tel') {
          // For Valid Mobile
          if (!currFocObj.vldChkLst.validMob(elmVal,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } 
        else if (attrType == 'telephoneNo') {
          // For Valid telephone No
          if (!currFocObj.vldChkLst.validTel(elmVal,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } 
        else if (attrType == 'telephone') {
          // For Valid Mobile
          if (!currFocObj.vldChkLst.validMob(elmVal,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } else if (attrType == 'password') {
          // For password Validation
          if (!currFocObj.vldChkLst.validPassword(elmVal,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } else if (attrType == 'date' && elmVal.length > 0) {
          // For Date
          rowaddmoredate = elmVal;
          let elmValDate: any = elmVal.split('-');
          elmVal = elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];
        }
     }
       else if (ctrlTypeId == 3) {
        // For DropDown
        let elm: any = <HTMLInputElement>document.getElementById(elmId);
        elmVal = elm.value;
        if (elmVal == 0 || elmVal == undefined || elmVal == '') {
          elmValText = '--';
        } else {
          elmValText = elm.options[elm.selectedIndex].text;
        }

        if (mandatoryDetails) {
          // For Mandatory
          if (!currFocObj.vldChkLst.selectDropdown(elmVal, lblName,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
      } 
      else if (ctrlTypeId == 4) {
        // For TextArea
        if (elmClass == currFocObj.ckEdtorCls) {
          elmVal = (<HTMLInputElement>(document.getElementById(elmId))).querySelector('.angular-editor-textarea')?.innerHTML;
        } else {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
        }

        if (mandatoryDetails) {
          // For Mandatory
          if (!currFocObj.vldChkLst.blankCheck(elmVal,lblName + ' can not be left blank',elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
        if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
          // For Max length
          if (!currFocObj.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
          // For Min length
          if (!currFocObj.vldChkLst.minLength(elmVal, ctrlMinLength, lblName,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
      }
  else if (ctrlTypeId == 5) {
        // For Checkbox
        if (mandatoryDetails) {
          // For Mandatory
          if (!currFocObj.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }
        let chkdVal: any = '';
        let chkdTxt: any = '';
        const checkboxes: any = document.getElementsByName(elmId);
        for (let checkbox of checkboxes) {
          if (checkbox.checked) {
            if (chkdVal.length > 0) {
              chkdVal += ',' + checkbox.value;
              let el = document.querySelector(`label[for="${checkbox.id}"]`);
              chkdTxt += ',' + el?.textContent;
            } else {
              chkdVal += checkbox.value;
              let el = document.querySelector(`label[for="${checkbox.id}"]`);
              chkdTxt += el?.textContent;
            }
          }
        }
        elmVal = chkdVal.toString();
        if (chkdVal != '') {
          elmValText = chkdTxt;
        } else {
          elmValText = '--';
        }
      } else if (ctrlTypeId == 6) {
        // For Radio Btn
        if (mandatoryDetails) {
          // For Mandatory
          if (!currFocObj.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        const radioBtnElmn = document.getElementsByName(elmId);

        for (let i = 0, length = radioBtnElmn.length; i < length; i++) {
          if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
            elmVal = (<HTMLInputElement>radioBtnElmn[i]).value;
            let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
            if (elmVal == 0 || elmVal == undefined || elmVal == '') {
              elmValText = '--';
            } else {
              let el = document.querySelector(`label[for="${rdId}"]`);
              elmValText = el?.textContent;
            }
          }
        }
      } 
      
      else if (ctrlTypeId == 7) 
       {
         uploadFile = currFocObj.arrUploadedFiles[elmId];
         
          if(mandatoryDetails) // For Mandatory
          {
          if(uploadFile =='' || uploadFile == undefined)
            {
              Swal.fire({
                icon: 'error',
                text: 'Please upload ' + lblName
              });

              validatonStatus =  false;
               break;

            }

          }

        }
      // }

      validateArray[elmId] = {
        ctrlValue: elmVal,
        ctrlTypeId: ctrlTypeId,
      };
   
      arrAddMoreElementWiseData.push({
        ctrlTypeId: ctrlTypeId,
        ctrlId: addMoreColumnDetails.ctrlId,
        ctrlName: elmName,
        lblName: lblName,
        ctrlValue: currFocObj.encDec.escapeHtml(elmVal),
        ctrlText: elmValText,
        uploadFile: uploadFile,
        editStaus: 0,
        attrType: attrType,
        date: rowaddmoredate,
      });
     
  }
  if(validatonStatus)
  {
  addMoreColumnDataPush.push(arrAddMoreElementWiseData);
  }
  else
  {
    return validatonStatus;
  }
});
if(validatonStatus)
{
this.arrAddmoreFilledData[ctrlId] = addMoreColumnDataPush;
}
return validatonStatus; 
}

setTotCalculationForTablularAddMore(addMoreId:any, formctrls:any)
{
 
    if(this.arrTabularAddMoreTotData[addMoreId]==undefined)
    { 
      
  
      for(let loopArrTabularAddMOre of this.arrAddmoreDetails[addMoreId])
        {
          if(loopArrTabularAddMOre.ctrlTypeId==2 && loopArrTabularAddMOre.totalCalcAddMore==true)
            { 
              setTimeout(() => {
              $('.'+loopArrTabularAddMOre.ctrlName).on("blur",function(){
                  let totalCalCulation:number=0;
                  $('.'+loopArrTabularAddMOre.ctrlName).each(function(){
                    let enteredAddMoreTabularValue:any =$(this).val();
                    if(enteredAddMoreTabularValue.length>0 && enteredAddMoreTabularValue!="")
                      {
                        totalCalCulation+=Number(enteredAddMoreTabularValue);
                      }
                    
                  });
                $('#tot_'+loopArrTabularAddMOre.ctrlId).val(totalCalCulation);
              });
              if(this.onlineServiceId > 0)
              {
                  $('.'+loopArrTabularAddMOre.ctrlName).blur();
              }
            }, 50);
              this.arrTabularAddMoreTotData[addMoreId] = this.arrAddmoreDetails[addMoreId];
            }
         
        }
       

  }
}
setTotCalculationForColumnAddMore(addMoreId:any,hitFuncType:any=0)
{
 if(hitFuncType==0) // when Form is loaded then it hitFunction type is 0
  {

  if(this.arrColumnAddMoreTotData[addMoreId]==undefined)
  {
    setTimeout(() => {
      for(let loopArrColumnAddMOre of this.arrAddmoreDetails[addMoreId])
      {

        if(loopArrColumnAddMOre.ctrlTypeId==2 && loopArrColumnAddMOre.totalCalcAddMore==true)
        { 
 
          $("."+loopArrColumnAddMOre.ctrlName).on("blur",function(){
         
            let totalCalCulationColumnWise:number=0;
            $('.'+loopArrColumnAddMOre.ctrlName).each(function(){
              let enteredAddMoreTabularValue:any =$(this).val();
              if(enteredAddMoreTabularValue.length>0 && enteredAddMoreTabularValue!="")
                {
                  totalCalCulationColumnWise+=Number(enteredAddMoreTabularValue);
                }
              
            });
            $('#tot_'+loopArrColumnAddMOre.ctrlName).val(totalCalCulationColumnWise);
          });
          this.arrColumnAddMoreTotData[addMoreId] = this.arrAddmoreDetails[addMoreId];
        }
      }
      this.calculateColumnWiseAddMore(addMoreId)
    }, 50);
  } 
  }
  else // when add More  is clicked else part will be excuted
  {

    for(let loopArrColumnAddMOre of this.arrAddmoreDetails[addMoreId])
    {
      if(loopArrColumnAddMOre.ctrlTypeId==2 && loopArrColumnAddMOre.totalCalcAddMore==true)
      { 
        $("."+loopArrColumnAddMOre.ctrlName).on("blur",function(){
          
          let totalCalCulationColumnWise:number=0;
          $('.'+loopArrColumnAddMOre.ctrlName).each(function(){
            let enteredAddMoreTabularValue:any =$(this).val();
            if(enteredAddMoreTabularValue.length>0 && enteredAddMoreTabularValue!="")
              {
                totalCalCulationColumnWise+=Number(enteredAddMoreTabularValue);
              }
            
          });
          $('#tot_'+loopArrColumnAddMOre.ctrlName).val(totalCalCulationColumnWise);
        });
        this.arrColumnAddMoreTotData[addMoreId] = this.arrAddmoreDetails[addMoreId];
      }
    }
  }
}
calculateColumnWiseAddMore(addMoreId:any)
  {
    for(let loopArrColumnAddMOre of this.arrAddmoreDetails[addMoreId])
    {
      if(loopArrColumnAddMOre.ctrlTypeId==2 && loopArrColumnAddMOre.totalCalcAddMore==true)
      { 
          let totalCalCulationColumnWise:number=0;
          $('.'+loopArrColumnAddMOre.ctrlName).each(function(){
            let enteredAddMoreTabularValue:any =$(this).val();
            if(enteredAddMoreTabularValue.length>0 && enteredAddMoreTabularValue!="")
              {
                totalCalCulationColumnWise+=Number(enteredAddMoreTabularValue);
              }
            
          });
          $('#tot_'+loopArrColumnAddMOre.ctrlName).val(totalCalCulationColumnWise);
      }
    }
  }
totalTabularEditForm(addMoreId:any)
  {
  for(let loopArrTabularAddMOre of this.arrAddmoreDetails[addMoreId])
  {
    if(loopArrTabularAddMOre.ctrlTypeId==2 && loopArrTabularAddMOre.totalCalcAddMore==true)
      {
            let totalCalCulation:number=0;
            $('.'+loopArrTabularAddMOre.ctrlName).each(function(){
              let enteredAddMoreTabularValue:any =$(this).val();
              if(enteredAddMoreTabularValue.length>0 && enteredAddMoreTabularValue!="")
                {
                  totalCalCulation+=Number(enteredAddMoreTabularValue);
                }
              
            });
          $('#tot_'+loopArrTabularAddMOre.ctrlId).val(totalCalCulation);
     
        this.arrTabularAddMoreTotData[addMoreId] = this.arrAddmoreDetails[addMoreId];
      }
   
  } 
}


 storeAddMoreMergeDetails(formctrls:any,addMoreId:any)
  {

    this.addMoreMergedColumns[addMoreId] = [];
      this.addMoreAllMergedColumns[addMoreId] = [];
    if(formctrls.addmoreMergeColumnDetails!=undefined && formctrls.addmoreMergeColumnDetails.length>0)
    {
      let ctr = 0;
     
      let ctrlLoopId:any=0;
      let ctrlLoopCtr:any=0;
      for(let addmoreDetails of formctrls.addmoreDetails)
      {
        this.addMoreAllMergedColumns[addMoreId].push(addmoreDetails.ctrlId);
        
        if(ctrlLoopCtr ==ctrlLoopId)
        {
          ctrlLoopId=0;
        }
        if(ctrlLoopId > 0)
          {
            this.addMoreAllMergedColumns[addMoreId].pop(addmoreDetails.ctrlId);
            ctrlLoopCtr++;
            continue;
          }
          else
          {
            ctrlLoopId =0;
            ctrlLoopCtr=0;
         
        let colspanFlag = 0;
        this.addMoreMergedColumns[addMoreId][ctr] = {"label":addmoreDetails.ctrlLabel,"colSpan":1};
        let addMoreColumns = addmoreDetails.ctrlId;
        for(let mergedCols of formctrls.addmoreMergeColumnDetails)
        {
          if(mergedCols.initalControlId == addMoreColumns)
          {
            this.addMoreAllMergedColumns[addMoreId].pop(addmoreDetails.ctrlId);
            this.addMoreMergedColumns[addMoreId][ctr] = {"label":mergedCols.mergeCtrlLabel,"colSpan":mergedCols.noOfColumnsMerged};
            colspanFlag = 1;
            ctrlLoopId=mergedCols.noOfColumnsMerged;
          }              
        }
        
        ctr++;
       }
        ctrlLoopCtr++
    }
    }
  }
  addMoreColumnData(ctrlId:any,indx:any)
  {
    let currFocObj:any = this;
    let validatonStatus:any=true;
     let arrAddMoreDynamicElements:any=[];
      let validateArray:any=[];
      let arrAddMoreElementWiseData:any=[];
      for (let addMoreColumnDetails of currFocObj.arrAddmoreDetails[ctrlId]) {
        let ctrlTypeId = addMoreColumnDetails.ctrlTypeId;
        let elmVal: any = '';
        let elmValText: any = '';
        let elmId = addMoreColumnDetails.ctrlId+indx;
        let elmName = addMoreColumnDetails.ctrlName;
        let lblName = addMoreColumnDetails.ctrlLabel;
        let mandatoryDetails = addMoreColumnDetails.ctrlMandatory;
        let attrType = addMoreColumnDetails.ctrlAttributeType;
        let ctrlMaxLength = addMoreColumnDetails.ctrlMaxLength;
        let ctrlMinLength = addMoreColumnDetails.ctrlMinLength;
        let elmClass = addMoreColumnDetails.ctrlClass;
        let uploadFile = ""
        let rowaddmoredate: any = '';
         if (ctrlTypeId == 1) {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).innerText;
        } else if (ctrlTypeId == 2) {
          // For Textbox
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
         
          if (mandatoryDetails) {
            // For Mandatory
            if (
              !currFocObj.vldChkLst.blankCheck(
                elmVal,
                lblName + ' can not be left blank',elmId
              )
            ) {
             // (<HTMLInputElement>document.getElementById(elmId)).focus();
           
              validatonStatus = false;
              break;
            }
          }
  
  
          if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
            // For Max length
            if (!currFocObj.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
  
          if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
            // For Min length
            if (!currFocObj.vldChkLst.minLength(elmVal, ctrlMinLength, lblName,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
  
          if (attrType == 'email') {
            // For Valid Email
            if (!currFocObj.vldChkLst.validEmail(elmVal,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          } else if (attrType == 'tel') {
            // For Valid Mobile
            if (!currFocObj.vldChkLst.validMob(elmVal,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }else if (attrType == 'telephoneNo') {
            // For Valid telephone no
            if (!currFocObj.vldChkLst.validTel(elmVal,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }else if (attrType == 'telephone') {
            // For Valid Mobile
            if (!currFocObj.vldChkLst.validMob(elmVal,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          } else if (attrType == 'password') {
            // For password Validation
            if (!currFocObj.vldChkLst.validPassword(elmVal,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          } else if (attrType == 'date' && elmVal.length > 0) {
            // For Date
            rowaddmoredate = elmVal;
            let elmValDate: any = elmVal.split('-');
            elmVal = elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];
          }
       }
         else if (ctrlTypeId == 3) {
          // For DropDown
          let elm: any = <HTMLInputElement>document.getElementById(elmId);
          let addMoredynbindflag:string = elm.getAttribute("data-dynbindflag");
          let addMoredynbinddependflag:string = elm.getAttribute("data-dynbinddependflag");
          if(addMoredynbindflag=="true" && addMoredynbinddependflag=="false")
            {
              arrAddMoreDynamicElements.push({'ctrlId':elmId , 'addMoreCtrlId':addMoreColumnDetails.ctrlId});
            }
          
          //data-dynbindflag
          elmVal = elm.value;
          if (elmVal == 0 || elmVal == undefined || elmVal == '') {
            elmValText = '--';
          } else {
            elmValText = elm.options[elm.selectedIndex].text;
          }
  
          if (mandatoryDetails) {
            // For Mandatory
            if (!currFocObj.vldChkLst.selectDropdown(elmVal, lblName,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
        } 
        else if (ctrlTypeId == 4) {
          // For TextArea
          if (elmClass == currFocObj.ckEdtorCls) {
            elmVal = (<HTMLInputElement>(document.getElementById(elmId))).querySelector('.angular-editor-textarea')?.innerHTML;
          } else {
            elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
          }
  
          if (mandatoryDetails) {
            // For Mandatory
            if (!currFocObj.vldChkLst.blankCheck(elmVal,lblName + ' can not be left blank',elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
          if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
            // For Max length
            if (!currFocObj.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
  
          if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
            // For Min length
            if (!currFocObj.vldChkLst.minLength(elmVal, ctrlMinLength, lblName,elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
        }
        else if (ctrlTypeId == 5) {
          // For Checkbox
          if (mandatoryDetails) {
            // For Mandatory
            if (!currFocObj.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
              validatonStatus = false;
              break;
            }
          }
          let chkdVal: any = '';
          let chkdTxt: any = '';
          const checkboxes: any = document.getElementsByName(elmId);
          for (let checkbox of checkboxes) {
            if (checkbox.checked) {
              if (chkdVal.length > 0) {
                chkdVal += ',' + checkbox.value;
                let el = document.querySelector(`label[for="${checkbox.id}"]`);
                chkdTxt += ',' + el?.textContent;
              } else {
                chkdVal += checkbox.value;
                let el = document.querySelector(`label[for="${checkbox.id}"]`);
                chkdTxt += el?.textContent;
              }
            }
          }
         
          elmVal = chkdVal.toString();
          if (chkdVal != '') {
            elmValText = chkdTxt;
          } else {
            elmValText = '--';
          }
        } else if (ctrlTypeId == 6) {
          // For Radio Btn
          if (mandatoryDetails) {
            // For Mandatory
            if (!currFocObj.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
              validatonStatus = false;
              break;
            }
          }
  
          const radioBtnElmn = document.getElementsByName(elmId);
  
          for (let i = 0, length = radioBtnElmn.length; i < length; i++) {
            if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
              elmVal = (<HTMLInputElement>radioBtnElmn[i]).value;
              let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
              if (elmVal == 0 || elmVal == undefined || elmVal == '') {
                elmValText = '--';
              } else {
                let el = document.querySelector(`label[for="${rdId}"]`);
                elmValText = el?.textContent;
              }
            }
          }
        } 
        
        else if (ctrlTypeId == 7) 
         {
           uploadFile = currFocObj.arrUploadedFiles[elmId];
          //  this.removeFile(elmId);fileDownloadDiv_
            if(mandatoryDetails) // For Mandatory
            {
            if(uploadFile =='' || uploadFile == undefined)
              {
                Swal.fire({
                  icon: 'error',
                  text: 'Please upload ' + lblName
                });
  
                validatonStatus =  false;
                 break;
  
              }
  
            }
  
          }
        // }
  
        validateArray[elmId] = {
          ctrlValue: elmVal,
          ctrlTypeId: ctrlTypeId,
        };
        arrAddMoreElementWiseData[addMoreColumnDetails.ctrlId]= {
          ctrlTypeId: ctrlTypeId,
          ctrlId: elmId,
          ctrlName: elmName,
          lblName: lblName,
          ctrlValue: currFocObj.encDec.escapeHtml(elmVal),
          ctrlText: elmValText,
          uploadFile: uploadFile,
          editStaus: 0,
          attrType: attrType,
          date: rowaddmoredate,
        }
    }
    if(validatonStatus)
    { 
        currFocObj.arrAddMoreColumnData[ctrlId].splice((indx),0,arrAddMoreElementWiseData);   
        currFocObj.arrAddMoreColumnData[ctrlId][(indx+1)]=[]; 
        setTimeout(function(){
           $('.'+ctrlId + (indx+1)).find("input:checkbox").prop("checked", false);
           $('.'+ctrlId + (indx+1)).find("input[type=text],input[type=file],TEXTAREA").val("");
           $('.'+ctrlId + (indx+1)).find("SELECT").val("0");
           $('.'+ctrlId + (indx+1)).find(".fileDownloadDiv").addClass("d-none");
          currFocObj.setTotCalculationForColumnAddMore(ctrlId,1);
        },10);
        
        if(arrAddMoreDynamicElements.length > 0)
          {
            for(let loopOfDynamicElements of arrAddMoreDynamicElements)
            {
              this.arralldynVal[loopOfDynamicElements.addMoreCtrlId+(indx+1)] = this.arralldynVal[loopOfDynamicElements.ctrlId];
             
            }
            
          }
    }
  // });  
  }
  // End of column wise add more on 31-10-23

   /**
   * Function Name: addMoreCalculation
   * Description: calculate the add more field given field value 
   * Created By: Bindurekha Nayak
   * Created Date: 11th jan 2024
   */
  addMoreCalculation(data, ctrlId, formName){
    let totalAmount = 0;
    if(this.processId == 94){
      data[ctrlId].forEach(element => {
        if(element[1].ctrlValue != ''){
          totalAmount += parseInt(element[1].ctrlValue);
        }
      });
      this.invSubTotalAssAmount = totalAmount;
      this.invSubCapitalAmount();
    }else if(this.processId == 48){
      data[ctrlId].forEach(element => {
        if(element[3].ctrlValue != '' && element[1].ctrlValue != ''){
        let amountToAdd = parseInt(element[3].ctrlValue) * element[1].ctrlValue;
        totalAmount += amountToAdd;
          // if (totalAmount + amountToAdd <= 300000) {
          //   totalAmount += amountToAdd;
          // }else{
          //     Swal.fire({
          //     title: "Exceeding Limit",
          //     text: "Total amount cannot exceed 300,000. Further additions are not allowed.",
          //     icon: "warning",
          //     confirmButtonText: "OK"
          //     });
          // }
        }
      });
      this.certificationAmount = totalAmount;
      this.certificationAmountCal();
    } else if(this.processId == 40){
      data[ctrlId].forEach(element => {
        if(element[1].ctrlValue != ''){
          totalAmount += parseInt(element[1].ctrlValue);
        }
      });
      this.otherAssetTotalAmount = totalAmount;
      this.calculateTotalCapital();

    }
  }

    /**
   * Function Name: addMoreCalculation for InterestSubsidy
   * Description: calculate the add more field given field value 
   * Created By: Manish Kumar
   * Created Date: 28-05-2024
   */

  interestSubsidyAddMoreCalculation(data, ctrlId, formName){
    let totalAmount: number = 0;
    let term_of_load_sanctioned = "";
    //let policyDataStr = 
    let commecDate : any = sessionStorage.getItem('SCHEME_POLICY_DET');
    let clsTotalInterestPayment : any = (<HTMLInputElement>document.getElementsByClassName('cls_isTotRepayment')[0]);
      data[ctrlId].forEach(element => {
        if(element[2].ctrlValue !=''){
          term_of_load_sanctioned = element[2].ctrlValue
        }
        if(element[8].ctrlValue != ''){
          if(element[2].ctrlValue !=''){
            const conDateForamt = moment(commecDate, 'YYYY-MM-DD');
            const sanDateFormat = moment(term_of_load_sanctioned, 'YYYY-MM-DD');
            if (sanDateFormat.isSameOrAfter(conDateForamt)) {
              totalAmount += parseInt(element[8].ctrlValue);
            }
          }
        } 
      });
      if(totalAmount >= 0) {
        clsTotalInterestPayment.value = totalAmount;
      }
      this.totalIntersetRePayment = totalAmount;
      this.repaymentClaimIncentiveCalculation(this.totalIntersetRePayment);
      
      
  }

  repaymentClaimIncentiveCalculation(recivedRepaymentValue: number){
      // console.log("recivedRepaymentValue1", recivedRepaymentValue);
      if (recivedRepaymentValue <= 500000000) {
        // For FCI up to Rs. 50 crores
        this.repaymentClaimAmount = recivedRepaymentValue * 0.05;
        if(this.repaymentClaimAmount > 20000000) {
          this.repaymentClaimAmount = 20000000
        }
      } else if (recivedRepaymentValue > 500000000 && recivedRepaymentValue < 10000000000) {
        // For FCI greater than Rs. 50 crores but less than Rs. 1000 crores
        this.repaymentClaimAmount = 50000000;
      } else if (recivedRepaymentValue >= 10000000000) {
        // For FCI greater than Rs. 1000 crores
        this.repaymentClaimAmount = 100000000;
      }
      this.compareRepaymentbetweenIntresetCapital();
  }

  compareRepaymentbetweenIntresetCapital() {
    //let periodOfSubsidy : any = (<HTMLInputElement>document.getElementsByClassName('cls_epfSubsidyPeriod')[0]);
    let interestClaimAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTotal')[0]);
    let fincalConcinementValue : number = 0;

    if(this.repaymentClaimAmount > this.totalInterstClaimAmount) {
      fincalConcinementValue = this.totalInterstClaimAmount;
    }
    if(this.repaymentClaimAmount < this.totalInterstClaimAmount){
      fincalConcinementValue = this.repaymentClaimAmount;
    }

    if(this.repaymentClaimAmount == this.totalInterstClaimAmount) {
       fincalConcinementValue = this.repaymentClaimAmount;
    }
    // console.log("fincalConcinementValue",fincalConcinementValue);
    this.finalRepayementClaimAmount = fincalConcinementValue;
   // let periodInterestSubsidy: number = parseInt(periodOfSubsidy.value);
    let totalSubsidyValue = this.finalRepayementClaimAmount * this.periodOfSubsidy;
    if(this.periodOfSubsidy > 0){
      this.finalRepayementClaimAmount = totalSubsidyValue;
    }
    if(this.finalRepayementClaimAmount > 0) {
      interestClaimAmount.value = this.finalRepayementClaimAmount.toFixed(2);
    }
    else {
      interestClaimAmount.value = 0;
    }
    
  }

  /**
   * Function Name: skillGapAddMoreCalculation
   * Description: It calculate the add more field given field value
   * Created By: Bindurekha Nayak
   * Created Date: 08th may 2024
   */
  skillGapAddMoreCalculation(data, ctrlId, formName) {
    let totalAmount = 0;
    let totalCourseFeePerValueMale = 0;
      data[ctrlId].forEach(element => {
        if (element[4].ctrlValue != '' && element[3].ctrlValue != '' && element[2].ctrlValue != '' && element[1].ctrlValue != '') {
            if (element[1].ctrlValue == 1) {
                totalCourseFeePerValueMale = element[4].ctrlValue <= 20000 ? element[4].ctrlValue : 20000;
            } else if (element[1].ctrlValue == 2) {
                totalCourseFeePerValueMale = element[4].ctrlValue <= 10000 ? element[4].ctrlValue : 10000;
            }
             totalAmount += ((element[2].ctrlValue) * totalCourseFeePerValueMale) + ((element[3].ctrlValue) * element[4].ctrlValue);
        }
      });
      this.totalSkillGapAmount = totalAmount;
      this.skillGapAddMoreCalculationDet();
    
  }
  skillGapAddMoreCalculationDet(){
    let totalAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_totalAmount')[0]);
    totalAmountElement.value =parseFloat(this.totalSkillGapAmount);
    let event = new Event("input");
    totalAmountElement.dispatchEvent(event);
  }
  
  /**
   * Function Name: calculateTotalCapital
   * Description: It calculate the total capital amount for "Interest Subsidy Form" 
   * Created By: Bindurekha Nayak
   * Created Date: 01 Nov 2023
   */
  calculateTotalCapital(){
    let totalAmount: any = parseFloat(this.otherAssetTotalAmount);
    let sumTotal = this.totalIntersetInvestment + parseFloat(totalAmount);
    let totalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_iSTotalInv')[0]);
    totalCapitalElement.value = sumTotal;
    this.interestSubsidyCalculation(totalCapitalElement.value);
  }

  // calculateTotalRepaymentInterestSubsidy(amount, sanDate)
  // {
  //     // this.totalIntersetRePayment = 
  //     console.log('returnAmount',amount);
  //     let clsTotalInterestPayment : any = (<HTMLInputElement>document.getElementsByClassName('cls_isTotRepayment')[0]);
  //     let totalPayment : number = 0;
  //     let commecDate : any = '2021-12-04';
  //     const conDateForamt = moment(commecDate, 'YYYY-MM-DD');
  //     const sanDateFormat = moment(sanDate, 'YYYY-MM-DD');
  //     if (sanDateFormat.isSameOrAfter(conDateForamt)) {
  //       totalPayment  = this.totalIntersetRePayment + parseFloat(amount);
  //       clsTotalInterestPayment.value = totalPayment;
  //     }
  //     else {
  //       totalPayment  = this.totalIntersetRePayment + parseFloat(amount);
  //       clsTotalInterestPayment.value = totalPayment;
  //     }         
  // } 

   /**
   * Function Name: calculationInterestSubsidy
   * Description: It calculate the total claim amount for "Interest Subsidy Form" 
   * Created By: Manish Kumar
   * Created Date: 14 May 2024
   */
  interestSubsidyCalculation(receivedValue) {
    //console.log("mainReceivedValue",receivedValue);
    if (receivedValue <= 500000000) {
      // For FCI up to Rs. 50 crores
      this.totalInterstClaimAmount = receivedValue * 0.05;
      if(this.totalInterstClaimAmount > 20000000) {
        this.totalInterstClaimAmount = 20000000
      }
    } else if (receivedValue > 500000000 && receivedValue < 10000000000) {
      // For FCI greater than Rs. 50 crores but less than Rs. 1000 crores
      this.totalInterstClaimAmount = 50000000;
    } else if (receivedValue >= 10000000000) {
      // For FCI greater than Rs. 1000 crores
      this.totalInterstClaimAmount = 100000000;
    }
    this.compareRepaymentbetweenIntresetCapital();
    //claimInputElement.value = this.totalInterstClaimAmount.toFixed(2);
  }
  
  /**
   * Function Name: certificationAmountCal
   */
  certificationAmountCal(){
    let totalAmount = parseFloat(this.certificationAmount);
    let invtotalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_skTotalValue')[0]);
    invtotalCapitalElement.value = totalAmount;
    let event = new Event("input");
    invtotalCapitalElement.dispatchEvent(event);
   }
  /**
   * Function Name: invSubCapitalAmount
   */
  invSubCapitalAmount(){
    let totalAmount = parseFloat(this.iseCapitalExpAmount) + parseFloat(this.ivsSubBuildingAmount) + parseFloat(this.ivsSubPlantAmount) + parseFloat(this.ivsSubRefAmount) + parseFloat(this.ivsSubRndAmount) + parseFloat(this.ivsSubUtilityAmount) + parseFloat(this.ivsSubTransAmount) + parseFloat(this.invSubTotalAssAmount);
    let invSubtotalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_iseTotalAmount')[0]);
    invSubtotalCapitalElement.value = totalAmount;
    let event = new Event("input");
    invSubtotalCapitalElement.dispatchEvent(event);
  }

  /**
   * Function Name: getPrevClaimDetails
   * Description: This method is used to set Previous Claim details fields
   * Created By: Bindurekha Nayak
   * Created On: 06th Nov 2023
   * @param intId
   */
  getPrevClaimDetails(intId: any) {
    let index = this.previousClaimedSubsidy.findIndex(x => x.intId === intId);
     if(this.processId == 48){
      $('.cls_skisPrevClaimAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_skisPrevClaimAmount');
      $('.cls_skFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_skToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 97){
      $('.cls_isrPrevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_isrPrevAmount');
      $('.cls_isrPrevFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_isrPrevToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 98){
      $('.cls_sgstAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_sgstAmount');
      $('.cls_sgstFrom').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_sgstTo').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 99){
      $('.cls_prevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_prevAmount');
      $('.cls_miaDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 102){
      $('.cls_claim_amount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_claim_amount');
      $('.cls_patent_claim_date').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 100){
      $('.cls_rndPrevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_rndPrevAmount');
      $('.cls_rdFrom').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_rdTo').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 43){
      $('.cls_prev_amount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_prev_amount');
      $('.cls_prev_from_date').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_prev_to_date').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 117){
      $('.cls_prevAmount ').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_prevAmount');
      $('.cls_validate_future_date').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 39){
      $('.cls_qscfrAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_qscfrAmount');
      $('.cls_qscfrDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 45){
      $('.cls_prevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_prevAmount');
      $('.cls_prevDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 35){
      $('.cls_epfEsiAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_epfEsiAmount');
      $('.cls_epfEsiFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_epfEsiToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 62){
      $('.cls_rdAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_rdAmount');
      $('.cls_rdFrom').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_rdTo').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 64){
      $('.cls_rfinAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_rfinAmount');
      $('.cls_rfinFrom').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_rfinTo').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 47){
      $('.cls_sgtaPrevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_sgtaPrevAmount');
      $('.cls_sgtaPrevFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_sgtaPrevToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 40){
      $('.cls_isPreviousClaimAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_isPreviousClaimAmount');
      $('.cls_prev_claim_from').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_prev_claim_to').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 44){
      $('.cls_preAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_preAmount');
      $('.cls_esdmFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_esdmToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }
    this.modalService.dismissAll();
  }

  ptsDateValidation(ptsFromDate, ptsToDate, ptsIncentiveClaimed){
    let startDate = ptsFromDate.value;
    let endDate = ptsToDate.value;
    let fromDate = new Date(startDate);
    let toDate = new Date(endDate);
    let difference = toDate.getTime() - fromDate.getTime();
    let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
    let diffYear = diffMon / 12;
    if(toDate < fromDate){
      ptsToDate.value = '';
      Swal.fire({
        icon: 'error',
        text: 'To date can not be less than From date'
      });
    }else if(diffYear > 5){
      ptsToDate.value = '';
      Swal.fire({
        icon: 'error',
        text: 'Can not claim more than 5 Years!'
      });
    }else{
      let param = {
        "fromDate": startDate,
        "toDate": endDate,
        "intId": sessionStorage.getItem('REGD_ID'),
        "yearLimit": 5,
        "onlineProcessId": this.processId,
        "profileId": this.userId
      } 
      this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
        this.loading = false;
        if(res.status == 200){
          if(res.isApplicable==0){
            ptsToDate.value = '';
            ptsFromDate.value='';
            Swal.fire({
              icon: 'error',
              text: 'You have already applied untill the selected date.Please try with another latest date.'
            });
          }else if(res.isApplicable==1){
          let yearLimitDet = res.result;
          let appliedYear = parseFloat(yearLimitDet)/12;
          let claimPeriod =5;
          let ClaimablePeriod = claimPeriod - appliedYear;
          if(diffYear > ClaimablePeriod){
              Swal.fire({
                icon: 'error',
                text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
              });
              ptsToDate.value = '';
            }else{
              this.ptsPrevClaimedAmount = res.amount;
            }
          }
          }
      });
  }

  }

  
  setTowerDetails(intId: any) {
    let index = this.towerDeatilsList.findIndex(x => x.intId === intId);
    let towerLocation = this.towerDeatilsList[index].vch_operation + ', ' + this.towerDeatilsList[index].vch_od_ofc_location;
    $('.cls_tower_list').val(towerLocation);
    this.keyUpEvent('cls_tower_list');
    this.modalService.dismissAll();
  }
  //modified for edit time overlap :by sibananda
  fillUpMdInfo(mdName:any, mdDesg:any){
    let mdNameEle: any = (<HTMLInputElement>document.getElementsByClassName(mdName)[0]);
    let mdDesgEle: any = (<HTMLInputElement>document.getElementsByClassName(mdDesg)[0]);
    mdDesgEle.value = 'Managing Director';
    if(mdNameEle.value == '' || mdNameEle.value == undefined || mdNameEle.value == null || mdNameEle.value == 'NULL') {
        mdNameEle.value = this.vchMdName
        setTimeout(()=>{
          if(mdDesgEle.value != 'Managing Director'){
            mdDesgEle.value = 3;
          }
        }, 1000);
    }
  }

  fillUpPrevDetails(eleClass:any){
    let ClaimEvent: any = (<HTMLInputElement>document.getElementsByClassName(eleClass)[0]);
    let button = document.createElement('button');
    button.textContent = 'Select Previous Claimed Details';
    button.classList.add('btn','btn-outline-primary','custom-dynamic-button');
    let h6Element = ClaimEvent?.closest('.h6');
    if( h6Element == null){
    let parentElement = ClaimEvent.closest('div[id^="ctrl_"]');
    let headingBtnDiv = parentElement.querySelector('.heading-btn');
    h6Element = headingBtnDiv?.querySelector('.h6');
    }
    if (h6Element) {
      console.log(h6Element);
        h6Element.insertAdjacentElement('afterend', button);
    }
    button.addEventListener('click', () => {
      this.selectPreviousClaimedDetails();
    });
  }
  /*
  * Function: AddMore Total
  * Description: To Calculate addmore total value
  * Created By: Sibananda Sahu
  * Date: 27 Dec 2023
  */
  addMoreTotal(event: any) {
		var odDomicileGenCls = document.getElementsByClassName('od_domicile_general');
		var odDomicileScCls = document.getElementsByClassName('od_domicile_sc');
		var odDomicileStCls = document.getElementsByClassName('od_domicile_st');
		var odDomicileDisabledCls = document.getElementsByClassName('od_domicile_disabled');
		var odDomicileGenClsF = document.getElementsByClassName('od_domicile_general_f');
		var odDomicileScClsF = document.getElementsByClassName('od_domicile_sc_f');
		var odDomicileStClsF = document.getElementsByClassName('od_domicile_st_f');
		var odDomicileDisabledClsF = document.getElementsByClassName('od_domicile_disabled_f');
		var odDomicileTotalCls = document.getElementsByClassName('od_domicile_total_emp');
		for (let i = 0; i < odDomicileGenCls.length; i++) {
			let odDomicileGenId = odDomicileGenCls[i]?.id;
			let odDomicileScId = odDomicileScCls[i]?.id;
			let odDomicileStId = odDomicileStCls[i]?.id;
			let odDomicileDisabledId = odDomicileDisabledCls[i]?.id;
			let odDomicileGenIdF = odDomicileGenClsF[i]?.id;
			let odDomicileScIdF = odDomicileScClsF[i]?.id;
			let odDomicileStIdF = odDomicileStClsF[i]?.id;
			let odDomicileDisabledIdF = odDomicileDisabledClsF[i]?.id;
			let odDomicileTotalId = odDomicileTotalCls[i]?.id;



			const odDomicileGenValue = (<HTMLInputElement>document.getElementById(odDomicileGenId)).value ? (<HTMLInputElement>document.getElementById(odDomicileGenId)).value : '0';
			const odDomicileScValue = (<HTMLInputElement>document.getElementById(odDomicileScId)).value ? (<HTMLInputElement>document.getElementById(odDomicileScId)).value : '0';
			const odDomicileStValue = (<HTMLInputElement>document.getElementById(odDomicileStId)).value ? (<HTMLInputElement>document.getElementById(odDomicileStId)).value : '0';
			const odDomicileDisabledValue = (<HTMLInputElement>document.getElementById(odDomicileDisabledId)).value ? (<HTMLInputElement>document.getElementById(odDomicileDisabledId)).value : '0';

			const odDomicileGenValueF = (<HTMLInputElement>document.getElementById(odDomicileGenIdF)).value ? (<HTMLInputElement>document.getElementById(odDomicileGenIdF)).value : '0';
			const odDomicileScValueF = (<HTMLInputElement>document.getElementById(odDomicileScIdF)).value ? (<HTMLInputElement>document.getElementById(odDomicileScIdF)).value : '0';
			const odDomicileStValueF = (<HTMLInputElement>document.getElementById(odDomicileStIdF)).value ? (<HTMLInputElement>document.getElementById(odDomicileStIdF)).value : '0';
			const odDomicileDisabledValueF = (<HTMLInputElement>document.getElementById(odDomicileDisabledIdF)).value ? (<HTMLInputElement>document.getElementById(odDomicileDisabledIdF)).value : '0';

			if(odDomicileGenValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileGenId)).value = "0";
			if(odDomicileScValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileScId)).value = "0";
			if(odDomicileStValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileStId)).value = "0";
			if(odDomicileDisabledValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileDisabledId)).value = "0";
			if(odDomicileGenValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileGenIdF)).value = "0";
			if(odDomicileScValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileScIdF)).value = "0";
			if(odDomicileStValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileStIdF)).value = "0";
			if(odDomicileDisabledValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileDisabledIdF)).value = "0";

			const totalAmount = (parseInt(odDomicileGenValue) + parseInt(odDomicileScValue) + parseInt(odDomicileStValue) + parseInt(odDomicileDisabledValue) + parseInt(odDomicileGenValueF) + parseInt(odDomicileScValueF) + parseInt(odDomicileStValueF) + parseInt(odDomicileDisabledValueF)).toString();
			if (totalAmount >= "0") {
				(<HTMLInputElement>document.getElementById(odDomicileTotalId)).value = totalAmount;
				document.getElementById(odDomicileTotalId).setAttribute("disabled", "disabled");
			} else {
				(<HTMLInputElement>document.getElementById(odDomicileTotalId)).value = "0";
				document.getElementById(odDomicileTotalId).setAttribute("disabled", "disabled");
			}
		}

	}
   /*
  * Function: AddMore Total
  * Description: To Calculate addmore total value
  * Created By: Bindurekha Nayak
  * Date: 10-06-2024
  */
  addMoreTotal2(event: any) {
		var odDomicileGenClsNow = document.getElementsByClassName('od_now_domicile_general');
    var odDomicileScClsNow = document.getElementsByClassName('od_now_domicile_sc');
		var odDomicileStClsNow = document.getElementsByClassName('od_now_domicile_st');
		var odDomicileDisabledClsNow = document.getElementsByClassName('od_now_domicile_disabled');
		var odDomicileGenClsFNow = document.getElementsByClassName('od_now_domicile_general_f');
		var odDomicileScClsFNow = document.getElementsByClassName('od_now_domicile_sc_f');
		var odDomicileStClsFNow = document.getElementsByClassName('od_now_domicile_st_f');
		var odDomicileDisabledClsFNow = document.getElementsByClassName('od_now_domicile_disabled_f');
		var odDomicileTotalClsNow = document.getElementsByClassName('od_now_domicile_total_emp');
		for (let i = 0; i < odDomicileGenClsNow.length; i++) {
			let odDomicileGenIdNow = odDomicileGenClsNow[i]?.id;
			let odDomicileScIdNow = odDomicileScClsNow[i]?.id;
			let odDomicileStIdNow = odDomicileStClsNow[i]?.id;
			let odDomicileDisabledIdNow = odDomicileDisabledClsNow[i]?.id;
			let odDomicileGenIdFNow = odDomicileGenClsFNow[i]?.id;
			let odDomicileScIdFNow = odDomicileScClsFNow[i]?.id;
			let odDomicileStIdFNow = odDomicileStClsFNow[i]?.id;
			let odDomicileDisabledIdFNow = odDomicileDisabledClsFNow[i]?.id;
			let odDomicileTotalIdNow = odDomicileTotalClsNow[i]?.id;



			const odDomicileGenValueNow = (<HTMLInputElement>document.getElementById(odDomicileGenIdNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileGenIdNow)).value : '0';
			const odDomicileScValueNow = (<HTMLInputElement>document.getElementById(odDomicileScIdNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileScIdNow)).value : '0';
			const odDomicileStValueNow = (<HTMLInputElement>document.getElementById(odDomicileStIdNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileStIdNow)).value : '0';
			const odDomicileDisabledValueNow = (<HTMLInputElement>document.getElementById(odDomicileDisabledIdNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileDisabledIdNow)).value : '0';

			const odDomicileGenValueFNow = (<HTMLInputElement>document.getElementById(odDomicileGenIdFNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileGenIdFNow)).value : '0';
			const odDomicileScValueFNow = (<HTMLInputElement>document.getElementById(odDomicileScIdFNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileScIdFNow)).value : '0';
			const odDomicileStValueFNow = (<HTMLInputElement>document.getElementById(odDomicileStIdFNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileStIdFNow)).value : '0';
			const odDomicileDisabledValueFNow = (<HTMLInputElement>document.getElementById(odDomicileDisabledIdFNow)).value ? (<HTMLInputElement>document.getElementById(odDomicileDisabledIdFNow)).value : '0';

			if(odDomicileGenValueNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileGenIdNow)).value = "0";
			if(odDomicileScValueNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileScIdNow)).value = "0";
			if(odDomicileStValueNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileStIdNow)).value = "0";
			if(odDomicileDisabledValueNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileDisabledIdNow)).value = "0";
			if(odDomicileGenValueFNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileGenIdFNow)).value = "0";
			if(odDomicileScValueFNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileScIdFNow)).value = "0";
			if(odDomicileStValueFNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileStIdFNow)).value = "0";
			if(odDomicileDisabledValueFNow <= "0") (<HTMLInputElement>document.getElementById(odDomicileDisabledIdFNow)).value = "0";

			const totalAmountNow = (parseInt(odDomicileGenValueNow) + parseInt(odDomicileScValueNow) + parseInt(odDomicileStValueNow) + parseInt(odDomicileDisabledValueNow) + parseInt(odDomicileGenValueFNow) + parseInt(odDomicileScValueFNow) + parseInt(odDomicileStValueFNow) + parseInt(odDomicileDisabledValueFNow)).toString();
      if (totalAmountNow >= "0") {
				(<HTMLInputElement>document.getElementById(odDomicileTotalIdNow)).value = totalAmountNow;
				document.getElementById(odDomicileTotalIdNow).setAttribute("disabled", "disabled");
			} else {
				(<HTMLInputElement>document.getElementById(odDomicileTotalIdNow)).value = "0";
				document.getElementById(odDomicileTotalIdNow).setAttribute("disabled", "disabled");
			}
		}

	}


  /**
   * Function: validateDate
   * Description: It will allow date picker to show min and max date based on condition
   * Date:9th feb 2024
   * Created By: Bibhuti Bhusan Sahoo
   * Modified By:Bindurekha Nayak
   * Modified Date : 08-03-2024
   */
  validateDate(){
    let futureDateField: any = document.getElementsByClassName('cls_validate_future_date');
    let commencementDateField: any = document.getElementsByClassName('cls_check_commencement_date');
    let commencementEndDateField: any = document.getElementsByClassName('cls_check_commencement_end_date');
    let commencementBothDate: any = document.getElementsByClassName('cls_check_commencement_both_date');
    let today: string = new Date().toISOString().split('T')[0];
    
    if(futureDateField){
      for (let i = 0; i < futureDateField.length; i++) {
        let dateField = futureDateField[i] as HTMLInputElement;
        let dateFieldId = dateField.getAttribute('id');

        if (dateFieldId) {
          dateField.setAttribute('max', today);
        }
      }
    }
    let policyDataStr = sessionStorage.getItem('SCHEME_POLICY_DET');
    if (policyDataStr) {
        let policyData = JSON.parse(policyDataStr);
        if(commencementDateField){
          let commecStartDate: string = new Date(policyData.COMM_START_DATE).toISOString().split('T')[0];
          for (let i = 0; i < commencementDateField.length; i++) {
            let dateField = commencementDateField[i] as HTMLInputElement;
            let dateFieldId = dateField.getAttribute('id');
    
            if (dateFieldId) {
              dateField.setAttribute('min', commecStartDate);
            }
          }
        }
        if(commencementEndDateField){
          let commecEndDate: string = new Date(policyData.COMM_END_DATE).toISOString().split('T')[0];
          for (let i = 0; i < commencementEndDateField.length; i++) {
            let dateField = commencementEndDateField[i] as HTMLInputElement;
            let dateFieldId = dateField.getAttribute('id');
    
            if (dateFieldId) {
              dateField.setAttribute('max', commecEndDate);
            }
          }
        }

        if (commencementBothDate) {
          let commecStartDate: string = new Date(policyData.COMM_START_DATE).toISOString().split('T')[0];
          let commecEndDate: string = new Date(policyData.COMM_END_DATE).toISOString().split('T')[0];
          let currentDate: string = new Date().toISOString().split('T')[0];
          let maxDate = (commecEndDate < currentDate) ? commecEndDate : currentDate;
      
          for (let i = 0; i < commencementBothDate.length; i++) {
              let dateField = commencementBothDate[i] as HTMLInputElement;
              let dateFieldId = dateField.getAttribute('id');
      
              if (dateFieldId) {
                  dateField.setAttribute('min', commecStartDate);
                  dateField.setAttribute('max', maxDate);
              }
          }
      }
        
    } 
    
  }

  /*
  * Function: fromToDateValidation
  * Description: To Validate fromDate is lower then to date
  * Created By: Sibananda Sahu
  * Date: 16 jan 2024
  */
  fromToDateValidation() {
    const fromDateInputs = document.getElementsByClassName('cls_fromDate');
    const toDateInputs = document.getElementsByClassName('cls_toDate');
    

    for (let i = 0; i < fromDateInputs.length; i++) {
      const fromDate = <HTMLInputElement>fromDateInputs[i];
      const toDate = <HTMLInputElement>toDateInputs[i];

      toDate.addEventListener('change', () => {
        if (fromDate.value) {
          if (fromDate.value > toDate.value) {
            toDate.value = '';
            Swal.fire({
              icon: 'error',
              text: "The end date cannot be earlier than the start date"
            });
          }
        }
      });

      fromDate.addEventListener('change', () => {
        if (toDate.value) {
          if (fromDate.value > toDate.value) {
            fromDate.value = '';
            Swal.fire({
              icon: 'error',
              text: "The start date cannot be less than the end date"
            });
          }
        }
      });
    }
  }
  /*
  * Function: fromAlphaNumericValidation
  * Description: To Validate alphanumeric
  * Created By: Bindurekha Nayak
  * Date: 18-03-2024
  */
  fromAlphaNumericValidation() {
    const alphaNumericElements = document.getElementsByClassName('cls_alphaNumeric');
    
    // Iterate over each element with the specified class
    for (let i = 0; i < alphaNumericElements.length; i++) {
        const element = alphaNumericElements[i] as HTMLInputElement; // Cast the element to HTMLInputElement
        
        // Add event listener to each element
        element.addEventListener('input', () => {
            let value = element.value;
  
            // Define regex to allow only letters, numbers, and whitespace
            const regex = /^[a-zA-Z0-9\s]*$/;
  
            // Check if the value matches the regex pattern
            if (!regex.test(value)) {
                // If it doesn't match, remove special characters
                element.value = value.replace(/[^a-zA-Z0-9\s]/g, '');
            }
        });
    }
}

getFounderPercentageValue() {
  let ivsSubTotal: any = document.getElementsByClassName('cls_iseTotalAmount')[0];
  let ivsClaimedElement: any = document.getElementsByClassName('cls_claim_amount')[0];
  let param = {
    "intId": sessionStorage.getItem('REGD_ID')
  }
  this.IrmsDetailsService.getFounderPercentageValue(param).subscribe(res => {
    if(res.status == 1){
      this.founderPercentValue = res.result;

      if(this.founderPercentValue.int_gender==2 || this.founderPercentValue.int_category==2 || this.founderPercentValue.int_category==3 || this.founderPercentValue.int_handicapped==1){
        if(ivsSubTotal.value <= 500000000){
          ivsClaimedElement.value = ((20/100) * ivsSubTotal.value)+10000000;
          if(ivsClaimedElement.value > 110000000){
            Swal.fire({
              icon: 'error',
              text: 'Total Eligible Investment claimed amount can not be more that 110000000/-'
            });
            ivsClaimedElement.value = 0;
          }
        }else if(ivsSubTotal.value>=510000000 && ivsSubTotal.value <= 10000000000){
          ivsClaimedElement.value = (((10/100) * ivsSubTotal.value)+100000000)+10000000;
          if(ivsClaimedElement.value <  101000000 || ivsClaimedElement.value > 1060000000){
            Swal.fire({
              icon: 'error',
              text: 'Total Eligible Investment claimed amount can not be more that 1060000000/-'
            });
            ivsClaimedElement.value = 0;
          }
        }else if(ivsSubTotal.value >=10010000000){
          ivsClaimedElement.value = (((10/100) * ivsSubTotal.value)+1050000000)+10000000;
          if(ivsClaimedElement.value < 1051000000 || ivsClaimedElement.value > 2510000000){
            Swal.fire({
              icon: 'error',
              text: 'Total Eligible Investment claimed amount can not be more that 2510000000/-'
            });
            ivsClaimedElement.value = 0;
          }
        }
      }else{
        if(ivsSubTotal.value <= 500000000){
          ivsClaimedElement.value = (20/100) * ivsSubTotal.value;
          if(ivsClaimedElement.value > 100000000){
            Swal.fire({
              icon: 'error',
              text: 'Total Eligible Investment claimed amount can not be more that 100000000/-'
            });
            ivsClaimedElement.value = 0;
          }
        }else if(ivsSubTotal.value>=510000000 && ivsSubTotal.value <= 10000000000){
          ivsClaimedElement.value = ((10/100) * ivsSubTotal.value)+100000000;
          if(ivsClaimedElement.value <  101000000 || ivsClaimedElement.value > 1050000000){
            Swal.fire({
              icon: 'error',
              text: 'Total Eligible Investment claimed amount can not be more that 1050000000/-'
            });
            ivsClaimedElement.value = 0;
          }
        }else if(ivsSubTotal.value >=10010000000){
          ivsClaimedElement.value = ((10/100) * ivsSubTotal.value)+1050000000;
          if(ivsClaimedElement.value < 1051000000 || ivsClaimedElement.value > 2500000000){
            Swal.fire({
              icon: 'error',
              text: 'Total Eligible Investment claimed amount can not be more that 2500000000/-'
            });
            ivsClaimedElement.value = 0;
          }
        }
      }
      
    }
  });
  
}





  /**
   * Function: eligibilityDateCheck
   * Description: It will compare the from date and to date and return if toDate > fromDate
   * Created on: 9th feb 2024
   * Created by: Bibhuti Bhusan Sahoo
   * @param fromDateClass 
   * @param toDateClass 
   */

  eligibilityDateCheck(fromDateClass, toDateClass){
    let fromDateEle: any = (<HTMLInputElement>document.getElementsByClassName(fromDateClass)[0]);
    let toDateEle: any = (<HTMLInputElement>document.getElementsByClassName(toDateClass)[0]);
    if(fromDateEle.value == '' || toDateEle.value == ''){
      return 0;
    }else{
      const fromDate = new Date(fromDateEle.value);
      const toDate = new Date(toDateEle.value);
      if(toDate < fromDate){
        return 0;
      }else{
        return 1;
      }
    } 
  }
/*
   * Function: loadAccCustomValidation
   * Description: To Validate custom validation cinNo
   * Created By: Bindurekha Nayak
   * Date: 30-04-2024
   */
loadAccCustomValidation() {
  let accNoEle: HTMLInputElement = <HTMLInputElement>(
    document.getElementsByClassName('cls_cinNo')[0]
  );
  
  if (accNoEle) {
    accNoEle.addEventListener('blur', () => {
      let accNoVal: string = accNoEle.value;
      if (!this.isValidCIN(accNoVal)) {
        accNoEle.value = '';
        Swal.fire({
          icon: 'error',
          text: 'Please enter a correct Corporate Identification Number',
        });
      }
    });
  }
}
/*
   * Function: isValidCIN
   * Description: To Validate custom validation cinNo
   * Created By: Bindurekha Nayak
   * Date: 30-04-2024
   */
isValidCIN(cin: string): boolean {
  // CIN must be exactly 21 characters
  if (cin.length !== 21) return false;

  // First character must be 'L' or 'U'
  const firstChar = cin[0];
  if (firstChar !== 'L' && firstChar !== 'U') return false;

  // Next five characters must be digits (Industry code)
  const industryCode = cin.slice(1, 6);
  if (!/^\d{5}$/.test(industryCode)) return false;

  // Next two characters must be valid state code (e.g., MH for Maharashtra)
  const stateCode = cin.slice(6, 8);
  // Add a list of valid state codes as per your requirement
  const validStateCodes = [
    'AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 'KA', 'KL', 
    'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB', 'RJ', 'SK', 'TN', 'TS', 
    'TR', 'UP', 'UK', 'WB', 'AN', 'CH', 'DN', 'DD', 'DL', 'LD', 'PY', 'OR'
  ];
  if (!validStateCodes.includes(stateCode)) return false;

  // Next four characters must be digits (Year of incorporation)
  const year = cin.slice(8, 12);
  if (!/^\d{4}$/.test(year)) return false;

  // Next three characters must be either 'PLC' or 'PTC'
  const companyType = cin.slice(12, 15);
  if (companyType !== 'PLC' && companyType !== 'PTC') return false;

  // Last six characters must be digits (Unique identifier)
  const uniqueIdentifier = cin.slice(15);
  if (!/^\d{6}$/.test(uniqueIdentifier)) return false;

  // If all checks pass, the CIN is valid
  return true;
}

/*
* Function: getFinancialYearWithQuarters
* Description: To Validate custom validation financial year and quater
* Created By: Bindurekha Nayak
* Date: 10-06-2024
*/
getFinancialYearWithQuarters(startDate: Date, endDate: Date): FinancialYear[] {
  const financialYearsWithQuarters = [];
  const startYear = startDate.getMonth() < 3 ? startDate.getFullYear() - 1 : startDate.getFullYear();
  const endYear = endDate.getMonth() < 3 ? endDate.getFullYear() - 1 : endDate.getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    const financialYear = [`${year}-${(year + 1).toString().slice(-2)}`];
    const quarters = [
      { quarter: '1', start: new Date(year, 3, 1), end: new Date(year, 5, 30) },
      { quarter: '2', start: new Date(year, 6, 1), end: new Date(year, 8, 30) },
      { quarter: '3', start: new Date(year, 9, 1), end: new Date(year, 11, 31) },
      { quarter: '4', start: new Date(year + 1, 0, 1), end: new Date(year + 1, 2, 31) }
    ];

    const relevantQuarters = quarters.filter(quarter => {
      return (quarter.start >= startDate && quarter.start <= endDate) ||
             (quarter.end >= startDate && quarter.end <= endDate) ||
             (quarter.start <= startDate && quarter.end >= endDate);
    }).map(quarter => quarter.quarter);

    if (relevantQuarters.length > 0) {
      financialYearsWithQuarters.push({ year: financialYear, quarters: relevantQuarters });
    }
  }
    
  return financialYearsWithQuarters; 
}
 //To enable Add to List button upon user input || By-Siba
EnableAddMoreButton(event,addMoreCtrlId:any,ctrlId:any){
  let addMoreButton = document.getElementById('addMoreBtn_' + addMoreCtrlId);
  addMoreButton?.removeAttribute('disabled');
  addMoreButton?.classList.add('blink');
}
//End of enabling Add to List button


keyUpEvent(className:any){
  document.getElementsByClassName(className)[0].dispatchEvent(new Event('keyup'));
}
/**
   * Function: eligibilityEndDateCheck
   * Description: It will compare the  to date and return if toDate
   * Created on: 02 july 2024
   * Created by: Bindurekha Nayak
   * @param toDateClass 
   */
  eligibilityEndDateCheck(toDateClass) {
    let toDateEle: any = (<HTMLInputElement>document.getElementsByClassName(toDateClass)[0]);
    if (toDateEle.value === '') {
        return 0;
    } else {
        const toDate = new Date(toDateEle.value);
        let policyDateDetails = sessionStorage.getItem('SCHEME_POLICY_DET');
        let policyData = JSON.parse(policyDateDetails);
        let commecEndDate: string = new Date(policyData.COMM_END_DATE).toISOString().split('T')[0];
        const endDate = new Date(commecEndDate);
        //const endDate = new Date('2014-06-26');
       if (toDate < endDate) {
            return 0;
        } else {
            return 1;
        }
    }
  }
  
  /**
  * Function Name: customValidations
  * Description: This method is used to set different validations based on product
  * Created By: Sibananda sahu
  * Added By: Manish Kumar (29-07-2024)
  * Created On: 10th July 2024
  */
customValidations(addMorectrlId){
  let addMoreElement  = document.getElementById(addMorectrlId);
  console.log(this.intProductId,'--',addMoreElement.classList);
  const validationCondition = {
    44: ['cls_other_assets','cls_parrent_previous_claim'],
    45: ['cls_other_fixed_assets'],
    46: ['cls_parrent_previous_claim'],
    47: ['cls_parrent_previous_claim'],
    48: ['cls_parrent_previous_claim'],
    50: ['cls_parrent_previous_claim'],
    51: ['cls_parrent_previous_claim'],
    52: ['cls_parrent_previous_claim'],
    54: ['cls_parrent_previous_claim'],
    90: ['cls_parrent_previous_claim'], 
    91: ['cls_parrent_previous_claim'], 
    92: ['cls_parrent_previous_claim'], 
    93: ['cls_parrent_previous_claim'], 
    94: ['cls_parrent_previous_claim'], 
    122: ['cls_employee_travele','cls_parrent_previous_claim'], 
  };

  const classListMatches = validationCondition[this.intProductId]?.some(className => addMoreElement.classList.contains(className));
  if(classListMatches){
    let suiAddMoreId       = this.arrAddmoreDetails[addMorectrlId][0].ctrlId;
    let elementsClassList  = document.getElementById(suiAddMoreId);
    let addMoreFieldLength = this.arrAddmoreDetails[addMorectrlId].length;
    for (let schemeWiseFormCtr of this.arrAddmoreDetails[addMorectrlId]) {
      let ctrlTypeId       = schemeWiseFormCtr.ctrlTypeId;
      let elmId            = schemeWiseFormCtr.ctrlId;
      let addMoreEleVal: any;

      if (ctrlTypeId == 2 || ctrlTypeId == 3 || ctrlTypeId == 4) {
        addMoreEleVal = (<HTMLInputElement>document.getElementById(elmId)).value;
      } else if (ctrlTypeId == 5 || ctrlTypeId == 6) {
        let elements = document.getElementsByClassName('cls_' + elmId);
        for (let i = 0; i < elements.length; i++) {
          if ((elements[i] as HTMLInputElement).checked) {
            addMoreEleVal = 1;
          }
        }
      } else if (ctrlTypeId == 7) {
        if (this.arrUploadedFiles[elmId] !== undefined && this.arrUploadedFiles[elmId] !== 'undefined') {
          addMoreEleVal = this.arrUploadedFiles[elmId];
        }
      }
      //decrementing element length
      if (addMoreEleVal != 0 && addMoreEleVal !== '' && addMoreEleVal !== undefined && addMoreEleVal !== null) {
        addMoreFieldLength--;
      }      
    }
    if(addMoreFieldLength <= 0){
      return true;
    } else{
      Swal.fire({
        icon: 'error',
        text: 'Upon giving one field value, all fields should be filled!'
      })
      return false;
    }
  } else {
    return true;
  }
}
 /**
  * Function Name: getFinalEligibleAmount
  * Description: This method is used to getFinalEligibleAmount
  * Created By: Bindurekha Nayak
  * Created On: 31th July 2024
  */
 getFinalEligibleAmount(totalGenM, totalOth, totalSum, amtPerGenM, amtPerOth) {
  let totAmt  = 0;
  let totGenM = 0;
  let totOth  = 0;
  let resArr  = [];
  if (totalSum <= totalOth) {
    totAmt = totalSum * amtPerOth;
    totGenM=0;
    totOth=totalSum;
    
  } else if (totalSum > totalOth) {
    totAmt = totalOth * amtPerOth;
    
    if ((totalSum - totalOth) <= totalGenM) {
      totAmt += (totalSum - totalOth) * amtPerGenM;
    }
    totGenM= (totalSum - totalOth);
    totOth=totalOth;
  }
  resArr=[totGenM,totOth,totAmt];
  return resArr;
}  
  /* Function Name: customAddmoreFunction
  * Description: This method is used for delete add more calculation in interest subsidy
  * Create By: Manish Kumar
  * Created On: 31th July 2024
  */
customAddmoreFunction(intFormId, ctrlId, removedAddMore){
    let commecDate : any = sessionStorage.getItem('SCHEME_POLICY_DET');
    //console.log(removedAddMore[0][2].ctrlValue);
    //let removedAddMore = this.arrAddmoreFilledData[ctrlId].splice(indx, 1);
    let addMoreElementClass  = document.getElementById(ctrlId);
    if(intFormId == 40 && addMoreElementClass.classList.contains('cls_parrent_loan_terms')) {
      if(removedAddMore[0][8].ctrlValue !='') {
        const conDateForamt = moment(commecDate, 'YYYY-MM-DD');
        const sanDateFormat = moment(removedAddMore[0][2].ctrlValue, 'YYYY-MM-DD');
        if (sanDateFormat.isSameOrAfter(conDateForamt)) {
          this.totalIntersetRePayment = this.totalIntersetRePayment - removedAddMore[0][8].ctrlValue ;
          let totalRepaymentElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isTotRepayment')[0]);
          totalRepaymentElement.value = this.totalIntersetRePayment;
          this.repaymentClaimIncentiveCalculation(this.totalIntersetRePayment);
        } 
      }
    }

    if(intFormId == 40 && addMoreElementClass.classList.contains('cls_other_assets')) {
      if(removedAddMore[0][1].ctrlValue !='') {
        let totalInvestmentElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_is_totalInvestment')[0]);
        let totalAmount: any = parseFloat(this.otherAssetTotalAmount);
        let sumTotal = this.totalIntersetInvestment + parseFloat(totalAmount);
        sumTotal = sumTotal - removedAddMore[0][1].ctrlValue ;
        totalInvestmentElement.value = sumTotal
        this.interestSubsidyCalculation(totalInvestmentElement.value);
      }
      //console.log("assetAmount1",removedAddMore[0][1].ctrlValue);
    }
}
  
}






