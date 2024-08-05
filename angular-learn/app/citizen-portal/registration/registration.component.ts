import { Component, ElementRef, OnInit, ViewChild, Input, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  NgbModal,
  NgbTooltip,
  ModalDismissReasons,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { TranslateService } from '@ngx-translate/core';
import { CitizenMasterService } from '../../citizen-portal/service-api/citizen-master.service';
import { CitizenProfileService } from '../service-api/citizen-profile.service';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { IrmsDetailsService } from '../service-api/irms-details-service';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
//import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

// Added by Mrutunjay

import { WebcommonservicesService } from 'src/app/webcommonservices.service';
import { ViewportScroller } from '@angular/common';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../../../styles.scss', './registration.component.css'],
  providers: [ValidatorchklistService],
})
export class RegistrationComponent implements OnInit {
  @ViewChildren('datePicker') datepickerDirectives: QueryList<BsDatepickerDirective>;
  @Input() childprocessId: any;
  @Input() fromadmin: any;
  loginSts: any;
  public innerWidth: any;
  farmerInfo: any;
  // Mrutunjay Added
  arrSelectedCheckbox: any[] = [];
  processId: any = 0;
  dynamicCtrlDetails: any = [];
  dynamicCtrlDetKeys: any = [];
  arrCascadingBindDependtDetails: any[] = [];
  arrallStaticDependtDetails: any[] = [];
  ctrlarray: any;
  currSecTabKey: any = 0;
  currSecId: any = 0;
  onlineServiceId: any = 0;
  formName: any = '';
  arralldynVal: any[] = [];
  arrallCascadingDetails: any[] = [];
  prevdipStatus: any = 'd-none';
  // editor:any = ClassicEditor;
  ckEdtorCls=environment.ckEdiorClass;
  editor: any = '';
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
  getUserInfo: any = null;
  parentDetVal: any[] = [];
  preBtnDisabled: boolean = false;
  loadDynBindAllData: any = [];
  //added by sibananda to disable tabs
  devMode = environment.devMode;
  secDisabled: any; 
  private dispatchingChange = false;
  //end for disable tabs.
  arrSetAllDataKeys: any = [];  //For Date format || Arpita
  // Mrutunjay Added
  @ViewChild('formFile', { static: false })
  formFile: ElementRef;
  constructor(
    public authService: CitizenAuthService,
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
    private scroller: ViewportScroller,

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
    this.secDisabled = !environment.devMode;
    // body scroll left sidebar fixed
    $(window).scroll(function () {
      var scrollTop = $(this).scrollTop();
      if (scrollTop > 150) {
        $('.fixed-sidebar').css('top', '140px');
      } else {
        $('.fixed-sidebar').css('top', '140px');
      }
    });

    // body scroll left sidebar fixed

    setTimeout(() => {
      this.empCal(null);
    }, 3000);
    this.secDisable = false;
    let schemeArr: any = [];
    let encSchemeId = this.route.snapshot.paramMap.get('id');
    //let encSchemeId = '';
    if (encSchemeId != '' && encSchemeId != null) {
      let schemeStr = this.encDec.decText(encSchemeId);
      schemeArr = schemeStr.split(':');
      this.processId = schemeArr[0];
      this.onlineServiceId = schemeArr[1];
      this.currSecId = schemeArr[2];
    } else {
      this.getRegistrationCount();
    }
    this.processId = 21;
    let dynSchmCtrlParms = {
      intProcessId: 21,
      intOnlineServiceId: this.onlineServiceId,
      sectionId: this.currSecId,
    };
    this.getUserDetails();
    this.loadDynamicCtrls(dynSchmCtrlParms);
     
  }

  setHtmlData(data: any) {
    return this.encDec.decodeHtml(data);
  }
  loadDynamicCtrls(dynSchmCtrlParms: any) {
    this.arrAddmoreElemntKeys = [];
    this.dynamicCtrlDetails = [];
    this.arrAddmoreFilledData = [];
    this.arrUploadedFiles = [];
    this.arrSetAllDataKeys = [];
    this.WebCommonService.schemeDynCtrl(dynSchmCtrlParms).subscribe((res) => {
      this.loading = true;
      if (res.status == 200) {
        this.dynamicCtrlDetails = res.result;
        const sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
        let orgType = sessionInfo.USER_ORG_TYPE;
        this.dynamicCtrlDetKeys = Object.keys(this.dynamicCtrlDetails).sort();
        if (orgType !== 1) {
          var index = this.dynamicCtrlDetKeys.indexOf('sec_6_426');
          this.dynamicCtrlDetKeys.splice(index, 1);
        }
        //to hide required fields as of organisation type :by sibananda
        setTimeout(() => {
          //for semiconductor unit
          if (orgType !== 5){
            let ismApprovedCls = document.getElementsByClassName('cls_imsapproved');
            if (ismApprovedCls[0]) {
              $("#"+ismApprovedCls[0].id).closest(".dynGridCls").hide();
            }
          } 
          if(orgType !== 2){//for bpo unit
            let totalApproved = document.getElementsByClassName('cls_total_approved');
            if (totalApproved[0]) {
              $("#"+totalApproved[0].id).closest(".dynGridCls").hide();
            }
          }
        }, 2000);
        //End of hiding required fields
        this.formName = res.formName;
        //this.dynamicCtrlDetKeys = Object.keys(this.dynamicCtrlDetails).sort();
        setTimeout(() => {
          this.loadDynamicValue();
        }, 2000);
        setTimeout(() => {
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
          }
        }, 3000);
        setTimeout(() => {
          this.loadDependCtrls();
          this.setCalcFields();

          if (this.onlineServiceId > 0) {
            // For Edit Case of Dependend Fields
            let prntIds: any = document.querySelectorAll('[data-dependctrlId]');

            for (let prntDet of prntIds) {
              let prntDetFields = prntDet.getAttribute('data-dependctrlId');
              if (prntDet.getAttribute('data-dependctrlId') != 0) {
                let parentDetailsElements: any =
                  document.getElementsByName(prntDetFields);

                for (let loopOfParendetails of parentDetailsElements) {
                  let dependntTypeID =
                    loopOfParendetails.getAttribute('data-typeid');
                  if (dependntTypeID == 5) {
                    if (loopOfParendetails.checked == true) {
                      loopOfParendetails.click();
                    }
                  } else if (dependntTypeID == 6) {
                    if (loopOfParendetails.checked == true) {
                      loopOfParendetails.click();
                    }
                  } else if (dependntTypeID == 3) {
                    var event = new Event('change');
                    loopOfParendetails.dispatchEvent(event);
                  }
                }

                //  alert("Rohit");
              }
            }
            // For Edit Case of Static Dependend Fields
            let loadStaicDependedFields: any = document.querySelectorAll(
              '[data-setstaticdependbindfalg=true]'
            );
            for (let loopStaticDetails of loadStaicDependedFields) {
              let staticTypeID = loopStaticDetails.getAttribute('data-typeid');

              if (staticTypeID == 3) {
                // For DropDown
                var event = new Event('change');
                loopStaticDetails.dispatchEvent(event);
              } else if (staticTypeID == 6) {
                let staticID = loopStaticDetails.getAttribute('data-id');
                let spltStaticID = staticID.split(':');
                let rdStaticid = spltStaticID[1];
                let rdStaticEle: any;
                setTimeout(() => {
                  rdStaticEle = document.getElementsByName(rdStaticid);
                  for (let rdStaticEleloop of rdStaticEle) {
                    //if(rdStaticEleloop.checked=true)
                    // {
                    //  alert("Rohioh");
                    // rdStaticEleloop.click()
                    // }
                  }
                }, 500);
              }
            }
          }
          this.loading = false;
        }, 4000);

        if (this.currSecTabKey == 0 && this.currSecId == 0) {
          this.currSecTabKey = this.dynamicCtrlDetKeys[0];

          this.currSecId =
            this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
        }
      }
    });

    setTimeout(() => {
      if (
        dynSchmCtrlParms.sectionId == 28 ||
        dynSchmCtrlParms.sectionId == 401
      ) {
        this.loadAccCustomValidation();
      } else if (dynSchmCtrlParms.sectionId == 433) {
        this.setIncentive();
      } else if (dynSchmCtrlParms.sectionId == 546) {
        this.financialCal();
      }
      this.fromToDateValidation();
      this.dateValidator();
    }, 5000);
    
  }
    /*
   * Function: dateValidator
   * Description: It will allow date picker to show min and max date based on condition
   * Date:15th Jul 2024
   * Created By: Sibananda sahu
   * Modified Date : __-__-____
   */
  dateValidator() {
    this.datepickerDirectives.forEach((datepickerDirective: BsDatepickerDirective) => {
      const hostElement = datepickerDirective['_elementRef'].nativeElement;

      if (hostElement) {
        if (hostElement.classList.contains('cls_validate_future_date')) {
          this.configureDatepicker(datepickerDirective, { maxDate: new Date() });
          // this.configureDatepicker(datepickerDirective, { minDate: new Date(2023, 0, 1), maxDate: new Date(2023, 11, 31) });
        } 
        // else if (hostElement.classList.contains('cls_check_commencement_date')) {
        //   let policyDataStr         = sessionStorage.getItem('SCHEME_POLICY_DET');
        //   let policyData            = JSON.parse(policyDataStr);
        //   let commecStartDate: Date = new Date(policyData.COMM_START_DATE)
        //   this.configureDatepicker(datepickerDirective, { minDate: commecStartDate});
        // } else if (hostElement.classList.contains('cls_check_commencement_end_date')) {
        //   let policyDataStr         = sessionStorage.getItem('SCHEME_POLICY_DET');
        //   let policyData            = JSON.parse(policyDataStr);
        //   let commecEndDate: Date   = new Date(policyData.COMM_END_DATE)
        //   this.configureDatepicker(datepickerDirective, { maxDate: commecEndDate});
        // }
      }

    });
  }

  /*
  * Function: configureDatepicker
  * Description: To configure bs-Datepicker
  * Date:15th Jul 2024
  * Created By: Sibananda sahu
  * Modified Date : __-__-____
  */
  private configureDatepicker(datepicker: BsDatepickerDirective, config: { maxDate?: Date, minDate?: Date }) {
    datepicker.bsConfig = { ...datepicker.bsConfig, ...config };
    datepicker.setConfig();
  }

  storeCasDetials(cascadingDetails: any, id: any) {
    this.arrallCascadingDetails[id] = cascadingDetails;
  }
  curSelectedSec(sectionKey: any) {
    //added for disabling tabs click
    if (this.secDisabled) {
      return;
    }
    //added for disabling tabs click
    this.currSecTabKey = sectionKey;
    this.currSecId = this.dynamicCtrlDetails[sectionKey]['sectionid'];
    let dynSchmCtrlParms = {
      intProcessId: this.processId,
      sectionId: this.currSecId,
      intOnlineServiceId: this.onlineServiceId,
    };
    this.loadDynamicCtrls(dynSchmCtrlParms);
    setTimeout(() => {
      this.empCal(null);
      //added by sibananda for vfx calculation
      let vfxExistdropDown =
        document.getElementsByClassName('cls_vfx_existance');
      if (vfxExistdropDown[0]) {
        let vfxExistdropDownId = vfxExistdropDown[0].id;
        document
          .getElementById(vfxExistdropDownId)
          .addEventListener('change', (event) => {
            const vfxExistdropDownValue =
              parseInt(
                (<HTMLInputElement>document.getElementById(vfxExistdropDownId))
                  .value
              ) ?? 0;
            if (vfxExistdropDownValue == 1) {
              this.empCal(null);
            }
          });
      }
    }, 3000);
  }
  

  // loadDependCtrls() {
  //   this.checkCastCategory('cls_ethnicity_race_cat','cls_parent_cast_certificate');
  //   this.checkHandicapped('cls_handicapped_able','cls_parent_different_able_certificate');

  //   let prntIds: any = document.querySelectorAll('[data-parentflag]');
  //   // let prntIds:any = document.querySelectorAll("[data-dependctrlId]")

  //   for (let prntDet of prntIds) {
  //     let dependntTypeID = prntDet.getAttribute('data-typeid');

  //     // if(prntDet.getAttribute('data-dependflagstatus') == 'false')
  //     // {
  //     //   continue;
  //     // }
  //     if (dependntTypeID == 6 || dependntTypeID == 5) {
  //       // For Radio and checkbox
  //       let id = prntDet.name;
  //       let chldDetls: any = document.querySelectorAll(
  //         '[data-dependctrlId=' + id + ']'
  //       );
  //       prntDet.addEventListener('click', () => {
  //         for (let loopChldDet of chldDetls) {
  //           let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
  //           lopdependval = lopdependval.split(',');
  //           if (lopdependval.includes(prntDet.value)) {
  //             if (prntDet.checked) {
  //               loopChldDet.closest('.dynGridCls').classList.remove('d-none');
  //               loopChldDet
  //                 .closest('.dynGridCls')
  //                 .querySelector('.dynlabel')
  //                 .classList.remove('d-none');
  //               loopChldDet.classList.remove('d-none');
  //               // loopChldDet.closest(".control-holder").querySelector('.form-group').classList.remove('d-none');

  //               let lblEmnt = (<HTMLInputElement>(
  //                 document.getElementById(loopChldDet.id)
  //               )).nextElementSibling;
  //               lblEmnt?.classList.remove('d-none');
  //             } else {
  //               loopChldDet.closest('.dynGridCls').classList.add('d-none');
  //               loopChldDet
  //                 .closest('.dynGridCls')
  //                 .querySelector('.dynlabel')
  //                 .classList.add('d-none');
  //               loopChldDet.classList.remove('d-none');
  //               loopChldDet.classList.add('d-none');
  //               let lblEmnt = (<HTMLInputElement>(
  //                 document.getElementById(loopChldDet.id)
  //               )).nextElementSibling;
  //               lblEmnt?.classList.add('d-none');
  //               let tpId = loopChldDet.getAttribute('data-typeid');
  //               if (tpId == 2) {
  //                 (<HTMLInputElement>(
  //                   document.getElementById(loopChldDet.id)
  //                 )).value = '';
  //               } else if (tpId == 3) {
  //                 (<HTMLInputElement>(
  //                   document.getElementById(loopChldDet.id)
  //                 )).value = '0';
  //               }
  //             }
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
  //       //Added By Bibhuti Bhusan Sahoo For dropdown hide issue (Temporary Fixing)
  //       // let vfxDropdownChange: any = (<HTMLInputElement>document.getElementsByClassName('cls_vfx_existance')[0]);
  //       // if(vfxDropdownChange){
  //       // 	vfxDropdownChange.addEventListener('change', () => {
  //       //this.hideAllChildParent(prntDet, '');
  //       // 	})
  //       // }
  //       //Added By Bibhuti Bhusan Sahoo For dropdown hide issue (Temporary Fixing)
  //       //added by Rohit Kumar Behera for dependent add more field
  //       prntDet.addEventListener('change', () => {
  //         this.hideAllChildParent(prntDet, '');
  //         for (let loopChldDet of chldDetls) {
  //           let lopdependval = loopChldDet.getAttribute('data-dependentvalue');
  //           lopdependval = lopdependval.split(',');
  //           if (lopdependval.includes(prntDet.value)) {
  //             if (loopChldDet.getAttribute('data-typeid') == 8) {
  //               loopChldDet.closest('.dynGridCls').classList.remove('d-none');
  //               loopChldDet.classList.remove('d-none');
  //             } else if (loopChldDet.getAttribute('data-typeid') == 10) {
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
  // end for dependent add more field
  //Added by : Arpita || On: 24-jul-24
  loadDependCtrls() {
    //custom codes by irms team
    this.checkCastCategory('cls_ethnicity_race_cat','cls_parent_cast_certificate');
    this.checkHandicapped('cls_handicapped_able','cls_parent_different_able_certificate');
    //end custom codes by irms team
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
  //end for dependent add more field
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
    this.loadPanCustomValidation();
    this.formmAlphaNumericValidation();
  }
  /*
   * Function: formmAlphaNumericValidation
   * Description: To Validate alphanumeric
   * Created By: Bindurekha Nayak
   * Date: 18-03-2024
   */
  formmAlphaNumericValidation() {
    const alphaNumericElements =
      document.getElementsByClassName('cls_alphaNumeric');
    if (alphaNumericElements) {
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
  }
  /*
   * Function: loadPanCustomValidation
   * Description: To Validate pan validation
   * Created By: Bindurekha Nayak
   * Date: 14-03-2024
   */
  loadPanCustomValidation() {
    let panNoEle: any = <HTMLInputElement>(
      document.getElementsByClassName('cls_pan_no')[0]
    );
    if (panNoEle) {
      panNoEle.addEventListener('blur', () => {
        let panNoVal: any = panNoEle.value;
        let panCheckRes: boolean = this.validatePanCard(panNoVal);
        if (!panCheckRes) {
          panNoEle.value = '';
          Swal.fire({
            icon: 'error',
            text: 'Please enter correct pan',
          });
        }
      });
    }
  }
  /*
   * Function: loadAccCustomValidation
   * Description: To Validate custom validation pincode and account no
   * Created By: Bindurekha Nayak
   * Date: 14-03-2024
   */
  loadAccCustomValidation() {
    let accNoEle: any = <HTMLInputElement>(
      document.getElementsByClassName('cls_acc_no')[0]
    );
    let pinCodeEle: any = <HTMLInputElement>(
      document.getElementsByClassName('cls_pincode')[0]
    );
    if (accNoEle) {
      accNoEle.addEventListener('blur', () => {
        let accNoVal: any = accNoEle.value;
        if (!this.digitSum(accNoVal)) {
          accNoEle.value = '';
          Swal.fire({
            icon: 'error',
            text: 'Please enter correct Account Number',
          });
        }
      });
    } else if (pinCodeEle) {
      pinCodeEle.addEventListener('blur', () => {
        let pinNoVal: any = pinCodeEle.value;
        if (!this.digitSum(pinNoVal)) {
          pinCodeEle.value = '';
          Swal.fire({
            icon: 'error',
            text: 'Please enter correct pincode',
          });
        }
      });
    }
  }
  dynmaicValApi(params: any, dynbindCtrlId: any) {
    this.WebCommonService.loadDynamicBindDetails(params).subscribe((res) => {
      if (res.status == 200) {
        this.arralldynVal[dynbindCtrlId] = res.result;
        this.setUserDetails();
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
    this.secDisabled = false; //added by sibananda
    let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let schemeWiseFormDetails =
      this.dynamicCtrlDetails[this.currSecTabKey]['formDetails'];
    const formData = new FormData();
    let uploadFile: any;
    let validatonStatus = true;
    let validateArray: any[] = [];
    let arrJsnTxtDet: any = [];
    let fireUpdateCompanyName = false;
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
       uploadFile=""; //added by rakesh
      //if(elmClass == "gstin_registration_number" || elmClass == "company_name") fireUpdateCompanyName = true
      if (ctrlTypeId == 2) {
        // console.log("processId ==="+ this.processId +"environment.registrationProcessId ==="+ environment.registrationProcessId +"sessionInfo.USER_ORG_TYPE ==="+ sessionInfo.USER_ORG_TYPE+"cls_total_approved ==="+elmClass.includes("cls_total_approved")+elmClass);
        // For Textbox
        //for bpo skip validation :by sibananda
        if((this.processId == environment.registrationProcessId && sessionInfo.USER_ORG_TYPE!=2 && elmClass.includes("cls_total_approved")))
        {
            continue;
        }
        //End for bpo skip validation :by sibananda
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          if (validateArray[dependElemId] == undefined) {
            continue;
          }
          if (
            !dependElemdCondVal.includes(validateArray[dependElemId].ctrlValue)
          ) {
            continue;
          }
        }
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

        if (mandatoryDetails) // For Mandatory
        {

          if (!this.vldChkLst.blankCheck(elmVal, this.encDec.decodeHtml(lblName) + ' can not be left blank', elmId)) {

            this.scroller.scrollToAnchor(elmId);
            (<HTMLInputElement>document.getElementById(elmId)).focus();


            validatonStatus = false;
            break;
          }

        }
        if (elmClass.includes('gstin_registration_number')) {
          // For Mandatory
          if (!this.vldChkLst.validGstNo(elmVal)) {
            this.scroller.scrollToAnchor(elmId);
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
        //for ifsc code validation :by sibananda
        if (elmClass.includes('cls_ifsc_code')) {
          // For Mandatory
          if (!this.vldChkLst.validIfscCode(elmVal)) {
            validatonStatus = false;
            break;
          }
        }
        //End for ifsc code validation

        if (elmClass == 'organization_pan_number') {
          // For Mandatory
          if (!this.vldChkLst.validPanNo(elmVal)) {
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMaxLength != '' && Number(ctrlMaxLength > 0)) // For Max length
        {

          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, this.encDec.decodeHtml(lblName), elmId,attrType)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '' && Number(ctrlMinLength > 0))// For Min length
        {
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, this.encDec.decodeHtml(lblName), elmId,attrType)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }

        }

        if (attrType == 'email') // For Valid Email
        {
          if (!this.vldChkLst.validEmail(elmVal, elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }

        }

        else if (attrType == 'tel') // For Valid Mobile
        {
          if (!this.vldChkLst.validMob(elmVal, elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }

        }  else if (attrType == 'telephoneNo') // For Valid Mobile
        {
          if (!this.vldChkLst.validTel(elmVal)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }

        }

        else if (attrType == 'password') // For password Validation
        {
          if (!this.vldChkLst.validPassword(elmVal, elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
      } else if (attrType == 'date' && elmVal.length > 0) { 
        let elmValDate: any = elmVal.split('-');  //To Format Date || Arpita
        elmVal = elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];
        elmVal = this.formatDate(elmVal);
      }
    }else if (ctrlTypeId == 3) {
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

          if (validateArray[dependElemId] == undefined) {
            continue;
          }
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

          if (!dependElemdCondVal.includes(dependElemVal)) {
            continue;
          }
        }

        // if (mandatoryDetails) {
        //   // For Mandatory
        //   if (!this.vldChkLst.selectDropdown(elmVal, lblName)) {
        //     // alert("Rohit")
        //     validatonStatus = false;
        //     break;
        //   }
        // }
        if (mandatoryDetails) // For Mandatory
        {

          if (!this.vldChkLst.selectDropdown(elmVal, this.encDec.decodeHtml(lblName), elmId)) {

            (<HTMLInputElement>document.getElementById(elmId)).focus();
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
          if (validateArray[dependElemId] == undefined) {
            continue;
          }
          if (dependElemdCondVal.includes(dependElemVal)) {
            continue;
          }
        }
        // if (mandatoryDetails) {
        //   // For Mandatory
        //   if (
        //     !this.vldChkLst.blankCheck(
        //       elmVal,
        //       lblName + ' can not be left blank'
        //     )
        //   ) {
        //     validatonStatus = false;
        //     break;
        //   }
        // }
        // if (ctrlMaxLength != '') {
        //   // For Max length
        //   if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName)) {
        //     validatonStatus = false;
        //     break;
        //   }
        // }

        // if (ctrlMinLength != '') {
        //   // For Min length
        //   if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
        //     validatonStatus = false;
        //     break;
        //   }
        // }
        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheck(elmVal, this.encDec.decodeHtml(lblName) + ' can not be left blank', elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }
        if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) // For Max length
        {
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, this.encDec.decodeHtml(lblName), elmId,attrType)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }


        }

        if (ctrlMinLength != '' && Number(ctrlMinLength) > 0)// For Min length
        {
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, this.encDec.decodeHtml(lblName), elmId)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
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

          if (validateArray[dependElemId] == undefined) {
            continue;
          }
          if (validateArray[dependElemId]['ctrlTypeId'] == 5) {
            // For Checkbox
          } else if (validateArray[dependElemId]['ctrlTypeId'] == 6) {
            // For Radio
            if (
              !dependElemdCondVal.includes(
                validateArray[dependElemId]['ctrlValue']
              )
            ) {
              continue;
            }
          } else {
            let dependElemVal = (<HTMLInputElement>(
              document.getElementById(dependElemId)
            )).value;

            if (!dependElemdCondVal.includes(dependElemVal)) {
              continue;
            }
          }
        }

        // if (mandatoryDetails) {
        //   // For Mandatory
        //   if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
        //     validatonStatus = false;
        //     break;
        //   }
        // }
        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, this.encDec.decodeHtml(lblName), elmId)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 6) {
        // For Radio Btn
        //for semiconductor skip validation :by sibananda
        if((this.processId == environment.registrationProcessId && sessionInfo.USER_ORG_TYPE!=5 && elmClass.includes("cls_imsapproved")))
        {
            continue;
        }
        //End for semiconductor skip validation :by sibananda
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
          if (validateArray[dependElemId] == undefined) {
            continue;
          }
          //   return false;

          if (validateArray[dependElemId]['ctrlTypeId'] == 5) {
            // For Checkbox
          } else if (validateArray[dependElemId]['ctrlTypeId'] == 6) {
            // For Radio
            if (
              !dependElemdCondVal.includes(
                validateArray[dependElemId]['ctrlValue']
              )
            ) {
              continue;
            }
          } else {
            let dependElemVal = (<HTMLInputElement>(
              document.getElementById(dependElemId)
            )).value;

            if (!dependElemdCondVal.includes(dependElemVal)) {
              continue;
            }
          }
        }
        // if (mandatoryDetails) {
        //   // For Mandatory
        //   if (!this.vldChkLst.blankCheckRdoDynamic(elmId, lblName)) {
        //     validatonStatus = false;
        //     break;
        //   }
        // }
        if (mandatoryDetails) // For Mandatory
        {
          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, this.encDec.decodeHtml(lblName), elmId)) {
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 7) {
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];
          if (validateArray[dependElemId] == undefined) {
            continue;
          }
          //   return false;

          if (validateArray[dependElemId]['ctrlTypeId'] == 5) {
            // For Checkbox
          } else if (validateArray[dependElemId]['ctrlTypeId'] == 6) {
            // For Radio
            if (
              !dependElemdCondVal.includes(
                validateArray[dependElemId]['ctrlValue']
              )
            ) {
              continue;
            }
          } else {
            let dependElemVal = (<HTMLInputElement>(
              document.getElementById(dependElemId)
            )).value;

            if (!dependElemdCondVal.includes(dependElemVal)) {
              continue;
            }
          }
        }
        uploadFile = this.arrUploadedFiles[elmId];
        if (mandatoryDetails) {
          // For Mandatory
          if (
            uploadFile == '' ||
            uploadFile == undefined ||
            uploadFile['fileName'] == '' ||
            uploadFile['fileName'] == undefined
          ) {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + lblName,
            })
            validatonStatus = false;
            break;
          }
        }
      } else if (ctrlTypeId == 10) {
        //For AddMore
        if (schemeWiseFormCtr['dependctrlDetails'][0]['ctrlChkDepend']) {
          // For Dependent Check
          let dependElemId =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependParent'];
          let dependElemdCondVal =
            schemeWiseFormCtr['dependctrlDetails'][0]['ctrlSelDependValue'];

          let dependElemVal;
          if (validateArray[dependElemId] == undefined) {
            continue;
          }
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
          if (!dependElemdCondVal.includes(dependElemVal)) {
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

          // if(!this.addAddMoreArrTabularWise(schemeWiseFormCtr))
          //   {
          //     validatonStatus =  false;
          //     break;
          //   }
          //   else
          //   {
          // addMoreElementData = JSON.stringify(this.arrAddmoreFilledTabularData[elmId]);
          // }
        } else {
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
            // console.log(schemeWiseFormCtr['addmoreDetails'][0]['ctrlId']);
            // (<HTMLInputElement>document.getElementById(schemeWiseFormCtr['addmoreDetails'][0]['ctrlId'])).focus();
            validatonStatus = false;
            break;
          } else {
            addMoreElementData = JSON.stringify(
              this.arrAddmoreFilledData[elmId]
            );
          }
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
    //if(fireUpdateCompanyName) //console.log(`this is a test message`);
    formData.append('intProfileId', sessionInfo.USER_ID);
    formData.append('processId', this.processId);
    formData.append('secId', this.currSecId);
    formData.append('intOnlineServiceId', this.onlineServiceId);
    formData.append("userOrgType",(sessionInfo!=undefined && sessionInfo!=null && sessionInfo!="" && sessionInfo.USER_ORG_TYPE!=undefined && sessionInfo.USER_ORG_TYPE!="" && sessionInfo.USER_ORG_TYPE!=null) ? sessionInfo.USER_ORG_TYPE : "0" )
    // formData.append('optionTxtDetails', JSON.stringify(arrJsnTxtDet));
    if (validatonStatus) {
      this.WebCommonService.schemeApply(formData).subscribe((res: any) => {
        let validationMsg =
          res.result.validationMsg != '' ? res.result.validationMsg : 'error';
        if (res.status == 200) {
          this.onlineServiceId = res.result.intOnlineServiceId;
          if (
            this.dynamicCtrlDetKeys.length >
            this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey) + 1
          ) {
            let latestDynCtlkeyIndex =
              Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey)) + 1;
            this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
            this.currSecId =
              this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
            this.prevdipStatus = '';
            this.secDisable = false;
            // added by sibananda to enable button during go to previous
            const buttonElement = <HTMLButtonElement>(
              document.getElementById(
                'sec-tab-' + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex]
              )
            );
            buttonElement.disabled = false;
            // End by sibananda
            (<HTMLElement>(
              document.getElementById(
                'sec-tab-' + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex]
              )
            )).click();
            if (!environment.devMode) {
              this.secDisabled = true;
            } //added by sibananda
            // setTimeout(() => {
            // 	this.empCal(null);
            // }, 3000);
            // this.secDisable   = true;
          } else {
            let formParms =
              this.processId + ':' + this.onlineServiceId + ':' + 0;
            let encSchemeStr = this.encDec.encText(formParms.toString());
            this.router.navigate([
              '/citizen-portal/registration-view',
              encSchemeStr,
            ]);

            /*this.router.navigate(['/citizen-portal/registration-view']);
						let formParms  = this.processId+':'+this.onlineServiceId+':'+1;
						let encSchemeStr = this.encDec.encText(formParms.toString());
						if(this.fromadmin != 'admin'){
							 this.router.navigate(['/website/formPreview',encSchemeStr]);
						}
					  else{
						Swal.fire({
						  icon: 'success',
						  text: 'Success',
						  confirmButtonColor: '#3085d6',
						  confirmButtonText: 'Ok'
						}).then((result) => {

							 let formParms  = this.processId+':'+0+':'+0;
							 let encSchemeStr = this.encDec.encText(formParms.toString());


						this.router.navigate(['./admin/configuration/dynamicFormsview',encSchemeStr]);
						});
					  }*/
          }
        } else {
          Swal.fire({
            icon: 'error',
            text: validationMsg,
          });
        }
      });
    }
  }
  
  //To Format DateField || Arpita | Siba
  formatDate(inputDate: any) {
    const [year, monthStr, day] = inputDate.split('-');
    const month = new Date(`${monthStr} 1 2000`).getMonth() + 1;
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
    return formattedDate;
  }
  //end date formater

  goToPrevious() {
    this.secDisabled = false; //added by sibananda
    if (
      this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey) == 0 &&
      this.fromadmin != 'admin'
    ) {
      this.router.navigate(['/website/servicelisting']);
    } else {
      let latestDynCtlkeyIndex =
        Number(this.dynamicCtrlDetKeys.indexOf(this.currSecTabKey)) - 1;
      this.currSecTabKey = this.dynamicCtrlDetKeys[latestDynCtlkeyIndex];
      this.currSecId = this.dynamicCtrlDetails[this.currSecTabKey]['sectionid'];
      this.prevdipStatus = '';
      this.secDisable = false;
      // added by sibananda to enable button during go to previous
      const buttonElement = <HTMLButtonElement>(
        document.getElementById(
          'sec-tab-' + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex]
        )
      );
      buttonElement.disabled = false;
      // End by sibananda
      (<HTMLElement>(
        document.getElementById(
          'sec-tab-' + this.dynamicCtrlDetKeys[latestDynCtlkeyIndex]
        )
      )).click();
      this.secDisable = true;
      if (!environment.devMode) {
        this.secDisabled = true; // added by sibananda for section disaBLING
      }
    }
  }

  reset() {
    if (this.currSecTabKey == 'sec_1_866') {
      location.reload();
      return;
    }
    let dynSchmCtrlParms = {
      intProcessId: 21,
      intOnlineServiceId: this.onlineServiceId,
      sectionId: this.currSecId,
    };
    this.loadDynamicCtrls(dynSchmCtrlParms);
  }
  // setCkEdtorValue({ editor }: ChangeEvent , ckId:any)
  // {
  //   this.arrckEdtorVal[ckId] = editor.getData();
  // }

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

  removeFile(ctrlId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete',
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        // Checking if the user confirmed deletion
        (<HTMLInputElement>document.getElementById(ctrlId)).value = '';
        document
          .getElementById('fileDownloadDiv_' + ctrlId)
          ?.closest('.form-group')
          ?.querySelector('.downloadbtn')
          ?.setAttribute('href', '');
        document
          .getElementById('fileDownloadDiv_' + ctrlId)
          ?.classList.add('d-none');
        delete this.arrUploadedFiles[ctrlId];
        const element = document.getElementById('fileName_' + ctrlId);
        if (element) {
          // Setting the innerHTML of the element to Browse File
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
      fileName != 'NULL' &&
      fileName != '' &&
      !this.arrDeletedUploadedFiles.includes(ctrlId)
    ) {
      
      document.getElementById('fileDownloadDiv_' + ctrlId)?.closest('.form-group')
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
            // Set the innerText of the element to the fileName variable
            element.innerText = fileName;
          }
      
     




      //
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
      (<HTMLInputElement>document.getElementById(loopdynCalc.id)).readOnly =
        true;
      for (let clcloop of this.arrCalcFields[loopdynCalc.id]) {
        if (clcloop.ctrlCalcFieldtype == 'fieldValue') {
          let clcElement = <HTMLInputElement>(
            document.getElementById(clcloop.ctrlCalcValue)
          );
          clcElement.addEventListener('keyup', () => {
            this.calculate(this.arrCalcFields[loopdynCalc.id], loopdynCalc.id);
          });
        }
      }
    }
    return;
  }

  calculate(
    calcDetails: any,
    ctrlId: any // This function is used for Calculation purpose
  ) {
    let clc: any = 0;
    let valuate: any = '';
    for (let calcloop of calcDetails) {
      if (calcloop.ctrlCalcFieldtype == 'fieldValue') {
        let fldValue = (<HTMLInputElement>(
          document.getElementById(calcloop.ctrlCalcValue)
        )).value;
        clc = fldValue.length > 0 ? fldValue : 0;
      } else {
        clc = calcloop.ctrlCalcValue;
      }
      valuate += clc;
    }
    (<HTMLInputElement>document.getElementById(ctrlId)).value = eval(valuate);
    return;
  }

  backClicked() {
    this._location.back();
  }

  setArrAddMoreDetails(ctrlId: any, addMoreparams: any) {
    // This function is used to set the configured data of Add more
    this.arrAddmoreDetails[ctrlId] = addMoreparams;
  }

  addMoreData(addMorectrlId: any) {
    let rowaddmoredate: any = ''; //to clear date | Arpita 
    let addMoreEleValStatus = [];  //Added for add more element value status store
    let validateArray: any[] = [];
    let validatonStatus = true;
    let arrAddMoreElementWiseData: any[] = [];
    let uploadFile: any;
    let indx = 0;
    let blankArray: any = [];
    let clearAddMoreValue = [];
    let arrAllCtrlFileIds: any[] = [];
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
        let addMoreEleVal: any;
        let checkedCtr: number = 0;

        if (ctrlTypeId == 2 || ctrlTypeId == 3 || ctrlTypeId == 4) {
          addMoreEleVal = (<HTMLInputElement>document.getElementById(elmId)).value;
        } else if (ctrlTypeId == 5 || ctrlTypeId == 6) {
          let className = 'cls_' + elmId;
          let ele = document.getElementsByClassName(className);
          
          for (let i = 0; i < ele.length; i++) {
            if ((ele[i] as HTMLInputElement).checked) {
              addMoreEleVal = 1;
            }
          }
        } else if (ctrlTypeId == 7) {
          if (this.arrUploadedFiles[elmId] !== undefined && this.arrUploadedFiles[elmId] !== 'undefined') {
            addMoreEleVal = this.arrUploadedFiles[elmId];
          }
        }
        if (addMoreEleVal == 0 || addMoreEleVal === '' || addMoreEleVal === undefined || addMoreEleVal === null ) {
          addMoreEleValStatus.push(0);
        } else {
          addMoreEleValStatus.push(1);
        }
      // End || Code added for adding add more element value status



      if (ctrlTypeId == 2) {
        // For Textbox
        elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;

        // if (mandatoryDetails) {
        //   // For Mandatory
        //   if (
        //     !this.vldChkLst.blankCheck(
        //       elmVal,
        //       lblName + ' can not be left blank'
        //     )
        //   ) {
        //     validatonStatus = false;
        //     break;
        //   }
        // }

        if (mandatoryDetails) {
          // For Mandatory
          if (
            !this.vldChkLst.blankCheck(
              elmVal,
              this.encDec.decodeHtml(lblName) + ' can not be left blank', elmId
            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMaxLength != '') {
          // For Max length
          if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, lblName,elmId,attrType)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (ctrlMinLength != '') {
          // For Min length
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, lblName)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }

        if (attrType == 'email') {
          // For Valid Email
          if (!this.vldChkLst.validEmail(elmVal)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } else if (attrType == 'tel') {
          // For Valid Mobile
          if (!this.vldChkLst.validMob(elmVal)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        }  else if (attrType == 'telephoneNo') // For Valid telephone
        {
          if (!this.vldChkLst.validTel(elmVal)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }

        } else if (attrType == 'password') {
          // For password Validation
          if (!this.vldChkLst.validPassword(elmVal)) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();
            validatonStatus = false;
            break;
          }
        } 
        else if (attrType == 'date' && elmVal.length > 0) {
          // For Date format | Arpita
          rowaddmoredate = elmVal;
          let elmValDate: any = elmVal.split('-');
          elmVal = elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];
          elmVal = this.formatDate(elmVal);


          //  let splitedDataVal: any = elmVal.split('-');
          //   if (splitedDataVal[1] != "") {
          //     const dateDataBs = new Date(elmVal);

          //     splitedDataVal[1] = dateDataBs.toLocaleDateString('en-US', {
          //       month: 'short'
          //     });
          //   }
          // rowaddmoredate =
          //   splitedDataVal[2] + '-' + splitedDataVal[1] + '-' + splitedDataVal[0];
          //   console.log(elmVal);
          // console.log(9);
          // elmVal = elmVal;
        }
        // validation for percentage of share
        if (this.currSecId == 866 || this.currSecId) {
          // validation for Branch Name
          if (elmClass.includes('cls_percentage')) {
            //for percentage not more then 100
            if (Number(elmVal) > 100) {
              Swal.fire({
                icon: 'error',
                text: lblName + ' should be within 100',
              });
              (<HTMLInputElement>document.getElementById(elmId)).focus();
              validatonStatus = false;
              break;
            }
          }
        }
      } else if (ctrlTypeId == 3) {
        // For DropDown
        let elm: any = <HTMLInputElement>document.getElementById(elmId);

        elmVal = elm.value;

        if (parseInt(elmVal) == 0 || elmVal == undefined || elmVal == '') {

          elmValText = '--';

        } else {

          elmValText = elm.options[elm.selectedIndex].text;

        }



        if (mandatoryDetails) {

          // For Mandatory

          if (!this.vldChkLst.selectDropdown(elmVal, this.encDec.decodeHtml(lblName), elmId)) {

            (<HTMLInputElement>document.getElementById(elmId)).focus();

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

        if (mandatoryDetails) {
          // For Mandatory
          if (
            !this.vldChkLst.blankCheck(

              elmVal,

              this.encDec.decodeHtml(lblName) + ' can not be left blank', elmId

            )
          ) {
            (<HTMLInputElement>document.getElementById(elmId)).focus();

            validatonStatus = false;

            break;
          }
        }
        if (ctrlMaxLength != '' && Number(ctrlMaxLength) > 0) {
         // For Max length

         if (!this.vldChkLst.maxLength(elmVal, ctrlMaxLength, this.encDec.decodeHtml(lblName), elmId,attrType)) {

          (<HTMLInputElement>document.getElementById(elmId)).focus();

          validatonStatus = false;

          break;

        }
        }

        if (ctrlMinLength != '' && Number(ctrlMinLength) > 0) {
          // For Min length
          if (!this.vldChkLst.minLength(elmVal, ctrlMinLength, this.encDec.decodeHtml(lblName), elmId)) {

            (<HTMLInputElement>document.getElementById(elmId)).focus();

            validatonStatus = false;

            break;

          }
        }
      } else if (ctrlTypeId == 5) {
        // For Checkbox
        if (mandatoryDetails) {
          // For Mandatory

          // For Mandatory

          if (!this.vldChkLst.blankCheckRdoDynamic(elmId, this.encDec.decodeHtml(lblName))) {

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

        if (chkdVal != '') {

          elmValText = chkdTxt;

        } else {

          elmValText = '--';

        }
      } else if (ctrlTypeId == 6) {
        // For Radio Btn
        // For Mandatory

        if (!this.vldChkLst.blankCheckRdoDynamic(elmId, this.encDec.decodeHtml(lblName))) {

          validatonStatus = false;

          break;

        }

        const radioBtnElmn = document.getElementsByName(elmId);



        for (let i = 0, length = radioBtnElmn.length; i < length; i++) {

          if ((<HTMLInputElement>radioBtnElmn[i]).checked) {

            elmVal = (<HTMLInputElement>radioBtnElmn[i]).value;

            let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;

            if (parseInt(elmVal) == 0 || elmVal == undefined || elmVal == '') {

              elmValText = '--';

            } else {

              let el = document.querySelector(`label[for="${rdId}"]`);

              elmValText = el?.textContent;

            }

          }

        }
      } else if (ctrlTypeId == 7) {
        if (this.arrUploadedFiles[elmId] != 'undefined' &&
        this.arrUploadedFiles[elmId]     != undefined) {

          uploadFile = this.arrUploadedFiles[elmId];

        }
 // this.arrUploadedFiles=[];

        if (uploadFile != '' || uploadFile != undefined) {
          arrAllCtrlFileIds.push(elmId);
        }
        if (mandatoryDetails) // For Mandatory
        {
          if (uploadFile == '' || uploadFile == undefined) {
            Swal.fire({
              icon: 'error',
              text: 'Please upload ' + this.encDec.decodeHtml(lblName)
            });
            validatonStatus = false;
            break;
          } else {
            const element = document.getElementById('fileName_' + elmId);
            if (element) {
              // Setting the innerHTML of the element to Browse File
              element.innerHTML = 'Browse File';
            }
          }
        }
      }
      // if (schemeWiseFormCtr.totalCalcAddMore == true) {

      //   this.addMoreRowElemntWiseTotalData[addMorectrlId + elmId] = (this.addMoreRowElemntWiseTotalData[addMorectrlId + elmId] != undefined) ? this.addMoreRowElemntWiseTotalData[addMorectrlId + elmId] : 0

      //   this.addMoreRowElemntWiseTotalData[addMorectrlId + elmId] = Number(elmVal) + Number(this.addMoreRowElemntWiseTotalData[addMorectrlId + elmId]);



      // }
      validateArray[elmId] = {
        ctrlValue: elmVal,
        ctrlTypeId: ctrlTypeId,
      };
      if (this.encDec.escapeHtml(elmVal) !== '') {
      	blankArray.push(this.encDec.escapeHtml(elmVal));
        } else if (ctrlTypeId == 7) {//type =file
      	if (uploadFile && uploadFile.fileName !== undefined) {
      	  blankArray.push(uploadFile.fileName);
      	}
        }
      arrAddMoreElementWiseData.push({
        ctrlTypeId: ctrlTypeId,
        ctrlId: elmId,
        ctrlName: elmName,
        lblName: lblName,
        ctrlValue: elmVal,
        // ctrlValue: this.encDec.escapeHtml(elmVal),
        ctrlValueText: elmValText,
        uploadFile: uploadFile,
        editStaus: 0,
        attrType: attrType,
        date: rowaddmoredate,
      });

      indx++;
      this.arrUploadedFiles[elmId] = '';
      uploadFile='';
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

          } else if (addMoreClearloop['elmtypeId'] == 4) {

            if (addMoreClearloop['elmClass'] == this.ckEdtorCls) {
              let ele = <HTMLInputElement>(
                document.getElementById(addMoreClearloop['elmId'])
              );
              ele.querySelector('.angular-editor-textarea');
              this.arrckEdtorVal[addMoreClearloop['elmId']] = '';
            } else {
              (<HTMLInputElement>(
                document.getElementById(addMoreClearloop['elmId'])
              )).value = '';
            }

          } else if (addMoreClearloop['elmtypeId'] == 5) {

            const checkboxes: any = document.getElementsByName(

              addMoreClearloop['elmId']

            );

            for (let checkbox of checkboxes) {

              if (checkbox.checked) {

                (<HTMLInputElement>(

                  document.getElementById(checkbox.id)

                )).checked = false;

              }

            }

          } else if (addMoreClearloop['elmtypeId'] == 6) {

            const radioBtnElmn = document.getElementsByName(

              addMoreClearloop['elmId']

            );



            for (let i = 0, length = radioBtnElmn.length; i < length; i++) {

              if ((<HTMLInputElement>radioBtnElmn[i]).checked) {

                let rdId = (<HTMLInputElement>radioBtnElmn[i]).id;

                (<HTMLInputElement>document.getElementById(rdId)).checked =

                  false;

              }

            }

          } else if (addMoreClearloop['elmtypeId'] == 7) {

            document

              .getElementById('fileDownloadDiv_' + addMoreClearloop['elmId'])

              ?.querySelector('.downloadbtn')

              ?.setAttribute('href', '');

            document

              .getElementById('fileDownloadDiv_' + addMoreClearloop['elmId'])

              ?.classList.add('d-none');

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
  }

  // editAddMore(event:any,ctrlId:any,indx:any)
  // {
  //   this.editIndex = indx;
  //  if(this.arrAddMoreEditData.length > 0)
  //  {
  //   this.arrAddMoreEditData = [];
  //  }
  //   this.arrAddMoreEditData.push(this.arrAddmoreFilledData[ctrlId][indx]);

  // }
  setDynRadioBtn(dynSetVal: any, ctrlValue: any) {
    if (dynSetVal != null) {
      let arrRadioDetails = dynSetVal.split(',');
      return arrRadioDetails.includes(ctrlValue);
    } else {
      return false;
    }
  }

  deleteAddMore(event: any, ctrlId: any, indx: any) {
    this.arrAddmoreFilledData[ctrlId].splice(indx, 1);
  }
  //To Format Date for AddMore || Arpita | Co-Siba
  formatDate1(inputDate: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [day, monthNum, year] = inputDate.split('-');
    const monthName = months[parseInt(monthNum, 10) - 1];
    return `${day}-${monthName}-${year}`;
  }
  //End To Format Date for AddMore || Arpita | Co-Siba
  fillAddMoreArray(
    addMorectrlId: any,
    addMoreFormConfigData: any,
    addMoreFormResult: any // when page is loaded this function set's add more array
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
                  finalrowdate = this.formatDate1(finalrowdate);
                  
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
              attrType: addMoreConfigloop.ctrlAttributeType, //Arpita for addmore date view
              date: finalrowdate,//Arpita for addmore date view
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
    let rowaddmoredate: any = '';
    let elmVal: any = '';

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
          
          // (<HTMLInputElement>(

          //   document.getElementById(addMoreConfiguredValidatorloop.ctrlId)

          // )).focus();
          addMoreerrorMsg =
            'Select ' + addMoreConfiguredValidatorloop.ctrlLabel;
          
        } else {
          (<HTMLInputElement>(

            document.getElementById(addMoreConfiguredValidatorloop.ctrlId)

          )).focus();
          addMoreerrorMsg =
            addMoreConfiguredValidatorloop.ctrlLabel + ' can not be left blank';
        }
        Swal.fire({
          icon: 'error',
          text: addMoreerrorMsg,
        });
        // (<HTMLInputElement>document.getElementById(addMoreConfiguredValidatorloop.ctrlId)).focus();
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
      for (let addMoreTrDataValidatorloop of addmoreData) { //TR
        for (let addMoreTdDataValidatorloop of addMoreTrDataValidatorloop) { //TD
          if (addMoreTdDataValidatorloop['ctrlTypeId'] == 2) {
            // Textbox Validation
            elmVal = (<HTMLInputElement>document.getElementById(addMoreTdDataValidatorloop['ctrlId'])).value;
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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

                addmreValidStaus = false;

                break;

              }
            } else if (
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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

                addmreValidStaus = false;

                break;

              }
            }  else if (arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
              'ctrlAttributeType'
            ] == 'telephoneNo') // For Valid telephone
            {
              if (!this.vldChkLst.validTel(elmVal)) {
                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();
                addmreValidStaus = false;
                break;
              }
    
            }else if (
              arrAddMoreValdiator[addMoreTdDataValidatorloop['ctrlId']][
                'ctrlAttributeType'
              ] == 'password'
            ) {
              // For password Validation
              if (
                !this.vldChkLst.validPassword(
                  addMoreTdDataValidatorloop['ctrlValue']
                )
              )  {

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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
                  ] + ' can not be left blanky'
                )
              ) {
                // console.log('radioid'+addMoreTdDataValidatorloop['ctrlId']);
                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();
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

                (<HTMLInputElement>(

                  document.getElementById(addMoreTdDataValidatorloop['ctrlId'])

                )).focus();

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
        var radioBtnElmn = document.getElementsByName(ctrlId);
        for (var i = 0, length = radioBtnElmn.length; i < length; i++) {
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

  // For Add More Tabular Wise
  addAddMoreArrTabularWise(arrAllAddMoreData: any) {
    let addmreTabularValidStaus = true;
    let addMreTrIndx = 0;
    let addMreTdIndx = 0;
    let addMoreTabularElmVal = '';
    let addMoreTabularelmValText: any = '';
    let addMoreTabularuploadFile: any = '';
    let addMrePushDetails: any = [];
    let addMoreTabularElementCtrlId;
    let arrAddmoreFilledTabularData: any[] = [];
    for (let addMoreTrTabularLoop of arrAllAddMoreData['addmorerowdata']) { //TR Loop
      let rowDataName = addMoreTrTabularLoop['ctrlRowdataName'];
      addMreTdIndx = 0;
      addMrePushDetails = [];

      for (let addMoreTdTabularLoop of arrAllAddMoreData['addmoreDetails']) { // TD Loop
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

          if (addMoreTdTabularLoop['ctrlMaxLength'] != '' &&

          Number(addMoreTdTabularLoop['ctrlMaxLength']) > 0) {
            // For Max length
            if (

              !this.vldChkLst.maxLength(

                addMoreTabularElmVal,

                addMoreTdTabularLoop['ctrlMaxLength'],

                this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) + ' (' + rowDataName + ')'

              )

            ) {

              (<HTMLInputElement>(

                document.getElementById(addMoreTabularElementCtrlId)

              )).focus();

              addmreTabularValidStaus = false;

              break;

            }
          }

          if (addMoreTdTabularLoop['ctrlMinLength'] != '' &&

          Number(addMoreTdTabularLoop['ctrlMinLength']) > 0) {
           // For Min length

           if (

            !this.vldChkLst.minLength(

              addMoreTabularElmVal,

              addMoreTdTabularLoop['ctrlMinLength'],

              this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) + ' (' + rowDataName + ')'

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
          } else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'telephone') {
            // For Valid Mobile
           
            if (!this.vldChkLst.validMob(addMoreTabularElmVal)) {

              (<HTMLInputElement>(

                document.getElementById(addMoreTabularElementCtrlId)

              )).focus();

              addmreTabularValidStaus = false;

              break;

            }
          }  else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'telephoneNo') // For Valid telephone
          {
            (<HTMLInputElement>(

              document.getElementById(addMoreTabularElementCtrlId)

            )).focus();

            addmreTabularValidStaus = false;

              break;
            
  
          } else if (addMoreTdTabularLoop['ctrlAttributeType'] == 'password') {
            // For password Validation

            if (!this.vldChkLst.validPassword(addMoreTabularElmVal)) {

              (<HTMLInputElement>(

                document.getElementById(addMoreTabularElementCtrlId)

              )).focus();

              addmreTabularValidStaus = false;

              break;

            }
          }
          // else if (

          //   addMoreTdTabularLoop['ctrlAttributeType'] == 'date' &&

          //   addMoreTabularElmVal.length > 0

          // ) {

          //   addMoreTabularElmVal = addMoreTabularElmVal

          //   let elmValDate: any = addMoreTabularElmVal.split('-');

          //   addMoreTabularElmVal = elmValDate[2] + '-' + elmValDate[1] + '-' + elmValDate[0];

          //   addMoreTabularElmVal = this.formatDate(addMoreTabularElmVal);



          // }
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
            addMoreTabularElmVal =
              this.arrckEdtorVal[addMoreTabularElementCtrlId];
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

                this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) +

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

          if (addMoreTdTabularLoop['ctrlMaxLength'] != '' &&

          Number(addMoreTdTabularLoop['ctrlMaxLength']) > 0) {
            // For Max length
            if (

              !this.vldChkLst.maxLength(

                addMoreTabularElmVal,

                addMoreTdTabularLoop['ctrlMaxLength'],

                this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) + ' (' + rowDataName + ')'

              )

            ) {

              (<HTMLInputElement>(

                document.getElementById(addMoreTabularElementCtrlId)

              )).focus();

              addmreTabularValidStaus = false;

              break;

            }
          }

          if (addMoreTdTabularLoop['ctrlMinLength'] != '' &&

          Number(addMoreTdTabularLoop['ctrlMinLength']) > 0) {
            // For Min length
            if (

              !this.vldChkLst.minLength(

                addMoreTabularElmVal,

                addMoreTdTabularLoop['ctrlMinLength'],

                this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) + ' (' + rowDataName + ')'

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
             // For Mandatory

             if (

              !this.vldChkLst.blankCheckRdoDynamic(

                addMoreTabularElementCtrlId,

                this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) + ' (' + rowDataName + ')'

              )

            ) {

              addmreTabularValidStaus = false;

              break;

            }
          }
          let chkdVal: any = '';
          let chkdTxt: any = '';
          var checkboxes: any = document.getElementsByName(
            addMoreTabularElementCtrlId
          );
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
          addMoreTabularElmVal = chkdVal.toString();
          addMoreTabularelmValText = chkdTxt;
        } else if (addMoreTdTabularLoop['ctrlTypeId'] == 6) {
          // Radio Validation
          if (addMoreTdTabularLoop['ctrlMandatory']) {
            // For Mandatory
            if (

              !this.vldChkLst.blankCheckRdoDynamic(

                addMoreTabularElementCtrlId,

                this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) + ' (' + rowDataName + ')'

              )

            ) {

              addmreTabularValidStaus = false;

              break;

            }
          }

          var radioBtnElmn = document.getElementsByName(
            addMoreTabularElementCtrlId
          );
          for (var i = 0, length = radioBtnElmn.length; i < length; i++) {
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

                  this.encDec.decodeHtml(addMoreTdTabularLoop['ctrlLabel']) +

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
          ctrlValue: addMoreTabularElmVal,
          ctrlValueText: addMoreTabularelmValText,
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

  // added by Gopinath Jena
  getRegistrationCount() {
    this.loading = true;
    const sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.objSchm
      .getRegistrationCount({ USER_ID: sessionInfo.USER_ID })
      .subscribe((res) => {
        if (Object.keys(res.result).length >= 1) {
          this.router.navigate(['/citizen-portal/registration-manage']);
        }
      });
    this.loading = false;
  }

  // added by Gopinath Jena
  setUserDetails() {
    this.preBtnDisabled = false;
    const cuurentSectionNo = this.currSecTabKey.split('_')[1];
    if (cuurentSectionNo != 1) this.preBtnDisabled = true;
    const sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let organizationType = <HTMLElement>(
      document.querySelector('.organization_type')
    );
    let organizationTypeId = organizationType?.id;

    if (organizationTypeId != undefined && this.getUserInfo != null) {
      (<HTMLInputElement>document.getElementById(organizationTypeId)).value =
        this.getUserInfo.int_organization_type;
      document
        .getElementById(organizationTypeId)
        .setAttribute('disabled', 'disabled');
    }

    let organizationName = <HTMLElement>document.querySelector('.company_name');
    let organizationNameId = organizationName?.id;

    if (organizationNameId != undefined && this.getUserInfo != null) {
      (<HTMLInputElement>document.getElementById(organizationNameId)).value =
        this.getUserInfo.vch_organization_name;
      //ocument.getElementById(organizationNameId).setAttribute("disabled","disabled");
    }

    let gstRegdName = <HTMLElement>(
      document.querySelector('.gstin_registration_number')
    );
    let gstRegdId = gstRegdName?.id;
    if(gstRegdId){
    let gstRegdIdValue = (gstRegdName as HTMLInputElement).value;
    if (gstRegdId != undefined && 
        this.getUserInfo != null && 
        (gstRegdIdValue === null || gstRegdIdValue === undefined || gstRegdIdValue === '' || (Array.isArray(gstRegdIdValue) && gstRegdIdValue.length === 0))) {
      (<HTMLInputElement>document.getElementById(gstRegdId)).value =
        this.getUserInfo.vch_gstin;
      //document.getElementById(gstRegdId).setAttribute("disabled","disabled");
    }
  }
    const dateIncorporation = <HTMLElement>(
      document.querySelector('.date_of_incorporation')
    );
    const dateIncorporationId = dateIncorporation?.id;

    const dateTermLoanSanctioned = <HTMLElement>(
      document.querySelector('.date_term_loan_sanctioned')
    );
    const dateTermLoanSanctionedId = dateTermLoanSanctioned?.id;

    const dateFirstSalesBill = <HTMLElement>(
      document.querySelector('.date_of_first_sales_bill')
    );

    

    const dateFirstSalesBillId = dateFirstSalesBill?.id;

    const dateReturnBill = <HTMLElement>(
      document.querySelector('.date_of_return_bill')
    );
    const dateReturnBillId = dateReturnBill?.id;

    const maxDate = this.vldChkLst.getMaxDate();
    if (dateIncorporationId != undefined)
      document.getElementById(dateIncorporationId).setAttribute('max', maxDate);
    if (dateTermLoanSanctionedId != undefined)
      document
        .getElementById(dateTermLoanSanctionedId)
        .setAttribute('max', maxDate);
    if (dateFirstSalesBillId != undefined)
      document
        .getElementById(dateFirstSalesBillId)
        .setAttribute('max', maxDate);
    if (dateReturnBillId != undefined)
      document.getElementById(dateReturnBillId).setAttribute('max', maxDate);
  }

  // added by Gopinath Jena
  getUserDetails() {
    const sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.objSchm
      .getUserDetails({ USER_ID: sessionInfo.USER_ID })
      .subscribe((res) => {
        this.getUserInfo = res.result;
      });
  }

  //added by Rohit Kumar Behera for dependent add more field
  setArrhAllchildOfParent(ids: any) {
    if (ids != null && ids != '') {
      const allParms: any = document.querySelectorAll(
        '[data-dynbinddependctlfldid=' + ids + ']'
      );
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
            this.parentDetVal.push(allParmsLoop.getAttribute('name'));
            this.setArrhAllchildOfParent(allParmsLoop.getAttribute('name'));
          } else {
            //removed for dynamic dropdown issue in adress
            // this.parentDetVal.push(allParmsLoop.id);
          }

          this.setArrhAllchildOfParent(allParmsLoop.id);
        }
      }
      //end for dependent add more field
      if (allParms.length == 0) {
        return;
      } else {
        //commented for dynamic dropdown issue in adress
        // for (let allParmsLoop of allParms) {
        // 	this.parentDetVal.push(allParmsLoop.id);
        // 	this.setArrhAllchildOfParent(allParmsLoop.id);
        // }
      }
    }
  }

  hideAllChildParent(parentDetails: any, dpndval: any) {
    if (dpndval.includes(parentDetails.value)) {
      return;
    }
    let parentId = parentDetails.id;
    this.setArrhAllchildOfParent(parentId);
    //added by Rohit Kumar Behera for dependent add more field
    if (
      this.loadDynBindAllData[parentId] != '' &&
      this.loadDynBindAllData[parentId] != undefined &&
      this.loadDynBindAllData[parentId].length > 0
    ) {
      this.hideAllDependTData(this.loadDynBindAllData[parentId]);
    }
    //end for dependent add more field
    for (let allChilds of this.parentDetVal) {
      let childEle: any = document.getElementById(allChilds);
      childEle.closest('.dynGridCls').classList.add('d-none');
      childEle
        .closest('.dynGridCls')
        .querySelector('.dynlabel')
        .classList.add('d-none');
      childEle.classList.add('d-none');
      let tpId = childEle.getAttribute('data-typeid');
      if (tpId == 2) {
        (<HTMLInputElement>document.getElementById(childEle.id)).value = '';
      } else if (tpId == 3) {
        (<HTMLInputElement>document.getElementById(childEle.id)).value = '0';
      } else if (tpId == 4) {
        let elmle: any = <HTMLInputElement>document.getElementById(childEle.id);
        elmle.options[elmle.selectedIndex].text = '';
      } else if (tpId == 5 || tpId == 6) {
        let chckboxClear: any = document.getElementsByName(childEle.id);
        for (let dynrdobndtype of chckboxClear) {
          if (dynrdobndtype.checked) {
            dynrdobndtype.checked = false;
          }
        }
      } else {
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
    this.parentDetVal.splice(0, this.parentDetVal.length);
  }
  //added by Rohit Kumar Behera for dependent add more field closing
  hideAllDependTData(arrAllDependtData: any) {
    for (let allChildsa of arrAllDependtData) {
      let bindDetailsType = allChildsa.getAttribute('data-ctrlccbinddatatype');
      let tpId = allChildsa.getAttribute('data-typeid');

      let data: any = document.querySelectorAll(
        '[data-dependctrlid=' + allChildsa.id + ']'
      );
      for (let dataLoop of data) {
        let innerTpId = dataLoop.getAttribute('data-typeid');
        if (innerTpId == 10) {
          dataLoop.closest('.dynGridCls').classList.add('d-none');
          //delete this.arrAddmoreFilledData[dataLoop.id]
        } else {
          dataLoop.closest('.dynGridCls').classList.add('d-none');
          dataLoop
            .closest('.dynGridCls')
            .querySelector('.dynlabel')
            .classList.add('d-none');
          dataLoop.classList.add('d-none');
        }
      }

      if (allChildsa.getAttribute('data-dependflagstatus') == 'true') {
        allChildsa.closest('.dynGridCls').classList.add('d-none');
        if (tpId != 8) {
          allChildsa
            .closest('.dynGridCls')
            .querySelector('.dynlabel')
            .classList.add('d-none');
        }

        if (tpId == 3) {
          let elementData: any = <HTMLInputElement>(
            document.getElementById(
              allChildsa.getAttribute('data-dependctrlid')
            )
          );
          // console.log(elementData.getAttribute("data-value") + "=====" + allChildsa.getAttribute('data-dependentvalue'))
          if (
            elementData.value != allChildsa.getAttribute('data-dependentvalue')
          ) {
            (<HTMLInputElement>document.getElementById(allChildsa.id)).value =
              '0';
          }
        }
        allChildsa.classList.add('d-none');
      } else if (tpId == 10) {
        allChildsa.closest('.dynGridCls').classList.add('d-none');
      }
    }
  }
  //added by Rohit Kumar Behera for dependent add more field closing
  // added by Sibananda sahu
  financialCal() {
  
    let export_turnover: any = document.getElementsByClassName('export_turnover')[0];
    let domestice_turnover: any = document.getElementsByClassName('domestice_turnover')[0];
    let turnover_total: any = document.getElementsByClassName('turnover_total')[0];
    turnover_total.readOnly = true;
  
    const calculateTotal = () => {
      const exportTurnoverValue = parseFloat(export_turnover.value) || 0;
      const domesticeTurnoverValue = parseFloat(domestice_turnover.value) || 0;
  
      turnover_total.value = (exportTurnoverValue + domesticeTurnoverValue).toFixed(2);
    };
  
    export_turnover.addEventListener('input', calculateTotal);
    domestice_turnover.addEventListener('input', calculateTotal);
  }
  

  setTabularDataEdit(
    addMoreValueParmDetails: any,
    slNo: any,
    addMorectrlId: any,
    addMorectrlTblColName: any,
    addMoreTbIndx: any
  ) {
    if (
      addMoreValueParmDetails[slNo + addMorectrlId] != undefined &&
      addMoreValueParmDetails[slNo + addMorectrlId][addMorectrlId] == undefined
    ) {
      return '';
    } else if (addMoreValueParmDetails[slNo + addMorectrlId] != undefined) {
      return addMoreValueParmDetails[slNo + addMorectrlId][addMorectrlId][
        'addMoreDataValue'
      ][addMorectrlTblColName];
    }
    //[addMorectrlId]['addMoreDataValue'][addMorectrlTblColName]
  }

  // added by Gopinath Jena
  empCal(event: any) {
    var odDomicileGenCls = document.getElementsByClassName(
      'od_domicile_general'
    );
    var odDomicileScCls = document.getElementsByClassName('od_domicile_sc');
    var odDomicileStCls = document.getElementsByClassName('od_domicile_st');
    var odDomicileDisabledCls = document.getElementsByClassName(
      'od_domicile_disabled'
    );
    var odDomicileGenClsF = document.getElementsByClassName(
      'od_domicile_general_f'
    );
    var odDomicileScClsF = document.getElementsByClassName('od_domicile_sc_f');
    var odDomicileStClsF = document.getElementsByClassName('od_domicile_st_f');
    var odDomicileDisabledClsF = document.getElementsByClassName(
      'od_domicile_disabled_f'
    );
    var odDomicileTotalCls = document.getElementsByClassName(
      'od_domicile_total_emp'
    );
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

      const odDomicileGenValue = (<HTMLInputElement>(
        document.getElementById(odDomicileGenId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileGenId)).value
        : '0';
      const odDomicileScValue = (<HTMLInputElement>(
        document.getElementById(odDomicileScId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileScId)).value
        : '0';
      const odDomicileStValue = (<HTMLInputElement>(
        document.getElementById(odDomicileStId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileStId)).value
        : '0';
      const odDomicileDisabledValue = (<HTMLInputElement>(
        document.getElementById(odDomicileDisabledId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileDisabledId))
            .value
        : '0';

      const odDomicileGenValueF = (<HTMLInputElement>(
        document.getElementById(odDomicileGenIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileGenIdF)).value
        : '0';
      const odDomicileScValueF = (<HTMLInputElement>(
        document.getElementById(odDomicileScIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileScIdF)).value
        : '0';
      const odDomicileStValueF = (<HTMLInputElement>(
        document.getElementById(odDomicileStIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileStIdF)).value
        : '0';
      const odDomicileDisabledValueF = (<HTMLInputElement>(
        document.getElementById(odDomicileDisabledIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odDomicileDisabledIdF))
            .value
        : '0';

      if (odDomicileGenValue <= '0')
        (<HTMLInputElement>document.getElementById(odDomicileGenId)).value =
          '0';
      if (odDomicileScValue <= '0')
        (<HTMLInputElement>document.getElementById(odDomicileScId)).value = '0';
      if (odDomicileStValue <= '0')
        (<HTMLInputElement>document.getElementById(odDomicileStId)).value = '0';
      if (odDomicileDisabledValue <= '0')
        (<HTMLInputElement>(
          document.getElementById(odDomicileDisabledId)
        )).value = '0';
      if (odDomicileGenValueF <= '0')
        (<HTMLInputElement>document.getElementById(odDomicileGenIdF)).value =
          '0';
      if (odDomicileScValueF <= '0')
        (<HTMLInputElement>document.getElementById(odDomicileScIdF)).value =
          '0';
      if (odDomicileStValueF <= '0')
        (<HTMLInputElement>document.getElementById(odDomicileStIdF)).value =
          '0';
      if (odDomicileDisabledValueF <= '0')
        (<HTMLInputElement>(
          document.getElementById(odDomicileDisabledIdF)
        )).value = '0';

      const totalAmount = (
        parseInt(odDomicileGenValue) +
        parseInt(odDomicileScValue) +
        parseInt(odDomicileStValue) +
        parseInt(odDomicileDisabledValue) +
        parseInt(odDomicileGenValueF) +
        parseInt(odDomicileScValueF) +
        parseInt(odDomicileStValueF) +
        parseInt(odDomicileDisabledValueF)
      ).toString();
      if (totalAmount >= '0') {
        (<HTMLInputElement>document.getElementById(odDomicileTotalId)).value =
          totalAmount;
        document
          .getElementById(odDomicileTotalId)
          .setAttribute('disabled', 'disabled');
      } else {
        (<HTMLInputElement>document.getElementById(odDomicileTotalId)).value =
          '0';
        document
          .getElementById(odDomicileTotalId)
          .setAttribute('disabled', 'disabled');
      }
    }

    var odNonDomicileGenCls = document.getElementsByClassName(
      'od_nondomicile_general'
    );
    var odNonDomicileScCls =
      document.getElementsByClassName('od_nondomicile_sc');
    var odNonDomicileStCls =
      document.getElementsByClassName('od_nondomicile_st');
    var odNonDomicileDisabledCls = document.getElementsByClassName(
      'od_nondomicile_disabled'
    );
    var odNonDomicileGenClsF = document.getElementsByClassName(
      'od_nondomicile_general_f'
    );
    var odNonDomicileScClsF = document.getElementsByClassName(
      'od_nondomicile_sc_f'
    );
    var odNonDomicileStClsF = document.getElementsByClassName(
      'od_nondomicile_st_f'
    );
    var odNonDomicileDisabledClsF = document.getElementsByClassName(
      'od_nondomicile_disabled_f'
    );
    var odNonDomicileTotalCls = document.getElementsByClassName(
      'od_nondomicile_total_emp'
    );
    for (let i = 0; i < odNonDomicileGenCls.length; i++) {
      let odNonDomicileGenId = odNonDomicileGenCls[i]?.id;
      let odNonDomicileScId = odNonDomicileScCls[i]?.id;
      let odNonDomicileStId = odNonDomicileStCls[i]?.id;
      let odNonDomicileDisabledId = odNonDomicileDisabledCls[i]?.id;
      let odNonDomicileGenIdF = odNonDomicileGenClsF[i]?.id;
      let odNonDomicileScIdF = odNonDomicileScClsF[i]?.id;
      let odNonDomicileStIdF = odNonDomicileStClsF[i]?.id;
      let odNonDomicileDisabledIdF = odNonDomicileDisabledClsF[i]?.id;
      let odNonDomicileTotalId = odNonDomicileTotalCls[i]?.id;

      const odNonDomicileGenValue = (<HTMLInputElement>(
        document.getElementById(odNonDomicileGenId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileGenId)).value
        : '0';
      const odNonDomicileScValue = (<HTMLInputElement>(
        document.getElementById(odNonDomicileScId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileScId)).value
        : '0';
      const odNonDomicileStValue = (<HTMLInputElement>(
        document.getElementById(odNonDomicileStId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileStId)).value
        : '0';
      const odNonDomicileDisabledValue = (<HTMLInputElement>(
        document.getElementById(odNonDomicileDisabledId)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileDisabledId))
            .value
        : '0';

      const odNonDomicileGenValueF = (<HTMLInputElement>(
        document.getElementById(odNonDomicileGenIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileGenIdF)).value
        : '0';
      const odNonDomicileScValueF = (<HTMLInputElement>(
        document.getElementById(odNonDomicileScIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileScIdF)).value
        : '0';
      const odNonDomicileStValueF = (<HTMLInputElement>(
        document.getElementById(odNonDomicileStIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileStIdF)).value
        : '0';
      const odNonDomicileDisabledValueF = (<HTMLInputElement>(
        document.getElementById(odNonDomicileDisabledIdF)
      )).value
        ? (<HTMLInputElement>document.getElementById(odNonDomicileDisabledIdF))
            .value
        : '0';

      if (odNonDomicileGenValue <= '0')
        (<HTMLInputElement>document.getElementById(odNonDomicileGenId)).value =
          '0';
      if (odNonDomicileScValue <= '0')
        (<HTMLInputElement>document.getElementById(odNonDomicileScId)).value =
          '0';
      if (odNonDomicileStValue <= '0')
        (<HTMLInputElement>document.getElementById(odNonDomicileStId)).value =
          '0';
      if (odNonDomicileDisabledValue <= '0')
        (<HTMLInputElement>(
          document.getElementById(odNonDomicileDisabledId)
        )).value = '0';
      if (odNonDomicileGenValueF <= '0')
        (<HTMLInputElement>document.getElementById(odNonDomicileGenIdF)).value =
          '0';
      if (odNonDomicileScValueF <= '0')
        (<HTMLInputElement>document.getElementById(odNonDomicileScIdF)).value =
          '0';
      if (odNonDomicileStValueF <= '0')
        (<HTMLInputElement>document.getElementById(odNonDomicileStIdF)).value =
          '0';
      if (odNonDomicileDisabledValueF <= '0')
        (<HTMLInputElement>(
          document.getElementById(odNonDomicileDisabledIdF)
        )).value = '0';

      const NonDomicileTotalAmount = (
        parseInt(odNonDomicileGenValue) +
        parseInt(odNonDomicileScValue) +
        parseInt(odNonDomicileStValue) +
        parseInt(odNonDomicileDisabledValue) +
        parseInt(odNonDomicileGenValueF) +
        parseInt(odNonDomicileScValueF) +
        parseInt(odNonDomicileStValueF) +
        parseInt(odNonDomicileDisabledValueF)
      ).toString();

      if (NonDomicileTotalAmount >= '0') {
        (<HTMLInputElement>(
          document.getElementById(odNonDomicileTotalId)
        )).value = NonDomicileTotalAmount;
        document
          .getElementById(odNonDomicileTotalId)
          .setAttribute('disabled', 'disabled');
      } else {
        (<HTMLInputElement>(
          document.getElementById(odNonDomicileTotalId)
        )).value = '0';
        document
          .getElementById(odNonDomicileTotalId)
          .setAttribute('disabled', 'disabled');
      }
    }
  }
  validatePanCard(panNumber) {
    // Regular expression for PAN card validation
    let panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    // Check if the provided PAN number matches the regex pattern
    if (panRegex.test(panNumber)) {
      // Check the 10th character, which should be an alphabet (either A-Z)
      let tenthCharacter = panNumber.charAt(9).toUpperCase();
      if (tenthCharacter >= 'A' && tenthCharacter <= 'Z') {
        // Valid PAN card number
        return true;
      }
    }
    // Invalid PAN card number
    return false;
  }
  digitSum(number) {
    // Convert the number to an array of digits
    var digits = [...number.toString()].map(Number);
    // Calculate the sum using reduce function
    return digits.reduce((sum, digit) => sum + digit, 0);
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
              html: `<div>${toDateLabel} / End Date Can't be earlier than ${fromDateLabel} / Start Date</div>`,
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
              html: `<div>${fromDateLabel} / Start Date can't be later than ${toDateLabel} / End Date</div>`,
            });
          }
        }
      });
    }

    function getLabelByTextElement(inputElement: HTMLInputElement): string {
      const parentDiv = inputElement.closest('.dynGridCls');
      const labelElement = parentDiv.querySelector('.dynlabel');
      return labelElement
        ? labelElement.textContent.trim().replace(/\*/g, '')
        : '';
    }
  }

  /*
   * Function: validateDate
   * Description: It will allow date picker to show min and max date based on condition
   * Date:9th feb 2024
   * Created By: Sibananda sahu
   * Modified Date : 28-03-2024
   */
  // validateDate() {
  //   let futureDateField: any = document.getElementsByClassName(
  //     'cls_validate_future_date'
  //   );
  //   let commencementDateField: any = document.getElementsByClassName(
  //     'cls_check_commencement_date'
  //   );
  //   let commencementEndDateField: any = document.getElementsByClassName(
  //     'cls_check_commencement_end_date'
  //   );
  //   let today: string = new Date().toISOString().split('T')[0];

  //   if (futureDateField) {
  //     for (let i = 0; i < futureDateField.length; i++) {
  //       let dateField = futureDateField[i] as HTMLInputElement;
  //       let dateFieldId = dateField.getAttribute('id');

  //       if (dateFieldId) {
  //         dateField.setAttribute('max', today);
  //       }
  //     }
  //   }
  //   let policyDataStr = sessionStorage.getItem('SCHEME_POLICY_DET');
  //   if (policyDataStr) {
  //     let policyData = JSON.parse(policyDataStr);
  //     if (commencementDateField) {
  //       let commecStartDate: string = new Date(policyData.COMM_START_DATE)
  //         .toISOString()
  //         .split('T')[0];
  //       for (let i = 0; i < commencementDateField.length; i++) {
  //         let dateField = commencementDateField[i] as HTMLInputElement;
  //         let dateFieldId = dateField.getAttribute('id');

  //         if (dateFieldId) {
  //           dateField.setAttribute('min', commecStartDate);
  //         }
  //       }
  //     }
  //     if (commencementEndDateField) {
  //       let commecEndDate: string = new Date(policyData.COMM_END_DATE)
  //         .toISOString()
  //         .split('T')[0];
  //       for (let i = 0; i < commencementEndDateField.length; i++) {
  //         let dateField = commencementEndDateField[i] as HTMLInputElement;
  //         let dateFieldId = dateField.getAttribute('id');

  //         if (dateFieldId) {
  //           dateField.setAttribute('max', commecEndDate);
  //         }
  //       }
  //     }
  //   }
  // }

  setIncentive() {
    this.loading = true;
    const sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    const optionsData = [];
    this.objSchm
      .getIncentivePolicyDetails({ intOrgType: sessionInfo.USER_ORG_TYPE })
      .subscribe((res) => {
        const optionsData = [];
        this.objSchm
          .getIncentivePolicyDetails({ intOrgType: sessionInfo.USER_ORG_TYPE })
          .subscribe((res) => {
            this.loading = false;
            optionsData.push(...res.result); // Populate optionsData with
            let incentiveEle =
              document.getElementsByClassName('cls_incentive_type')[0];
            incentiveEle.innerHTML = '';
            optionsData.forEach((option) => {
              const optionElement = document.createElement('option');
              optionElement.text = option.vchProcessName;
              optionElement.value = option.intProcessId;
              incentiveEle.appendChild(optionElement);
            });
          });
      });
  }
   // Create By Manish Kumar | date: 07-05-2024
  checkCastCategory(cls_ethnicity_race_cat: string,cls_parent_cast_certificate:string){
    const parentHTMLelements = document.getElementsByClassName(cls_parent_cast_certificate);
    Array.from(parentHTMLelements).forEach((element: HTMLElement) => {
      element.style.display = 'none';
    });
   
    let checkEthncityRaceValue = document.getElementsByClassName(cls_ethnicity_race_cat);
    Array.from(checkEthncityRaceValue).forEach((ethnicityValue: HTMLInputElement) => {
      ethnicityValue.addEventListener('change', () => {
            if(ethnicityValue.value == "1")
            {
              Array.from(parentHTMLelements).forEach((element: HTMLElement) => {
                element.style.display = 'none';
              });
            }
            else{
              Array.from(parentHTMLelements).forEach((element: HTMLElement) => {
                element.style.display = '';
              });
            }
        });
    });
  }
   // Create By Manish Kumar | date: 07-05-2024
  checkHandicapped(cls_handicapped_able : string,cls_parent_different_able_certificate:string){
    const parentHandiCappedHTMLelements = document.getElementsByClassName(cls_parent_different_able_certificate);
    Array.from(parentHandiCappedHTMLelements).forEach((handiCappedelement: HTMLElement) => {
      handiCappedelement.style.display = 'none';
    });
    let checkHandicappedValue = document.getElementsByClassName(cls_handicapped_able);
    Array.from(checkHandicappedValue).forEach((handiCappdValue: HTMLInputElement) => {
      handiCappdValue.addEventListener('change', () => {
            if(handiCappdValue.value == "2")
            {
              Array.from(parentHandiCappedHTMLelements).forEach((element: HTMLElement) => {
                element.style.display = 'none';
              });
            }
            else{
              Array.from(parentHandiCappedHTMLelements).forEach((element: HTMLElement) => {
                element.style.display = '';
              });
            }
        });
    });
  }
  //To Set Formatted Date Field in Html Site || Arpita | Co-Siba
  setDateData(
    dateCtrlId: string,
    dateVal: any,
    arrAddMoreFileData: any = '',
    columnName: any = '',
    formCtrlId: any = '',
    addMoreCtrlId: any = ''
  ) {
    if (
      dateVal == 'tabularAddMore' &&
      this.arrSetAllDataKeys[dateCtrlId + formCtrlId] == undefined &&
      arrAddMoreFileData[dateCtrlId] != undefined
    ) {
      let tabularDate: any =
        arrAddMoreFileData[dateCtrlId][formCtrlId]['addMoreDataValue'][
        columnName
        ];
      if (environment.defaultDate == tabularDate) {
        return;
      }
      setTimeout(() => {
        let splitedDataVal: any = tabularDate.split('-');
        if (splitedDataVal[1] != "") {
          const dateDataBs = new Date(tabularDate);

          splitedDataVal[1] = dateDataBs.toLocaleDateString('en-US', {
            month: 'short'
          });
        }
        (<HTMLInputElement>document.getElementById(addMoreCtrlId)).value =
          splitedDataVal[2] + '-' + splitedDataVal[1] + '-' + splitedDataVal[0];
        this.arrSetAllDataKeys[dateCtrlId + formCtrlId] = { tabularDate };
      }, 500);
    } else if (
      dateVal != null &&
      dateVal != '' &&
      this.arrSetAllDataKeys[dateCtrlId] == undefined &&
      dateVal != 'tabularAddMore'
    ) {
      if (environment.defaultDate == dateVal || dateVal == 'NULL') {
        return;
      } 
      setTimeout(() => {
        let splitedDataVal: any = dateVal.split('-');
        if (splitedDataVal[1] != "") {
          const dateDataBs = new Date(dateVal);

          splitedDataVal[1] = dateDataBs.toLocaleDateString('en-US', {
            month: 'short'
          });
        }
        (<HTMLInputElement>document.getElementById(dateCtrlId)).value =
          splitedDataVal[2] + '-' + splitedDataVal[1] + '-' + splitedDataVal[0];
        this.arrSetAllDataKeys[dateCtrlId] = { dateVal };
      }, 500);
    }
  }
  //End of Setting Formatted Date Field in Html Site || Arpita | Co-Siba

  //To enable Add to List button upon user input || By-Sibananda
  EnableAddMoreButton(event,addMorectrlId:any,ctrlId:any){
    let suiAddMoreId = this.arrAddmoreDetails[addMorectrlId][0].ctrlId;
    let addMoreButton = document.getElementById('addMoreBtn_' + addMorectrlId);
    for (let schemeWiseFormCtr of this.arrAddmoreDetails[addMorectrlId]) {
      let ctrlTypeId = schemeWiseFormCtr.ctrlTypeId;
      let elmId = schemeWiseFormCtr.ctrlId;
      if (elmId == ctrlId){
        if (ctrlTypeId == 2) {
          let elmVal = (<HTMLInputElement>document.getElementById(elmId)).value;
          elmVal = typeof elmVal === 'string' ? elmVal.trim() : elmVal;
            if (elmVal == '' || typeof (elmVal) == undefined || elmVal == null) {
              return;
            } else {
              addMoreButton?.removeAttribute('disabled');
              addMoreButton?.classList.add('blink');
            }
          } else {
            addMoreButton?.removeAttribute('disabled');
            addMoreButton?.classList.add('blink');
          }
      }
    }
   
  }
  //End of enabling Add to List button

  //To track date change || By-Sibananda
    dateChangeTrack(event,ctrlClass:any,ctrlId:any) {
      if (!this.dispatchingChange) {
        this.dispatchingChange = true;
        setTimeout(() => {
          const dateElement = document.getElementById(ctrlId);
          if (dateElement) {
            const changeEvent = new Event('change', { bubbles: true });
            dateElement.dispatchEvent(changeEvent);
          }
          this.dispatchingChange = false;
        });
      }    
    }
  //End To track date change || By-Sibananda
}
