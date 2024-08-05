import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { FormBuilder } from '@angular/forms';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';
import { CitizenMasterService } from '../../citizen-portal/service-api/citizen-master.service';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { WebcommonservicesService } from 'src/app/webcommonservices.service';
import { IrmsDetailsService } from '../service-api/irms-details-service';
import { CommonService } from '../../common.service';
import { first } from 'rxjs/operators';
// import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
declare var require: any;
const FileSaver = require('file-saver');
interface FinancialYear {
  year: string;
  quarters: string[];
}
@Component({
  selector: 'app-apply-bpo-form',
  templateUrl: './apply-bpo-form.component.html',
  styleUrls: [
    './apply-bpo-form.component.css',
    './apply-bpo-form.component.scss',
  ],
})
export class ApplyBpoFormComponent implements OnInit {
  loginSts: any;
  public innerWidth: any;
  farmerInfo: any;
  // Mrutunjay Added
  arrSetAllDataKeys: any = [];
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
  editIndex: any = '';
  storagePath: any = environment.serviceURL + 'storage/app/uploads/';
  btnSaveNextDisableStatus = false; // if false then btn is enabled else disabled
  private _location: any;
  loading = false;
  calLoader = false;
  intFormId: any = '';
  intProductId: number = 0;
  arrCascadingBindDependtDetails: any[] = [];
  loadDynBindAllData: any = [];
  loadDyndata = 0;
  // Mrutunjay Added
  employfinDetList: any = [];
  arr: any = [];
  intTotalEmpCount: any = 0;
  vchMdName: any = '';
  // Added by Rohit for column wise add more on 31-10-23
  arrAddMoreColumnData: any[] = [];
  arrTabularAddMoreTotData: any[] = [];
  arrColumnAddMoreTotData: any[] = [];
  arrAddmoreElemntColumnKeys: any[] = [];
  addMoreMergedColumns: any = [];
  addMoreAllMergedColumns: any = [];
  // End of column wise add more on 31-10-23

  fixedAssetTotal: any = 0;
  buildingCivilAmount: any = 0;
  equipmentAmount: any = 0;
  RefurbishedPlantMechineryAmount: any = 0;
  isTotalRdAmount: any = 0;
  isUtilitiesAmount: any = 0;
  isTransferTechnologyAmount: any = 0;
  isOtherFixedAssetsAmount: any = 0;
  invSubTotalAssAmount: any = 0;
  ivsSubBuildingAmount: any = 0;
  ivsSubPlantAmount: any = 0;
  ivsSubRefAmount: any = 0;
  ivsSubRndAmount: any = 0;
  ivsSubUtilityAmount: any = 0;
  ivsSubTransAmount: any = 0;
  builtSpaceUpCappingVal: any = 0;
  ResAmount: any = 0;
  previousClaimedSubsidy: any = [];
  ptsPrevClaimedAmount: any = 0;
  ptsToatlClaimedAmount: any = 0;
  rentalClaimedAmount: any = 0;
  intNoOfDateField: any = 0;
  objequipmentDetails: any = []; //created by Sibananda sahu on 05 jan 2024
  booleanEquipmentStatus: boolean = false; //created by Sibananda sahu on 05 jan 2024
  objFixedAssets: any = []; //created by Sibananda sahu on 08 jan 2024
  booleanFixedAssetStatus: boolean = false; //created by Sibananda sahu on 08 jan 2024
  equipmentTotalValue: any = 0;
  fixedAssetsTotalValue: any = 0;
  buildingCivilInvest: any = 0;
  isAddMoreCtrlIds: any = [];
  rentalfinalCapping: any = 0;
  rentalFinalamount: any = 0;
  totalLeaseRental: any = 0;
  finalLeaseSpace: any = 0;
  otherAssetTotalAmount: any = 0;
  formEditStatus: any = 0;
  prevAmount:any = 0;
  plantAmount:any =0;
  financialYearsWithQuarters: FinancialYear[] = [];
  @ViewChild('formFile', { static: false })
  formFile: ElementRef;
  @ViewChild('equipmentDetailsModal') equipmentDetailsModalRef: ElementRef;
  @ViewChild('fixedAssetsModal') fixedAssetsModalRef: ElementRef;
  @ViewChild('previousClaimModal') previousClaimModalRef: ElementRef;
  @ViewChild('towerDetailsModal') towerDetailsModalRef: ElementRef;
  userId: any;
  booleanPrevClaimStatus: boolean;
  towerDeatilsList: any;
  isTowerAvailable: number;
  isCappingValue: number;
  totalRecruitmentClaimAmount: number;
  epfClaimAmount: number;
  totalRepaymentValueInterestSubsidy: number;
  stateGSTcommencementDate: any;
  amountAddMoreDet:any =0;
  amountAddMoreDetOther:any =0;
  totalPreviousAmount:any =0;
  constructor(
    public authService: CitizenAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private encDec: EncryptDecryptService,
    public vldChkLst: ValidatorchklistService,
    private modalService: NgbModal,
    public translate: TranslateService,
    public masterService: CitizenMasterService,
    private WebCommonService: WebcommonservicesService,
    private IrmsDetailsService: IrmsDetailsService,
    private commonService: CommonService
  ) {
    translate.addLangs(['English', 'Odia']);
    if (localStorage.getItem('locale')) {
      const browserLang = localStorage.getItem('locale');
      translate.use(
        browserLang.match(/English|Odia/) ? browserLang : 'English'
      );
    } else {
      localStorage.setItem('locale', 'English');
      translate.setDefaultLang('English');
    }
  }
  ngOnInit(): void {
    this.secDisable = false;
    let schemeArr: any = [];
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    if (encSchemeId != '') {
      let schemeStr = this.encDec.decText(encSchemeId);
      schemeArr = schemeStr.split(':');
      this.processId = schemeArr[0];
      this.onlineServiceId = schemeArr[1];
      this.currSecId = schemeArr[2];
      this.intProductId = schemeArr[3];
      this.formEditStatus = schemeArr[4];
    }
    this.intTotalEmpCount = sessionStorage.getItem('totalEmpCount')
      ? sessionStorage.getItem('totalEmpCount')
      : 0;
    this.vchMdName = sessionStorage.getItem('mdName')
      ? sessionStorage.getItem('mdName')
      : '';
    let dynSchmCtrlParms = {
      intProcessId: this.processId,
      intOnlineServiceId: this.onlineServiceId,
      sectionId: this.currSecId,
      intProductId: this.intProductId,
    };
    if (this.intProductId != 0) {
      this.loading = true;
      this.masterService.getTaggedFormId(dynSchmCtrlParms).subscribe((res) => {
        if (res.result?.intFormId) {
          this.intFormId = res.result.intFormId;
          this.processId = res.result.intFormId;
          dynSchmCtrlParms.intProcessId = res.result.intFormId;
          this.loadDynamicCtrls(dynSchmCtrlParms);
        } else {
          this.intFormId = 'no-data';
          this.loading = false;
        }
      });
    }
    // this.objFinancialDetails = JSON.parse(
    //   sessionStorage.getItem('financialDetails')
    // );
    // if (this.objFinancialDetails != null)
    //   this.booleanFinancialStatus =
    //     this.objFinancialDetails.length > 0 ? true : false;
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
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe((res) => {
      //  this.loading=true;
      if (res.status == 200) {
        this.dynamicCtrlDetails = res.result;
       // console.log(res.result);
        // console.log(res.result.sec_0.addMoreValueDetails);
        let vchEquipmentValueSum = 0;
        let vchAssetAmountSum = 0;
        if (res && res.result && res.result.sec_0 && res.result.sec_0.dataValue && res.result.sec_0.dataValue.vch_claimed_amount) {
          this.totalRecruitmentClaimAmount = res.result.sec_0.dataValue.vch_claimed_amount;
        }
        const addMoreValueDetails = res.result.sec_0.addMoreValueDetails;
        for (const key in addMoreValueDetails) {
          const addMoreDataValue = addMoreValueDetails[key].addMoreDataValue;
          if (Array.isArray(addMoreDataValue)) {
            addMoreDataValue.forEach(item => {
              if (item?.vchEquipmentValue) {
                vchEquipmentValueSum += parseFloat(item.vchEquipmentValue);
              }
              if (item?.vch_asset_amount) {
                vchAssetAmountSum += parseFloat(item.vch_asset_amount);
              }
            });
          }
        }
        this.equipmentTotalValue = vchEquipmentValueSum;
        this.fixedAssetsTotalValue = vchAssetAmountSum;



        this.formName = res.formName;
        this.dynamicCtrlDetKeys = Object.keys(this.dynamicCtrlDetails).sort();
        setTimeout(() => {
          this.loadDynamicValue();
        }, 2000);
        setTimeout(() => {
          this.loadDependCtrls();
          this.setCalcFields();

          if (this.onlineServiceId > 0) {
            let dynBindType: any = document.querySelectorAll(
              '[data-dynbindflag=true]'
            );

            for (let dynbndtype of dynBindType) {
              let dynCtrlId = dynbndtype.getAttribute('data-id');
              let dynbindconditions =
                this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
              let dynbindtbl =
                this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName;
              let dynbindtxtclmname =
                this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
              let dynbinddependflag = dynbndtype.getAttribute(
                'data-dynbinddependflag'
              );
              let dynbindvalclmn =
                this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;
            
              if (dynbinddependflag == 'true') {
                let parms = {
                  tableName: dynbindtbl,
                  columnName: dynbindtxtclmname + ',' + dynbindvalclmn,
                  condition: dynbindconditions,
                };
                this.dynmaicValApi(parms, dynCtrlId);
              }
            }

            // For Edit Case of Dependend Fields
            let prntIds: any = document.querySelectorAll(
              '[data-parentflag=true]'
            );

            for (let prntDet of prntIds) {
              let dependntTypeID = prntDet.getAttribute('data-typeid');
              if (dependntTypeID == 5) {
                if (prntDet.checked == true) {
                }
              } else if (dependntTypeID == 6) {
                if (prntDet.checked == true) {
                  prntDet.click();
                }
              } else if (dependntTypeID == 3) {
                var event = new Event('change');
                prntDet.dispatchEvent(event);
              }
            }
          }
          this.loading = false;
        }, 3000);

        if (this.currSecTabKey == 0 && this.currSecId == 0) {
          this.currSecTabKey = this.dynamicCtrlDetKeys[0];

          this.currSecId =
            this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
        }
      }
    });
    setTimeout(() => {
      this.validateDate();
      this.validateNumberWithSpecialCharacter();
    }, 1500);
  }

  storeCasDetials(cascadingDetails: any, id: any) {
    this.arrallCascadingDetails[id] = cascadingDetails;
  }
  curSelectedSec(sectionKey: any) {
    this.currSecTabKey = sectionKey;
    this.currSecId = this.dynamicCtrlDetails[sectionKey]['sectionid'];
    let dynSchmCtrlParms = {
      intProcessId: this.processId,
      sectionId: this.currSecId,
      intOnlineServiceId: this.onlineServiceId,
    };
    this.loadDynamicCtrls(dynSchmCtrlParms);
  }

  // loadDependCtrls() {
  //   let prntIds: any = document.querySelectorAll('[data-parentflag=true]');

  //   for (let prntDet of prntIds) {
  //     let dependntTypeID = prntDet.getAttribute('data-typeid');
  //     if (dependntTypeID == 6 || dependntTypeID == 5) {
  //       // For Radio and checkbox
  //       let id = prntDet.name;
  //       let chldDetls: any = document.querySelectorAll(
  //         '[data-dependctrlId=' + id + ']'
  //       );
  //       prntDet.addEventListener('click', () => {
  //         for (let loopChldDet of chldDetls) {
  //           let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
  //           if (prntDet.value == lopdependval) {
  //             loopChldDet.closest('.dynGridCls').classList.remove('d-none');
  //             loopChldDet
  //               .closest('.dynGridCls')
  //               .querySelector('.dynlabel')
  //               .classList.remove('d-none');
  //             loopChldDet.classList.remove('d-none');

  //             let lblEmnt = (<HTMLInputElement>(
  //               document.getElementById(loopChldDet.id)
  //             )).nextElementSibling;
  //             lblEmnt?.classList.remove('d-none');
  //           } else {
  //             loopChldDet.closest('.dynGridCls').classList.add('d-none');
  //             loopChldDet
  //               .closest('.dynGridCls')
  //               .querySelector('.dynlabel')
  //               .classList.add('d-none');
  //             loopChldDet.classList.remove('d-none');
  //             loopChldDet.classList.add('d-none');
  //             let lblEmnt = (<HTMLInputElement>(
  //               document.getElementById(loopChldDet.id)
  //             )).nextElementSibling;
  //             lblEmnt?.classList.add('d-none');
  //             let tpId = loopChldDet.getAttribute('data-typeid');
  //             if (tpId == 2) {
  //               (<HTMLInputElement>(
  //                 document.getElementById(loopChldDet.id)
  //               )).value = '';
  //             } else if (tpId == 3) {
  //               (<HTMLInputElement>(
  //                 document.getElementById(loopChldDet.id)
  //               )).value = '0';
  //             }
  //           }
  //         }
  //       });
  //     } // For Dropdown
  //     else {
  //       let chldDetls: any = document.querySelectorAll(
  //         '[data-dependctrlId=' + prntDet.id + ']'
  //       );

  //       prntDet.addEventListener('change', () => {
  //         this.hideAllChildParent(prntDet, '');
  //         for (let loopChldDet of chldDetls) {
  //           let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
  //           lopdependval = lopdependval.split(',');
  //           if (lopdependval.includes(prntDet.value)) {
  //             if (loopChldDet.getAttribute('data-typeid') == 8) {
  //               loopChldDet.closest('.dynGridCls').classList.remove('d-none');
  //               loopChldDet.classList.remove('d-none');
  //             } else {
  //               loopChldDet.closest('.dynGridCls').classList.remove('d-none');
  //               loopChldDet
  //                 .closest('.dynGridCls')
  //                 .querySelector('.dynlabel')
  //                 .classList.remove('d-none');
  //               loopChldDet.classList.remove('d-none');
  //               if (
  //                 loopChldDet.getAttribute('data-typeid') == 6 ||
  //                 loopChldDet.getAttribute('data-typeid') == 5
  //               ) {
  //                 let lblEmnt = (<HTMLInputElement>(
  //                   document.getElementById(loopChldDet.id)
  //                 )).nextElementSibling;
  //                 lblEmnt?.classList.remove('d-none');
  //               }
  //             }
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
    let dynBindType: any = document.querySelectorAll('[data-dynbindFlag=true]');

    for (let dynbndtype of dynBindType) {
      let dynCtrlId = dynbndtype.getAttribute('data-id');
      let dynbindconditions =
        this.arrallCascadingDetails[dynCtrlId].ctrlCCDConditions;
      let dynbindtbl = this.arrallCascadingDetails[dynCtrlId].ctrlCCDTableName;
      let dynbindtxtclmname =
        this.arrallCascadingDetails[dynCtrlId].ctrlCCDTextColumnName;
      let dynbinddependflag = dynbndtype.getAttribute('data-dynbinddependflag');
      let dynbindvalclmn =
        this.arrallCascadingDetails[dynCtrlId].ctrlCCDValueColumnName;
      if (dynbinddependflag == 'false') {
        // if not dependent on parent
        let parms = {
          tableName: dynbindtbl,
          columnName: dynbindtxtclmname + ',' + dynbindvalclmn,
          condition: dynbindconditions,
        };
        this.dynmaicValApi(parms, dynCtrlId);
      }
    }
    this.setAutofillUpFields();
  }
  dynmaicValApi(params: any, dynbindCtrlId: any) {
    this.WebCommonService.loadDynamicBindDetails(params).subscribe((res) => {
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
    let schemeWiseFormDetails =
      this.dynamicCtrlDetails[this.currSecTabKey]['formDetails'];
    const formData = new FormData();
    let uploadFile: any;
    let validatonStatus = true;
    let validateArray: any[] = [];
    let arrJsnTxtDet: any = [];
    let clearAddMoreValue = [];
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
      
      

      if (ctrlTypeId == 2) {
        // For Textbox
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          if (validateArray[dependElemId].ctrlValue != dependElemdCondVal) {
            continue;
          }
        }
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

        if (mandatoryDetails) {
          // For Mandatory
          if (
            !this.vldChkLst.blankCheck(
              elmVal,
              lblName + ' can not be left blank'
            )
          ) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMaxLength != '') {
          // For Max length
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '') {
          // For Min length
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (attrType == 'email') {
          // For Valid Email
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
        else if (attrType == 'telephone') {
          // For Valid Mobile
          if (!this.vldChkLst.validMob(elmVal)) {
            validatonStatus = false;
            break;
          }
        } else if (attrType == 'password') {
          // For password Validation
          if (!this.vldChkLst.validPassword(elmVal)) {
            validatonStatus = false;
            break;
          }
        }
        
      } else if (ctrlTypeId == 3) {
        // For DropDown
        let elm: any = <HTMLInputElement>document.getElementById(elmId);
        elmVal = elm.value;
        elmValText = elm.options[elm.selectedIndex].text;

        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal;
          if (
            validateArray[dependElemId]['ctrlTypeId'] == 6 ||
            validateArray[dependElemId]['ctrlTypeId'] == 5
          ) {
            let dependElem: any = document.getElementsByName(dependElemId);
            for (let i of dependElem) {
              if (i.checked) {
                dependElemVal = i.value;
                break;
              }
            }
          } else {
            dependElemVal = (<HTMLInputElement>(
              document.getElementById(dependElemId)
            )).value;
          }
          if (dependElemVal != dependElemdCondVal) {
            continue;
          }
        }

        if (mandatoryDetails) {
          // For Mandatory
          if (!this.vldChkLst.selectDropdown(elmVal, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 4) {
        // For TextArea
        if (elmClass != '' && elmClass == this.ckEdtorCls) {
          elmVal = this.arrckEdtorVal[elmId];
        } else {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
        }

        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal = (<HTMLInputElement>(
            document.getElementById(dependElemId)
          )).value;
          if (dependElemVal != dependElemdCondVal) {
            continue;
          }
        }
        if (mandatoryDetails) {
          // For Mandatory
          if (
            !this.vldChkLst.blankCheck(
              elmVal,
              lblName + ' can not be left blank'
            )
          ) {
            validatonStatus = false;
            break;
          }
        }
        if (ctrlMaxLength != '') {
          // For Max length
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '') {
          // For Min length
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 5) {
        // For Checkbox
        let chkdVal: any = '';
        let chkdTxt: any = '';
        var checkboxes: any = document.getElementsByName(elmId);

        for (var checkbox of checkboxes) {
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
        elmVal = chkdVal;
        elmValText = chkdTxt;
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          if (validateArray[dependElemId]['ctrlTypeId'] == 5) {
            // For Checkbox
          } else if (validateArray[dependElemId]['ctrlTypeId'] == 6) {
            // For Radio
            if (
              dependElemdCondVal != validateArray[dependElemId]['ctrlValue']
            ) {
              continue;
            }
          } else {
            let dependElemVal = (<HTMLInputElement>(
              document.getElementById(dependElemId)
            )).value;

            if (dependElemVal != dependElemdCondVal) {
              continue;
            }
          }
        }

        if (mandatoryDetails) {
          // For Mandatory
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 6) {
        // For Radio Btn
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
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          //   return false;

          if (validateArray[dependElemId]['ctrlTypeId'] == 5) {
            // For Checkbox
          } else if (validateArray[dependElemId]['ctrlTypeId'] == 6) {
            // For Radio
            if (
              dependElemdCondVal != validateArray[dependElemId]['ctrlValue']
            ) {
              continue;
            }
          } else {
            let dependElemVal = (<HTMLInputElement>(
              document.getElementById(dependElemId)
            )).value;

            if (dependElemVal != dependElemdCondVal) {
              continue;
            }
          }
        }
        if (mandatoryDetails) {
          // For Mandatory
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 7) {
        uploadFile = this.arrUploadedFiles[elmId];
        if (mandatoryDetails) // For Mandatory
        {
          if (uploadFile) {
            if (uploadFile['fileName'] == '' || uploadFile['fileName'] == undefined) {
              Swal.fire({
                icon: 'error',
                text: 'Please upload ' + lblName
              });
              validatonStatus = false;
              break;
            }
          } else {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName
            });
            validatonStatus = false;
            break;
          }
        }
        // if (mandatoryDetails) {
        //   // For Mandatory
        //   if (
        //     uploadFile['fileName'] == '' ||
        //     uploadFile['fileName'] == undefined
        //   ) {
        //     Swal.fire({
        //       icon: 'error',
        //       text: 'Please upload ' + lblName,
        //     });
        //     validatonStatus = false;
        //     break;
        //   }
        // }
      } else if (ctrlTypeId == 10) {
        //For AddMore
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          // For Dependent Check
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          let dependElemVal;
          if (
            validateArray[dependElemId]['ctrlTypeId'] == 6 ||
            validateArray[dependElemId]['ctrlTypeId'] == 5
          ) {
            let dependElem: any = document.getElementsByName(dependElemId);
            for (let i of dependElem) {
              if (i.checked) {
                dependElemVal = i.value;
                break;
              }
            }
          } else {
            dependElemVal = (<HTMLInputElement>(
              document.getElementById(dependElemId)
            )).value;
          }
          if (dependElemVal != dependElemdCondVal) {
            continue;
          }
        }
        if (schemeWiseFormCtr['radioAddmoreviewtype'] == 'table') {
          let addMoreTbulrRes =
            this.addAddMoreArrTabularWise(schemeWiseFormCtr);
          if (addMoreTbulrRes.validationStatus) {
            addMoreElementData = JSON.stringify(
              addMoreTbulrRes.arrAddmoreFilledTabularData
            );
          } else {
            validatonStatus = false;
            break;
          }
        }
        // Added by Rohit for column wise add more on 31-10-23
        else if (schemeWiseFormCtr['radioAddmoreviewtype'] == 'column') {
          if (this.saveaddMoreColumnData(elmId, 0)) {
            addMoreElementData = JSON.stringify(
              this.arrAddmoreFilledData[elmId]
            );
          } else {
            validatonStatus = false;
            break;
          }
        } // End of column wise add more on 31-10-23
        else {
          let addmoreAllCtrlWiseData = this.arrAddmoreFilledData[elmId];
          if (addmoreAllCtrlWiseData == undefined) {
            addmoreAllCtrlWiseData = [];
          }
          if (
            !this.addMoreValidation(
              addmoreAllCtrlWiseData,
              schemeWiseFormCtr['addmoreDetails']
            )
          ) {
            validatonStatus = false;
            break;
          }
          addMoreElementData = JSON.stringify(this.arrAddmoreFilledData[elmId]);
        }
      }
      validateArray[elmId] = {
        ctrlValue: elmVal,
        ctrlTypeId: ctrlTypeId,
      };
      formData.append('ctrlTypeId[' + elmId + ']', ctrlTypeId);
      formData.append('ctrlId[' + elmId + ']', elmId);
      formData.append('ctrlName[' + elmId + ']', elmName);
      formData.append('lblName[' + elmId + ']', lblName);
      formData.append('ctrlValue[' + elmId + ']', elmVal);
      formData.append('ctrlValueText[' + elmId + ']', elmValText);
      formData.append(
        'uploadedFiles[' + elmId + ']',
        JSON.stringify(uploadFile)
      );
      formData.append('addMoreElementData[' + elmId + ']', addMoreElementData);
    }
    formData.append('intProfileId', sessionInfo.USER_ID);
    formData.append('processId', this.processId);
    formData.append('secId', this.currSecId);
    formData.append('intOnlineServiceId', this.onlineServiceId);
    if (validatonStatus) {
      this.loading = true;
      const finalClaimAmtField: any = (<HTMLInputElement>document.getElementsByClassName('cls_fca_d_none')[0]);
      const claimAmt: any = (<HTMLInputElement>document.getElementsByClassName('cls_fca')[0]);
      if (finalClaimAmtField && claimAmt) {
        formData.set('ctrlValue[' + finalClaimAmtField.id + ']', claimAmt.value);
      }
      this.WebCommonService.schemeApply(formData).subscribe((res: any) => {
        let validationMsg =
          res.result.validationMsg != '' ? res.result.validationMsg : 'error';
        if (res.status == 200) {
          this.onlineServiceId = res.result.intOnlineServiceId;
          let onlineProductId = JSON.parse(
            sessionStorage.getItem('FFS_SESSION_SCHEME')
          ).FFS_APPLY_SCHEME_PRODUCT_ID;
          let onlineModuleId = JSON.parse(
            sessionStorage.getItem('FFS_SESSION_SCHEME')
          ).FFS_APPLY_SCHEME_MODULE_ID;
          const regdId = sessionStorage.getItem('REGD_ID');

          let param = {
            onlineServiceId: this.onlineServiceId,
            onlineProductId: onlineProductId,
            onlineModuleId: onlineModuleId,
            profileId: sessionInfo.USER_ID,
            regdId: regdId,
            finalClaimedAmount: (claimAmt) ? claimAmt.value : 0
          };
          this.IrmsDetailsService.saveIncentiveDetails(param).subscribe(
            (result: any) => {
              this.loading = false;
              if (
                this.dynamicCtrlDetKeys.length >
                this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey) + 1
              ) {
                let latestDynCtlkeyIndex =
                  Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey)) +
                  1;
                this.currSecTabKey =
                  this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
                this.currSecId =
                  this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
                this.prevdipStatus = '';
                this.secDisable = false;
                (<HTMLElement>(
                  document.getElementById(
                    'sec-tab-' + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex]
                  )
                )).click();
                // this.secDisable   = true;
              } else {
                let formParms =
                  this.processId +
                  ':' +
                  this.onlineServiceId +
                  ':0:' +
                  this.intProductId;
                let encSchemeStr = this.encDec.encText(formParms.toString());
                this.router.navigate([
                  '/citizen-portal/preview-form',
                  encSchemeStr,
                ]);
              }
            }
          );
        } else {
          Swal.fire({
            icon: 'error',
            text: validationMsg,
          });
        }
      });
    }
  }

  goToPrevious() {
    if (this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey) == 0) {
      this.router.navigate(['/website/servicelisting']);
    } else {
      let latestDynCtlkeyIndex =
        Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey)) - 1;
      this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
      this.currSecId = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
      this.prevdipStatus = '';
      this.secDisable = false;
      (<HTMLElement>(
        document.getElementById(
          'sec-tab-' + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex]
        )
      )).click();
      this.secDisable = true;
    }
  }

  reset() {
    if (this.currSecTabKey == 'sec_0') {
      location.reload();
      return;
    }
    (<HTMLElement>(
      document.getElementById('sec-tab-' + this.currSecTabKey)
    )).click();
  }
  setCkedtorArr(
    ckVal: any,
    ckId: any // To set the ck editor value in array while page submit
  ) {
    this.arrckEdtorVal[ckId] = ckVal;
  }
  saveFileTemp(
    event: any,
    fileId: any,
    fileType: any,
    fileSize: any,
    fileForApproval: any,
    fileSizeType: any // This function is used to save the file in temporary Folder
  ) {
    const target = event.target as HTMLInputElement;
    const files: any = target.files as FileList;
    const uploadedfleSize = files[0].size;
    const uploadedfileType = files[0].type;
    let validFileStatus = true;
    if (!this.vldChkLst.validateFile(uploadedfileType, fileType)) {
      // File Type Validation Check
      validFileStatus = false;
      Swal.fire({
        icon: 'error',
        text: 'invalid file type',
      });
    }
    if (
      !this.vldChkLst.validateFileSize(uploadedfleSize, fileSize, fileSizeType)
    ) {
      // File Size Validation Check
      let filesizeMsg = '';
      if (fileSizeType.toLowerCase() == 'kb') {
        filesizeMsg = 'File size exceeds ' + fileSize + 'KB.';
      } else {
        filesizeMsg = 'File size exceeds ' + fileSize + 'MB.';
      }
      validFileStatus = false;
      Swal.fire({
        icon: 'error',
        text: filesizeMsg,
      });
    }
    if (!validFileStatus) {
      (<HTMLInputElement>document.getElementById(fileId)).value = '';
      document
        .getElementById('fileDownloadDiv_' + fileId)
        ?.closest('.form-group')
        ?.querySelector('.downloadbtn')
        ?.setAttribute('href', '');
      document
        .getElementById('fileDownloadDiv_' + fileId)
        ?.classList.add('d-none');
      delete this.arrUploadedFiles[fileId];
      return false;
    }
    const fileData = new FormData();
    fileData.append('file', files[0]);
    fileData.append('fileType', fileType);
    fileData.append('fileSize', fileSize);
    fileData.append('fileSizeType', fileSizeType);
    this.btnSaveNextDisableStatus = true;
    this.WebCommonService.saveFileToTemp(fileData).subscribe((res: any) => {
      if (res.status == 200) {
        this.arrUploadedFiles[fileId] = {
          fileName: res.result.fileName,
          fileForApproval: fileForApproval,
          fileType: fileType,
        };
        const element = document.getElementById('fileName_' + fileId);
        if (element) {
          // Set the innerHTML of the element to the fileName variable
          element.innerHTML = res.result.fileName;
        }
        document
          .getElementById('fileDownloadDiv_' + fileId)
          ?.closest('.form-group')
          ?.querySelector('.downloadbtn')
          ?.setAttribute('href', res.result.filePath);
        document
          .getElementById('fileDownloadDiv_' + fileId)
          ?.classList.remove('d-none');
      } else {
        (<HTMLInputElement>document.getElementById(fileId)).value = '';
        Swal.fire({
          icon: 'error',
          text: 'error while uploading files',
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
          const element = document.getElementById('fileName_' + ctrlId);
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

  showUploadFile(
    fileName: any,
    ctrlId: any,
    fileForApproval: any,
    fileType: any
  ) {
    if (
      fileName != null &&
      fileName != '' &&
      !this.arrDeletedUploadedFiles.includes(ctrlId) &&
      fileName != 'NULL' &&
      fileName != 'null'
    ) {
      document
        .getElementById('fileDownloadDiv_' + ctrlId)
        ?.closest('.form-group')
        ?.querySelector('.downloadbtn')
        ?.setAttribute(
          'href',
          environment.serviceURL + 'storage/app/uploads/' + fileName
        );
      document
        .getElementById('fileDownloadDiv_' + ctrlId)
        ?.classList.remove('d-none');
      const element = document.getElementById('fileName_' + ctrlId);
      if (element) {
        // Set the innerHTML of the element to the fileName variable
        element.innerHTML = fileName;
      }
      this.arrUploadedFiles[ctrlId] = {
        fileName: fileName,
        fileForApproval: fileForApproval,
        fileType: fileType,
      };
    }
  }

  setCalcFieldValue(ctrlCalcFieldData: any, ctrlId: any) {
    this.arrCalcFields[ctrlId] = ctrlCalcFieldData;
  }
  setCalcFields() {
    let dynCalc: any = document.querySelectorAll("[data-calcflag='true']");
    for (let loopdynCalc of dynCalc) {
      (<HTMLInputElement>document.getElementById(loopdynCalc.id)).readOnly = false;   //changed to false for auto-calculation field to be editable
      for (let clcloop of this.arrCalcFields[loopdynCalc.id]) {
        if (clcloop.ctrlCalcFieldtype == 'fieldValue') {
          let clcElement = (<HTMLInputElement>document.getElementById(clcloop.ctrlCalcValue));
          clcElement.addEventListener('keyup', () => {
            this.calculate(this.arrCalcFields[loopdynCalc.id], loopdynCalc.id);
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
  setArrAddMoreDetails(
    ctrlId: any,
    addMoreparams: any,
    addMoreViewType: any,
    formctrls: any
  ) {
    // This function is used to set the configured data of Add more

    if (
      addMoreViewType == 'table' &&
      (this.arrAddmoreDetails[ctrlId] == '' ||
        this.arrAddmoreDetails[ctrlId] == undefined)
    ) {
      this.storeAddMoreMergeDetails(formctrls, ctrlId);
    } else if (
      addMoreViewType == 'column' &&
      (this.arrAddmoreDetails[ctrlId] === '' ||
        this.arrAddmoreDetails[ctrlId] == undefined)
    ) {
      this.setTotCalculationForColumnAddMore(ctrlId);
      this.storeAddMoreMergeDetails(formctrls, ctrlId);
    }
    this.arrAddmoreDetails[ctrlId] = addMoreparams;
  }
  // End of column wise add more on 31-10-23
  addMoreData(addMorectrlId: any) {
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
      let bndDataType =
        schemeWiseFormCtr.addmorecascadingCtrlDetails[0].ctrlCCbindDatatype;
      let bndDataTypeDpndOther =
        schemeWiseFormCtr.addmorecascadingCtrlDetails[0]
          .AMctrlCCbinddepentOther;

      clearAddMoreValue.push({
        elmId: elmId,
        elmtypeId: ctrlTypeId,
        elmClass: elmClass,
        bindDataType: bndDataType,
        bndDataTypeDpndOther: bndDataTypeDpndOther,
      });
      // Start || Code added for adding add more element value status
      let addMoreEleVal:any = (<HTMLInputElement>document.getElementById(elmId)).value;
      if(addMoreEleVal == 0 || addMoreEleVal == '' || typeof (addMoreEleVal) == undefined || addMoreEleVal == null){
        addMoreEleValStatus.push(0);
      }else{
        addMoreEleValStatus.push(1);
      }
      // End
      if (ctrlTypeId == 2) {
        // For Textbox
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

        if (mandatoryDetails) {
          // For Mandatory
          addMoreEleValStatus.push(1);
          if (
            !this.vldChkLst.blankCheck(
              elmVal,
              lblName + ' can not be left blank'
            )
          ) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMaxLength != '') {
          // For Max length
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '') {
          // For Min length
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (attrType == 'email') {
          // For Valid Email
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

        } else if (attrType == 'telephone') {
          // For Valid Mobile
          if (!this.vldChkLst.validMob(elmVal)) {
            validatonStatus = false;
            break;
          }
        } else if (attrType == 'password') {
          // For password Validation
          if (!this.vldChkLst.validPassword(elmVal)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 3) {
        // For DropDown
        let elm: any = <HTMLInputElement>document.getElementById(elmId);

        elmVal = elm.value;
        elmValText = elm.options[elm.selectedIndex].text;

        if (mandatoryDetails) {
          // For Mandatory
          if (!this.vldChkLst.selectDropdown(elmVal, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 4) {
        // For TextArea
        if (elmClass == this.ckEdtorCls && elmClass != '') {
          elmVal = this.arrckEdtorVal[elmId];
        } else {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
        }

        if (mandatoryDetails) {
          // For Mandatory
          if (
            !this.vldChkLst.blankCheck(
              elmVal,
              lblName + ' can not be left blank'
            )
          ) {
            validatonStatus = false;
            break;
          }
        }
        if (ctrlMaxLength != '') {
          // For Max length
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '') {
          // For Min length
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 5) {
        // For Checkbox
        if (mandatoryDetails) {
          // For Mandatory
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
            } else {
              chkdVal += checkbox.value;
              let el = document.querySelector(`label[for="${checkbox.id}"]`);
              chkdTxt += el?.textContent;
            }
          }
        }
        elmVal = chkdVal.toString();
        elmValText = chkdTxt;
      } else if (ctrlTypeId == 6) {
        // For Radio Btn
        if (mandatoryDetails) {
          // For Mandatory
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
      } else if (ctrlTypeId == 7) {
        uploadFile = this.arrUploadedFiles[elmId];

        if (mandatoryDetails) {
          // For Mandatory
          if (uploadFile == '' || uploadFile == undefined) {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName,
            });
            validatonStatus = false;
            break;
          }
        }
      }
      validateArray[elmId] = {
        ctrlValue: elmVal,
        ctrlTypeId: ctrlTypeId,
      };

      arrAddMoreElementWiseData.push({
        ctrlTypeId: ctrlTypeId,
        ctrlId: elmId,
        ctrlName: elmName,
        lblName: lblName,
        ctrlValue: elmVal,
        ctrlValueText: elmValText,
        uploadFile: uploadFile,
        editStaus: 0,
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
      if (clearAddMoreValue.length > 0) {
        // Clear All the add More elements
        for (let addMoreClearloop of clearAddMoreValue) {
          if (addMoreClearloop['elmtypeId'] == 2) {
            (<HTMLInputElement>(
              document.getElementById(addMoreClearloop['elmId'])
            )).value = '';
          } else if (addMoreClearloop['elmtypeId'] == 3) {
            (<HTMLInputElement>(
              document.getElementById(addMoreClearloop['elmId'])
            )).value = '0';

            // if(addMoreClearloop['bindDataType'] == 'dynamic' && addMoreClearloop['bndDataTypeDpndOther'] == 0)
            //   {
            //    console.log(this.arralldynVal[addMoreClearloop['elmId']].splice(Object.keys(this.arralldynVal).indexOf(addMoreClearloop['elmId']),500));
            //    console.log(this.arralldynVal[addMoreClearloop['elmId']]);
            //   }
            //
          } else if (addMoreClearloop['elmtypeId'] == 4) {
            if (addMoreClearloop['elmClass'] == this.ckEdtorCls) {
              this.arrckEdtorVal[addMoreClearloop['elmId']] = '';
            } else {
              (<HTMLInputElement>(
                document.getElementById(addMoreClearloop['elmId'])
              )).value = '';
            }
          } else if (addMoreClearloop['elmtypeId'] == 5) {
            var checkboxes: any = document.getElementsByName(
              addMoreClearloop['elmId']
            );
            for (var checkbox of checkboxes) {
              if (checkbox.checked) {
                (<HTMLInputElement>(
                  document.getElementById(checkbox.id)
                )).checked = false;
              }
            }
          } else if (addMoreClearloop['elmtypeId'] == 6) {
            var radioBtnElmn = document.getElementsByName(
              addMoreClearloop['elmId']
            );

            for (var i = 0, length = radioBtnElmn.length; i < length; i++) {
              if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
                let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
                (<HTMLInputElement>document.getElementById(rdId)).checked =
                  false;
              }
            }
          } else if (addMoreClearloop['elmtypeId'] == 7) {
            document
              .getElementById('fileDownloadDiv_' + addMoreClearloop['elmId'])
              ?.closest('.form-group')
              ?.querySelector('.downloadbtn')
              ?.setAttribute('href', '');
            document
              .getElementById('fileDownloadDiv_' + addMoreClearloop['elmId'])
              ?.classList.add('d-none');
            const element = document.getElementById('fileName_' + addMoreClearloop['elmId']);
            if (element) {
              element.innerHTML = 'Browse File';
            }
            (<HTMLInputElement>(
              document.getElementById(addMoreClearloop['elmId'])
            )).value = '';
          }
        }
      }

      // First store using index of add more id  in this.arrAddmoreFilledData and then push it in this.arrAddmoreFilledData
      if (this.arrAddmoreFilledData[addMorectrlId] != undefined) {
        this.arrAddmoreFilledData[addMorectrlId].push(
          arrAddMoreElementWiseData
        );
      } else {
        this.arrAddmoreFilledData[addMorectrlId] = [arrAddMoreElementWiseData];
      }
      this.arrAddmoreElemntKeys[addMorectrlId] = Object.keys(
        arrAddMoreElementWiseData
      );
      this.editIndex = '';
    //To Disable Addmore button after successfully adding to list | By:Siba
    let addMoreButton = document.getElementById('addMoreBtn_' + addMorectrlId);
    addMoreButton?.setAttribute('disabled', 'disabled');;
    addMoreButton?.classList.remove('blink');
    //End of disabling Addmore button 
    }
    let otherAssId =
      this.arrAddmoreFilledData[addMorectrlId][
        this.arrAddmoreFilledData[addMorectrlId].length - 1
      ][1].ctrlId;
    let otherAssClassList = document.getElementById(otherAssId);
    if (otherAssClassList.classList.contains('cls_cisEquipmentValue')) {
      this.addMoreCalculation(
        this.arrAddmoreFilledData,
        addMorectrlId,
        this.formName
      );
    } else if (otherAssClassList.classList.contains('cls_cisAssetValue')) {
      this.isAddMoreCtrlIds.push(addMorectrlId);
      this.addMoreCalculation2(
        this.arrAddmoreFilledData,
        addMorectrlId,
        this.formName
      );
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
  }

  setDynRadioBtn(dynSetVal: any, ctrlValue: any) {
    if (dynSetVal != null) {
      let arrRadioDetails = dynSetVal.split(',');
      return arrRadioDetails.includes(ctrlValue);
    } else {
      return false;
    }
  }

  deleteAddMore(event: any, ctrlId: any, indx: any) {
    if (this.isAddMoreCtrlIds.includes(ctrlId)) {
      this.arrAddmoreFilledData[ctrlId].splice(indx, 1);
      this.addMoreCalculation2(
        this.arrAddmoreFilledData,
        ctrlId,
        this.formName
      );
      this.interestSubsidyAddMoreCalculation(
        this.arrAddmoreFilledData,
        ctrlId,
        this.formName
      );
    } else {
      this.arrAddmoreFilledData[ctrlId].splice(indx, 1);
      this.addMoreCalculation(this.arrAddmoreFilledData, ctrlId, this.formName);
     
    }
  }
  checkAddMoreTabularkeyExists(
    addMoreTabularKeySlno: any,
    addMoreTabularId: any,
    addMoreTavularColumnName: any,
    allAddMoreTabularData: any,
    tabularAddMoreTypeId: any = 0,
    ctrlCCStaticValue: any = '',
    ctrlTabularFileForApproval: any = '',
    ctrlTabularAddMoreFileType: any = ''
  ) {
    if (
      allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId] ==
      undefined
    ) {
      return '';
    } else if (tabularAddMoreTypeId == 5) {
      // For Checkbox
      return this.setDynRadioBtn(
        allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][
        addMoreTabularId
        ]['addMoreDataValue'][addMoreTavularColumnName],
        ctrlCCStaticValue
      );
    } else if (tabularAddMoreTypeId == 7) {
      // for file upload
      this.showUploadFile(
        allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][
        addMoreTabularId
        ]['addMoreDataValue'][addMoreTavularColumnName],
        ctrlCCStaticValue,
        ctrlTabularFileForApproval,
        ctrlTabularAddMoreFileType
      );
      return '';
    } else if (tabularAddMoreTypeId == 4 && ctrlCCStaticValue == 1) {
      // for ckeditor  here ctrlCCStaticValue status is mantained for ckeditor
      this.setHtmlData(
        allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][
        addMoreTabularId
        ]['addMoreDataValue'][addMoreTavularColumnName],
        ctrlTabularFileForApproval
      );

      // checkAddMoreTabularkeyExists
    } else {
      return this.encDec.decodeHtml(
        allAddMoreTabularData[addMoreTabularKeySlno + addMoreTabularId][
        addMoreTabularId
        ]['addMoreDataValue'][addMoreTavularColumnName]
      );
    }
  }
  fillAddMoreArray(
    addMorectrlId: any,
    addMoreFormConfigData: any,
    addMoreFormResult: any,
    addMorectrlClass: any // when page is loaded this function set's add more array
  ) {
    if (
      addMoreFormResult[addMorectrlId] != undefined &&
      !Object.keys(this.arrAddmoreElemntKeys).includes(addMorectrlId)
    ) {
      let arrAddMoreElementWiseData = [];
      if (addMoreFormResult[addMorectrlId]['addMoreDataValue'] != '') {
        for (let addmoreloop of addMoreFormResult[addMorectrlId][
          'addMoreDataValue'
        ]) {
          let optAddMoreValue = '';
          arrAddMoreElementWiseData = [];
          if (this.processId == 76 && addMorectrlClass=='cls_other_fixed_assets') {
            this.isAddMoreCtrlIds.push(addMorectrlId);
            let amountAddMore = 0; 
            for (let addmoreloop of addMoreFormResult[addMorectrlId]['addMoreDataValue']) {
              if(addmoreloop.vch_asset_value>0){
                const parsedAmount = parseFloat(addmoreloop.vch_asset_value);
                if (!isNaN(parsedAmount)) {
                  amountAddMore += parsedAmount; 
                }
              }
            }
            this.amountAddMoreDet = amountAddMore;
          }
          if (this.processId == 76 && addMorectrlClass=='cls_equ_details') {
            this.isAddMoreCtrlIds.push(addMorectrlId);
            let amountAddMoreOther = 0; 
            for (let addmoreloop of addMoreFormResult[addMorectrlId]['addMoreDataValue']) {
              if(addmoreloop.int_repay_ia>0){
                const parsedAmount = parseFloat(addmoreloop.int_repay_ia);
                if (!isNaN(parsedAmount)) {
                  amountAddMoreOther += parsedAmount; 
                }
              }
            }
            this.amountAddMoreDetOther = amountAddMoreOther;
          }
          if (this.processId == 74 && addMorectrlClass=='cls_equ_details') {
            let amountAddMore = 0; 
            for (let addmoreloop of addMoreFormResult[addMorectrlId]['addMoreDataValue']) {
              if(addmoreloop.vchEquipmentValue>0){
                const parsedAmount = parseFloat(addmoreloop.vchEquipmentValue);
                if (!isNaN(parsedAmount)) {
                  amountAddMore += parsedAmount; 
                }
              }
            }
            this.amountAddMoreDet = amountAddMore;
          }
          if (this.processId == 74 && addMorectrlClass=='cls_other_fixed_assets') {
            this.isAddMoreCtrlIds.push(addMorectrlId);
            let amountAddMoreOther = 0; 
            for (let addmoreloop of addMoreFormResult[addMorectrlId]['addMoreDataValue']) {
              if(addmoreloop.vch_asset_amount>0){
                const parsedAmount = parseFloat(addmoreloop.vch_asset_amount);
                if (!isNaN(parsedAmount)) {
                  amountAddMoreOther += parsedAmount; 
                }
              }
            }
            this.amountAddMoreDetOther = amountAddMoreOther;
          }
          if (
            addmoreloop.jsonOptTxtDetails != '' &&
            addmoreloop.jsonOptTxtDetails != undefined
          ) {
            optAddMoreValue = JSON.parse(addmoreloop.jsonOptTxtDetails);
            //   optVal   =
          }
          for (let addMoreConfigloop of addMoreFormConfigData) {
            //To Format Date for AddMore View only || Arpita | Co-Siba
            let finalrowdate: any;
            if (
              addMoreConfigloop.ctrlTypeId == 2 &&
              addMoreConfigloop.ctrlAttributeType == 'date'
            ) {
              console.log(999);
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
            //End of Format Date for AddMore View only || Arpita |Co-Siba
            let optVal =
              optAddMoreValue[0] != undefined
                ? optAddMoreValue[0][
                addMoreConfigloop['addmoretablecolDetails'][0][
                'ctrlTblColName'
                ]
                ]
                : '';
            arrAddMoreElementWiseData.push({
              ctrlTypeId: addMoreConfigloop.ctrlTypeId,
              ctrlId: addMoreConfigloop.ctrlId,
              ctrlName: addMoreConfigloop.ctrlName,
              lblName: addMoreConfigloop.ctrlLabel,
              ctrlValue:
                addMoreConfigloop.ctrlTypeId != 7
                  ? addmoreloop[
                  addMoreConfigloop['addmoretablecolDetails'][0][
                  'ctrlTblColName'
                  ]
                  ]
                  : '',
              ctrlValueText: optVal,
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
            });
          }
          if (this.arrAddmoreFilledData[addMorectrlId] != undefined) {
            this.arrAddmoreFilledData[addMorectrlId].push(
              arrAddMoreElementWiseData
            );
          } else {
            this.arrAddmoreFilledData[addMorectrlId] = [
              arrAddMoreElementWiseData,
            ];
          }
        }
        // First store using index of add more id  in this.arrAddmoreFilledData and then push it in this.arrAddmoreFilledData
        this.arrAddmoreElemntKeys[addMorectrlId] = Object.keys(
          arrAddMoreElementWiseData
        );
      }
    }
  }

  addMoreValidation(addmoreData: any, addmoreConfiguredData: any) {
    let arrAddMoreValdiator: any[] = [];
    let addmreValidStaus = true;
    for (let addMoreConfiguredValidatorloop of addmoreConfiguredData) {
      let addMoreerrorMsg: any = '';
      if (
        addMoreConfiguredValidatorloop.ctrlMandatory &&
        addmoreData.length == 0
      ) {
        if (
          addMoreConfiguredValidatorloop.ctrlTypeId == 3 ||
          addMoreConfiguredValidatorloop.ctrlTypeId == 5 ||
          addMoreConfiguredValidatorloop.ctrlTypeId == 6
        ) {
          addMoreerrorMsg =
            'Select ' + addMoreConfiguredValidatorloop.ctrlLabel;
        } else {
          addMoreerrorMsg =
            addMoreConfiguredValidatorloop.ctrlLabel + ' can not be left blank';
        }
        Swal.fire({
          icon: 'error',
          text: addMoreerrorMsg,
        });
        addmreValidStaus = false;
        break;
      }
      arrAddMoreValdiator[addMoreConfiguredValidatorloop.ctrlId] = {
        ctrlTypeId: addMoreConfiguredValidatorloop.ctrlTypeId,
        ctrlMandatory: addMoreConfiguredValidatorloop.ctrlMandatory,
        ctrlMaxLength: addMoreConfiguredValidatorloop.ctrlMaxLength,
        ctrlMinLength: addMoreConfiguredValidatorloop.ctrlMinLength,
        ctrlAttributeType: addMoreConfiguredValidatorloop.ctrlAttributeType,
        ctrlLabel: addMoreConfiguredValidatorloop.ctrlLabel,
      };
    }
    if (addmreValidStaus && addmoreData != undefined) {
      for (let addMoreTrDataValidatorloop of addmoreData) {
        //TR
        for (let addMoreTdDataValidatorloop of addMoreTrDataValidatorloop) {
          //TD
          if (addMoreTdDataValidatorloop['ctrlTypeId'] == 2) {
            // Textbox Validation
            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMandatory'
              ]
            ) {
              // For Mandatory
              if (
                !this.vldChkLst.blankCheck(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ] + ' can not be left blank'
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }
            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMaxLength'
              ] != ''
            ) {
              // For Max length
              if (
                !this.vldChkLst.maxLength(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlMaxLength'
                  ],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ]
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }

            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMinLength'
              ] != ''
            ) {
              // For Min length
              if (
                !this.vldChkLst.minLength(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlMinLength'
                  ],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ]
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }

            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlAttributeType'
              ] == 'email'
            ) {
              // For Valid Email
              if (
                !this.vldChkLst.validEmail(
                  addMoreTdDataValidatorloop['ctrlValue']
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            } 
            else if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlAttributeType'
              ] == 'telephoneNo'
            ) {
              // For Valid Mobile
              if (
                !this.vldChkLst.validTel(
                  addMoreTdDataValidatorloop['ctrlValue']
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }else if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlAttributeType'
              ] == 'tel'
            ) {
              // For Valid Mobile
              if (
                !this.vldChkLst.validMob(
                  addMoreTdDataValidatorloop['ctrlValue']
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }else if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlAttributeType'
              ] == 'telephone'
            ) {
              // For Valid Mobile
              if (
                !this.vldChkLst.validMob(
                  addMoreTdDataValidatorloop['ctrlValue']
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            } else if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlAttributeType'
              ] == 'password'
            ) {
              // For password Validation
              if (
                !this.vldChkLst.validPassword(
                  addMoreTdDataValidatorloop['ctrlValue']
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }
          } else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 3) {
            // Dropdown Validation
            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMandatory'
              ]
            ) {
              // For Mandatory
              if (
                !this.vldChkLst.selectDropdown(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ]
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }
          } else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 4) {
            // Text Area and ckeditor Validation
            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMandatory'
              ]
            ) {
              // For Mandatory
              if (
                !this.vldChkLst.blankCheck(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ] + ' can not be left blank'
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }

            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMaxLength'
              ] != ''
            ) {
              // For Max length
              if (
                !this.vldChkLst.maxLength(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlMaxLength'
                  ],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ]
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }

            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMinLength'
              ] != ''
            ) {
              // For Min length
              if (
                !this.vldChkLst.minLength(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlMinLength'
                  ],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ]
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }
          } else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 5) {
            // Checkbox Validation
            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMandatory'
              ]
            ) {
              // For Mandatory
              if (
                !this.vldChkLst.blankCheck(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ] + ' can not be left blank'
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }
          } else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 6) {
            // Radio Validation
            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMandatory'
              ]
            ) {
              // For Mandatory
              if (
                !this.vldChkLst.blankCheck(
                  addMoreTdDataValidatorloop['ctrlValue'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ] + ' can not be left blank'
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }
          } else if (addMoreTdDataValidatorloop['ctrlTypeId'] == 7) {
            // File Validation
            if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlMandatory'
              ]
            ) {
              // For Mandatory
              if (
                !this.vldChkLst.blankCheck(
                  addMoreTdDataValidatorloop['uploadFile']['fileName'],
                  arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                  'ctrlLabel'
                  ] + ' can not be left blank'
                )
              ) {
                addmreValidStaus = false;
                break;
              }
            }
          }
        }
      }
    }
    return addmreValidStaus;
  }

  /**
   * Function Name: open
   * Description: This method is used open bootstarp modal
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 11th Apr 2023
   */
  open(content: any) {
    this.modalService
      .open(content, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }
  /**
   * Function Name: getFinancialDetails
   * Description: This method is used to set financial details fields
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 12th Apr 2023
   * @param intId
   */
  // getFinancialDetails(intId: any) {
  //   let index = this.objFinancialDetails.findIndex((x) => x.intId === intId);
  //   $('.cls_institute_name').val(
  //     this.objFinancialDetails[index].vch_financial_institution_name
  //   );
  //   $('.cls_tl_sanc_amt').val(
  //     this.objFinancialDetails[index].vch_loan_sanctioned_amount
  //   );
  //   $('.cls_tl_date').val(
  //     this.objFinancialDetails[index].vch_loan_sanctioned_date
  //   );
  //   $('.cls_tl_tenure').val(
  //     this.objFinancialDetails[index].vch_tenure_term_loan
  //   );
  //   $('.cls_interest_rate').val(
  //     this.objFinancialDetails[index].dcml_loan_sanctioned_interest_rate
  //   );
  //   this.modalService.dismissAll();
  // }

  /**
   * Function Name: setAutofillUpFields
   * Description: This function is used to set Auto fill up fields data
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 13th Apr 2023
   */
  setAutofillUpFields() {
    let autoFillUpData = JSON.parse(sessionStorage.getItem('companyDetails'));
    if (this.formEditStatus != 1) {
      $('.cls_tot_land_investment').val(autoFillUpData.vch_total_investment_loan);
      $('.cls_total_area').val(autoFillUpData.vch_total_sqmeter);
      $('.cls_stamp_duty_charges').val(autoFillUpData.vch_stamp_duty_charges);
      $('.cls_land_conversion_fee').val(autoFillUpData.vch_land_conversion_fee);
      $('.cls_equity_investment').val(autoFillUpData.vch_equity_investment);
      $('.cls_term_loan_from_bank_institution').val(
        autoFillUpData.vch_term_loan_finalcial_instituton
      );
      $('.cls_expenditure_building_civilwork').val(
        autoFillUpData.vch_building_civilwork
      );
      $('.cls_gstin_regd_number').val(autoFillUpData.vch_gstin_regd_number);
      $('.cls_institute_name').val(autoFillUpData.vch_company_name);
      $('.cls_registration_no').val(autoFillUpData.vch_regd_no);
      $('.cls_registration_date').val(autoFillUpData.registrationDate);
      //code created by sibananda sahu 
      let genericCompNameElement = document.querySelector('.cls_genericCompName');
      if (genericCompNameElement) {
        genericCompNameElement.appendChild(
          document.createTextNode(
            ' ' + '"' + autoFillUpData['0'].vch_company_name + '"'
          )
        );
      }
    }
    const claimedAmountField: any = (<HTMLInputElement>document.getElementsByClassName('cls_fca_d_none')[0]);
    if (claimedAmountField) {
      claimedAmountField.closest('.dynGridCls').classList.add('d-none');
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
    for (let addMoreTrTabularLoop of arrAllAddMoreData['addmorerowdata']) {
      //TR Loop
      let rowDataName = addMoreTrTabularLoop['ctrlRowdataName'];
      addMreTdIndx = 0;
      addMrePushDetails = [];

      for (let addMoreTdTabularLoop of arrAllAddMoreData['addmoreDetails']) {
        // TD Loop
        addMoreTabularElmVal = '';
        addMoreTabularuploadFile = '';
        addMoreTabularelmValText = '';
        addMoreTabularElementCtrlId =
          addMoreTdTabularLoop['ctrlId'] + addMreTrIndx + addMreTdIndx;
        addMreTdIndx += 1;
        if (addMoreTdTabularLoop['ctrlTypeId'] == 1) {
          // For Label
          addMoreTabularElmVal = (<HTMLInputElement>(
            document.getElementById(addMoreTabularElementCtrlId)
          )).innerText;
        } else if (addMoreTdTabularLoop['ctrlTypeId'] == 2) {
          // Textbox Validation
          addMoreTabularElmVal = (<HTMLInputElement>(
            document.getElementById(addMoreTabularElementCtrlId)
          )).value;

          if (addMoreTdTabularLoop['ctrlMandatory']) {
            // For Mandatory
            if (
              !this.vldChkLst.blankCheck(
                addMoreTabularElmVal,
                addMoreTdTabularLoop['ctrlLabel'] +
                ' (' +
                rowDataName +
                ') can not be left blank'
              )
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (
            addMoreTdTabularLoop['ctrlMaxLength'] != '' &&
            Number(addMoreTdTabularLoop['ctrlMaxLength']) > 0
          ) {
            // For Max length
            if (
              !this.vldChkLst.maxLength(
                addMoreTabularElmVal,
                addMoreTdTabularLoop['ctrlMaxLength'],
                addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              )
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (
            addMoreTdTabularLoop['ctrlMinLength'] != '' &&
            Number(addMoreTdTabularLoop['ctrlMinLength']) > 0
          ) {
            // For Min length
            if (
              !this.vldChkLst.minLength(
                addMoreTabularElmVal,
                addMoreTdTabularLoop['ctrlMinLength'],
                addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              )
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (addMoreTdTabularLoop['ctrlAttributeType'] == 'email') {
            // For Valid Email
            if (!this.vldChkLst.validEmail(addMoreTabularElmVal)) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          } else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'telephoneNo') {
            // For Valid telephone no
            if (!this.vldChkLst.validTel(addMoreTabularElmVal)) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'tel') {
            // For Valid Mobile
            if (!this.vldChkLst.validMob(addMoreTabularElmVal)) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'telephone') {
            // For Valid Mobile
            if (!this.vldChkLst.validMob(addMoreTabularElmVal)) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          } else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'password') {
            // For password Validation
            if (!this.vldChkLst.validPassword(addMoreTabularElmVal)) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          } else if (
            addMoreTdTabularLoop['ctrlAttributeType'] == 'date' &&
            addMoreTabularElmVal.length > 0
          ) {
            let elmValDate: any = addMoreTabularElmVal.split('-');
            addMoreTabularElmVal =
              elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];
          }
        } else if (addMoreTdTabularLoop['ctrlTypeId'] == 3) {
          // Dropdown Validation
          let elm: any = <HTMLInputElement>(
            document.getElementById(addMoreTabularElementCtrlId)
          );
          addMoreTabularElmVal = elm.value;
          addMoreTabularelmValText = elm.options[elm.selectedIndex].text;
          if (addMoreTdTabularLoop['ctrlMandatory']) {
            // For Mandatory
            if (
              !this.vldChkLst.selectDropdown(
                addMoreTabularElmVal,
                addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              )
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }
        } else if (addMoreTdTabularLoop['ctrlTypeId'] == 4) {
          // Text Area and ckeditor Validation
          if (addMoreTdTabularLoop['ctrlClass'] == this.ckEdtorCls) {
            addMoreTabularElmVal = (<HTMLInputElement>(
              document.getElementById(addMoreTabularElementCtrlId)
            )).getAttribute('ng-reflect-model');
          } else {
            addMoreTabularElmVal = (<HTMLInputElement>(
              document.getElementById(addMoreTabularElementCtrlId)
            )).value;
          }

          if (addMoreTdTabularLoop['ctrlMandatory']) {
            // For Mandatory
            if (
              !this.vldChkLst.blankCheck(
                addMoreTabularElmVal,
                addMoreTdTabularLoop['ctrlLabel'] +
                ' (' +
                rowDataName +
                ')' +
                ' can not be left blank'
              )
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (
            addMoreTdTabularLoop['ctrlMaxLength'] != '' &&
            Number(addMoreTdTabularLoop['ctrlMaxLength']) > 0
          ) {
            // For Max length
            if (
              !this.vldChkLst.maxLength(
                addMoreTabularElmVal,
                addMoreTdTabularLoop['ctrlMaxLength'],
                addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              )
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }

          if (
            addMoreTdTabularLoop['ctrlMinLength'] != '' &&
            Number(addMoreTdTabularLoop['ctrlMinLength']) > 0
          ) {
            // For Min length
            if (
              !this.vldChkLst.minLength(
                addMoreTabularElmVal,
                addMoreTdTabularLoop['ctrlMinLength'],
                addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              )
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              addmreTabularValidStaus = false;
              break;
            }
          }
        } else if (addMoreTdTabularLoop['ctrlTypeId'] == 5) {
          // Checkbox Validation
          if (addMoreTdTabularLoop['ctrlMandatory']) {
            // For Mandatory
            if (
              !this.vldChkLst.blankCheckRdoDynamic(
                addMoreTabularElementCtrlId,
                addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              )
            ) {
              addmreTabularValidStaus = false;
              break;
            }
          }
          let chkdVal: any = '';
          let chkdTxt: any = '';
          const checkboxes: any = document.getElementsByName(
            addMoreTabularElementCtrlId
          );
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
          addMoreTabularElmVal = chkdVal.toString();
          addMoreTabularelmValText = chkdTxt;
        } else if (addMoreTdTabularLoop['ctrlTypeId'] == 6) {
          // Radio Validation
          if (addMoreTdTabularLoop['ctrlMandatory']) {
            // For Mandatory
            if (
              !this.vldChkLst.blankCheckRdoDynamic(
                addMoreTabularElementCtrlId,
                addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')'
              )
            ) {
              addmreTabularValidStaus = false;
              break;
            }
          }

          const radioBtnElmn = document.getElementsByName(
            addMoreTabularElementCtrlId
          );
          for (let i = 0, length = radioBtnElmn.length; i < length; i++) {
            if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
              addMoreTabularElmVal = (<HTMLInputElement>radioBtnElmn[i]).value;
              let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;
              let el = document.querySelector(`label[for="${rdId}"]`);
              addMoreTabularelmValText = el?.textContent;
            }
          }
        } else if (addMoreTdTabularLoop['ctrlTypeId'] == 7) {
          // File Validation
          addMoreTabularuploadFile =
            this.arrUploadedFiles[addMoreTabularElementCtrlId];
          if (addMoreTdTabularLoop['ctrlMandatory']) {
            // For Mandatory
            if (
              addMoreTabularuploadFile == '' ||
              addMoreTabularuploadFile == undefined ||
              addMoreTabularuploadFile['fileName'] == '' ||
              addMoreTabularuploadFile['fileName'] == undefined
            ) {
              (<HTMLInputElement>(
                document.getElementById(addMoreTabularElementCtrlId)
              )).focus();
              Swal.fire({
                icon: 'error',
                text:
                  'Please upload' +
                  ' ' +
                  addMoreTdTabularLoop['ctrlLabel'] +
                  ' (' +
                  rowDataName +
                  ')',
              });
              addmreTabularValidStaus = false;
              break;
            }
          }
          if (
            addMoreTabularuploadFile == '' ||
            addMoreTabularuploadFile == undefined ||
            addMoreTabularuploadFile['fileName'] == '' ||
            addMoreTabularuploadFile['fileName'] == undefined
          ) {
            addMoreTabularuploadFile = '';
          }
        }

        addMrePushDetails.push({
          ctrlTypeId: addMoreTdTabularLoop['ctrlTypeId'],
          ctrlId: addMoreTdTabularLoop['ctrlId'],
          ctrlName: addMoreTdTabularLoop['ctrlName'],
          lblName: addMoreTdTabularLoop['ctrlLabel'],
          ctrlValue: this.encDec.escapeHtml(addMoreTabularElmVal),
          ctrlText: this.encDec.escapeHtml(addMoreTabularelmValText),
          uploadFile: addMoreTabularuploadFile,
          addMoreslNo: addMoreTrTabularLoop.ctrlRowdataSlNo,
          addMoreTabularCtrlId: addMoreTabularElementCtrlId,
          addMoreTabularCtrlLblName:
            addMoreTdTabularLoop['ctrlLabel'] + ' (' + rowDataName + ')',
        });
      }

      if (!addmreTabularValidStaus) {
        break;
      }
      addMreTrIndx += 1;
      arrAddmoreFilledTabularData.push(addMrePushDetails);
    }

    return {
      validationStatus: addmreTabularValidStaus,
      arrAddmoreFilledTabularData: arrAddmoreFilledTabularData,
    };
  }

  /**
   * Function Name: getOperationLocationDetails
   * Description: This function is used to fetch all operation location from Common Application form and Preview it.
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 21th Jan 2024
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
        if (this.towerDeatilsList.length > 0) {
          this.isTowerAvailable = 1;
        }
        // setTimeout(() => {
        //   console.log(res);
        //   let bindData = '<table class="table table-striped">';
        //   if (Object.keys(res.result).length > 0) {
        //     for (let data of res.result) {
        //       bindData += '<tr>';
        //       bindData += '<td><input class="form-control" id="operation" type="text" value="' + data.vch_operation + '" readonly></td>';
        //       bindData += '<td><input class="form-control" type="text" value="' + data.vch_od_ofc_location + '" readonly></td>';
        //       bindData += '</tr>';
        //     }
        //     bindData += '</table>';
        //     $('.cls_tower_list').after(bindData);
        //     $('#operation').addClass('test_cls');
        //     this.loading = false;
        //   }
        // }, 5000);
      }
      else {
        this.loading = false;
      }
    });
  }


  /**
   * Function Name: getPrevClaimedExpenses
   * Description: This function is used to fetch all previously claimed expenses.
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 11th May 2023
   */
  getPrevClaimedExpenses() {
    this.loading = true;
    let intProdId = sessionStorage.getItem('intProfileId');
    let regParam = {
      intProfileId: intProdId,
    };
    this.IrmsDetailsService.getMarketingPrevClaimedExpenses(regParam).subscribe(
      (res) => {
        if (res.status == 1 && Object.keys(res.result).length > 0) {
          setTimeout(() => {
            let bindData = '<table class="table table-striped">';
            if (Object.keys(res.result).length > 0) {
              for (let data of res.result) {
                bindData += '<tr>';
                bindData +=
                  '<td><input class="form-control" type="text" value="' +
                  data.prevClaimAmount +
                  '" readonly></td>';
                bindData +=
                  '<td><input class="form-control" type="text" value="' +
                  data.prevClaimDate +
                  '" readonly></td>';
                bindData += '</tr>';
              }
              bindData += '</table>';
              $('.cls_marketing_prev_claim_history').after(bindData);
              $('.cls_marketing_prev_claim_amount')
                .parent()
                .parent()
                .parent()
                .parent()
                .find('label')
                .hide();
              $('.cls_marketing_prev_claim_amount').hide();
              $('.cls_marketing_prev_claim_date')
                .parent()
                .parent()
                .parent()
                .parent()
                .find('label')
                .hide();
              $('.cls_marketing_prev_claim_date').hide();
              this.loading = false;
            }
          }, 1000);
        } else {
          this.loading = false;
        }
      }
    );
    this.IrmsDetailsService.getPrevPatentRegdClaimDetails(regParam).subscribe(
      (res) => {
        if (res.status == 1 && Object.keys(res.result).length > 0) {
          setTimeout(() => {
            let bindData = '<table class="table table-striped">';
            if (Object.keys(res.result).length > 0) {
              for (let data of res.result) {
                bindData += '<tr>';
                bindData +=
                  '<td><input class="form-control" type="text" value="' +
                  data.prevClaimAmount +
                  '" readonly></td>';
                bindData +=
                  '<td><input class="form-control" type="text" value="' +
                  data.prevClaimDate +
                  '" readonly></td>';
                bindData += '</tr>';
              }
              bindData += '</table>';
              $('.cls_patent_regd_cost_history').after(bindData);
              $('.cls_patent_regd_cost_claim_amount')
                .parent()
                .parent()
                .parent()
                .parent()
                .find('label')
                .hide();
              $('.cls_patent_regd_cost_claim_amount').hide();
              $('.cls_patent_regd_claim_date')
                .parent()
                .parent()
                .parent()
                .parent()
                .find('label')
                .hide();
              $('.cls_patent_regd_claim_date').hide();
              this.loading = false;
            }
          }, 1000);
        } else {
          this.loading = false;
        }
      }
    );
    this.IrmsDetailsService.getPrevInternetClaimDetails(regParam).subscribe(
      (res) => {
        if (res.status == 1 && Object.keys(res.result).length > 0) {
          setTimeout(() => {
            let bindData = '<table class="table table-striped">';
            if (Object.keys(res.result).length > 0) {
              for (let data of res.result) {
                bindData += '<tr>';
                bindData +=
                  '<td><input class="form-control" type="text" value="' +
                  data.prevClaimAmount +
                  '" readonly></td>';
                bindData +=
                  '<td><input class="form-control" type="text" value="' +
                  data.prevClaimStartDate +
                  '" readonly></td>';
                bindData +=
                  '<td><input class="form-control" type="text" value="' +
                  data.prevClaimEndDate +
                  '" readonly></td>';
                bindData += '</tr>';
              }
              bindData += '</table>';
              $('.cls_internet_connectivity_claim_history').after(bindData);
              $('.cls_internet_connectivity_claim_amount')
                .parent()
                .parent()
                .parent()
                .parent()
                .find('label')
                .hide();
              $('.cls_internet_connectivity_claim_amount').hide();
              $('.cls_internet_connectivity_claim_start_date')
                .parent()
                .parent()
                .parent()
                .parent()
                .find('label')
                .hide();
              $('.cls_internet_connectivity_claim_start_date').hide();
              $('.cls_internet_connectivity_claim_end_date')
                .parent()
                .parent()
                .parent()
                .parent()
                .find('label')
                .hide();
              $('.cls_internet_connectivity_claim_end_date').hide();
              this.loading = false;
            }
          }, 1000);
        } else {
          this.loading = false;
        }
      }
    );
  }
  setStaticDependBindArr(
    casDetails: any,
    parentCtrlId: any // Set the static array if depended Static Details exists
  ) {
    if (!Object.keys(this.arrallStaticDependtDetails).includes(parentCtrlId)) {
      this.arrallStaticDependtDetails[parentCtrlId] = casDetails;
    }
  }

  loadStaticDetails(
    ctrlId: any,
    ctrlTypeId: any // Load The depended Static Details if exist
  ) {
    if (Object.keys(this.arrallStaticDependtDetails).includes(ctrlId)) {
      let parnetStaticValue = '';
      if (ctrlTypeId == 6) {
        const radioBtnElmn = document.getElementsByName(ctrlId);
        for (let i = 0, length = radioBtnElmn.length; i < length; i++) {
          if ((<HTMLInputElement>radioBtnElmn[i]).checked) {
            parnetStaticValue = (<HTMLInputElement>radioBtnElmn[i]).value;
          }
        }
      } else {
        parnetStaticValue = (<HTMLInputElement>document.getElementById(ctrlId))
          .value;
      }

      if (this.arrCascadingBindDependtDetails[ctrlId] != undefined) {
        this.arrCascadingBindDependtDetails[ctrlId].splice(
          0,
          this.arrCascadingBindDependtDetails[ctrlId].length
        );
      }

      for (let staticCasLoop of this.arrallStaticDependtDetails[ctrlId]) {
        if (staticCasLoop['ctrlCCStaticFieldValue'] == parnetStaticValue) {
          if (this.arrCascadingBindDependtDetails[ctrlId] == undefined) {
            this.arrCascadingBindDependtDetails[ctrlId] = [
              {
                ctrlCCStaticName: staticCasLoop['ctrlCCStaticName'],
                ctrlCCStaticValue: staticCasLoop['ctrlCCStaticValue'],
              },
            ];
          } else {
            this.arrCascadingBindDependtDetails[ctrlId].push({
              ctrlCCStaticName: staticCasLoop['ctrlCCStaticName'],
              ctrlCCStaticValue: staticCasLoop['ctrlCCStaticValue'],
            });
          }
        }
      }
    }
  }

  setArrhAllchildOfParent(ids: any) {
    const allParms: any = document.querySelectorAll(
      '[data-dynbinddependctlfldid=' + ids + ']'
    );
    // attr.data-dependctrlId
    let loadDynchldDetls: any = document.querySelectorAll(
      '[data-dependctrlId=' + ids + ']'
    );
    if (loadDynchldDetls.length > 0) {
      this.loadDynBindAllData[ids] = loadDynchldDetls;
    }

    if (allParms.length == 0) {
      return;
    } else {
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
    if (
      this.loadDynBindAllData[parentId] != '' &&
      this.loadDynBindAllData[parentId] != undefined &&
      this.loadDynBindAllData[parentId].length > 0
    ) {
      this.hideAllDependTData(this.loadDynBindAllData[parentId]);
    }
    for (let allChilds of this.parentDetVal) {
      let childEle: any = document.getElementById(allChilds);
      if (childEle) {
        let tpId = childEle.getAttribute('data-typeid');

        if (tpId == 2 && this.loadDyndata == 1) {
          (<HTMLInputElement>document.getElementById(childEle.id)).value = '';
        } else if (tpId == 3 && this.loadDyndata == 1) {
          this.arralldynVal[childEle.id] = [];

          // (<HTMLInputElement>document.getElementById(childEle.id))
          (<HTMLInputElement>document.getElementById(childEle.id)).value = '0';
        } else if (tpId == 4 && this.loadDyndata == 1) {
          let elmle: any = <HTMLInputElement>(
            document.getElementById(childEle.id)
          );
          if (elmle.selectedIndex != undefined) {
            elmle.options[elmle.selectedIndex].text = '';
          }
        } else if ((tpId == 5 || tpId == 6) && this.loadDyndata == 1) {
          let chckboxClear: any = document.getElementsByName(childEle.name);
          for (let dynrdobndtype of chckboxClear) {
            if (dynrdobndtype.checked) {
              dynrdobndtype.checked = false;
            }
            if (dynrdobndtype.getAttribute('data-dbStatus') == true) {
              dynrdobndtype.checked = true;
              dynrdobndtype.setAttribute('data-dbStatus', false);
            }
          }
        } else if (this.loadDyndata == 1) {
          (<HTMLInputElement>document.getElementById(childEle.id)).value = '';
          document
            .getElementById('fileDownloadDiv_' + childEle.id)
            ?.querySelector('.downloadbtn')
            ?.setAttribute('href', '');
          document
            .getElementById('fileDownloadDiv_' + childEle.id)
            ?.classList.add('d-none');
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
        allChildsa.closest('.dynGridCls').classList.add('d-none');
        if (tpId != 8) {
          allChildsa
            .closest('.dynGridCls')
            .querySelector('.dynlabel')
            .classList.add('d-none');
        }
        allChildsa.classList.add('d-none');
      }
    }
  }
  // Added by Rohit for column wise add more on 31-10-23
  fillAddMoreColumnArray(
    addMorectrlId: any,
    addMoreFormConfigData: any,
    addMoreValueDetails: any // when page is loaded this function set's add more array
  ) {
    if (
      (typeof this.arrAddMoreColumnData[addMorectrlId] == 'undefined' ||
        typeof this.arrAddMoreColumnData[addMorectrlId] == undefined) &&
      addMoreValueDetails[addMorectrlId]! == undefined
    ) {
      this.arrAddMoreColumnData[addMorectrlId] = [{}];
    } else if (
      !Object.keys(this.arrAddmoreElemntColumnKeys).includes(addMorectrlId) &&
      addMoreValueDetails[addMorectrlId] != undefined
    ) {
      let arrAddMoreElementWiseData: any = [];
      let addMoreIndx: any = 0;
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
              addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']
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
              addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']
              ]
            ) == environment.defaultDate
          ) {
            rowaddmorevalue = '';
          } else {
            rowaddmorevalue = this.encDec.escapeHtml(
              addmoreloop[
              addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']
              ]
            );
          }

          arrAddMoreElementWiseData[addMoreConfigloop.ctrlId] = {
            ctrlTypeId: addMoreConfigloop.ctrlTypeId,
            ctrlId: addMoreConfigloop.ctrlId + addMoreIndx,
            ctrlName: addMoreConfigloop.ctrlName,
            lblName: addMoreConfigloop.ctrlLabel,
            // 'ctrlValue' : (addMoreConfigloop.ctrlTypeId!=7) ? this.encDec.escapeHtml(addmoreloop[addMoreConfigloop['addmoretablecolDetails'][0]['ctrlTblColName']]) : '',
            ctrlValue: addMoreConfigloop.ctrlTypeId != 7 ? rowaddmorevalue : '',

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
      this.arrAddmoreElemntColumnKeys[addMorectrlId] = Object.keys(
        arrAddMoreElementWiseData
      );
    }
  }

  deleteAddMoreColumnWiseDetails(ctrlId: any, addMoreColumnCtr: any) {
    this.arrAddMoreColumnData[ctrlId].splice(addMoreColumnCtr, 1);
    setTimeout(() => {
      this.calculateColumnWiseAddMore(ctrlId);
    }, 10);
  }

  saveaddMoreColumnData(ctrlId: any, indx: any) {
    let currFocObj: any = this;
    let validatonStatus: any = true;
    let addMoreColumnDataPush: any = [];
    $('.addMoreColumn' + ctrlId).each(function (indx: any) {
      let validateArray: any = [];
      let arrAddMoreElementWiseData: any = [];
      for (let addMoreColumnDetails of currFocObj.arrAddmoreDetails[ctrlId]) {
        let ctrlTypeId = addMoreColumnDetails.ctrlTypeId;
        let elmVal: any = '';
        let elmValText: any = '';
        let elmId = addMoreColumnDetails.ctrlId + indx;
        let elmName = addMoreColumnDetails.ctrlName;
        let lblName = addMoreColumnDetails.ctrlLabel;
        let mandatoryDetails = addMoreColumnDetails.ctrlMandatory;
        let attrType = addMoreColumnDetails.ctrlAttributeType;
        let ctrlMaxLength = addMoreColumnDetails.ctrlMaxLength;
        let ctrlMinLength = addMoreColumnDetails.ctrlMinLength;
        let elmClass = addMoreColumnDetails.ctrlClass;
        let uploadFile = '';
        let bndDataType =
          addMoreColumnDetails.addmorecascadingCtrlDetails[0]
            .ctrlCCbindDatatype;
        let bndDataTypeDpndOther =
          addMoreColumnDetails.addmorecascadingCtrlDetails[0]
            .AMctrlCCbinddepentOther;
        let rowaddmoredate: any = '';
        // console.log(addMoreColumnDetails);
        if (ctrlTypeId == 1) {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).innerText;
          //    console.log(elmVal);
        } else if (ctrlTypeId == 2) {
          // For Textbox
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

          if (mandatoryDetails) {
            // For Mandatory
            if (
              !currFocObj.vldChkLst.blankCheck(
                elmVal,
                lblName + ' can not be left blank',
                elmId
              )
            ) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }

          if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
            // For Max length
            if (
              !currFocObj.vldChkLst.maxLength(
                elmVal,
                ctrlMaxLength,
                lblName,
                elmId
              )
            ) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }

          if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
            // For Min length
            if (
              !currFocObj.vldChkLst.minLength(
                elmVal,
                ctrlMinLength,
                lblName,
                elmId
              )
            ) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }

          if (attrType == 'email') {
            // For Valid Email
            if (!currFocObj.vldChkLst.validEmail(elmVal, elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          } else if (attrType == 'telephone') {
            // For Valid Mobile
            if (!currFocObj.vldChkLst.validMob(elmVal, elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
          else if (attrType == 'tel') {
            // For Valid Mobile
            if (!currFocObj.vldChkLst.validMob(elmVal, elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          } else if (attrType == 'telephoneNo') {
            // For Valid telephone no
            if (!currFocObj.vldChkLst.validTel(elmVal, elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          } else if (attrType == 'password') {
            // For password Validation
            if (!currFocObj.vldChkLst.validPassword(elmVal, elmId)) {
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
        } else if (ctrlTypeId == 3) {
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
            if (!currFocObj.vldChkLst.selectDropdown(elmVal, lblName, elmId)) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
        } else if (ctrlTypeId == 4) {
          // For TextArea
          if (elmClass == currFocObj.ckEdtorCls) {
            elmVal = (<HTMLInputElement>(
              document.getElementById(elmId)
            )).querySelector('.angular-editor-textarea')?.innerHTML;
          } else {
            elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
          }

          if (mandatoryDetails) {
            // For Mandatory
            if (
              !currFocObj.vldChkLst.blankCheck(
                elmVal,
                lblName + ' can not be left blank',
                elmId
              )
            ) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
          if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
            // For Max length
            if (
              !currFocObj.vldChkLst.maxLength(
                elmVal,
                ctrlMaxLength,
                lblName,
                elmId
              )
            ) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }

          if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
            // For Min length
            if (
              !currFocObj.vldChkLst.minLength(
                elmVal,
                ctrlMinLength,
                lblName,
                elmId
              )
            ) {
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
        } else if (ctrlTypeId == 5) {
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
        } else if (ctrlTypeId == 7) {
          uploadFile = currFocObj.arrUploadedFiles[elmId];

          if (mandatoryDetails) {
            // For Mandatory
            if (uploadFile == '' || uploadFile == undefined) {
              Swal.fire({
                icon: 'error',
                text: 'Please upload ' + lblName,
              });

              validatonStatus = false;
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
      if (validatonStatus) {
        addMoreColumnDataPush.push(arrAddMoreElementWiseData);
      } else {
        return validatonStatus;
      }
    });
    if (validatonStatus) {
      this.arrAddmoreFilledData[ctrlId] = addMoreColumnDataPush;
    }
    return validatonStatus;
  }

  setTotCalculationForTablularAddMore(addMoreId: any, formctrls: any) {
    if (this.arrTabularAddMoreTotData[addMoreId] == undefined) {
      for (let loopArrTabularAddMOre of this.arrAddmoreDetails[addMoreId]) {
        if (
          loopArrTabularAddMOre.ctrlTypeId == 2 &&
          loopArrTabularAddMOre.totalCalcAddMore == true
        ) {
          setTimeout(() => {
            $('.' + loopArrTabularAddMOre.ctrlName).on('blur', function () {
              let totalCalCulation: number = 0;
              $('.' + loopArrTabularAddMOre.ctrlName).each(function () {
                let enteredAddMoreTabularValue: any = $(this).val();
                if (
                  enteredAddMoreTabularValue.length > 0 &&
                  enteredAddMoreTabularValue != ''
                ) {
                  totalCalCulation += Number(enteredAddMoreTabularValue);
                }
              });
              $('#tot_' + loopArrTabularAddMOre.ctrlId).val(totalCalCulation);
            });
            if (this.onlineServiceId > 0) {
              $('.' + loopArrTabularAddMOre.ctrlName).blur();
            }
          }, 50);
          this.arrTabularAddMoreTotData[addMoreId] =
            this.arrAddmoreDetails[addMoreId];
        }
      }
    }
  }
  setTotCalculationForColumnAddMore(addMoreId: any, hitFuncType: any = 0) {
    if (hitFuncType == 0) {
      // when Form is loaded then it hitFunction type is 0
      if (this.arrColumnAddMoreTotData[addMoreId] == undefined) {
        setTimeout(() => {
          for (let loopArrColumnAddMOre of this.arrAddmoreDetails[addMoreId]) {
            if (
              loopArrColumnAddMOre.ctrlTypeId == 2 &&
              loopArrColumnAddMOre.totalCalcAddMore == true
            ) {
              $('.' + loopArrColumnAddMOre.ctrlName).on('blur', function () {
                let totalCalCulationColumnWise: number = 0;
                $('.' + loopArrColumnAddMOre.ctrlName).each(function () {
                  let enteredAddMoreTabularValue: any = $(this).val();
                  if (
                    enteredAddMoreTabularValue.length > 0 &&
                    enteredAddMoreTabularValue != ''
                  ) {
                    totalCalCulationColumnWise += Number(
                      enteredAddMoreTabularValue
                    );
                  }
                });
                $('#tot_' + loopArrColumnAddMOre.ctrlName).val(
                  totalCalCulationColumnWise
                );
              });
              this.arrColumnAddMoreTotData[addMoreId] =
                this.arrAddmoreDetails[addMoreId];
            }
          }
          this.calculateColumnWiseAddMore(addMoreId);
        }, 50);
      }
    } // when add More  is clicked else part will be excuted
    else {
      for (let loopArrColumnAddMOre of this.arrAddmoreDetails[addMoreId]) {
        if (
          loopArrColumnAddMOre.ctrlTypeId == 2 &&
          loopArrColumnAddMOre.totalCalcAddMore == true
        ) {
          $('.' + loopArrColumnAddMOre.ctrlName).on('blur', function () {
            let totalCalCulationColumnWise: number = 0;
            $('.' + loopArrColumnAddMOre.ctrlName).each(function () {
              let enteredAddMoreTabularValue: any = $(this).val();
              if (
                enteredAddMoreTabularValue.length > 0 &&
                enteredAddMoreTabularValue != ''
              ) {
                totalCalCulationColumnWise += Number(
                  enteredAddMoreTabularValue
                );
              }
            });
            $('#tot_' + loopArrColumnAddMOre.ctrlName).val(
              totalCalCulationColumnWise
            );
          });
          this.arrColumnAddMoreTotData[addMoreId] =
            this.arrAddmoreDetails[addMoreId];
        }
      }
    }
  }
  calculateColumnWiseAddMore(addMoreId: any) {
    for (let loopArrColumnAddMOre of this.arrAddmoreDetails[addMoreId]) {
      if (
        loopArrColumnAddMOre.ctrlTypeId == 2 &&
        loopArrColumnAddMOre.totalCalcAddMore == true
      ) {
        let totalCalCulationColumnWise: number = 0;
        $('.' + loopArrColumnAddMOre.ctrlName).each(function () {
          let enteredAddMoreTabularValue: any = $(this).val();
          if (
            enteredAddMoreTabularValue.length > 0 &&
            enteredAddMoreTabularValue != ''
          ) {
            totalCalCulationColumnWise += Number(enteredAddMoreTabularValue);
          }
        });
        $('#tot_' + loopArrColumnAddMOre.ctrlName).val(
          totalCalCulationColumnWise
        );
      }
    }
  }
  totalTabularEditForm(addMoreId: any) {
    for (let loopArrTabularAddMOre of this.arrAddmoreDetails[addMoreId]) {
      if (
        loopArrTabularAddMOre.ctrlTypeId == 2 &&
        loopArrTabularAddMOre.totalCalcAddMore == true
      ) {
        let totalCalCulation: number = 0;
        $('.' + loopArrTabularAddMOre.ctrlName).each(function () {
          let enteredAddMoreTabularValue: any = $(this).val();
          if (
            enteredAddMoreTabularValue.length > 0 &&
            enteredAddMoreTabularValue != ''
          ) {
            totalCalCulation += Number(enteredAddMoreTabularValue);
          }
        });
        $('#tot_' + loopArrTabularAddMOre.ctrlId).val(totalCalCulation);

        this.arrTabularAddMoreTotData[addMoreId] =
          this.arrAddmoreDetails[addMoreId];
      }
    }
  }

  storeAddMoreMergeDetails(formctrls: any, addMoreId: any) {
    this.addMoreMergedColumns[addMoreId] = [];
    this.addMoreAllMergedColumns[addMoreId] = [];
    if (
      formctrls.addmoreMergeColumnDetails != undefined &&
      formctrls.addmoreMergeColumnDetails.length > 0
    ) {
      let ctr = 0;

      let ctrlLoopId: any = 0;
      let ctrlLoopCtr: any = 0;
      for (let addmoreDetails of formctrls.addmoreDetails) {
        this.addMoreAllMergedColumns[addMoreId].push(addmoreDetails.ctrlId);

        if (ctrlLoopCtr == ctrlLoopId) {
          ctrlLoopId = 0;
        }
        if (ctrlLoopId > 0) {
          this.addMoreAllMergedColumns[addMoreId].pop(addmoreDetails.ctrlId);
          ctrlLoopCtr++;
          continue;
        } else {
          ctrlLoopId = 0;
          ctrlLoopCtr = 0;

          let colspanFlag = 0;
          this.addMoreMergedColumns[addMoreId][ctr] = {
            label: addmoreDetails.ctrlLabel,
            colSpan: 1,
          };
          let addMoreColumns = addmoreDetails.ctrlId;
          for (let mergedCols of formctrls.addmoreMergeColumnDetails) {
            if (mergedCols.initalControlId == addMoreColumns) {
              this.addMoreAllMergedColumns[addMoreId].pop(
                addmoreDetails.ctrlId
              );
              this.addMoreMergedColumns[addMoreId][ctr] = {
                label: mergedCols.mergeCtrlLabel,
                colSpan: mergedCols.noOfColumnsMerged,
              };
              colspanFlag = 1;
              ctrlLoopId = mergedCols.noOfColumnsMerged;
            }
          }

          ctr++;
        }
        ctrlLoopCtr++;
      }
    }
  }
  addMoreColumnData(ctrlId: any, indx: any) {
    let currFocObj: any = this;
    let validatonStatus: any = true;
    let arrAddMoreDynamicElements: any = [];
    let validateArray: any = [];
    let arrAddMoreElementWiseData: any = [];
    for (let addMoreColumnDetails of currFocObj.arrAddmoreDetails[ctrlId]) {
      let ctrlTypeId = addMoreColumnDetails.ctrlTypeId;
      let elmVal: any = '';
      let elmValText: any = '';
      let elmId = addMoreColumnDetails.ctrlId + indx;
      let elmName = addMoreColumnDetails.ctrlName;
      let lblName = addMoreColumnDetails.ctrlLabel;
      let mandatoryDetails = addMoreColumnDetails.ctrlMandatory;
      let attrType = addMoreColumnDetails.ctrlAttributeType;
      let ctrlMaxLength = addMoreColumnDetails.ctrlMaxLength;
      let ctrlMinLength = addMoreColumnDetails.ctrlMinLength;
      let elmClass = addMoreColumnDetails.ctrlClass;
      let uploadFile = '';
      let rowaddmoredate: any = '';
      // console.log(addMoreColumnDetails);
      if (ctrlTypeId == 1) {
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).innerText;
        //    console.log(elmVal);
      } else if (ctrlTypeId == 2) {
        // For Textbox
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

        if (mandatoryDetails) {
          // For Mandatory
          if (
            !currFocObj.vldChkLst.blankCheck(
              elmVal,
              lblName + ' can not be left blank',
              elmId
            )
          ) {
            // (<HTMLInputElement>document.getElementById(elmId)).focus();

            validatonStatus = false;
            break;
          }
        }

        if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
          // For Max length
          if (
            !currFocObj.vldChkLst.maxLength(
              elmVal,
              ctrlMaxLength,
              lblName,
              elmId
            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
          // For Min length
          if (
            !currFocObj.vldChkLst.minLength(
              elmVal,
              ctrlMinLength,
              lblName,
              elmId
            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (attrType == 'email') {
          // For Valid Email
          if (!currFocObj.vldChkLst.validEmail(elmVal, elmId)) {
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
        } else if (attrType == 'telephoneNo') {
          // For Valid telephone no
          if (!currFocObj.vldChkLst.validTel(elmVal,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }else if (attrType == 'telephone') {
          // For Valid Mobile
          if (!currFocObj.vldChkLst.validMob(elmVal, elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } else if (attrType == 'password') {
          // For password Validation
          if (!currFocObj.vldChkLst.validPassword(elmVal, elmId)) {
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
      } else if (ctrlTypeId == 3) {
        // For DropDown
        let elm: any = <HTMLInputElement>document.getElementById(elmId);
        let addMoredynbindflag: string = elm.getAttribute('data-dynbindflag');
        let addMoredynbinddependflag: string = elm.getAttribute(
          'data-dynbinddependflag'
        );
        if (
          addMoredynbindflag == 'true' &&
          addMoredynbinddependflag == 'false'
        ) {
          arrAddMoreDynamicElements.push({
            ctrlId: elmId,
            addMoreCtrlId: addMoreColumnDetails.ctrlId,
          });
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
          if (!currFocObj.vldChkLst.selectDropdown(elmVal, lblName, elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 4) {
        // For TextArea
        if (elmClass == currFocObj.ckEdtorCls) {
          elmVal = (<HTMLInputElement>(
            document.getElementById(elmId)
          )).querySelector('.angular-editor-textarea')?.innerHTML;
        } else {
          elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
        }

        if (mandatoryDetails) {
          // For Mandatory
          if (
            !currFocObj.vldChkLst.blankCheck(
              elmVal,
              lblName + ' can not be left blank',
              elmId
            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
        if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
          // For Max length
          if (
            !currFocObj.vldChkLst.maxLength(
              elmVal,
              ctrlMaxLength,
              lblName,
              elmId
            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
          // For Min length
          if (
            !currFocObj.vldChkLst.minLength(
              elmVal,
              ctrlMinLength,
              lblName,
              elmId
            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 5) {
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
      } else if (ctrlTypeId == 7) {
        uploadFile = currFocObj.arrUploadedFiles[elmId];
        //  this.removeFile(elmId);fileDownloadDiv_
        if (mandatoryDetails) {
          // For Mandatory
          if (uploadFile == '' || uploadFile == undefined) {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName,
            });

            validatonStatus = false;
            break;
          }
        }
      }
      // }

      validateArray[elmId] = {
        ctrlValue: elmVal,
        ctrlTypeId: ctrlTypeId,
      };
      arrAddMoreElementWiseData[addMoreColumnDetails.ctrlId] = {
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
      };
    }
    if (validatonStatus) {
      currFocObj.arrAddMoreColumnData[ctrlId].splice(
        indx,
        0,
        arrAddMoreElementWiseData
      );
      currFocObj.arrAddMoreColumnData[ctrlId][indx + 1] = [];
      setTimeout(function () {
        $('.' + ctrlId + (indx + 1))
          .find('input:checkbox')
          .prop('checked', false);
        $('.' + ctrlId + (indx + 1))
          .find('input[type=text],input[type=file],TEXTAREA')
          .val('');
        $('.' + ctrlId + (indx + 1))
          .find('SELECT')
          .val('0');
        $('.' + ctrlId + (indx + 1))
          .find('.fileDownloadDiv')
          .addClass('d-none');
        currFocObj.setTotCalculationForColumnAddMore(ctrlId, 1);
      }, 10);

      if (arrAddMoreDynamicElements.length > 0) {
        for (let loopOfDynamicElements of arrAddMoreDynamicElements) {
          this.arralldynVal[loopOfDynamicElements.addMoreCtrlId + (indx + 1)] =
            this.arralldynVal[loopOfDynamicElements.ctrlId];
        }
      }
    }
  }
  // End of column wise add more on 31-10-23

  /**
   * Function Name: addMoreCalculation
   * Description: It calculate the add more field given field value
   * Created By: Bibhuti Bhusan Sahoo
   * Created Date: 31 Oct 2023
   */
  addMoreCalculation(data, ctrlId, formName) {
    let totalAmount = 0;
    data[ctrlId].forEach((element) => {
      if (element[1].ctrlValue != '') {
        totalAmount += parseInt(element[1].ctrlValue);
      }
    });

    if (this.processId == 74) {
      this.equipmentTotalValue = totalAmount;
      this.calculateTotalValue();
    }
  }

  /**
   * Function Name: addMoreCalculation for double table in single form
   * Description: It calculate the add more field given field value
   * Created By: Sibananda sahu
   * Created Date: 08 jan 2024
   */
  addMoreCalculation2(data, ctrlId, formName) {
    let totalAmount = 0;
    data[ctrlId].forEach((element) => {
      if (element[1].ctrlValue != '') {
        totalAmount += parseInt(element[1].ctrlValue);
      }
    });
    if (this.processId == 76) {
      this.fixedAssetsTotalValue = totalAmount;
      this.calculateTotalCapital();
    }else if (this.processId == 74) {
      this.fixedAssetsTotalValue = totalAmount;
      this.calculateTotalValue();
    }
  }

  interestSubsidyAddMoreCalculation(data, ctrlId, formName) {
    let totalAmount = 0;
    data[ctrlId].forEach((element) => {
      // console.log(element);
      if (element[8].ctrlValue != '') {
        totalAmount += parseInt(element[8].ctrlValue);
      }
    });
    if (this.processId == 76) {
      this.totalRepaymentValueInterestSubsidy = totalAmount;
      this.calculateTotalRepayementWithClaimAmount();
    }
  }


  calculateTotalRepayementWithClaimAmount(){
    let totalRepaymentelement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTotal')[0]);
    let claimPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
    let repaymentElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isTotRepayment')[0]);
    repaymentElement.value = this.totalRepaymentValueInterestSubsidy;
    let totalPreviousAmount = this.totalPreviousAmount || 0;
    let isCappingValueDet = ((10000000 - totalPreviousAmount) <= 10000000) ? 10000000 - totalPreviousAmount : 10000000;
    let claimPeriod = (parseInt(claimPeriodElement.value)>0) ? parseInt(claimPeriodElement.value) : 0;
    this.isCappingValue = isCappingValueDet;
    let repaymentValue = parseFloat(repaymentElement.value); 
    let totalCappingValue = claimPeriod * (repaymentValue * 0.05);
    totalRepaymentelement.value = (totalCappingValue > this.isCappingValue) ? this.isCappingValue : totalCappingValue;
  }

  /**
   * Function Name: calculateTotalValue
   * Description:  To calculate total value (Capital Investment Subsidy)
   * Created By: Sibananda sahu
   * Created Date: 08 jan 2024
   */
  calculateTotalValue() {
    let cappingAmount: number = 200000000;
    let totalAmount =
      parseFloat(this.buildingCivilInvest) +
      parseFloat(this.equipmentTotalValue) +
      parseFloat(this.fixedAssetsTotalValue);
    let totalElgibleInvestment: any = <HTMLInputElement>(
      document.getElementsByClassName('cls_cisTotalCapital')[0]
    );

    //totalElgibleInvestment.value = totalAmount;
    totalElgibleInvestment.value = totalAmount > cappingAmount ? cappingAmount : totalAmount;
  }

  calculateFixedAsset(){
    let totalAmount =
      parseFloat(this.buildingCivilInvest) +
      parseFloat(this.equipmentTotalValue)+
      parseFloat(this.fixedAssetsTotalValue);
    let totalElgibleInvestment: any = <HTMLInputElement>(
      document.getElementsByClassName('cls_cisTotalCapital')[0]
    );
    totalElgibleInvestment.value = totalAmount;
  }

  /**
   * Function Name: getPrevClaimDetails
   * Description: This method is used to set Previous Claim details fields
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 18th Jan 2024
   * @param intId
   */
  getPrevClaimDetails(intId: any) {
    let index = this.previousClaimedSubsidy.findIndex((x) => x.intId === intId);
    if (this.processId == 75) {
      $('.cls_sgstAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_sgstAmount');
      $('.cls_sgstFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_sgstToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    } else if (this.processId == 76) {
      $('.cls_isPreviousClaimAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_isPreviousClaimAmount');
      $('.cls_prev_claim_from').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_prev_claim_to').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    } else if (this.processId == 78) {
      $('.cls_epfEsiAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_epfEsiAmount');
      $('.cls_epfEsiFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_epfEsiToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    } else if (this.processId == 89) {
      $('.cls_qcPrevClaimed').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_qcPrevClaimed');
      $('.cls_claim_date').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      this.modalService.dismissAll();
    }
    this.modalService.dismissAll();
  }

  //modified for edit time overlap :by sibananda
  fillUpMdInfo(mdName: any, mdDesg: any) {
    let mdNameEle: any = (<HTMLInputElement>document.getElementsByClassName(mdName)[0]);
    let mdDesgEle: any = (<HTMLInputElement>document.getElementsByClassName(mdDesg)[0]);
    if (mdNameEle && mdDesgEle) {//add by sibananda
      mdDesgEle.value = 'Managing Director';
      if (mdNameEle.value == '' || mdNameEle.value == undefined || mdNameEle.value == null || mdNameEle.value == 'NULL') {
        mdNameEle.value = this.vchMdName
        setTimeout(() => {
          if (mdDesgEle.value != 'Managing Director') {
            mdDesgEle.value = 3;
          }
        }, 1000);
      }
    }
    this.checkPinCodeValidation();
  }

  /**
   * Function Name: openEquipmentDetails
   * Description: This method is used to open Equipment details modal
   * Created By: Sibananda Sahu
   * Created On: 5th Jan 2024
   */
  openEquipmentDetails() {
    this.open(this.equipmentDetailsModalRef);
  }

  /**
   * Function Name: fillEquipmentDetails
   * Description: This method is used to set Equipment Details
   * Created By: Sibananda Sahu
   * Created On: 08 bJan 2024
   * @param intId
   */
  fillEquipmentDetails(intId: any) {
    let index = this.objequipmentDetails.findIndex((x) => x.intId === intId);
    // console.log(this.objequipmentDetails[index].equipmentName);
    $('.cls_cisEquipmentName').val(
      this.objequipmentDetails[index].equipmentName
    
    );
    this.keyUpEvent('cls_cisEquipmentName');
    $('.cls_cisEquipmentValue').val(
      this.objequipmentDetails[index].equipmentValue
    );
    this.modalService.dismissAll();
  }

  /**
   * Function Name: openFixedAssetDetails
   * Description: This method is used to open Fixed-assets details modal
   * Created By: Sibananda Sahu
   * Created On: 8th Jan 2024
   */
  openFixedAssetDetails() {
    this.open(this.fixedAssetsModalRef);
  }

  /**
   * Function Name: fill Assets Details
   * Description: This method is used to set Assets Details.
   * Created By: Sibananda Sahu
   * Created On: 08 bJan 2024
   * @param intId
   */
  fillAssetsDetails(intId: any) {
    let index = this.objFixedAssets.findIndex((x) => x.intId === intId);
    $('.cls_isAssetName').val(this.objFixedAssets[index].fixedAssetsName);
    this.keyUpEvent('cls_isAssetName');
    $('.cls_cisAssetValue').val(this.objFixedAssets[index].fixedAssetsValue);
    this.modalService.dismissAll();
  }
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



  /**
   * function name: autoCalculation
   * function description: used to calculate and auto fill the form.
   **/
  autoCalculation() {
    let h4Text: any = document.getElementsByTagName('h4')[0].innerText;
    console.log(this.processId);
    switch (this.processId) {
      /* start of Capital Investment Subsidy incentive */
      case 74:
        this.fillUpMdInfo('cls_cisName', 'cls_cisDesg');
        let cisParam = { intRegId: sessionStorage.getItem('REGD_ID') };
        this.IrmsDetailsService.getInvestmentDetails(cisParam).subscribe(
          (res) => {
            if (res.status == 200) {
              let preCalBuildingCivilInvest = res.result.buildingCivilInvest;
              this.objequipmentDetails = res.result.equipmentDetails;
              this.booleanEquipmentStatus =
                res.result.equipmentDetails.length > 0 ? true : false;
              let equipmentNameElement: any = <HTMLInputElement>(
                document.getElementsByClassName('cls_cisEquipmentName')[0]
              );
              let button = document.createElement('button');
              button.textContent = 'Select Details';
              button.classList.add('btn', 'btn-outline-primary', 'mb-2', 'custom-dynamic-button');
              let h6Element = equipmentNameElement?.closest('.h6');
              if( h6Element == null){
              let parentElement = equipmentNameElement.closest('div[id^="ctrl_"]');
              let headingBtnDiv = parentElement.querySelector('.heading-btn');
              h6Element = headingBtnDiv?.querySelector('.h6');
              }
              if (h6Element) {
                  h6Element.insertAdjacentElement('afterend', button);
              }
              button.addEventListener('click', () => {
                this.openEquipmentDetails();
              });

              this.objFixedAssets = res.result.fixedAssets;
              this.booleanFixedAssetStatus =
                res.result.fixedAssets.length > 0 ? true : false;
              let fixedAssetNameElement: any = <HTMLInputElement>(
                document.getElementsByClassName('cls_cisAssetName')[0]
              );
              let button1 = document.createElement('button');
              button1.textContent = 'Select Details';
              button1.classList.add('btn', 'btn-outline-primary', 'mb-2', 'custom-dynamic-button');
              let mainElement = fixedAssetNameElement?.closest('.h6');
              if( mainElement == null){
              let parentElement = fixedAssetNameElement.closest('div[id^="ctrl_"]');
              let headingBtnDiv = parentElement.querySelector('.heading-btn');
              mainElement = headingBtnDiv?.querySelector('.h6');
              }
              if (mainElement) {
                  mainElement.insertAdjacentElement('afterend', button1);
              }
              button1.addEventListener('click', () => {
                this.openFixedAssetDetails();
              });
            } else {
              this.objequipmentDetails = [];
              this.objFixedAssets = [];
            }
          }
        );
        const buildingCivilElement = (<HTMLInputElement>document.getElementsByClassName('cls_cisBuilding')[0]);
        if (buildingCivilElement) {
          buildingCivilElement.addEventListener('input', () => {
            this.buildingCivilInvest = buildingCivilElement.value
            this.calculateTotalValue();
          });
        }
        this.buildingCivilInvest = (buildingCivilElement.value =='') ? 0 : buildingCivilElement.value;
        this.equipmentTotalValue = (this.amountAddMoreDet =='') ? 0 : this.amountAddMoreDet;
        this.fixedAssetsTotalValue = (this.amountAddMoreDetOther =='') ? 0 : this.amountAddMoreDetOther;
        this.calculateTotalValue();

        let totalCapitalInvestementElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_cisTotalCapital')[0]);
        totalCapitalInvestementElement.addEventListener('input', () => {
          let totalCappingAmount: number = 200000000;
          totalCapitalInvestementElement.value = totalCapitalInvestementElement.value > totalCappingAmount ? totalCappingAmount : totalCapitalInvestementElement.value;
        });
        
        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
        break;
      /* end of Capital Investment Subsidy incentive */

      /* start of State GST Reimbursement incentive */
      case 75:
        this.fromToDateValidation();
        this.fromAlphaNumericValidation();
        this.validateDate();
        let sgstParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(sgstParam).subscribe(res => {
          if (res.status == 200) {
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_sgstAmount');
        this.fillUpMdInfo('cls_sgrName', 'cls_sgrDesg');
        let sgstGstinElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstGstRegCrtNo')[0]);
        let sgstAuthorizedPersonDes: any = (<HTMLInputElement>document.getElementsByClassName('cls_des_auth_person')[0]);
        let gstCertificateDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_gst_certificate_date')[0]);
        let claimFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_check_commencement_date')[0]);
        let netSGSTAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgst_amount')[0]);
        let netSubsidyAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_fca')[0]);


        this.loading = true;
        let sgstRegParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(sgstRegParam).subscribe(res => {
          //console.log(res);
          //this.stateGSTcommencementDate = res.result.dateDetails.commencementDate;
          this.loading = false;
          if (res.status == 200) {
            if (res.result.companyDetails) {
              sgstGstinElement.value = res.result.companyDetails.gstNo;
            }
          }
        });
        claimFromDateElement.addEventListener('change', () => {
          const gstCertificateDateValue = moment(gstCertificateDateElement.value, 'YYYY-MM-DD');
          const gstFromClaimDateValue = moment(claimFromDateElement.value, 'YYYY-MM-DD');
          if (gstCertificateDateValue.isSameOrAfter(gstFromClaimDateValue)) {
            Swal.fire({
                icon: 'error',
                text: "Can't Apply, Before GST Registration Certificate Date"
            });  
            claimFromDateElement.value='';
          }
        });
        sgstGstinElement.addEventListener('input', () => {
          sgstGstinElement.value = sgstGstinElement.value.replace(/[^a-zA-Z0-9-]/g, '');
          if(sgstGstinElement.value.length > 15) {
            sgstGstinElement.value = sgstGstinElement.value.slice(0, 15);
          }
        });
        
        netSGSTAmountElement.addEventListener('input', () => {
          let netSgstAmountValue = netSGSTAmountElement.value;
          netSubsidyAmountElement.value = netSgstAmountValue;
        });
       //New functionality add by Bindurekha Nayak date: 15-07-2024
       let sgstFromDate : any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstFromDate')[0]);
       let sgstEndDate : any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstEndDate')[0]);

       sgstEndDate.addEventListener('input', () => {
        let sgstStartValue = sgstFromDate.value;
        let sgstEndValue = sgstEndDate.value;
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
                  sgstFromDate.value = '';
                  sgstEndDate.value = '';
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
                    sgstFromDate.value = '';
                  } 
                }
                }
            });
          }
        
        }  
       });
       
      //End New functionality add by Bindurekha Nayak date: 15-07-2024
      this.fromToDateValidation();
      break;
      /* end of State GST Reimbursement incentive */

      /* start of Interest Subsidy BPO Policy incentive */
      case 76:
        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
        this.calLoader = true;
        this.fillUpMdInfo('cls_isName', 'cls_isDesg');

        let param = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(param).subscribe(res => {
          if (res.status == 200) {
            let totalAmount = 0;
           res.result.forEach(record => {
             totalAmount += parseInt(record.total_int_prev_cia_amt, 10);
           });
           this.previousClaimedSubsidy = res.result;

           this.totalPreviousAmount = totalAmount;
           if(this.totalPreviousAmount>=10000000){
            Swal.fire({
              icon: 'error',
              text: 'You have reached your maximum subsidy claim limit.'
            });
            repaymentDateelement.value = '';
            repaymentToDateelement.value = '';
           }
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_isPreviousClaimAmount');
        let isParam = { intRegId: sessionStorage.getItem('REGD_ID') };
        this.IrmsDetailsService.getInvestmentDetails(isParam).subscribe(
          (res) => {
            if (res.status == 200) {
              this.calLoader = false;
              this.objFixedAssets = res.result.fixedAssets;
              this.booleanFixedAssetStatus = res.result.fixedAssets.length > 0 ? true : false;
              let fixedAssetNameElement: any = <HTMLInputElement>(document.getElementsByClassName('cls_isAssetName')[0]);
              // let button1 = document.createElement('button');
              // button1.textContent = 'Select Details';
              // button1.classList.add('btn', 'btn-outline-primary', 'mb-2', 'custom-dynamic-button');
              // let parentElement = fixedAssetNameElement.closest('div[id^="ctrl_"]');
              // let headingBtnDiv = parentElement.querySelector('.heading-btn');
              // const h6Element = headingBtnDiv?.querySelector('.h6');
              // if (h6Element) {
              //     h6Element.insertAdjacentElement('afterend', button1);
              // } else{
              //   console.log('button cant be added');
              // }
              // button1.addEventListener('click', () => {
              //   this.openFixedAssetDetails();
              // });
            } else {
              this.calLoader = false;
              this.objequipmentDetails = [];
              this.objFixedAssets = [];
            }
          }
        );
        this.isCappingValue = 10000000;
        let buildAmountElement = document.getElementsByClassName('cls_iSBuildCivil')[0] as HTMLInputElement;
        let equipmentAmountElement = document.getElementsByClassName('cls_equipment_operation')[0] as HTMLInputElement;
        let plantAmountElement = document.getElementsByClassName('cls_iSNewEqip')[0] as HTMLInputElement;
        let rebrestmentPlantBuilding = document.getElementsByClassName('cls_Refurbished_p&m')[0] as HTMLInputElement;
        let isRdInputElement = document.getElementsByClassName('cls_r&d')[0] as HTMLInputElement;
        let isUtilitiesElement = document.getElementsByClassName('cls_utilities')[0] as HTMLInputElement;
        let isTransferTechnologyElement = document.getElementsByClassName('cls_transfer_of_technology')[0] as HTMLInputElement;
        let isTotalCapInvestValue : any = document.getElementsByClassName('cls_eligible_cap_investment')[0] as HTMLInputElement;
        this.fixedAssetsTotalValue = (this.amountAddMoreDet =='') ? 0 : this.amountAddMoreDet;
        this.buildingCivilAmount = (buildAmountElement.value =='') ? 0 : buildAmountElement.value;
        this.equipmentAmount = (equipmentAmountElement.value =='') ? 0 : equipmentAmountElement.value;
        this.plantAmount = (plantAmountElement.value =='') ? 0 : plantAmountElement.value;
        this.RefurbishedPlantMechineryAmount=(rebrestmentPlantBuilding.value =='') ? 0 : rebrestmentPlantBuilding.value;
        this.isTotalRdAmount=(isRdInputElement.value =='') ? 0 : isRdInputElement.value; 
        this.isUtilitiesAmount = (isUtilitiesElement.value =='') ? 0 : isUtilitiesElement.value;
        this.isTransferTechnologyAmount = (isTransferTechnologyElement.value =='') ? 0 : isTransferTechnologyElement.value;
        this.calculateTotalCapital();
        buildAmountElement.addEventListener('input', () => {
          this.buildingCivilAmount = parseFloat(buildAmountElement.value);
          this.calculateTotalCapital();
        });
        equipmentAmountElement.addEventListener('input', () => {
          this.equipmentAmount = parseFloat(equipmentAmountElement.value);
          this.calculateTotalCapital();
        });
        plantAmountElement.addEventListener('input', () => {
          this.equipmentAmount = parseFloat(plantAmountElement.value);
          this.calculateTotalCapital();
        });
        rebrestmentPlantBuilding.addEventListener('input', () => {
          this.RefurbishedPlantMechineryAmount = parseFloat(rebrestmentPlantBuilding.value);
          this.calculateTotalCapital();
        });
        isRdInputElement.addEventListener('input', () => {
          this.isTotalRdAmount = parseFloat(isRdInputElement.value);
          this.calculateTotalCapital();
        });
        isUtilitiesElement.addEventListener('input', () => {
          this.isUtilitiesAmount = parseFloat(isUtilitiesElement.value);
          this.calculateTotalCapital();
        });
        isTransferTechnologyElement.addEventListener('input', () => {
          this.isTransferTechnologyAmount = parseFloat(isTransferTechnologyElement.value);
          this.calculateTotalCapital();
        });
        

     
        let repaymentElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isTotRepayment')[0]);
        this.totalRepaymentValueInterestSubsidy = (this.amountAddMoreDetOther =='') ? 0 : this.amountAddMoreDetOther;
        this.calculateTotalRepayementWithClaimAmount();
        let totalRepaymentelement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTotal')[0]);
        let repaymentDateelement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimFrom')[0]);
        let repaymentToDateelement: any = (<HTMLInputElement>document.getElementsByClassName('cls_isPisClaimTo')[0]);
        let amountOfTermLoanSanctionEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_tl_sanc_amt')[0]);
        let termLoanReleasedEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_termLoan')[0]);
        let repaymentPrincipleAmountEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_princ_amount')[0]);
        let tenureTermLoanElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_tl_tenure')[0]);
        let claimPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
        
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

        tenureTermLoanElement.addEventListener('input', () => {
          if(tenureTermLoanElement.value > 60) {
            tenureTermLoanElement.value = '';
            Swal.fire({
              icon: 'error',
              text: "Tenure for Term Loan maximum available for 60 Months"
            });
          }
        });

        // repaymentElement.addEventListener('input', () => {
        //   if(repaymentElement.value > 0){
        //     let repaymentValue = repaymentElement.value;
        //     totalRepaymentelement.value = repaymentValue * 0.05;
        //     totalRepaymentelement.value = (totalRepaymentelement.value > this.isCappingValue) ? this.isCappingValue : totalRepaymentelement.value;
        //   }
        //   else {
        //     Swal.fire({
        //       icon: 'error',
        //       text: 'Total Repayment Amount should be greater than 0'
        //     });
        //     repaymentElement.value = '';
        //   }
        // });

        // totalRepaymentelement.addEventListener('input', () => {
        //   totalRepaymentelement.value = (totalRepaymentelement.value > this.isCappingValue) ? this.isCappingValue : totalRepaymentelement.value;
        // });

         //New code Implemented by Bindurekha Nayak date : 18-07-2024
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
                     repaymentDateelement.value = '';
                     repaymentToDateelement.value = '';
                 } else {
                   repaymentDateelement.value = '';
                   repaymentToDateelement.value = '';
                  
                }
             }
         });
         repaymentDateelement.addEventListener('change', () => {
           let claimPeriod = parseInt(claimPeriodElement.value);
           if(claimPeriod <= 0){
             Swal.fire({
               icon: 'error',
               text: 'Please select Claim period first!'
             })
           }
           let startDate = new Date(repaymentDateelement.value);
           let endDate = new Date(repaymentToDateelement.value);
           if (endDate < startDate) {
             repaymentToDateelement.value = '';
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
                "incStartDate": repaymentDateelement.value,
                "claimLimit": 5,
              };
              this.loading = true;
              this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
                this.loading = false;
                let claimedPeriod = parseInt(res.claimedPeriod);
                let lastIncentiveDate = res.lastIncDate;
                if (res.status == 2) {
                  if (claimedPeriod >= 5) {
                   repaymentToDateelement.value = '';
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
                  repaymentDateelement.value = '';
                } else {
                  let ClaimablePeriod = 5 - claimedPeriod;
                  if (claimPeriod > ClaimablePeriod) {
                    Swal.fire({
                      icon: 'error',
                      text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                    });
                    repaymentDateelement.value = '';
                    repaymentToDateelement.value = '';
                  } else {
                    let fromDate = new Date(repaymentDateelement.value);
                    let toDate = new Date(fromDate);
                    let currentDate = new Date();
                    toDate.setFullYear(fromDate.getFullYear() + claimPeriod);
                    // Validating if toDate is less than or equal to current date
                    if (toDate <= currentDate) {
                      let formattedToDate = toDate.toISOString().slice(0, 10);
                      repaymentToDateelement.value = formattedToDate;
                      repaymentToDateelement.readOnly = true;
                      repaymentToDateelement.dispatchEvent(new Event('change'));
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
        repaymentElement.addEventListener('input', () => {
          repaymentDateelement.value = '';
          repaymentToDateelement.value = '';
          totalRepaymentelement.value = '';
        });
         totalRepaymentelement.addEventListener('keyup', () => {
           let value = parseFloat(totalRepaymentelement.value); // Ensure the value is a number
           if (!isNaN(value)) { // Check if the value is a valid number
               totalRepaymentelement.value = Math.min(value, this.isCappingValue);
           }
         });
         repaymentToDateelement.readOnly = true;
         repaymentToDateelement.addEventListener('change',  () => {
           repaymentToDateelement.readOnly = true;
           let startDate = new Date(repaymentDateelement.value);
           let endDate = new Date(repaymentToDateelement.value);
           if (endDate < startDate) {
             repaymentToDateelement.value = '';
             Swal.fire({
               icon: 'error',
               text: 'End date can not be less than start date'
             });
           }else{
             let policyEndDateCheck = this.eligibilityEndDateCheck('cls_isPisClaimTo');
             if(policyEndDateCheck==0){
               let startDate = new Date(repaymentDateelement.value);
               let endDate = new Date(repaymentToDateelement.value);
               
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
               repaymentToDateelement.value = '';
             }
           }
           let totalPreviousAmount = this.totalPreviousAmount || 0;
           let isCappingValueDet = ((10000000 - totalPreviousAmount) <= 10000000) ? 10000000 - totalPreviousAmount : 10000000;
           let claimPeriod = (parseInt(claimPeriodElement.value)>0) ? parseInt(claimPeriodElement.value) : 0;
           this.isCappingValue = isCappingValueDet;
           let repaymentValue = parseFloat(repaymentElement.value); 
           let totalCappingValue = claimPeriod * (repaymentValue * 0.05);
           totalRepaymentelement.value = (totalCappingValue > this.isCappingValue) ? this.isCappingValue : totalCappingValue;
       });
       //End New code Implemented by Bindurekha Nayak date : 18-07-2024

        break;
      /* end of Interest Subsidy BPO Policy incentive */

      /* start of Reimbursement of Power Tariff incentive Developed By Bindurekha Nayak*/
      case 77:
        this.fillUpMdInfo('cls_rptName', 'cls_rptDesg');
        this.fromAlphaNumericValidation();
        this.validateTelephoneNumber('cls_ptsTeleNo');
        this.validateMobileNumber('cls_ptsMobNo');
        let ptsCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsName')[0]);
        let ptsCompanyUnit: any = (<HTMLInputElement>document.getElementsByClassName('cls_roptBpo_unitType')[0]);
        let ptsCompanyAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsAddress')[0]);
        let ptsContactName: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsContactName')[0]);
        let ptsContactDesg: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsDegn')[0]);
        let ptsContactTel: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsTeleNo')[0]);
        let ptsContactMob: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsMobNo')[0]);
        let ptsContactEmail: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsEmail')[0]);
        let ptsContactAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_contact_address')[0]);
        let ptsTariffClaimed: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsClaimed')[0]);
        let ptsIncentiveClaimed: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsIncentiveClaimed')[0]);
        let ptsFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsFromDate')[0]);
        let ptsToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsToDate')[0]);

        this.loading = true;
        let powerParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(powerParam).subscribe(res => {
          this.loading = false;
          if (res.status == 200) {
            if (res.result.companyDetails) {
              ptsCompanyName.value = res.result.companyDetails.cmpName;
              ptsCompanyAddress.value = res.result.companyDetails.cmpAddress;
              ptsContactAddress.value = res.result.companyDetails.cmpAddress;
            }
            if (res.result.communicationDetails) {
              ptsContactName.value = res.result.communicationDetails.empName;
              ptsContactDesg.value = res.result.communicationDetails.empDegn;
              ptsContactTel.value = res.result.communicationDetails.empTeleNo;
              ptsContactMob.value = res.result.communicationDetails.empMobNo;
              ptsContactEmail.value = res.result.communicationDetails.empEmail;
            }
            if (res.result.unitDetails) {
              ptsCompanyUnit.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : ptsCompanyUnit.value;
            }
          }
        });
        //new development start code added by Bindurekha Nayak date: 16-07-2024
        ptsTariffClaimed.addEventListener('keyup', () => {
          let tariffClaimedValue:any = isNaN(ptsTariffClaimed.value) ? 0 : ptsTariffClaimed.value;
          let totalValue = (.30) * tariffClaimedValue;
          if(this.ptsPrevClaimedAmount>0){
            let restAmount = 3000000 - this.ptsPrevClaimedAmount;
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
          }else if(totalValue > 3000000){
            ptsIncentiveClaimed.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Incentive amount can not be more than 3000000 /- !'
            });
          }else{
            ptsIncentiveClaimed.value = totalValue;
          }
        });
        ptsIncentiveClaimed.addEventListener('keyup', () => {
          let tariffClaimedValue:any = isNaN(ptsTariffClaimed.value) ? 0 : ptsTariffClaimed.value;
          let totalValue = (.30) * tariffClaimedValue;
          if(this.ptsPrevClaimedAmount>0){
            let restAmount = 3000000 - this.ptsPrevClaimedAmount;
            if((totalValue + this.ptsPrevClaimedAmount) > 3000000 ){
              ptsIncentiveClaimed.value = '';
              Swal.fire({
                icon: 'error',
                text: 'Incentive amount cannot be more than ' +restAmount+ '!'
              });
            }else{
              ptsIncentiveClaimed.value = totalValue;
            }
          }else if(totalValue > 3000000){
            ptsIncentiveClaimed.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Incentive amount can not be more than 3000000 /- !'
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
        //new development end code added by Bindurekha Nayak date: 16-07-2024
        //this.fromToDateValidation();
        this.validateDate();
        this.validateNumberWithSpecialCharacter();
        //this.fromToDateValidation();
        break;
      /* end of Reimbursement of Power Tariff incentive */

      /* start of Human Capital Investment Subsidy BPO Policy incentive */
      case 86:
        let totalBreakUpAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalClaimAmount')[0]);
        let totalBreakUp: any       = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalBrkp')[0]);
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
        let finalCappingValue = 1500000;
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
        let netGeneralMale:number = 0;
        let netScMale:number = 0;
        let netStMale:number = 0;
        let netDisabledMale:number = 0;
        let netGeneralFemale:number = 0;
        let netScFemale:number = 0;
        let netStFemale:number = 0;
        let netDisabledFemale:number = 0;
        let netTotalAmount = 0;
        let otherMebCount = 0;
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
            netGeneralEle[calIndex].value = isNaN(domicialGeneralEle[calIndex].value - thisDomicialYearGeneralEle[calIndex].value) ? 0 : domicialGeneralEle[calIndex].value - thisDomicialYearGeneralEle[calIndex].value;
            netScEle[calIndex].value = isNaN(domicialScEle[calIndex].value - thisDomicialYearScEle[calIndex].value) ? 0 : domicialScEle[calIndex].value - thisDomicialYearScEle[calIndex].value;
            netStEle[calIndex].value = isNaN(domicialStEle[calIndex].value - thisDomicialYearStEle[calIndex].value) ? 0 : domicialStEle[calIndex].value - thisDomicialYearStEle[calIndex].value;
            netDisabledEle[calIndex].value = isNaN(domicialDisabledEle[calIndex].value - thisDomicialYearDisabledEle[calIndex].value) ? 0 : domicialDisabledEle[calIndex].value - thisDomicialYearDisabledEle[calIndex].value;
            netGeneralFEle[calIndex].value = isNaN(domicialGeneralFEle[calIndex].value - thisDomicialYearGeneralFEle[calIndex].value) ? 0 : domicialGeneralFEle[calIndex].value - thisDomicialYearGeneralFEle[calIndex].value;
            netScFEle[calIndex].value = isNaN(domicialScFEle[calIndex].value - thisDomicialYearScFEle[calIndex].value) ? 0 : domicialScFEle[calIndex].value - thisDomicialYearScFEle[calIndex].value;
            netStFEle[calIndex].value = isNaN(domicialStFEle[calIndex].value - thisDomicialYearStFEle[calIndex].value) ? 0 : domicialStFEle[calIndex].value - thisDomicialYearStFEle[calIndex].value;
            netDisabledFEle[calIndex].value = isNaN(domicialDisabledFEle[calIndex].value - thisDomicialYearDisabledFEle[calIndex].value) ? 0 : domicialDisabledFEle[calIndex].value - thisDomicialYearDisabledFEle[calIndex].value;
            netTotalEle[calIndex].value = isNaN(domicialTotalEle[calIndex].value - thisDomicialYearTotalEle[calIndex].value) ? 0 : domicialTotalEle[calIndex].value - thisDomicialYearTotalEle[calIndex].value;

            netGeneralMale = (netGeneralEle[calIndex].value > 0) ? netGeneralMale + parseInt(netGeneralEle[calIndex].value) : netGeneralMale + 0;
            netScMale = (netScEle[calIndex].value > 0) ? netScMale + parseInt(netScEle[calIndex].value) : netScMale + 0;
            netStMale = (netStEle[calIndex].value > 0) ? netStMale + parseInt(netStEle[calIndex].value) : netStMale + 0;
            netDisabledMale = (netDisabledEle[calIndex].value > 0) ? netDisabledMale + parseInt(netDisabledEle[calIndex].value) : netDisabledMale + 0;
            netGeneralFemale = (netGeneralFEle[calIndex].value > 0) ? netGeneralFemale + parseInt(netGeneralFEle[calIndex].value) : netGeneralFemale + 0;
            netScFemale = (netScFEle[calIndex].value > 0) ? netScFemale + parseInt(netScFEle[calIndex].value) : netScFemale + 0;
            netStFemale = (netStFEle[calIndex].value > 0) ? netStFemale + parseInt(netStFEle[calIndex].value) : netStFemale + 0;
            netDisabledFemale = (netDisabledFEle[calIndex].value > 0) ? netDisabledFemale + parseInt(netDisabledFEle[calIndex].value) : netDisabledFemale + 0;
            netTotalCount += (netTotalEle[calIndex].value > 0) ? parseInt(netTotalEle[calIndex].value) : 0;
            let employPerMonth = 3000;
            let otherEmpPerMonth = employPerMonth + (employPerMonth * 0.3) ;
             netTotalAmount = (netGeneralMale*employPerMonth)+(netScMale * otherEmpPerMonth)+(netStMale * otherEmpPerMonth)+(netDisabledMale * otherEmpPerMonth)+(netGeneralFemale * employPerMonth)+ (netScFemale * otherEmpPerMonth)+ (netStFemale * otherEmpPerMonth)+ (netDisabledFemale * otherEmpPerMonth);
            totalBreakUpAmount.value = (netTotalAmount > finalCappingValue) ? finalCappingValue : netTotalAmount;
            totalBreakUp.value = netTotalCount;
            calIndex++;
          }
        });
        
        totalBreakUpAmount.addEventListener('keyup', () => {
          let enteredTotalVal = totalBreakUpAmount.value;
          totalBreakUpAmount.value = (enteredTotalVal > finalCappingValue) ? finalCappingValue : netTotalAmount;
        });
        this.addMoreTotal(null);
        this.addMoreTotal2(null);
        this.fillUpMdInfo('cls_hciName', 'cls_hciDesg');
        this.fromAlphaNumericValidation();
        this.fromToDateValidation();
        this.validateDate();
        break;
      /* end of Human Capital Investment Subsidy BPO Policy incentive */

      /* start of EPF and ESI BPO Policy incentive */
      case 78:
        this.fillUpMdInfo('cls_epfEsiName', 'cls_epfesiDesg');
        this.fromAlphaNumericValidation();
        let eeParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(eeParam).subscribe(res => {
          if (res.status == 200) {
            this.previousClaimedSubsidy = res.result;
            //console.log(res.result);
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_epfEsiAmount');
        //this.checkFieldAmount('cls_epfClaimAmount', 'cls_epfEsiClaimAmount');
        this.fromToDateValidation();
        let epfAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfClaimAmount')[0]);
        let epfEsicClaimAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiClaimAmount')[0]);
        epfAmount.addEventListener('input', () =>{
           epfEsicClaimAmount.value =  epfAmount.value;
        });
        epfEsicClaimAmount.addEventListener('input', () => {
          epfEsicClaimAmount.value = '';
          epfEsicClaimAmount.value =  epfAmount.value;
        });
        //epfEsicClaimAmount.value = this.epfClaimAmount;

        let eeToDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiTodate')[0]);
        let eeFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiFromdate')[0]);
        //new functionality added by Bindurekha Nayak date: 16-07-2024
        eeToDateElement.addEventListener('input', () =>{
          let startDate = eeFromDateElement.value;
          let endDate = eeToDateElement.value;
          let fromDate = new Date(startDate);
          let toDate = new Date(endDate);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          if(toDate < fromDate){
            enAuditToDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'To date can not be less than From date'
            });
          }else if(diffYear > 3){
            eeToDateElement.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Can not claim more than 3 Years!'
            });
          }else{
            let param = {
              "fromDate": startDate,
              "toDate": endDate,
              "intId": sessionStorage.getItem('REGD_ID'),
              "yearLimit": 3,
              "onlineProcessId": this.processId,
              "profileId": this.userId
            } 
            this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
              this.loading = false;
              if(res.status == 200){
                if(res.isApplicable==0){
                  eeToDateElement.value = '';
                  eeFromDateElement.value='';
                  Swal.fire({
                    icon: 'error',
                    text: 'You have already applied untill the selected date.Please try with another latest date.'
                  });
                }else if(res.isApplicable==1){
                let yearLimitDet = res.result;
                let appliedYear = parseFloat(yearLimitDet)/12;
                let claimPeriod =3;
                let ClaimablePeriod = claimPeriod - appliedYear;
                 if(diffYear > ClaimablePeriod){
                    Swal.fire({
                      icon: 'error',
                      text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                    });
                    eeToDateElement.value = '';
                  } 
                 }
                }
            });
          }
        });
        
        eeFromDateElement.addEventListener('input', ()=>{
          eeToDateElement.value="";
        });
        //End code new functionality added by Bindurekha Nayak date: 16-07-2024
        this.fromToDateValidation();
        this.validateDate();
        this.validateNumberWithSpecialCharacter();
        break;
      /* end of EPF and ESI BPO Policy incentive */

      /* start of Internet Subsidy incentive */
      case 79:{
        this.fillUpMdInfo('cls_isName', 'cls_isDesg');
        this.fromAlphaNumericValidation();
        let Isiparam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(Isiparam).subscribe(res => {
          if (res.status == 200) {
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_rfinAmount');
        this.fromToDateValidation();
        let iciTotalAmountEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_rfinTotalIntConn')[0]);
        let iciAmountEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_iciExpense')[0]);
        let iciFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_expense_from')[0]);
        let iciToDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_expense_to')[0]);
        let iciSerProName: any = (<HTMLInputElement>document.getElementsByClassName('cls_pro_name')[0]);
        
//New code Implemented by Bindurekha Nayak date : 18-07-2024
        let claimPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimPeriod')[0]);
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
                    iciFromDateElement.value = '';
                    iciToDateElement.value = '';
                } else {
                  iciFromDateElement.value = '';
                  iciToDateElement.value = '';
                
              }
            }
        });
        iciFromDateElement.addEventListener('change', () => {
          let claimPeriod = parseInt(claimPeriodElement.value);
          if(claimPeriod <= 0){
            Swal.fire({
              icon: 'error',
              text: 'Please select Claim period first!'
            })
          }
          let startDate = new Date(iciFromDateElement.value);
          let endDate = new Date(iciToDateElement.value);
          if (endDate < startDate) {
            iciToDateElement.value = '';
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
               "incStartDate": iciFromDateElement.value,
               "claimLimit": 5,
             };
             this.loading = true;
             this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
               this.loading = false;
               let claimedPeriod = parseInt(res.claimedPeriod);
               let lastIncentiveDate = res.lastIncDate;
               if (res.status == 2) {
                 if (claimedPeriod >= 5) {
                  repaymentToDateelement.value = '';
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
                 iciFromDateElement.value = '';
               } else {
                 let ClaimablePeriod = 5 - claimedPeriod;
                 if (claimPeriod > ClaimablePeriod) {
                   Swal.fire({
                     icon: 'error',
                     text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                   });
                   iciFromDateElement.value = '';
                   iciToDateElement.value = '';
                 } else {
                   let fromDate = new Date(iciFromDateElement.value);
                   let toDate = new Date(fromDate);
                   let currentDate = new Date();
                   toDate.setFullYear(fromDate.getFullYear() + claimPeriod);
                   // Validating if toDate is less than or equal to current date
                   if (toDate <= currentDate) {
                     let formattedToDate = toDate.toISOString().slice(0, 10);
                     iciToDateElement.value = formattedToDate;
                     iciToDateElement.readOnly = true;
                     iciToDateElement.dispatchEvent(new Event('change'));
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
        iciToDateElement.readOnly = true;
        iciToDateElement.addEventListener('change',  () => {
          iciToDateElement.readOnly = true;
           let startDate = new Date(iciFromDateElement.value);
           let endDate = new Date(iciToDateElement.value);
           if (endDate < startDate) {
            iciToDateElement.value = '';
             Swal.fire({
               icon: 'error',
               text: 'End date can not be less than start date'
             });
           }else{
             let policyEndDateCheck = this.eligibilityEndDateCheck('cls_expense_to');
             if(policyEndDateCheck==0){
               let startDate = new Date(iciFromDateElement.value);
               let endDate = new Date(iciToDateElement.value);
               
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
               iciToDateElement.value = '';
             }
           }
           let iciAmountVal: any = 0;
           let iciTotalAmountVal: any = 0;
           let iciCappingVal: any = 200000;
           let claimPeriod = (parseInt(claimPeriodElement.value)>0) ? parseInt(claimPeriodElement.value) : 0;
           this.isCappingValue = claimPeriod*iciCappingVal;
          iciAmountVal = String((50 / 100) * iciAmountEle.value);
          iciTotalAmountVal = (iciAmountVal <= this.isCappingValue) ? iciAmountVal : this.isCappingValue;
          iciTotalAmountEle.value = iciTotalAmountVal;
       });
       iciAmountEle.addEventListener('input', () => {
        iciFromDateElement.value = '';
        iciToDateElement.value = '';
        iciTotalAmountEle.value='';
      });
      iciTotalAmountEle.addEventListener('input', () => {
        let iciAmountVal: any = 0;
        let iciTotalAmountVal: any = 0;
        let iciCappingVal: any = 200000;
        let claimPeriod = (parseInt(claimPeriodElement.value)>0) ? parseInt(claimPeriodElement.value) : 0;
        this.isCappingValue = claimPeriod*iciCappingVal;
       iciAmountVal = String((50 / 100) * iciAmountEle.value);
       iciTotalAmountVal = (iciAmountVal <= this.isCappingValue) ? iciAmountVal : this.isCappingValue;
       iciTotalAmountEle.value = iciTotalAmountVal;
      });
       //End New code Implemented by Bindurekha Nayak date : 18-07-2024
        
        
        // create By Manish kumar | date: 01-05-2024
        iciSerProName.addEventListener('input', () => {
          const regex = /^[a-zA-Z0-9]*$/;
          if (!regex.test(iciSerProName.value)) {
            iciSerProName.value = iciSerProName.value.replace(/[^a-zA-Z0-9]/g, '');
          }
        });
        this.validateDate();
      }
        break;
      /* end of Internet Subsidy incentive */

      /* start of Rent of build up space incentive  modified by Bindurekha Nayak date 16-07-2024*/
    case 80:
        
        this.fillUpMdInfo('cls_rbusName', 'cls_rbusDesg');
        this.fromAlphaNumericValidation();
        this.getOperationLocationDetails(sessionStorage.getItem('REGD_ID'));
        let towerElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_tower_list_button')[0]);
        let towerSelectButton = document.createElement('button');
        towerSelectButton.textContent = 'Select Tower';
        towerSelectButton.classList.add('btn', 'btn-outline-primary', 'mb-2', 'custom-dynamic-button');
        let parentOfTowerlist = towerElement;
        parentOfTowerlist.insertAdjacentElement('afterend', towerSelectButton);
        let hrElement = document.createElement('hr');
        towerSelectButton.insertAdjacentElement('afterend', hrElement);
        towerSelectButton.addEventListener('click', () => {
          this.open(this.towerDetailsModalRef);
        });
        let feeLeaseRental: any = (<HTMLInputElement>document.getElementsByClassName('cls_leaseRental')[0]);
        let rembStartDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rembStartDate')[0]);
        let rembEnddate: any = (<HTMLInputElement>document.getElementsByClassName('cls_rembToDate')[0]);
        let leasePayment: any = (<HTMLInputElement>document.getElementsByClassName('cls_monthlyLeasepayment')[0]);
        let totalLeasePayment: any = (<HTMLInputElement>document.getElementsByClassName('cls_totlLeaseRentalSubsidy')[0]);
        let leaseSpace: any = (<HTMLInputElement>document.getElementsByClassName('cls_LeaseSpace')[0]);
        
        totalLeasePayment.addEventListener("input", () => {
          totalLeasePayment.value = totalLeasePayment.value > this.builtSpaceUpCappingVal ? this.builtSpaceUpCappingVal : totalLeasePayment.value;
        });
        leasePayment.addEventListener('change', () => {
          rembStartDate.value = '';
          rembEnddate.value  ='';
          feeLeaseRental.value ='';
          totalLeasePayment.value= '';
          
        });
        rembEnddate.addEventListener('input', () => {
          let leaseSpaceValue = parseFloat(leaseSpace.value);
          let intTotalEmpCount = parseInt(this.intTotalEmpCount);
          let calLeaseSpace =  leaseSpaceValue / intTotalEmpCount;
          if (calLeaseSpace > 40) {
            this.finalLeaseSpace = 40 * this.intTotalEmpCount;
          }
          else {
            this.finalLeaseSpace = leaseSpace.value;
          }
          let fromDate = new Date(rembStartDate.value);
          let toDate = new Date(rembEnddate.value);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          if(diffYear > 5){
            rembEnddate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Can not claim more than 5 Years!'
            });
          }else{
          let param = {
            "fromDate": rembStartDate.value,
            "toDate": rembEnddate.value,
            "intId": sessionStorage.getItem('REGD_ID'),
            "yearLimit": 5,
            "onlineProcessId": this.processId,
            "profileId": this.userId
          } 
          this.IrmsDetailsService.checkPreviousDateCheckDetails(param).subscribe(res => {
            this.loading = false;
            if(res.status == 200){
              this.prevAmount = res.amount;
              if(this.prevAmount>=5000000){
                rembEnddate.value = '';
                rembStartDate.value ='';
                Swal.fire({
                  icon: 'error',
                  text: 'You have reached out your maximum appliying limit !'
                });
              }
              if(res.isApplicable==0){
                rembEnddate.value = '';
                rembStartDate.value ='';
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
                  rembEnddate.value = '';
                } else{
                  if(this.prevAmount>0){
                    this.builtSpaceUpCappingVal = 5000000-this.prevAmount;
                  }else{
                    this.builtSpaceUpCappingVal = 5000000;
                  }
                  this.totalLeaseRental = diffMon * leasePayment.value;
                  feeLeaseRental.value = this.totalLeaseRental;
                  let feePaid = this.totalLeaseRental * 0.75;
                  let leaseFeepaid = this.finalLeaseSpace * 20 * diffMon;
                  let finaValue = (feePaid > leaseFeepaid) ? leaseFeepaid : feePaid;
                  totalLeasePayment.value = (finaValue > this.builtSpaceUpCappingVal) ? this.builtSpaceUpCappingVal : finaValue;
                }
               }
              }
          });
        }
          
        });

        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
        break;
      /* end of Rent of build up space incentive */

      /* start of Marketing Assistance (Unit) BPO Policy incentive */
      case 87:
        this.fillUpMdInfo('cls_maName', 'cls_maDesg');
        let mauParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(mauParam).subscribe(res => {
          if (res.status == 200) {
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 1;
        this.fillUpPrevDetails('cls_prevAmount');
        //calculation of total expenses
        let unitSubsidyCapping = 300000;
        let unitSubsidyCapping2 = 600000;
        let finalsubsidys: any = 0;
        let subsidys: any = 0;
        let expenses: any = document.getElementsByClassName('cls_expenses');
        let totalExpenses: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expenses')[0]);
        let subsidyAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_mauEventClaimAmount')[0]);
        let eventLocation: any = (<HTMLInputElement>document.getElementsByClassName('cls_event_location')[0]).value;
        let eventCheck: any = (<HTMLInputElement>document.getElementsByClassName('cls_event_location')[0]);
        eventCheck.addEventListener('change', () => {
          eventLocation = eventCheck.value;
        })
        for (let button of expenses) {
          button.addEventListener("input", () => {
            let total: any = 0;
            for (let i = 0; i < expenses.length; i++) {
              // if (i == 0) { continue; } 
              let data: any = $(expenses[i]).val();
              if ($.isNumeric(data)) {
                total += parseFloat(data);
              }
            }
            eventLocation = eventCheck.value;
            totalExpenses.value = String(total);
            if (eventLocation == "" || eventLocation == undefined || eventLocation == 0) {
              Swal.fire({
                icon: 'error',
                text: 'Please first select event location'
              });
              expenses.value = '0';
            }
            else {
              if (eventLocation == 1) {
                subsidys = total * 0.50;
                finalsubsidys = (subsidys <= unitSubsidyCapping) ? subsidys : unitSubsidyCapping;
              }
              else if (eventLocation == 2) {
                subsidys = total * 0.50;
                finalsubsidys = (subsidys <= unitSubsidyCapping2) ? subsidys : unitSubsidyCapping2;
              }

            }
            subsidyAmount.value = String(finalsubsidys);
          });
        }

        totalExpenses.addEventListener('input', () => {
          if (eventLocation == "" || eventLocation == undefined || eventLocation == 0) {
            subsidyAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select event location'
            });
          } else {
            let totExpense = totalExpenses.value;
            if (eventLocation == 1) {
              subsidys = totExpense * 0.50;
              finalsubsidys = (subsidys <= unitSubsidyCapping) ? subsidys : unitSubsidyCapping;
            }
            else if (eventLocation == 2) {
              subsidys = totExpense * 0.50;
              finalsubsidys = (subsidys <= unitSubsidyCapping2) ? subsidys : unitSubsidyCapping2;
            }
            subsidyAmount.value = String(finalsubsidys);
          }
        });
        subsidyAmount.addEventListener('input', () => {
          if (eventLocation == "" || eventLocation == undefined || eventLocation == 0) {
            subsidyAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select event location'
            });
          } else {
            if (eventLocation == 1) {
              subsidys = subsidyAmount.value;
              finalsubsidys = (subsidys <= unitSubsidyCapping) ? subsidys : unitSubsidyCapping;
            }
            else if (eventLocation == 2) {
              subsidys = subsidyAmount.value;
              finalsubsidys = (subsidys <= unitSubsidyCapping2) ? subsidys : unitSubsidyCapping2;
            }
            subsidyAmount.value = String(finalsubsidys);
          }
        });      
        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
        break;
      /* end of Marketing Assistance (Unit) BPO Policy incentive */

      /* start of Quality Certification incentive Developed by Bindurekha Nayak*/
      case 89:
        this.fillUpMdInfo('cls_qcName', 'cls_qcDesg');
        let qscfParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(qscfParam).subscribe(res => {
          if (res.status == 200) {
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 1;
        this.fillUpPrevDetails('cls_qcPrevClaimed');
        let subsidyCappingdet: any = 1000000;
        let unitType: any = (<HTMLInputElement>document.getElementsByClassName('cls_unitName')[0]);
        let totalexpenditure: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expenditure')[0]);
        let finalSubsidy: any = (<HTMLInputElement>document.getElementsByClassName('cls_subsidy')[0]);
        let expenditureinputs: any = document.getElementsByClassName('cls_expenditure');
        let presentQualityCertificate : any = (<HTMLInputElement>document.getElementsByClassName('cls_qscfrPrstQuaClaimAmount')[0]);
        let totalAmount: any = 0
        let totalVal: any = 0;
        let subsidyVal: any = 0;
        for (let button of expenditureinputs) {
          button.addEventListener("input", () => {
            totalVal = 0;
            for (let i = 0; i < expenditureinputs.length; i++) {
              let data: any = $($(expenditureinputs[i])).val();
              if ($.isNumeric(data)) {
                totalVal += parseFloat(data);
              }
            }
            totalexpenditure.value = String(totalVal);
            totalAmount = totalexpenditure.value;
            subsidyVal = totalAmount * 0.75;
            subsidyVal = (subsidyVal <= subsidyCappingdet) ? subsidyVal : subsidyCappingdet;
            finalSubsidy.value = String(subsidyVal);
          });
        }
        presentQualityCertificate.addEventListener('input', () => {
          let currentExp = totalexpenditure.value;
          let currClaimAmount = currentExp * 0.75;
          if(presentQualityCertificate.value > subsidyCappingdet) {
            presentQualityCertificate.value = subsidyCappingdet
          }
          else {
            presentQualityCertificate.value = presentQualityCertificate.value;
          }
          if(presentQualityCertificate.value == ''){
            presentQualityCertificate.value = currClaimAmount;
          }
        });
        totalexpenditure.addEventListener('input', () => {
          totalAmount = totalexpenditure.value;
          subsidyVal = totalAmount * 0.75;
          subsidyVal = (subsidyVal <= subsidyCappingdet) ? subsidyVal : subsidyCappingdet;
          finalSubsidy.value = String(subsidyVal);
        });
        this.loading = true;
        let qcCmpParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(qcCmpParam).subscribe(res => {
          this.loading = false;
          if (res.status == 200) {
            if (res.result.unitDetails) {
              unitType.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : unitType.value;
            }
          }
        });
        this.fromAlphaNumericValidation();
        this.validateNumberWithSpecialCharacter();
        break;
      /* end of Quality Certification incentive */

      /* start of BPO Park incentive */
      case 81:
        // let pinCodeInputElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_pin_code')[0]);
        // pinCodeInputElement.addEventListener('input', () => {
        //   if (pinCodeInputElement.value.length > 7) {
        //     pinCodeInputElement.value = pinCodeInputElement.value.slice(0, 6);
        //   }
        // });
        //code added by manish kumar | date of : 23-05-2024
        // let bpiCapitalInvestment = document.getElementsByClassName('cls_capital_investment')[0] as HTMLInputElement;
        // let bpiGstRem = document.getElementsByClassName('cls_gst_reim_claim')[0] as HTMLInputElement;
        // let bpiClaimAmount : any = document.getElementsByClassName('cls_fca')[0] as HTMLInputElement;
        // let cappingAmount : number = 250000000;
        // function calculateBPOParkTotal() {
        //   let CapitalInvestment = parseFloat(bpiCapitalInvestment.value) || 0;
        //   let GstRem = parseFloat(bpiGstRem.value) || 0;
        //   let finalCapitalValue = CapitalInvestment * 0.25;
        //   let totalClaimAmount = finalCapitalValue + GstRem;
        //   if(totalClaimAmount > cappingAmount){
        //     bpiClaimAmount.value = cappingAmount;
        //   }
        //   else {
        //     bpiClaimAmount.value = totalClaimAmount;
        //   }
        // }
        // bpiCapitalInvestment.addEventListener('input', calculateBPOParkTotal);
        // bpiGstRem.addEventListener('input', calculateBPOParkTotal);

        // bpiClaimAmount.addEventListener('input', () => {
        //   if(bpiClaimAmount.value > cappingAmount) {
        //     bpiClaimAmount.value = cappingAmount;
        //   }
        //   else {
        //     bpiClaimAmount.value =  bpiClaimAmount.value
        //   }
        // });

        // calculateBPOParkTotal();
        // end Calculation
        this.fillUpMdInfo('cls_bpoparkName', 'cls_bpoparkDesg');
        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
        this.validateNumberWithSpecialCharacter();
        break;
      /* end of BPO Park incentive */

      /* start of conversion charges incentive */
      case 82:
        this.fillUpMdInfo('cls_ccName', 'cls_ccDesg');
        this.checkFieldAmount('cls_paid_amount', 'cls_subsidy_amount');
        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
        break;
      /* end of conversion charges incentive */

      /* start of electricity duty incentive */
      case 83:
        this.fillUpMdInfo('cls_edName', 'cls_edDesg');
        this.validateTelephoneNumber('cls_eafTeleNo');
        this.validateMobileNumber('cls_eafMobNo');
        let edCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafNameOfCompany')[0]);
        let edCompanyUnit: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafBpo_unitType')[0]);
        let edCompanyAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafAddress')[0]);
        let edContactName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafnameOfPerson')[0]);
        let edContactDesg: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafDegn')[0]);
        let edContactMob: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafMobNo')[0]);
        let edContactTel: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafTeleNo')[0]);
        let edContactEmail: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafEmailId')[0]);
        let edDateOfIncorporation: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafDateOfIncorporation')[0]);
        let edContactAdress: any = (<HTMLInputElement>document.getElementsByClassName('cls_cdcontact_address')[0]);
        let edTotalEnergy: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafTotalAuditFee')[0]);
        let edEnergySubsidy: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafEnergySubsidy')[0]);
        let edStartDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_edStartDate')[0]);
        let elEndDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_elEndDate')[0]);

        this.loading = true;
        let edParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(edParam).subscribe(res => {
          // console.log(res);
          this.loading = false;
          if (res.status == 200) {
            if (res.result.companyDetails) {
              edCompanyName.value = res.result.companyDetails.cmpName;
              edCompanyAddress.value = res.result.companyDetails.cmpAddress;
              edContactAdress.value = res.result.companyDetails.cmpAddress;
            }
            if (res.result.communicationDetails) {
              edContactName.value = res.result.communicationDetails.empName;
              edContactDesg.value = res.result.communicationDetails.empDegn;
              edContactMob.value = res.result.communicationDetails.empMobNo;
              edContactTel.value = res.result.communicationDetails.empTeleNo;
              edContactEmail.value = res.result.communicationDetails.empEmail;
            }
            if (res.result.dateDetails) {
              edDateOfIncorporation.value = res.result.dateDetails.incorporationDate;
            }
            if (res.result.unitDetails) {
              edCompanyUnit.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : edCompanyUnit.value;
            }
          }
        });
       
        this.fromToDateValidation();
        this.validateDate();
        elEndDate.addEventListener('change', () => {
          let res = this.eligibilityDateCheck('cls_edStartDate', 'cls_elEndDate');
          if (res == 1) {
            this.loading = true;
            let param = {
              "fromdate": edStartDate.value,
              "todate": elEndDate.value,
              "intId": sessionStorage.getItem('REGD_ID'),
              "yearLimit": 5,
              "onlineProcessId": this.processId,
              "profileId": this.userId
            }
            this.IrmsDetailsService.yearWithDateEligibility(param).subscribe(res => {
              this.loading = false;
              if (res.status == 0) {
                elEndDate.value = '';
                Swal.fire({
                  icon: 'error',
                  text: res.msg
                });
              }
            });
          }
        });
        this.fromAlphaNumericValidation();
        break;
      /* end of electricity duty incentive */

      /* start of Electricity Inspection Fee incentive */
      case 84:
        let eifStartDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifStartDate')[0]);
        let eifEndDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifEndDate')[0]);
        this.validateTelephoneNumber('cls_eafTeleNo');
        this.validateMobileNumber('cls_eafMobNo');
        // let elfTelInput: any = (<HTMLInputElement>document.getElementsByClassName('cls_eif_tel')[0]);
        // let elfMobInput: any = (<HTMLInputElement>document.getElementsByClassName('cls_eif_mob')[0]);
        let elCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafNameOfCompany')[0]);
        let elCompanyUnit: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafBpo_unitType')[0]);
        let elCompanyAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafAddress')[0]);
        let elContactName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafnameOfPerson')[0]);
        let elContactDesg: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafDegn')[0]);
        let elContactMob: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafMobNo')[0]);
        let elContactTel: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafTeleNo')[0]);
        let elContactEmail: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafEmailId')[0]);
        let elContactAdress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eif_contactAddress')[0]);
        let elDateOfIncorporation: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafDateOfIncorporation')[0]);
        this.loading = true;
        let elParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(elParam).subscribe(res => {
          // console.log(res);
          this.loading = false;
          if (res.status == 200) {
            if (res.result.companyDetails) {
              elCompanyName.value = res.result.companyDetails.cmpName;
              elCompanyAddress.value = res.result.companyDetails.cmpAddress;
              elContactAdress.value = res.result.companyDetails.cmpAddress;
            }
            if (res.result.communicationDetails) {
              elContactName.value = res.result.communicationDetails.empName;
              elContactDesg.value = res.result.communicationDetails.empDegn;
              elContactMob.value = res.result.communicationDetails.empMobNo;
              elContactTel.value = res.result.communicationDetails.empTeleNo;
              elContactEmail.value = res.result.communicationDetails.empEmail;
            }
            if (res.result.dateDetails) {
              elDateOfIncorporation.value = res.result.dateDetails.incorporationDate;
            }
            if (res.result.unitDetails) {
              elCompanyUnit.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : elCompanyUnit.value;
            }
          }
        });
       
        eifEndDate.addEventListener('change', () => {
          let res = this.eligibilityDateCheck('eifStartDate', 'eifEndDate');
          if (res == 1) {
            this.loading = true;
            let param = {
              "fromdate": eifStartDate.value,
              "todate": eifEndDate.value,
              "intId": sessionStorage.getItem('REGD_ID'),
              "yearLimit": 5,
              "onlineProcessId": this.processId,
              "profileId": this.userId
            }
            this.IrmsDetailsService.yearWithDateEligibility(param).subscribe(res => {
              this.loading = false;
              if (res.status == 0) {
                eifEndDate.value = '';
                Swal.fire({
                  icon: 'error',
                  text: res.msg
                });
              }
            });
          }
        });

        this.fromToDateValidation();
        this.validateDate();
        this.fillUpMdInfo('cls_eifName', 'cls_eifDesg');
        this.fromAlphaNumericValidation();
        break;
      /* end of Electricity Inspection Fee incentive */

      /* start of Energy Audit Fee incentive */
      case 85:
        this.fromToDateValidation();
        this.validateDate();
        this.fillUpMdInfo('cls_eafNameofMD', 'cls_eafDegnMD');
        this.validateTelephoneNumber('cls_eafTeleNo');
        this.validateMobileNumber('cls_eafMobNo');
        let eafCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafNameOfCompany')[0]);
        let eafCompanyUnit: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafBpo_unitType')[0]);
        let eafCompanyAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafAddress')[0]);
        let eafContactName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafnameOfPerson')[0]);
        let eafContactDesg: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafDegn')[0]);
        let eafContactMob: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafMobNo')[0]);
        let eafContactTel: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafTeleNo')[0]);
        let eafContactEmail: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafEmailId')[0]);
        let eafDateOfIncorporation: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafDateOfIncorporation')[0]);
        let eafContactAdress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafContactAddress')[0]);
        let eafTotalEnergy: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafTotalAuditFee')[0]);
        let eafEnergySubsidy: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafEnergySubsidy')[0]);
        this.loading = true;
        let cappingValue : number = 200000;
        let eafParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        
       

        this.IrmsDetailsService.getRegCompanyDetails(eafParam).subscribe(res => {
          // console.log(res);
          this.loading = false;
          if (res.status == 200) {
            if (res.result.companyDetails) {
              eafCompanyName.value = res.result.companyDetails.cmpName;
              eafCompanyAddress.value = res.result.companyDetails.cmpAddress;
              eafContactAdress.value = res.result.companyDetails.cmpAddress;
            }
            if (res.result.communicationDetails) {
              eafContactName.value = res.result.communicationDetails.empName;
              eafContactDesg.value = res.result.communicationDetails.empDegn;
              eafContactMob.value = res.result.communicationDetails.empMobNo;
              eafContactTel.value = res.result.communicationDetails.empTeleNo;
              eafContactEmail.value = res.result.communicationDetails.empEmail;
            }
            if (res.result.dateDetails) {
              eafDateOfIncorporation.value = res.result.dateDetails.incorporationDate;
            }
            if (res.result.unitDetails) {
              eafCompanyUnit.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : eafCompanyUnit.value;
            }
          }
        });
        eafTotalEnergy.addEventListener('input', () => {
          let subsidyVal : number = eafTotalEnergy.value * 0.75 ;
          eafEnergySubsidy.value = subsidyVal > cappingValue ? cappingValue : subsidyVal;
        });
        eafEnergySubsidy.addEventListener('input', () => {
          eafEnergySubsidy.value = eafEnergySubsidy.value > cappingValue ? cappingValue : eafEnergySubsidy.value;
        });
        // eafTotalEnergy.addEventListener('input', () => {
        //   let totalEnergyVal = parseFloat(eafTotalEnergy.value);
        //   let energySubsidyVal = (75 / 100) * totalEnergyVal;
        //   if (energySubsidyVal > 200000) {
        //     Swal.fire({
        //       icon: 'error',
        //       text: 'Energy Subsidy Capping value can not be more than 200000 /-'
        //     });
        //   } else {
        //     eafEnergySubsidy.value = energySubsidyVal;
        //   }
        // });
        // eafEnergySubsidy.addEventListener('input', () => {
        //   let energySubsidyValue = parseFloat(eafEnergySubsidy.value);
        //   if (energySubsidyValue > 200000) {
        //     eafEnergySubsidy.value = '';
        //     Swal.fire({
        //       icon: 'error',
        //       text: 'Energy Subsidy Capping value can not be more than 150000 /-'
        //     });
        //   }
        // });
        //start code New functionality added by Bindurekha Nayak date: 15-07-2024
        let enAuditFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_energyFromDate')[0]);
        let enAuditToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_energyToDate')[0]);
        enAuditToDate.addEventListener('input', () =>{
          let startDate = enAuditFromDate.value;
          let endDate = enAuditToDate.value;
          let fromDate = new Date(startDate);
          let toDate = new Date(endDate);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          if(toDate < fromDate){
            enAuditToDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'To date can not be less than From date'
            });
          }else if(diffYear > 5){
            enAuditToDate.value = '';
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
                  enAuditToDate.value = '';
                  enAuditFromDate.value='';
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
                    enAuditToDate.value = '';
                  } 
                 }
                }
            });
          }
        });
        
        enAuditFromDate.addEventListener('input', ()=>{
          enAuditToDate.value="";
        });
        //end code New functionality added by Bindurekha Nayak date: 15-07-2024
        this.fromAlphaNumericValidation();
        this.validateNumberWithSpecialCharacter();
        break;
      /* end of Energy Audit Fee incentive */

      /* start of Marketing Assistance (Association) incentive */
      case 88:
        this.fillUpMdInfo('cls_maName', 'cls_maDesg');
        this.validateTelephoneNumber('cls_miaTeleNo');
        this.validateMobileNumber('cls_miaMobNo');
        let maaContactName = (<HTMLInputElement>document.getElementsByClassName('cls_miaContPersonName')[0]);
        let maaContactDesg = (<HTMLInputElement>document.getElementsByClassName('cls_commDesg')[0]);
        let maaTelNo = (<HTMLInputElement>document.getElementsByClassName('cls_miaTeleNo')[0]);
        let maaMobNo = (<HTMLInputElement>document.getElementsByClassName('cls_miaMobNo')[0]);
        let maaEmailId = (<HTMLInputElement>document.getElementsByClassName('cls_miaEmailId')[0]);
        let maaGstId = (<HTMLInputElement>document.getElementsByClassName('cls_miaGstIn')[0]);
        let maaPanNo = (<HTMLInputElement>document.getElementsByClassName('cls_miaPanNo')[0]);
        let maaContactAddress = (<HTMLInputElement>document.getElementsByClassName('cls_miaContAddress')[0]);
        this.loading = true;
        let marketingAssParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(marketingAssParam).subscribe(res => {
          this.loading = false;
          if (res.status == 200) {
            //console.log(res.result.communicationDetails);
            if (res.result.communicationDetails) {
              maaContactName.value = res.result.communicationDetails.empName;
              maaContactDesg.value = res.result.communicationDetails.empDegn;
              maaTelNo.value = res.result.communicationDetails.empTeleNo;
              maaMobNo.value = res.result.communicationDetails.empMobNo;
              maaEmailId.value = res.result.communicationDetails.empEmail;
            }
            if (res.result.companyDetails) {
              maaGstId.value = res.result.companyDetails.gstNo;
              maaPanNo.value = res.result.companyDetails.panNo;
              maaContactAddress.value = res.result.companyDetails.cmpAddress;
            }
          }
        });
        let maaParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(maaParam).subscribe(res => {
          if (res.status == 200) {
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 1;
        this.fillUpPrevDetails('cls_miaAmount');

        let subsidyCapping = 1000000;
        let finalsubsidy: any = 0;
        let subsidy: any = 0;
        let total: any = 0;
        // let subsidyCapping2 = 6000000;
        let expense: any = document.getElementsByClassName('cls_expense');
        let maaTotalExpenses: any = (<HTMLInputElement>document.getElementsByClassName('cls_total_expense')[0]);
        let maaSubsidyAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_miaTotalMarktEventAmount')[0]);
        let maaEventLocation: any = (<HTMLInputElement>document.getElementsByClassName('cls_location')[0]).value;
        let maaEventCheck = (<HTMLInputElement>document.getElementsByClassName('cls_location')[0]);
        let maaTravelDesignation: any = (<HTMLInputElement>document.getElementsByClassName('cls_travel_designation')[0]);
        maaTravelDesignation.addEventListener('input', () => {
          const regex = /^[a-zA-Z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
          const travelDesignationvalue = maaTravelDesignation.value;
  
          if (!regex.test(travelDesignationvalue)) {
              maaTravelDesignation.value = travelDesignationvalue.replace(/[^a-zA-Z\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
          }
        });
        maaEventCheck.addEventListener('change', () => {
          maaEventLocation = maaEventCheck.value;
        })

        for (let button of expense) {
          button.addEventListener("input", () => {
            let total = 0;
            for (let i = 0; i < expense.length; i++) {
              if (i == 0) { continue } //adding to skip first iteration as the first used for location change trigger
              let data: any = $($(expense[i])).val();
              if ($.isNumeric(data)) {
                total += parseFloat(data);
              }
            }
            maaEventLocation = maaEventCheck.value;
            maaTotalExpenses.value = String(total);
            if (maaEventLocation == "" || maaEventLocation == undefined || maaEventLocation == 0) {
              // console.log(maaEventLocation);
              Swal.fire({
                icon: 'error',
                text: 'Please first select event location'
              });
              expense.value = '0';
              // console.log(maaEventLocation.value);
            }
            else {
              subsidy = total * 0.50;
              finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            }
            maaSubsidyAmount.value = String(finalsubsidy);
          });
        }
      

        maaGstId.addEventListener('input', () => {
          let maaGstIdValue = maaGstId.value;
          maaGstIdValue = maaGstIdValue.toUpperCase();
          maaGstIdValue = maaGstIdValue.replace(/[^A-Z0-9]/g, '');
          if (maaGstIdValue.length > 15) {
            maaGstIdValue = maaGstIdValue.slice(0, 15);
          }
          maaGstId.value = maaGstIdValue;
        });

        maaTotalExpenses.addEventListener('input', () => {
          if (maaEventLocation == "" || maaEventLocation == undefined || maaEventLocation == 0) {
            maaSubsidyAmount.value = 0;
            Swal.fire({
              icon: 'error',
              text: 'Please first select event location'
            });
          } else {
            let totExpense = maaTotalExpenses.value;
            subsidy = totExpense * 0.50;
            finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
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
          } else {
            subsidy = maaSubsidyAmount.value;
            finalsubsidy = (subsidy <= subsidyCapping) ? subsidy : subsidyCapping;
            maaSubsidyAmount.value = String(finalsubsidy);
          }
        });
        let participantCount: any = (<HTMLInputElement>document.getElementsByClassName('cls_participants')[0]);

        participantCount.addEventListener('change', () => {
          if (participantCount.value) {
            if (participantCount.value < 5) {
              participantCount.value = '';
              Swal.fire({
                icon: 'error',
                text: "Number of participating units can't be less then 5"
              });
            }
          }
        });


        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
        this.validateNumberWithSpecialCharacter();
        this.checkPinCodeValidation();
        break;
      /* end of Marketing Assistance (Association) incentive */
    }
  }

  fillUpPrevDetails(eleClass: any) {
    let ClaimEvent: any = (<HTMLInputElement>document.getElementsByClassName(eleClass)[0]);
    let button = document.createElement('button');
    button.textContent = 'Select Previous Claimed Details';
    button.classList.add('btn', 'btn-outline-primary', 'mb-2', 'custom-dynamic-button');
    let parentElement = ClaimEvent.closest('div[id^="ctrl_"]');
    let headingBtnDiv = parentElement.querySelector('.heading-btn');
    const h6Element = headingBtnDiv?.querySelector('.h6');
    if (h6Element) {
        h6Element.insertAdjacentElement('afterend', button);
    } else{
      console.log('button cant be added');
    }
    // let parentOfClaimed = ClaimEvent.parentNode.parentNode.parentNode.parentNode;
    // parentOfClaimed.insertAdjacentElement('beforeBegin', button);
    button.addEventListener('click', () => {
      this.selectPreviousClaimedDetails();
    });
  }


  /**
  * Function Name: selectPreviousClaimedDetails
  * Description: This method is used to open Claimed details modal
  * Created By: Bibhuti Bhusan Sahoo
  * Created On: 06th Nov 2023
  */
  selectPreviousClaimedDetails() {
    this.open(this.previousClaimModalRef);
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
      const fromDateLabel = getLabelByTextElement(fromDate) ?? 'From Date';

      const toDate = <HTMLInputElement>toDateInputs[i];
      const toDateLabel = getLabelByTextElement(toDate) ?? 'To Date';

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
              text: "The start date cannot be later than the end date"
            });
          }
        }
      });
    }

    function getLabelByTextElement(inputElement: HTMLInputElement): string {
      const parentDiv = inputElement.closest('.dynGridCls');
      const labelElement = parentDiv.querySelector('.dynlabel');
      return labelElement ? labelElement.textContent.trim().replace(/\*/g, '') : '';
    }
  }

  getLabelByTextElement(inputElement: HTMLInputElement): string {
    const parentDiv = inputElement.closest('.dynGridCls');
    const labelElement = parentDiv.querySelector('.dynlabel');
    return labelElement ? labelElement.textContent.trim().replace(/\*/g, '') : '';
  }

 /**
   * Function Name: ptsDateValidation
   * Description: This method is used to ptsDateValidation
   * Created By: Bindurekha Nayak
   * Created On: 16th july 2024
   */

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

  /**
   * Function Name: setTowerDetails
   * Description: This method is used to set tower details fields
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 21th Jan 2024
   * @param intId
   */
  setTowerDetails(intId: any) {
    let index = this.towerDeatilsList.findIndex(x => x.intId === intId);
    let towerLocation = this.towerDeatilsList[index].vch_operation + ', ' + this.towerDeatilsList[index].vch_od_ofc_location;
    $('.cls_tower_list').val(towerLocation);
    this.keyUpEvent('cls_tower_list');
    this.modalService.dismissAll();
  }

  /**
   * Function Name: calculateTotalCapital
   * Description: It calculate the total capital amount for "Interest Subsidy Form"
   * Created By: Bibhuti Bhusan Sahoo
   * Created Date: 01 Nov 2023
   * modify By: Manish Kumar
   * modify Date: 03-05-2023
   */
  calculateTotalCapital() {
    let totalAmount = parseFloat(this.buildingCivilAmount) + parseFloat(this.plantAmount) + parseFloat(this.equipmentAmount) + parseFloat(this.otherAssetTotalAmount) + parseFloat(this.RefurbishedPlantMechineryAmount) + parseFloat(this.isTotalRdAmount) + parseFloat(this.isUtilitiesAmount) + parseFloat(this.isTransferTechnologyAmount) + parseFloat(this.fixedAssetsTotalValue);
    let totalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_eligible_cap_investment')[0]);
    totalCapitalElement.value = totalAmount;
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
    let policyDataStr = sessionStorage.getItem('SCHEME_POLICY_DET');
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

   /**
   * Function: checkPinCodeValidation
   * Description: It should be used for validate pin code input value
   * Created on: 24th july 2024
   * Created by: Manish Kumar
   */
   checkPinCodeValidation() {
    let pinCodeEle = (<HTMLInputElement>document.getElementsByClassName('cls_pincode')[0]);
    if (pinCodeEle){
    pinCodeEle.addEventListener('input', () => {
     let pinCodeInputValue : any = pinCodeEle.value;
     if (pinCodeInputValue.startsWith('0')) {
       pinCodeEle.value = '';
       Swal.fire({
         icon: 'error',
         text: 'Please enter valid pin code'
       });
     }
     if (pinCodeInputValue.length > 6) {
       pinCodeEle.value = pinCodeInputValue.slice(0, 6);
       Swal.fire({
         icon: 'error',
         text: "Can't input more than 6 digit"
       });
     }
   });
  }
 }

  /**
   * Function: validateTelephoneNumber
   * Description: This function is used for validate proper telephone number with correct input Value 
   * Created on: 17th July 2024
   * Created by: Manish Kumar
   * @param telephoneNoClass 
   */
     validateTelephoneNumber(telephoneNoClass) {
        let eafContactTel: any = (<HTMLInputElement>document.getElementsByClassName(telephoneNoClass)[0]);
        eafContactTel.addEventListener('input', () => {
            if (eafContactTel.value.length > 10) {
              eafContactTel.value = eafContactTel.value.slice(0, 10);
            }
            if (eafContactTel.value === '00') {
              eafContactTel.value = '';
            }
        });
        eafContactTel.addEventListener('copy', (e) => {
          e.preventDefault();
        });

        eafContactTel.addEventListener('paste', (e) => {
          e.preventDefault();
        });

        eafContactTel.addEventListener('cut', (e) => {
          e.preventDefault();
        });

        eafContactTel.addEventListener('drag', (e) => {
          e.preventDefault();
        });

        eafContactTel.addEventListener('drop', (e) => {
          e.preventDefault();
        });
  }

   /**
   * Function: validateMobileNumber
   * Description: This function is used for validate proper mobile number with correct input Value 
   * Created on: 17th July 2024
   * Created by: Manish Kumar
   * @param mobileNoClass 
   */
   validateMobileNumber(mobileNoClass) {
    let eafContactMob: any = (<HTMLInputElement>document.getElementsByClassName(mobileNoClass)[0]);
    eafContactMob.addEventListener('input', () => {
      const phoneNumberInputValue = eafContactMob.value;
      if (phoneNumberInputValue.length > 0 && (phoneNumberInputValue.startsWith('1') || phoneNumberInputValue.startsWith('2') || phoneNumberInputValue.startsWith('3') || phoneNumberInputValue.startsWith('4') || phoneNumberInputValue.startsWith('5'))) {
        eafContactMob.value = '';
      }
      if (phoneNumberInputValue.startsWith('00')) {
        eafContactMob.value = '';
      }
      if (phoneNumberInputValue.length > 10) {
        eafContactMob.value = phoneNumberInputValue.slice(0, 10);
      }
    });

    eafContactMob.addEventListener('copy', (e) => {
      e.preventDefault();
    });

    eafContactMob.addEventListener('paste', (e) => {
      e.preventDefault();
    });

    eafContactMob.addEventListener('cut', (e) => {
      e.preventDefault();
    });

    eafContactMob.addEventListener('drag', (e) => {
      e.preventDefault();
    });

    eafContactMob.addEventListener('drop', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Function: validateNumberWithSpecialCharacter
   * Description: This is used for check input Number with special character and alphabet convert in Upper Case
   * Created on: 12th Jun 2024
   * Created by: Manish Kumar
   */
  validateNumberWithSpecialCharacter() {
    let specialCharacterFields: HTMLCollectionOf<Element> = document.getElementsByClassName('cls_validate_number_special');
    if (specialCharacterFields) {
      for (let i = 0; i < specialCharacterFields.length; i++) {
        specialCharacterFields[i].addEventListener('input', function (event: Event) {
          let input = event.target as HTMLInputElement;
          let value = input.value;
          // Allow numbers, /, ,, -, :, and convert alphabetic characters to uppercase
          let newValue = '';
          for (let char of value) {
            if (/[0-9/,\-:]/.test(char)) {
              newValue += char;
            } else if (/[a-zA-Z]/.test(char)) {
              newValue += char.toUpperCase();
            }
          }
          
          // Update the input value with the validated/converted string
          input.value = newValue;
        });
      }
    }
  }

  /**
   * Function: eligibilityDateCheck
   * Description: It will compare the from date and to date and return if toDate > fromDate
   * Created on: 9th feb 2024
   * Created by: Bibhuti Bhusan Sahoo
   * @param fromDateClass 
   * @param toDateClass 
   */

  eligibilityDateCheck(fromDateClass, toDateClass) {
    let fromDateEle: any = (<HTMLInputElement>document.getElementsByClassName(fromDateClass)[0]);
    let toDateEle: any = (<HTMLInputElement>document.getElementsByClassName(toDateClass)[0]);
    if (fromDateEle.value == '' || toDateEle.value == '') {
      return 0;
    } else {
      const fromDate = new Date(fromDateEle.value);
      const toDate = new Date(toDateEle.value);
      if (toDate < fromDate) {
        return 0;
      } else {
        return 1;
      }
    }
  }

  /*
  * Function: checkFieldAmount
  * Description: To Validate value difference
  * Created By: Sibananda Sahu
  * Date: 08 feb 2024
  */
  checkFieldAmount(cls_fisrstField, cls_secondField) {
    const firstFieldInputs = document.getElementsByClassName(cls_fisrstField);
    const secondFieldInputs = document.getElementsByClassName(cls_secondField);
    for (let i = 0; i < firstFieldInputs.length; i++) {
      const firstField = <HTMLInputElement>firstFieldInputs[i];
      const firstFieldLabel = getLabelByTextElement(firstField) ?? 'first Field';
      const secondField = <HTMLInputElement>secondFieldInputs[i];
      const secondFieldLabel = getLabelByTextElement(secondField) ?? 'second Field';
      secondField.addEventListener('change', () => {
        if (firstField.value) {
          if ((parseFloat(firstField.value)) < (parseFloat(secondField.value))) {
            secondField.value = '';
            Swal.fire({
              icon: 'error',
              text: "the incentive amount can't be greater than the investment  amount"
            });
          }
        } else {
          secondField.value = '';
          Swal.fire({
            icon: 'error',
            text: "please enter the investment amount first"
          })
        }
      });

      firstField.addEventListener('change', () => {
        if (secondField.value) {
          if ((parseFloat(firstField.value)) < (parseFloat(secondField.value))) {
            firstField.value = '';
            Swal.fire({
              icon: 'error',
              text: "the incentive amount can't be greater than the investment  amount"
            })
          }
        }
      })

      function getLabelByTextElement(inputElement: HTMLInputElement): string {
        const parentDiv = inputElement.closest('.dynGridCls');
        const labelElement = parentDiv.querySelector('.dynlabel');
        return labelElement ? labelElement.textContent.trim().replace(/\*/g, '') : '';
      }
    }
  }
  //To Format Date for AddMore || Arpita | Co-Siba
  // formatDate1(inputDate: string): string {
  //   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  //   const [day, monthNum, year] = inputDate.split('-');
  //   const monthName = months[parseInt(monthNum, 10) - 1];
  //   return `${day}-${monthName}-${year}`;
  // }
  //End To Format Date for AddMore || Arpita | Co-Siba

  //To Format DateField || Arpita | Co-Siba
  // formatDate(inputDate: any) {
  //   const [year, monthStr, day] = inputDate.split('-');
  //   const month = new Date(`${monthStr} 1 2000`).getMonth() + 1;
  //   const formattedMonth = month.toString().padStart(2, '0');
  //   const formattedDay = day.toString().padStart(2, '0');
  //   const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
  //   console.log(formattedDate);
  //   return formattedDate;
  // }
  //end of date formater

  //To Set Formatted Date Field in Html Site || Arpita | Co-Siba
  // setDateData(
  //   dateCtrlId: string,
  //   dateVal: any,
  //   arrAddMoreFileData: any = '',
  //   columnName: any = '',
  //   formCtrlId: any = '',
  //   addMoreCtrlId: any = ''
  // ) {
  //   if (
  //     dateVal == 'tabularAddMore' &&
  //     this.arrSetAllDataKeys[dateCtrlId + formCtrlId] == undefined &&
  //     arrAddMoreFileData[dateCtrlId] != undefined
  //   ) {
  //     let tabularDate: any =
  //       arrAddMoreFileData[dateCtrlId][formCtrlId]['addMoreDataValue'][
  //       columnName
  //       ];
  //     if (environment.defaultDate == tabularDate) {
  //       return;
  //     }
  //     setTimeout(() => {
  //       let splitedDataVal: any = tabularDate.split('-');
  //       if (splitedDataVal[1] != "") {
  //         const dateDataBs = new Date(tabularDate);

  //         splitedDataVal[1] = dateDataBs.toLocaleDateString('en-US', {
  //           month: 'short'
  //         });
  //       }
  //       (<HTMLInputElement>document.getElementById(addMoreCtrlId)).value =
  //         splitedDataVal[2] + '-' + splitedDataVal[1] + '-' + splitedDataVal[0];
  //       this.arrSetAllDataKeys[dateCtrlId + formCtrlId] = { tabularDate };
  //     }, 500);
  //   } else if (
  //     dateVal != null &&
  //     dateVal != '' &&
  //     this.arrSetAllDataKeys[dateCtrlId] == undefined &&
  //     dateVal != 'tabularAddMore'
  //   ) {
  //     if (environment.defaultDate == dateVal) {
  //       return;
  //     }
  //     setTimeout(() => {
  //       let splitedDataVal: any = dateVal.split('-');
  //       if (splitedDataVal[1] != "") {
  //         const dateDataBs = new Date(dateVal);

  //         splitedDataVal[1] = dateDataBs.toLocaleDateString('en-US', {
  //           month: 'short'
  //         });
  //       }
  //       (<HTMLInputElement>document.getElementById(dateCtrlId)).value =
  //         splitedDataVal[2] + '-' + splitedDataVal[1] + '-' + splitedDataVal[0];
  //       this.arrSetAllDataKeys[dateCtrlId] = { dateVal };
  //     }, 500);
  //   }
  // }
  //End of Setting Formatted Date Field in Html Site || Arpita | Co-Siba
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

      if (odDomicileGenValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileGenId)).value = "0";
      if (odDomicileScValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileScId)).value = "0";
      if (odDomicileStValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileStId)).value = "0";
      if (odDomicileDisabledValue <= "0") (<HTMLInputElement>document.getElementById(odDomicileDisabledId)).value = "0";
      if (odDomicileGenValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileGenIdF)).value = "0";
      if (odDomicileScValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileScIdF)).value = "0";
      if (odDomicileStValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileStIdF)).value = "0";
      if (odDomicileDisabledValueF <= "0") (<HTMLInputElement>document.getElementById(odDomicileDisabledIdF)).value = "0";

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
   /*
* Function: getFinancialYearWithQuarters
* Description: To Validate custom validation financial year and quater
* Created By: Bindurekha Nayak
* Date: 22-07-2024
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
/*
  * Function: AddMore Total
  * Description: To Calculate addmore total value
  * Created By: Bindurekha Nayak
  * Date: 22-07-2024
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
  * Function Name: customValidations
  * Description: This method is used to set different validations based on product
  * Created By: Sibananda sahu
  * Added By: Manish Kumar (26-07-2024)
  * Created On: 10th July 2024
  */
customValidations(addMorectrlId){
  let addMoreElement  = document.getElementById(addMorectrlId);
  console.log(this.intProductId,'--',addMoreElement.classList);
  const validationCondition = {
    61: ['cls_other_fixed_assets', 'cls_equ_details'],
    62: ['cls_parrent_previous_claim'],
    63: ['cls_other_fixed_assets', 'cls_parrent_previous_claim'],
    66: ['cls_parrent_previous_claim'],
    67: ['cls_parrent_previous_claim'],
    69: ['cls_parrent_previous_claim'],
    70: ['cls_parrent_previous_claim'],
    128: ['cls_parrent_previous_claim']
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

}
