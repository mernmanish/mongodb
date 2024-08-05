import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-apply-datacenter-form',
  templateUrl: './apply-datacenter-form.component.html',
  styleUrls: ['./apply-datacenter-form.component.css', './apply-datacenter-form.component.scss']
})
export class ApplyDatacenterFormComponent implements OnInit {
  amountAddMoreDet:any =0;
  amountAddMore:any =0;
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
  ivsSubBuildingAmount: any = 0;
  ivsSubPlantAmount: any = 0;
  ivsSubRefAmount: any = 0;
  ivsSubRndAmount: any = 0;
  ivsSubUtilityAmount: any = 0;
  ivsSubTransAmount: any = 0;

  previousClaimedSubsidy: any = [];
  ptsPrevClaimedAmount: any = 0;
  ptsToatlClaimedAmount: any = 0;
  intNoOfDateField: any = 0;
  booleanPrevClaimStatus: any = true;
  cmpRegDate: any = '';
  formEditStatus: any = 0;
  isAddMoreCtrlIds: any = [];
  totalSkillGapAmount:any = 0;
  totalSkillAmountAddMore:any=0;
  totalSkillAmount:any =0;
  financialYearsWithQuarters: FinancialYear[] = [];
  @ViewChild('formFile', { static: false })
  formFile: ElementRef;

  @ViewChild('financialDetailsModal') financialDetailsModalRef: ElementRef;
  @ViewChild('previousClaimModal') previousClaimModalRef: ElementRef;
  userId: any;

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
    private IrmsDetailsService: IrmsDetailsService
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
      this.intProductId = schemeArr[3];
      this.formEditStatus = schemeArr[4];
    }
    this.intTotalEmpCount = (sessionStorage.getItem('totalEmpCount')) ? sessionStorage.getItem('totalEmpCount') : 0;
    this.vchMdName = (sessionStorage.getItem('mdName')) ? sessionStorage.getItem('mdName') : '';
    this.cmpRegDate = (sessionStorage.getItem('companyRegDate')) ? sessionStorage.getItem('companyRegDate') : '1970-01-01';


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
        } else {

          this.intFormId = 'no-data';
          this.loading = false;
        }
      });
    }
    this.objFinancialDetails = (JSON.parse(sessionStorage.getItem('financialDetails')));
    if (this.objFinancialDetails != null)
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
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe(res => {
      if (res.status == 200) {
        this.dynamicCtrlDetails = res.result;

        this.formName = res.formName;
        this.dynamicCtrlDetKeys = Object.keys(this.dynamicCtrlDetails).sort();
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
                  // prntDet.innerHTML = true;
                  //  prntDet.click();
                  //prntDet.click();
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
    setTimeout(() => {
      this.validateDate();
    }, 1500);
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
  //             // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');

  //             let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
  //             lblEmnt?.classList.remove('d-none');


  //           }
  //           else {
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

  //     }

  //     else // For Dropdown
  //     {
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

  //             }
  //             else {
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

  //       /*   prntDet.addEventListener('change', ()=>{

  //            for (let loopChldDet of chldDetls)
  //            {

  //              let lopdependval = loopChldDet.getAttribute('data-dependentvalue');


  //              lopdependval = lopdependval.split(',');
  //              if (lopdependval.includes(prntDet.value)) {

  //                loopChldDet.closest(".dynGridCls").classList.remove('d-none');
  //                loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.remove('d-none');
  //                // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');
  //                loopChldDet.classList.remove('d-none');

  //                if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid') == 5)
  //                {
  //                  let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
  //                  lblEmnt?.classList.remove('d-none')

  //                }

  //              }
  //              else
  //              {
  //                loopChldDet.closest(".dynGridCls").classList.add('d-none');
  //                loopChldDet.closest(".dynGridCls").querySelector('.dynlabel').classList.add('d-none');

  //                // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.add('d-none');
  //                loopChldDet.classList.add('d-none');
  //                if(loopChldDet.getAttribute('data-typeid') == 6 || loopChldDet.getAttribute('data-typeid') == 5)
  //                {
  //                  let lblEmnt = (<HTMLInputElement>document.getElementById(loopChldDet.id)).nextElementSibling;
  //                  lblEmnt?.classList.add('d-none');
  //                }

  //                let tpId   = loopChldDet.getAttribute('data-typeid');
  //                if(tpId == 2)
  //                {
  //                  (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='';
  //                }
  //                else if(tpId == 3)
  //                {
  //                  (<HTMLInputElement>document.getElementById(loopChldDet.id)).value='0';
  //                }

  //              }

  //            }

  //          });*/

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
        else if (attrType == 'telephoneNo') // For Valid Mobile
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
        // if (mandatoryDetails) // For Mandatory
        // {
        //   if (uploadFile['fileName'] == '' || uploadFile['fileName'] == undefined) {
        //     Swal.fire({
        //       icon: 'error',
        //       text: 'Please upload ' + lblName
        //     });
        //     validatonStatus = false;
        //     break;
        //   }
        // }
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
  // setCkEdtorValue({ editor }: ChangeEvent , ckId:any)
  // {
  //   this.arrckEdtorVal[ckId] = editor.getData();
  // }

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
    let otherAssClassList = document.getElementById(otherAssId);
    if(otherAssClassList.classList.contains("cls_iSOtherAssAmt") || otherAssClassList.classList.contains("cls_ivsOtherAsset")){
      this.addMoreCalculation(this.arrAddmoreFilledData, addMorectrlId, this.formName);
    }

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
    if(this.isAddMoreCtrlIds.includes(ctrlId)){
      this.arrAddmoreFilledData[ctrlId].splice(indx, 1);
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
    if (addMoreFormResult[addMorectrlId] != undefined && !(Object.keys(this.arrAddmoreElemntKeys)).includes(addMorectrlId)) {
      let arrAddMoreElementWiseData = [];
      if (addMoreFormResult[addMorectrlId]['addMoreDataValue'] != '') {
        this.amountAddMore = 0;
        let vchTypeTrainingDet = 0;
        let vchExpPerEmpDet = 0;
        let otherAmountExpDet = 0;
        let intMaleEmpDet = 0;
        let intOtherEmpDet = 0;
        this.totalSkillAmount =0;
        for (let addmoreloop of addMoreFormResult[addMorectrlId]['addMoreDataValue']) {
          let optAddMoreValue = '';
          arrAddMoreElementWiseData = [];
          if (this.processId == 110) {
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
          this.amountAddMore += parseFloat(addmoreloop.vch_amount); // Ensure vch_amount is parsed as float
         
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
        if (this.processId == 110) {
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

            else if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'telephone') // For Valid Mobile
            {
              if (!this.vldChkLst.validMob(addMoreTdDataValidatorloop['ctrlValue'])) {
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
            else if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']]['ctrlAttributeType'] == 'telephoneNo') // For Valid telephone No
            {
              if (!this.vldChkLst.validTel(addMoreTdDataValidatorloop['ctrlValue'])) {
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
  * Created By: Bibhuti Bhusan Sahoo
  * Created On: 11th Apr 2023
  */
  selectFinancialDetails() {
    this.open(this.financialDetailsModalRef);
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
  /**
   * Function Name: open
   * Description: This method is used open bootstarp modal
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 11th Apr 2023
   */
  open(content: any) {
    this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }
  /**
   * Function Name: getFinancialDetails
   * Description: This method is used to set financial details fields
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 12th Apr 2023
   * @param intId
   */
  getFinancialDetails(intId: any) {

    let index = this.objFinancialDetails.findIndex(x => x.intId === intId);
    $('.cls_institute_name').val(this.objFinancialDetails[index].vch_financial_institution_name);
    this.keyUpEvent('cls_institute_name');
    $('.cls_tl_sanc_amt').val(this.objFinancialDetails[index].vch_loan_sanctioned_amount);
    $('.cls_tl_date').val(this.objFinancialDetails[index].vch_loan_sanctioned_date);
    $('.cls_tl_tenure').val(this.objFinancialDetails[index].vch_tenure_term_loan);
    $('.cls_interest_rate').val(this.objFinancialDetails[index].dcml_loan_sanctioned_interest_rate);
    this.modalService.dismissAll();
  }

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
    $('.cls_term_loan_from_bank_institution').val(autoFillUpData.vch_term_loan_finalcial_instituton);
    //$('.cls_expenditure_building_civilwork').val(autoFillUpData.vch_building_civilwork);
    $('.cls_gstin_regd_number').val(autoFillUpData.vch_gstin_regd_number);
    $('.cls_institute_name').val(autoFillUpData.vch_company_name);
    $('.cls_registration_no').val(autoFillUpData.vch_regd_no);
    $('.cls_registration_date').val(autoFillUpData.registrationDate);
    }
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
          else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'telephoneNo') // For Valid telephone No
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
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 9th May 2023
   */
  getOperationLocationDetails(intProdId) {
    this.loading = true;
    let regParam = {
      'intId': intProdId
    };

    this.IrmsDetailsService.getOperationLocationDetails(regParam).subscribe(res => {
      if (res.status == 1) {
        setTimeout(() => {
          let bindData = '<table class="table table-striped">';
          if (Object.keys(res.result).length > 0) {
            for (let data of res.result) {
              bindData += '<tr>';
              bindData += '<td><input class="form-control" id="operation" type="text" value="' + data.vch_operation + '" readonly></td>';
              bindData += '<td><input class="form-control" type="text" value="' + data.vch_od_ofc_location + '" readonly></td>';
              bindData += '</tr>';
            }
            bindData += '</table>';
            $('.cls_tower_list').after(bindData);
            $('#operation').addClass('test_cls');
            this.loading = false;
          }
        }, 1000);
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
   */
  autoCalculation() {
    let companyData = JSON.parse(sessionStorage.getItem('companyDetails'));
    const incorporationdate = companyData[0].dtm_incorporation_date;
    const gender = companyData[0].int_gender;
    const socialcategory = companyData[0].int_social_category;
    const disabled = companyData[0].int_physically_handicapped;
    // const empcount = companyData[0].int_total_emp;
    let empcount: any = 41;
    let totalSubsidableSpace: any = 0;
    let expense: any = 0;
    let subsidy: number = 0;
    let subsidyCapping: number = 0;
    let finalsubsidy: any = 0;
    let total: any = 0;


    let h4Text: any = document.getElementsByTagName('h4')[0].innerText;
    console.log(h4Text);
    console.log(this.processId);
    switch (this.processId) {

      /*Start of calculation for Conversion Charges Electronics  Developed by Bindurekha Nayak*/
      case 93:{
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        let chargesPaid: any   = (<HTMLInputElement>document.getElementsByClassName('cc_charges_paid')[0]);
        let conversionFee: any = (<HTMLInputElement>document.getElementsByClassName('cls_cc_conversion_fee')[0]);
        let finalSubsidy: any  = (<HTMLInputElement>document.getElementsByClassName('cls_claim_amount')[0]);
          chargesPaid.addEventListener('change', () => {
            finalSubsidy.value = parseFloat(chargesPaid.value);
          });
          conversionFee.addEventListener('change', () => {
            let conversionFeeFinal:any = parseFloat(conversionFee.value);
            let chargesPaidFinal:any = parseFloat(chargesPaid.value);
            if(chargesPaidFinal > conversionFeeFinal){
              Swal.fire({
                icon: 'error',
                text: 'Charges paid amount can not be more than Total Conversion Fee amount!'
              })
            }
          })
          finalSubsidy.addEventListener('change', () => {
            let conversionFeeFinal:any = parseFloat(conversionFee.value);
            let finalSubsidyFinal:any = parseFloat(finalSubsidy.value);
            if(finalSubsidyFinal > conversionFeeFinal){
              Swal.fire({
                icon: 'error',
                text: 'Final Subsidy amount can not be more than Total Conversion Fee amount!'
              })
            }
          })
      }
      this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Conversion Charges Electronics */
      /*Start of calculation for Conversion Charges Electronics  Developed by Bindurekha Nayak*/
      case 104:{
        let regDesnElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_regDate')[0]);
        //regDesnElement.value = this.cmpRegDate;
        let parkNameElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_parkName')[0]);
        let regNoElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_regNo')[0]);
        
        
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        let subsidyElementInputs = Array.from(document.getElementsByClassName('cls_subsidy'));
        let totalSubsidy: any   = (<HTMLInputElement>document.getElementsByClassName('cls_total_subsidy')[0]);
        for (let button of subsidyElementInputs) {
          button.addEventListener("input", () => {
            total = 0;
            for (let input of subsidyElementInputs) {
              let data: any = $($(input)).val();
              if ($.isNumeric(data)) {
                total += parseFloat(data);
              }
            }
            //console.log(total);
            totalSubsidy.value = parseFloat(total);
          });
        }

      }
      this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Conversion Charges Electronics */
      /*Start of calculation for Internet Bandwidth Subsidy Developed by Bindurekha Nayak*/
      case 108:{
        this.fillUpMdInfo('cls_mdname', 'cls_mdDesn');
        let ibsParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(ibsParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_prevAmount');
        let iciTotalAmountEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_rfinTotalIntConn')[0]);
        let iciAmountEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_iciExpense')[0]);
        let iciAmountVal:any = 0;
        let iciTotalAmountVal:any = 0;
        let iciCappingVal:any = 2500000;
        let eeFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_expense_from')[0]);
        let eeToDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_expense_to')[0]);
        iciAmountEle.addEventListener('input', () => {
          iciAmountVal = (25/100) * iciAmountEle.value;
          iciTotalAmountVal = (iciAmountVal <= iciCappingVal) ? iciAmountVal : iciCappingVal;
          iciTotalAmountEle.value = iciTotalAmountVal;
        });
        iciTotalAmountEle.addEventListener('input', () => {
          iciTotalAmountVal = String(iciTotalAmountEle.value);
          iciTotalAmountVal = (iciTotalAmountVal <= iciCappingVal) ? iciTotalAmountVal : iciCappingVal;
          iciTotalAmountEle.value = iciTotalAmountVal;
        });
        eeFromDateElement.addEventListener('input', ()=>{
          eeToDateElement.value="";
        });
        eeToDateElement.addEventListener('input', () => {
          let fromDate = eeFromDateElement.value;
          let endDate = eeToDateElement.value;
          let policyEndDateCheck = this.eligibilityEndDateCheck('cls_expense_to');
          if(policyEndDateCheck==0){
            if(fromDate && endDate){
              let diffInMonths = (new Date(endDate).getMonth() - new Date(fromDate).getMonth()) + (new Date(endDate).getFullYear() - new Date(fromDate).getFullYear()) * 12;
              let diffYear = diffInMonths / 12;
              if(diffYear > 3){
                ptsToDate.value = '';
                Swal.fire({
                  icon: 'error',
                  text: 'Can not claim more than 3 Years!'
                });
              }else{
                let param = {
                  "fromDate": fromDate,
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
                      Swal.fire({
                        icon: 'error',
                        text: 'You have already applied untill the selected date.Please try with another latest date.'
                      }).then((result) => {
                      eeFromDateElement.value = '';
                      eeToDateElement.value = '';
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
            
            }
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Ineligibility Notification',
              html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date.',
            });
            eeToDateElement.value = '';
          }
            
        });
        this.fromToDateValidation();
        this.fromAlphaNumericValidation();
      }
      break;
      /*End of calculation for Internet Bandwidth Subsidy */

      /*Start of calculation for Investment Subsidy  Developed by Bindurekha Nayak*/
      case 105:
        this.fillUpMdInfo('cls_iseName', 'cls_isedesn');
        let ivsSubBuildingElement: any = document.getElementsByClassName('cls_ivsBldCvlWork')[0];
        let ivsSubPlantElement: any = document.getElementsByClassName('cls_ivsPlntMachin')[0];
        let ivsSubRefElement: any = document.getElementsByClassName('cls_ivsRefusedPlnt')[0];
        let ivsSubRndElement: any = document.getElementsByClassName('cls_ivsRnd')[0];
        let ivsSubUtilityElement: any = document.getElementsByClassName('cls_ivsUtilities')[0];
        let ivsSubTransElement: any = document.getElementsByClassName('cls_ivsTransOfTech')[0];
        let ivsSubCapitalElement: any = document.getElementsByClassName('cls_ivsCapInvest')[0];
        let ivsClaimedElement: any = document.getElementsByClassName('cls_ivsInvestSubClaim')[0];
        this.ivsSubTransAmount = (ivsSubTransElement.value == '') ? 0 : parseFloat(ivsSubTransElement.value);
        this.ivsSubUtilityAmount = (ivsSubUtilityElement.value == '') ? 0 : parseFloat(ivsSubUtilityElement.value);
        this.ivsSubRndAmount = (ivsSubRndElement.value == '') ? 0 : parseFloat(ivsSubRndElement.value);
        this.ivsSubRefAmount = (ivsSubRefElement.value == '') ? 0 : parseFloat(ivsSubRefElement.value);
        this.ivsSubBuildingAmount = (ivsSubBuildingElement.value == '') ? 0 : parseFloat(ivsSubBuildingElement.value);
        this.ivsSubPlantAmount = (ivsSubPlantElement.value == '') ? 0 : parseFloat(ivsSubPlantElement.value);
        this.invSubTotalAssAmount = (this.amountAddMoreDet =='') ? 0 : parseFloat(this.amountAddMoreDet);
        this.invSubCapitalAmount();
        ivsSubBuildingElement.addEventListener('input', () => {
          this.ivsSubBuildingAmount = (ivsSubBuildingElement.value == '') ? 0 : parseFloat(ivsSubBuildingElement.value);
          this.invSubCapitalAmount();
        });
        ivsSubPlantElement.addEventListener('input', () => {
          this.ivsSubPlantAmount = (ivsSubPlantElement.value == '') ? 0 : parseFloat(ivsSubPlantElement.value);
          this.invSubCapitalAmount();
        });
        ivsSubRefElement.addEventListener('input', () => {
          this.ivsSubRefAmount = (ivsSubRefElement.value == '') ? 0 : parseFloat(ivsSubRefElement.value);
          this.invSubCapitalAmount();
        });
        ivsSubRndElement.addEventListener('input', () => {
          this.ivsSubRndAmount = (ivsSubRndElement.value == '') ? 0 : parseFloat(ivsSubRndElement.value);
          this.invSubCapitalAmount();
        });
        ivsSubUtilityElement.addEventListener('input', () => {
          this.ivsSubUtilityAmount = (ivsSubUtilityElement.value == '') ? 0 : parseFloat(ivsSubUtilityElement.value);
          this.invSubCapitalAmount();
        });
        ivsSubTransElement.addEventListener('input', () => {
          this.ivsSubTransAmount = (ivsSubTransElement.value == '') ? 0 : parseFloat(ivsSubTransElement.value);
          this.invSubCapitalAmount();
        });
        ivsSubCapitalElement.addEventListener('input', () => {
          let ivCappingVal = 250000000;
          let ivsCapitalTotal = ivsSubCapitalElement.value;
          let ivsClaimedElementAmount = (20/100) * ivsCapitalTotal;
          let totalAmountVal = (ivsClaimedElementAmount <= ivCappingVal) ? ivsClaimedElementAmount : ivCappingVal;
          ivsClaimedElement.value = totalAmountVal;
          
        }); 
        ivsClaimedElement.addEventListener('input', () => {
          let ivCappingVal = 250000000;
          let ivsCapitalTotal = ivsSubCapitalElement.value;
          let ivsClaimedElementAmount = (20/100) * ivsCapitalTotal;
          let totalAmountVal = (ivsClaimedElementAmount <= ivCappingVal) ? ivsClaimedElementAmount : ivCappingVal;
          ivsClaimedElement.value = totalAmountVal;
        });
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Investment Subsidy */
      /*Start of calculation for Reimbursement of net SGST Developed by Bindurekha Nayak*/
      case 109:
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
        let regDesnDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_gstRegDate')[0]);
        regDesnDateElement.value = this.cmpRegDate;
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
        let sgstFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstFromDate')[0]);
        let sgstToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_sgstToDate')[0]);
        sgstFromDate.addEventListener('input', ()=>{
          sgstToDate.value="";
        });
        sgstToDate.addEventListener('input', () => {
          let sgstStartValue = sgstFromDate.value;
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
                      sgstFromDate.value = '';
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
        this.fromToDateValidation();
        this.fromAlphaNumericValidation();
        break;
      /*End of calculation for Reimbursement of net SGST */
     /*start of calculation for Power Incentives Developed by Bindurekha Nayak*/
      case 106:
        let ptsCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_ptsName')[0]);
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
              ptsCompanyName.value = res.result.companyDetails.cmpName;
              ptsContactAddress.value = res.result.companyDetails.cmpAddress;
              ptsCompanyAddress.value = res.result.companyDetails.cmpAddress;
              mdName.value = res.result.companyDetails.mdName;
            }
            if(res.result.communicationDetails && this.formEditStatus!=1){
              ptsContactName.value = res.result.communicationDetails.empName;
              ptsContactDesg.value = res.result.communicationDetails.empDegn;
              ptsContactTel.value = res.result.communicationDetails.empTeleNo;
              ptsContactMob.value = res.result.communicationDetails.empMobNo;
              ptsContactEmail.value = res.result.communicationDetails.empEmail;
            }
            if (res.result.unitDetails) {
              ptseTypeofUnit.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : ptseTypeofUnit.value;
            }
          }
        });
        this.fillUpMdInfo('cls_ptsName', 'cls_ptsDesg');
        ptsTariffClaimed.addEventListener('keyup', () => {
          let tariffClaimedValue:any = isNaN(ptsTariffClaimed.value) ? 0 : ptsTariffClaimed.value;
          let totalValue = (.30) * tariffClaimedValue;
          if(this.ptsPrevClaimedAmount>0){
            let restAmount = 20000000 - this.ptsPrevClaimedAmount;
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
          }else if(totalValue > 20000000){
            ptsIncentiveClaimed.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Incentive amount can not be more than 20000000 /- !'
            });
          }else{
            ptsIncentiveClaimed.value = totalValue;
          }
        });
        ptsIncentiveClaimed.addEventListener('keyup', () => {
          let tariffClaimedValue:any = isNaN(ptsTariffClaimed.value) ? 0 : ptsTariffClaimed.value;
          let totalValue = (.30) * tariffClaimedValue;
          if(this.ptsPrevClaimedAmount>0){
            let restAmount = 20000000 - this.ptsPrevClaimedAmount;
            if((totalValue + this.ptsPrevClaimedAmount) > 20000000 ){
              ptsIncentiveClaimed.value = '';
              Swal.fire({
                icon: 'error',
                text: 'Incentive amount cannot be more than ' +restAmount+ '!'
              });
            }else{
              ptsIncentiveClaimed.value = totalValue;
            }
          }else if(totalValue > 20000000){
            ptsIncentiveClaimed.value = '';
            Swal.fire({
              icon: 'error',
              text: 'Incentive amount can not be more than 20000000 /- !'
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
       this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Power Incentives*/
      /*start of calculation for Exemption of Electricity Duty Electronics Developed by Bindurekha Nayak*/
      case 90:
        let unitTypeDet: any = (<HTMLInputElement>document.getElementsByClassName('cls_unitType')[0]);
        let prcrCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfCompany')[0]);
        let prcrCompanyAddress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifCmpAddress')[0]);
        let prcrContactName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfPerson')[0]);
        let prcrContactDesg: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDegn')[0]);
        let prcrContactMob: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifMobNo')[0]);
        let prcrContactTele: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifTeleNo')[0]);
        let prcrContactEmail: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifEmailId')[0]);
        let prcrDateOfIncorporation: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfIncorporation')[0]);
        let prcrDateOfCommercial: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfCommercial')[0]);
        let prcrContactAdress: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifAddress')[0]);
        let prcrMdElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifName')[0]);
        let prcrMdDesgElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDegnMD')[0]);
        let eeFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_eleFromDate')[0]);
        let toDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiTodate')[0]);
        this.fillUpMdInfo('cls_eifName', 'cls_eifDegnMD');
        this.loading = true;
        let prcrParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(prcrParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.companyDetails){
              prcrCompanyName.value = prcrCompanyName.value ? prcrCompanyName.value : res.result.companyDetails.cmpName;
              prcrCompanyAddress.value = prcrCompanyAddress.value ? prcrCompanyAddress.value : res.result.companyDetails.cmpAddress;
              prcrContactAdress.value = prcrContactAdress.value ? prcrContactAdress.value : res.result.companyDetails.cmpAddress;
            }
            if(res.result.communicationDetails){
              prcrContactName.value = prcrContactName.value ? prcrContactName.value : res.result.communicationDetails.empName;
              prcrContactDesg.value = prcrContactDesg.value ? prcrContactDesg.value : res.result.communicationDetails.empDegn;
              prcrContactMob.value = prcrContactMob.value ? prcrContactMob.value: res.result.communicationDetails.empMobNo;
              prcrContactEmail.value = prcrContactEmail.value ? prcrContactEmail.value : res.result.communicationDetails.empEmail;
              prcrContactTele.value = prcrContactTele.value ? prcrContactTele.value : res.result.communicationDetails.empTeleNo;
            }
            if(res.result.dateDetails){
              prcrDateOfIncorporation.value = prcrDateOfIncorporation.value ? prcrDateOfIncorporation.value : res.result.dateDetails.incorporationDate;
              prcrDateOfCommercial.value = prcrDateOfCommercial.value ? prcrDateOfCommercial.value : res.result.dateDetails.commencementDate;
            }
            if (res.result.unitDetails) {
              unitTypeDet.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : unitTypeDet.value;
            }
          }
        });
        this.fromToDateValidation();
        toDateElement.addEventListener('change', () => {
          let res = this.eligibilityDateCheck('cls_eleFromDate','cls_eleToDate');
           if(res == 1){
            this.loading = true;
            let param = {
              "intProfId": this.userId,
              "intId": sessionStorage.getItem('REGD_ID'),
              "onlineProcessId": this.processId,
              "fromdate": eeFromDateElement.value,
              "todate": toDateElement.value,
              "yearLimit": 10,
            }
            this.IrmsDetailsService.yearWithDateEligibility(param).subscribe(res => {
              this.loading = false;
              if(res.status == 0){
                toDateElement.value = '';
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
      /*End of calculation for Exemption of Electricity Duty Electronics*/
      /*start of calculation for Electricity Inspection Fee Data Center Developed by Bindurekha Nayak*/
      case 107:{
        let unitTypeDetDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_unitType')[0]);
        let prcrCompanyNameDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfCompany')[0]);
        let prcrCompanyAddressDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifCmpAddress')[0]);
        let prcrContactNameDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifNameOfPerson')[0]);
        let prcrContactDesgDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDegn')[0]);
        let prcrContactMobDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifMobNo')[0]);
        let prcrContactTeleDC: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifTeleNo')[0]);
        let prcrContactEmailDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifEmailId')[0]);
        let prcrDateOfIncorporationDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfIncorporation')[0]);
        let prcrDateOfCommercialDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDateOfCommercial')[0]);
        let prcrContactAdressDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifAddress')[0]);
        let eeFromDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_eleInsFromDate')[0]);
        let insToDateElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_eleInsToDate')[0]);
        let prcrMdElementDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifName')[0]);
        let prcrMdDesgElementDc: any = (<HTMLInputElement>document.getElementsByClassName('cls_eifDegnMD')[0]);
        this.fillUpMdInfo('cls_eifName', 'cls_eifDegnMD');
        this.fromAlphaNumericValidation();
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
              prcrContactTeleDC.value = res.result.communicationDetails.empTeleNo;
            }
            if(res.result.dateDetails){
              prcrDateOfIncorporationDc.value = res.result.dateDetails.incorporationDate;
              prcrDateOfCommercialDc.value = res.result.dateDetails.commencementDate;
            }
            if (res.result.unitDetails) {
              unitTypeDetDc.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : unitTypeDetDc.value;
            }
          }
        });
        this.fromToDateValidation();
        insToDateElement.addEventListener('change', () => {
          let res = this.eligibilityDateCheck('cls_eleInsFromDate','cls_eleInsToDate');
           if(res == 1){
            this.loading = true;
            let param = {
              "intProfId": this.userId,
              "intId": sessionStorage.getItem('REGD_ID'),
              "onlineProcessId": this.processId,
              "fromdate": eeFromDateElement.value,
              "todate": insToDateElement.value,
              "yearLimit": 10,
            }
            this.IrmsDetailsService.yearWithDateEligibility(param).subscribe(res => {
              this.loading = false;
              if(res.status == 0){
                insToDateElement.value = '';
                Swal.fire({
                  icon: 'error',
                  text: res.msg
                });
              }
            });
          }
        });}
        
      break;
      /*End of calculation for Electricity Inspection Fee Data Center*/
      /*start of calculation for Energy Audit fee Developed by Bindurekha Nayak*/
      case 28:
        let unitType: any = (<HTMLInputElement>document.getElementsByClassName('cls_unitType')[0]);
        let eafCompanyName: any = (<HTMLInputElement>document.getElementsByClassName('cls_eafNameOfCompany')[0]);
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
        let eafParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        if(this.formEditStatus !=1){
        this.IrmsDetailsService.getRegCompanyDetails(eafParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if(res.result.companyDetails){
              eafCompanyName.value = res.result.companyDetails.cmpName;
              eafCompanyAddress.value = res.result.companyDetails.cmpAddress;
              eafContactAdress.value = res.result.companyDetails.cmpAddress;
            }
            if(res.result.communicationDetails) {
              eafContactName.value = res.result.communicationDetails.empName;
              eafContactDesg.value = res.result.communicationDetails.empDegn;
              eafContactMob.value = res.result.communicationDetails.empMobNo;
              eafContactTel.value = res.result.communicationDetails.empTeleNo;
              eafContactEmail.value = res.result.communicationDetails.empEmail;
            }
            if(res.result.dateDetails){
              eafDateOfIncorporation.value = res.result.dateDetails.incorporationDate;
            }
            if (res.result.unitDetails) {
              unitType.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : unitType.value;
            }
          }
        });
      }
        let cappingValue : number = 200000;
        eafTotalEnergy.addEventListener('input', () => {
          let subsidyVal : number = eafTotalEnergy.value * 0.75 ;
          eafEnergySubsidy.value = subsidyVal > cappingValue ? cappingValue : subsidyVal;
        });
        eafEnergySubsidy.addEventListener('input', () => {
          eafEnergySubsidy.value = eafEnergySubsidy.value > cappingValue ? cappingValue : eafEnergySubsidy.value;
        });
        let enAuditFromDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimFromDate')[0]);
        let enAuditToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_claimToDate')[0]);
        enAuditToDate.addEventListener('input', () =>{
          let startDate = enAuditFromDate.value;
          let endDate = enAuditToDate.value;
          let fromDate = new Date(startDate);
          let toDate = new Date(endDate);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          let policyEndDateCheck = this.eligibilityEndDateCheck('cls_claimToDate');
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
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ineligibility Notification',
                html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date.',
              });
              enAuditToDate.value = '';
            }
          }
        });
        
        enAuditFromDate.addEventListener('input', ()=>{
          enAuditToDate.value="";
        });
        this.fromAlphaNumericValidation();
        this.fromToDateValidation();
        this.fillUpMdInfo('cls_eafNameofMD', 'cls_eafDegnMD');
      break;
      /*End of calculation for Energy Audit fee*/
       /*Start of calculation for Recruitment Assistance Datacenter Developed by Bindurekha Nayak*/
      case 111 :
        let totalBreakUpAmount: any = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalClaimAmount')[0]);
        let totalBreakUp: any       = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalBrkp')[0]);
        totalBreakUp.disabled       = true;
        let totalBreakUpOther: any       = (<HTMLInputElement>document.getElementsByClassName('cls_raTotalBrkpOthers')[0]);
        totalBreakUpOther.disabled = true;
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
        this.fillUpMdInfo('cls_mdName', 'cls_mdDegn');
        this.fromAlphaNumericValidation();
        this.fromToDateValidation();
      
      break;
      /*End of calculation for Recruitment Assistance Datacenter Developed by Bindurekha Nayak*/
      /*Start of calculation for Green and Self-Power Generating Developed by Bindurekha Nayak*/
      case 113:
        let cocTotalEnergy: any = (<HTMLInputElement>document.getElementsByClassName('cls_cocRegUnit')[0]);
        let cocInvestment: any = (<HTMLInputElement>document.getElementsByClassName('cls_cocInvestment')[0]);
        let cocTotalSubsidy: any = (<HTMLInputElement>document.getElementsByClassName('cls_cocSubsidy')[0]);
        let cocCapping:any = 10000000;
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
        let cocParam = {
          "intId": sessionStorage.getItem('REGD_ID')
        };
        this.IrmsDetailsService.getRegCompanyDetails(cocParam).subscribe(res => {
          this.loading = false;
          if(res.status == 200){
            if (res.result.unitDetails) {
              cocTotalEnergy.value = (res.result.unitDetails.unitId !== null && res.result.unitDetails.unitId !== undefined)? res.result.unitDetails.unitId : cocTotalEnergy.value;
            }
          }
        });
        this.fillUpMdInfo('cls_cocName', 'cls_cocDegn');
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Green and Self-Power Generating */
       /*Start of calculation for Skill Gap Training Assistance Developed By Bindurekha Nayak*/
       case 110:{
        let sgtaParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(sgtaParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_sgtaPrevAmount');
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
          
          this.fillUpMdInfo('cls_mdName', 'cls_mdDesg');
          this.fromAlphaNumericValidation();      
          this.fromToDateValidation();
          this.validateDate();
      }
      break;
      /*End of calculation for Reimbursement of Skill Gap Training Assistance */
      /*Start of calculation for Reimbursement of Skill Certifications Developed By Bindurekha Nayak*/
      case 112:
        let scParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(scParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        this.fillUpPrevDetails('cls_scPrevAmount');
        this.fillUpMdInfo('cls_mdName', 'cls_mdDesn');
        let invtotalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_skTotalSkillAmount')[0]);
        let skPeriodAmountElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_skPeriodAmount')[0]);
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
          let ivsCapitalTotal = skPeriodAmountElement.value;
          let invtotalCapitalElementAmount = (50/100) * ivsCapitalTotal;
          invtotalCapitalElement.value = (invtotalCapitalElementAmount <= isCappingValueDet) ? invtotalCapitalElementAmount : isCappingValueDet;
        });
        skPeriodAmountElement.addEventListener('input', () => {
          invtotalCapitalElement.value="";
          skillFromDateElement.value="";
          skillToDateElement.value="";
        });
        invtotalCapitalElement.addEventListener('input', () => {
          let claimPeriod = (parseInt(claimPeriodElement.value)>0) ? parseInt(claimPeriodElement.value) : 0;
          let isCappingValueDet = claimPeriod*300000;
          let ivsCapitalTotal = skPeriodAmountElement.value;
          let invtotalCapitalElementAmount = (50/100) * ivsCapitalTotal;
          invtotalCapitalElement.value = (invtotalCapitalElementAmount <= isCappingValueDet) ? invtotalCapitalElementAmount : isCappingValueDet;
        });
        this.fromToDateValidation();
        this.validateDate();
        this.fromAlphaNumericValidation();
      break;
      /*End of calculation for Reimbursement of Skill Certifications */
      /*Start of calculation for Intern Stipend Reimbursement Developed By Bindurekha Nayak*/
      case 118:
        this.fillUpMdInfo('cls_isrName', 'cls_isrDesg');
        let totalInternEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrTotalIntern')[0]);
        let sdteEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrTotalSdteIntern')[0]);
        let stipendPeriodEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrPeriod')[0]);
        let stipendPaidPerEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrStipend')[0]);
        let totalStipenedClaimEle: any = (<HTMLInputElement>document.getElementsByClassName('cls_isrPrevTotalElgibleAmount')[0]);
        let internToDate: any = (<HTMLInputElement>document.getElementsByClassName('cls_internToDate')[0]);
        let internFromDate : any = (<HTMLInputElement>document.getElementsByClassName('cls_internFromDate')[0]);
        let stipened:any = document.getElementsByClassName('cls_isrCmnStpTotal');
        let fixedSdteIntern:any = 10;
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
          if (Number(totalInternEle.value) < Number(sdteEle.value)) {
            Swal.fire({
                icon: 'error',
                text: 'Total Number of Interns Hired must be greater than or equal to the Number of Interns Selected through SDTE/OSDA.'
            });
            totalInternEle.value = '';
            sdteEle.value = '';
            stipendPeriodEle.value = '';
        }
         })
        for (let item of stipened){
          item.addEventListener('input', () => {
            let totalIntern = isNaN(totalInternEle.value) ? 0 : totalInternEle.value;
            let totalSdteIntern = isNaN(sdteEle.value) ? 0 : sdteEle.value;
            let stipenedPeriod = isNaN(stipendPeriodEle.value) ? 0 : stipendPeriodEle.value;
            let stipenedPaidPerMonth = isNaN(stipendPaidPerEle.value) ? 0 : stipendPaidPerEle.value;
            if(totalSdteIntern < 10){
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
        internToDate.addEventListener('input', () =>{
          let startDate = internFromDate.value;
          let endDate = internToDate.value;
          let fromDate = new Date(startDate);
          let toDate = new Date(endDate);
          let difference = toDate.getTime() - fromDate.getTime();
          let diffMon = Math.floor(difference / (1000 * 60 * 60 * 24 * 30.44));
          let diffYear = diffMon / 12;
          if(toDate < fromDate){
            internToDate.value = '';
            Swal.fire({
              icon: 'error',
              text: 'To date can not be less than From date'
            });
          }else if(diffYear > 5){
            internToDate.value = '';
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
                  internToDate.value = '';
                  internFromDate.value='';
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
                    internToDate.value = '';
                  } 
                 }
                }
            });
          }
        });
        
        internFromDate.addEventListener('input', ()=>{
          internToDate.value="";
        });
        this.fillUpPrevDetails('cls_isrPrevAmount');
        this.fromAlphaNumericValidation();
        this.fromToDateValidation();
        this.validateDate();
       break;
      /*End of calculation for Intern Stipend Reimbursement */
      /*Start of calculation for Building Fee Subsidy Developed By Bindurekha Nayak*/
      case 116:
         this.fillUpMdInfo('cls_bfsName', 'cls_bfsDesg');
         this.fromAlphaNumericValidation();
         let dcBuildAppCostElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_dcBuildAppCost')[0]);
         let dcBuildFeeCostElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_dcBuildFeeCost')[0]);
         let dcTotalBuildFeeCostElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_dcTotalBuildFeeCost')[0]);
         dcBuildFeeCostElement.addEventListener('input', () => {
          let ivsCapitalTotal = parseFloat(dcBuildAppCostElement.value)+parseFloat(dcBuildFeeCostElement.value);
          let buildingCapingValue = 200000;
          let dcTotalBuildFeeCostElementAmount = (50/100) * ivsCapitalTotal;
          let totalAmountVal = (dcTotalBuildFeeCostElementAmount <= buildingCapingValue) ? dcTotalBuildFeeCostElementAmount : buildingCapingValue;
          dcTotalBuildFeeCostElement.value = totalAmountVal;
        });
        dcTotalBuildFeeCostElement.addEventListener('input', () => {
          let ivsCapitalTotal = parseFloat(dcBuildAppCostElement.value)+parseFloat(dcBuildFeeCostElement.value);
          let buildingCapingValue = 200000;
          let dcTotalBuildFeeCostElementAmount = (50/100) * ivsCapitalTotal;
          let totalAmountVal = (dcTotalBuildFeeCostElementAmount <= buildingCapingValue) ? dcTotalBuildFeeCostElementAmount : buildingCapingValue;
          dcTotalBuildFeeCostElement.value = totalAmountVal;
        });
        this.fromToDateValidation();
      break;
      /*End of calculation for Building Fee Subsidy */
      /*Start of calculation for EPF and ESI Developed by Bindurekha Nayak modified by Sibananda Sahu*/
      case 119:{
        this.fromAlphaNumericValidation();
        this.fromToDateValidation();
        this.fillUpPrevDetails('cls_epfEsiAmount');
        this.fillUpMdInfo('cls_epfEsiName', 'cls_epfEsiDegn');
        let domicleEmp: any             = (<HTMLInputElement>document.getElementsByClassName('cls_od_emp')[0]);
        let domicleExp: any             = (<HTMLInputElement>document.getElementsByClassName('cls_odisha_exp')[0]);
        let eeBdaElement: any           = (<HTMLInputElement>document.getElementsByClassName('cls_epfBda')[0]);
        let nonDomicleEmp: any          = (<HTMLInputElement>document.getElementsByClassName('cls_nonod_emp')[0]);
        let nonDomicleExp: any          = (<HTMLInputElement>document.getElementsByClassName('cls_nonOdisha_exp')[0]);
        let toDateElement: any          = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiTodate')[0]);
        let calculationEle: any         = document.getElementsByClassName('cls_calculation');
        let fromDateElement: any        = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiFromdate')[0]);
        let eeBdaTotalElement: any      = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiClaimAmount')[0]);
        let eeClaimAmountElement: any   = (<HTMLInputElement>document.getElementsByClassName('cls_epfEsiClaimAmount')[0]);
        let autoFillUpData              = JSON.parse(sessionStorage.getItem('companyDetails'));
        if (this.formEditStatus != 1) {
          domicleEmp.value              = autoFillUpData[0].int_odisha_total_emp != null ? parseInt(autoFillUpData[0].int_odisha_total_emp) || 0 : 0;
          domicleEmp.disabled           = true;
          nonDomicleEmp.value           = autoFillUpData[0].int_non_odisha_total_emp != null ? parseInt(autoFillUpData[0].int_non_odisha_total_emp) || 0 : 0;
          nonDomicleEmp.disabled        = true;
        }
        let eeParam = {
          "onlineProcessId": this.processId,
          "profileId": this.userId,
          "intId": sessionStorage.getItem('REGD_ID')
        }
        this.IrmsDetailsService.getPastRecordEmpTotal(eeParam).subscribe(res => {
          if(res.status == 200){
            this.previousClaimedSubsidy = res.result;
            this.booleanPrevClaimStatus = ((res.result).length) ? true : false;
          }
        });
        this.intNoOfDateField = 2;
        for (let item of calculationEle){
          item.addEventListener('input', () => {
            
              let domicleValue    = parseInt(domicleExp.value) || 0;
              let nonDomicleValue = parseInt(nonDomicleExp.value) || 0;
              
            eeClaimAmountElement.value = (domicleEmp.value > 0 ? domicleValue : 0) + (nonDomicleEmp.value > 0 ? (50 / 100) * nonDomicleValue : 0);
          })
        }
        let claimPeriodElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_epfSubsidyPeriod')[0]);

      let previousClaimPeriod = parseInt(claimPeriodElement.value);
         claimPeriodElement.addEventListener('change', function () {
             let claimPeriod = parseInt(claimPeriodElement.value);
             if (claimPeriod !== previousClaimPeriod) {
                 previousClaimPeriod = claimPeriod; 
                 
                 if (claimPeriod <= 0) {
                     Swal.fire({
                         icon: 'error',
                         text: 'Please select a valid Subsidy period!'
                     });
                     fromDateElement.value = '';
                     toDateElement.value = '';
                 } else {
                    fromDateElement.value = '';
                    toDateElement.value = '';
                }
             }
         });
         fromDateElement.addEventListener('change', () => {
          let claimPeriod = parseInt(claimPeriodElement.value);
          if(claimPeriod <= 0){
            Swal.fire({
              icon: 'error',
              text: 'Please select Claim period first!'
            })
          }
          let startDate = new Date(fromDateElement.value);
          let endDate = new Date(toDateElement.value);
          if (endDate < startDate) {
            toDateElement.value = '';
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
               "incStartDate": fromDateElement.value,
               "claimLimit": 5,
             };
             this.loading = true;
             this.IrmsDetailsService.getyearCheckIncubationRental(prvParam).subscribe(res => {
               this.loading = false;
               let claimedPeriod = parseInt(res.claimedPeriod);
               let lastIncentiveDate = res.lastIncDate;
               if (res.status == 2) {
                 if (claimedPeriod >= 5) {
                   toDateElement.value = '';
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
                 fromDateElement.value = '';
               } else {
                 let ClaimablePeriod = 5 - claimedPeriod;
                 if (claimPeriod > ClaimablePeriod) {
                   Swal.fire({
                     icon: 'error',
                     text: 'You Can apply maximum ' + ClaimablePeriod + ' year!'
                   });
                   fromDateElement.value = '';
                   toDateElement.value = '';
                 } else {
                   let fromDate = new Date(fromDateElement.value);
                   let toDate = new Date(fromDate);
                   let currentDate = new Date();
                   toDate.setFullYear(fromDate.getFullYear() + claimPeriod);
                   // Validating if toDate is less than or equal to current date
                   if (toDate <= currentDate) {
                     let formattedToDate = toDate.toISOString().slice(0, 10);
                     toDateElement.value = formattedToDate;
                     toDateElement.readOnly = true;
                     toDateElement.dispatchEvent(new Event('change'));
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
        toDateElement.readOnly = true;
        toDateElement.addEventListener('change',  () => {
            toDateElement.readOnly = true;
           let startDate = new Date(fromDateElement.value);
           let endDate = new Date(toDateElement.value);
           if (endDate < startDate) {
            toDateElement.value = '';
             Swal.fire({
               icon: 'error',
               text: 'End date can not be less than start date'
             });
           }else{
             let policyEndDateCheck = this.eligibilityEndDateCheck('cls_epfEsiTodate');
             if(policyEndDateCheck==0){
               let startDate = new Date(fromDateElement.value);
               let endDate = new Date(toDateElement.value);
               
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
               toDateElement.value = '';
             }
           }
        });
      }
      break;
      /*End of calculation for EPF and ESI */
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
        } else if (attrType == 'telephoneNo') {
          // For Valid Mobile
          if (!currFocObj.vldChkLst.validTel(elmVal,elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }else if (attrType == 'tel') {
          // For Valid Mobile
          if (!currFocObj.vldChkLst.validMob(elmVal,elmId)) {
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
      // console.log(indx);
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
            // For Valid Telephone No
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
            // arrAddMoreDynamicElements.forEach(element:any => {

            // });
           // console.log(this.arralldynVal[elmId])
            //arralldynVal
          //  console.log(arrAddMoreDynamicElements);
          }
    }
  // });
  }
  // End of column wise add more on 31-10-23

   /**
   * Function Name: addMoreCalculation
   * Description: It calculate the add more field given field value
   * Created By: Bibhuti Bhusan Sahoo
   * Created Date: 31 Oct 2023
   */
   addMoreCalculation(data, ctrlId, formName){
    let totalAmount = 0;
    if(this.processId == 105){
      data[ctrlId].forEach(element => {
        console.log(element[1].ctrlValue);
        if(element[1].ctrlValue != ''){
          totalAmount += parseInt(element[1].ctrlValue);
        }
      });
      this.invSubTotalAssAmount = totalAmount;
      this.invSubCapitalAmount();
    }
  }

  /**
   * Function Name: calculateTotalCapital
   * Description: It calculate the total capital amount for "Interest Subsidy Form"
   * Created By: Bibhuti Bhusan Sahoo
   * Created Date: 01 Nov 2023
   */
  calculateTotalCapital(){
    let totalAmount = parseFloat(this.buildingCivilAmount) + parseFloat(this.equipmentAmount) + parseFloat(this.otherAssetTotalAmount);
    let totalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_iSTotalInv')[0]);
    totalCapitalElement.value = totalAmount;
  }

  /**
   * Function Name: invSubCapitalAmount
   * Description: It calculate the total capital amount for "Investment Subsidy Form"
   * Created By: Bibhuti Bhusan Sahoo
   * Created Date: 02 Nov 2023
   */
  invSubCapitalAmount(){
    let totalAmount = parseFloat(this.ivsSubBuildingAmount) + parseFloat(this.ivsSubPlantAmount) + parseFloat(this.ivsSubRefAmount) + parseFloat(this.ivsSubRndAmount) + parseFloat(this.ivsSubUtilityAmount) + parseFloat(this.ivsSubTransAmount) + parseFloat(this.invSubTotalAssAmount);
    let invSubtotalCapitalElement: any = (<HTMLInputElement>document.getElementsByClassName('cls_ivsCapInvest')[0]);
    invSubtotalCapitalElement.value = totalAmount;
    let event = new Event("input");
    invSubtotalCapitalElement.dispatchEvent(event);
  }

  /**
   * Function Name: getPrevClaimDetails
   * Description: This method is used to set Previous Claim details fields
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 06th Nov 2023
   * @param intId
   */
  getPrevClaimDetails(intId: any) {
    let index = this.previousClaimedSubsidy.findIndex(x => x.intId === intId);
    if(this.processId == 108){
      $('.cls_prevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_prevAmount');
      $('.cls_prevDateForm').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_prevDateTo').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 68){
      $('.cls_isPreviousClaimAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_isPreviousClaimAmount');
      $('.cls_prev_claim_from').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_prev_claim_to').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 109){
      $('.cls_sgstAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_sgstAmount');
      $('.cls_sgstFrom').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_sgstTo').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 110){
      $('.cls_sgtaPrevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_sgtaPrevAmount');
      $('.cls_sgtaPrevFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_sgtaPrevToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 112){
      $('.cls_scPrevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_scPrevAmount');
      $('.cls_scPrevFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_scPrevToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 51){
      $('.cls_qscfrAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_qscfrAmount');
      $('.cls_qscfrDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      this.modalService.dismissAll();
    }else if(this.processId == 42){
      $('.cls_miaAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_miaAmount');
      $('.cls_miaDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
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
    }else if(this.processId == 118){
      $('.cls_isrPrevAmount').val(this.previousClaimedSubsidy[index].total_int_prev_cia_amt);
      this.keyUpEvent('cls_isrPrevAmount');
      $('.cls_isrPrevFromDate').val(this.previousClaimedSubsidy[index].dtmCreatedOn);
      $('.cls_isrPrevToDate').val(this.previousClaimedSubsidy[index].stmUpdatedOn);
      this.modalService.dismissAll();
    }
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
    button.classList.add('btn','btn-outline-primary','mb-2','custom-dynamic-button');
    let parentElement = ClaimEvent.closest('div[id^="ctrl_"]');
    let headingBtnDiv = parentElement.querySelector('.heading-btn');
    const h6Element = headingBtnDiv?.querySelector('.h6');
    if (h6Element) {
        h6Element.insertAdjacentElement('afterend', button);
    }
    button.addEventListener('click', () => {
      this.selectPreviousClaimedDetails();
    });
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
    let today: string = new Date().toISOString().split('T')[0];
    let commencementBothDate: any = document.getElementsByClassName('cls_check_commencement_both_date');
    
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
  /**
   * Function Name: skillGapAddMoreCalculation
   * Description: It calculate the add more field given field value
   * Created By: Bindurekha Nayak
   * Created Date: 09th may 2024
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
   * Created on: 23 july 2024
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
      let policyEndDateCheck = this.eligibilityEndDateCheck('cls_ptsToDate');
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
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Ineligibility Notification',
          html: 'Unfortunately, you are not eligible for this start date.<br>The specified start date exceeds the policy end date.',
        });
        ptsToDate.value = '';
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
    75: ['cls_parrent_previous_claim'],
    76: ['cls_parrent_previous_claim'],
    133: ['cls_parrent_previous_claim'],
    134: ['cls_parrent_previous_claim'],
    135: ['cls_prev_claim_hd'],
    78: ['cls_parrent_previous_claim']
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
}
