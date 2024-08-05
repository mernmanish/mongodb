import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router,ActivatedRoute } from '@angular/router';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { CitizenMasterService } from '../service-api/citizen-master.service';
import Swal from 'sweetalert2';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import { IrmsDetailsService } from '../service-api/irms-details-service';
import { WebcommonservicesService } from 'src/app/webcommonservices.service';
import { CommonService } from '../../common.service';


@Component({
  selector: 'app-citizen-dashboard',
  templateUrl: './citizen-dashboard.component.html',
  styleUrls: ['./citizen-dashboard.component.css', 'citizen-dashboard.component.scss'],
  providers: [ValidatorchklistService]
})
export class CitizenDashboardComponent implements OnInit {



  @ViewChild('ApplicationModal') ApplicationModal:ElementRef;
  public loading = false;
  incentiveDetails : any =[];
  regDetails : any;
  incentiveDesc :any = {};

  processId:any=0;
  onlineServiceId:any=0;
  dynamicpreviewDetails:any;
  formName:any;
  dynamicCtrlPreviewKeys:any;
  sectionwise=true;
  gridtype:any;
  btnShow:any=0;
  intProfileId: any=0;
  addMoreTabularData:any[]=[];
  objFinancialDetailsList: any ;
  errMsg = '';
  farmerInfo: any;
  intOrganisationTypeId: any;
  intEmpTotal: any = 0;

  constructor(
    private Aroute : ActivatedRoute,
    private formBuilder:FormBuilder,
    private api: CitizenSchemeService,
    private modalService: NgbModal,
    private el: ElementRef,
    private router:Router,
    private encDec: EncryptDecryptService,
    private objMstr: CitizenMasterService,
    public vldChkLst: ValidatorchklistService,
    public IrmsDetailsService: IrmsDetailsService,
    private commonService: CommonService,
    private WebCommonService : WebcommonservicesService,
  ) { }

  ngOnInit(): void {
    sessionStorage.removeItem("REGD_ID");
    this.getRegistrationDetails();
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let intOrgTypeId = (this.farmerInfo.USER_ORG_TYPE) ? this.farmerInfo.USER_ORG_TYPE : 0;
    this.intOrganisationTypeId = intOrgTypeId;
    
  }
  previewDynamicForm(params:any)
  {
    this.WebCommonService.previewDynamicForm(params).subscribe(res => {
    
      if(res.status == 200)
        {
          var serviceResult:any       = res.result
          this.gridtype               = serviceResult.tinGridType;
          this.dynamicpreviewDetails  = serviceResult.arrSecFormDetails;
          this.formName               = serviceResult.formName;
          this.dynamicCtrlPreviewKeys = Object.keys(serviceResult.arrSecFormDetails).sort();
       //   console.log(this.dynamicCtrlPreviewKeys)
          if(this.dynamicCtrlPreviewKeys[0] == 'sec_0')
          {
            this.sectionwise = false; 
          }
        }
    });
  }
  getRegistrationDetails()
  {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      
      let regParam = {
        'user':farmerInfo.USER_ID
      };
      this.loading = this.commonService.loader(true);
      this.IrmsDetailsService.getRegistrationDetails(regParam).subscribe(res => {
        if (res.status == 1) {
          let result = res.result;
          this.regDetails = res.result;
          if(result.length > 0 )
          {
            this.incentiveDetails = result;
          }
          if(result.length <= 0 && res.result.length <= 0)
          {
            this.errMsg='No Record(s) Found !';
            Swal.fire({
              icon: 'info',
              html: '<p><strong>No Record(s) Updated !</strong><p>'
            });


          } 
          this.loading = this.commonService.loader(false);       
        }
        else {
          this.loading = this.commonService.loader(false);
        }
      });
  }

  modalLoanProduct(prod: any) {
    let sessionInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.incentiveDesc = prod.tbl_details[0];

    this.processId  = prod.intProcessId;
    this.onlineServiceId =prod.intOnlineServiceId;    
    let ctrlParms = {
      'intProcessId': this.processId,
      'intOnlineServiceId' :this.onlineServiceId,
      'intProfileId'        :sessionInfo.USER_ID
    }
    this.previewDynamicForm(ctrlParms);
  }

  viewDetails (prod :any ) {      
    let formParms = prod.intProcessId+':'+prod.intOnlineServiceId+':'+0;
    let encSchemeStr = this.encDec.encText(formParms.toString());
    this.router.navigate(['/citizen-portal/registration-view',encSchemeStr])    
  }

  viewIncentiveDetails (prod :any ) {     
    let formParms = prod.basicDetails.intProcessId+':'+prod.intOnlineServiceId+':viewincentive';
    let encSchemeStr = this.encDec.encText(formParms.toString());
    this.router.navigate(['/citizen-portal/preview-form',encSchemeStr])  
  }


  modalLoanProduct1(prod: any) {
    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    Swal.fire({
      title: 'Are you sure to edit the Application?',   
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = this.commonService.loader(true);
        if(prod.vchActionName == 3){
          let formParms = prod.intProcessId+':'+prod.intOnlineServiceId+':'+0;
          let encSchemeStr = this.encDec.encText(formParms.toString());
          this.router.navigate(['/citizen-portal/registration',encSchemeStr]);
        }else{
          const ctrlParms = {
            'intProcessId' : prod.intProcessId,
            'intOnlineServiceId' : prod.intOnlineServiceId,
            'intProfileId' : farmerInfo.USER_ID
          }
          this.IrmsDetailsService.createCloneApplication(ctrlParms).subscribe(res => {
            this.loading = this.commonService.loader(false);
            let formParms = prod.intProcessId+':'+res.result.intOnlineServiceId+':'+0;
            let encSchemeStr = this.encDec.encText(formParms.toString());
            this.router.navigate(['/citizen-portal/registration',encSchemeStr])
          });
        }  
      }
    })    
        
  }
  async gotoincentives(prod: any) {
    sessionStorage.setItem('REGD_ID',prod.intId);
    await this.router.navigate(['/citizen-portal/scheme-directorate']);
  }

  incentiveEdit(intProcessId:any, intServiceId:any, intProductId:any, intPolicyId:any, intRegdId:any){
    this.getCalimPeriod(intRegdId,intPolicyId);
     //start of setting session data for future requirements
    this.loading = this.commonService.loader(true);
    let regParam = {
      'intId':intRegdId
    };
    this.IrmsDetailsService.getCompanyDetails(regParam).subscribe(res=> {
      if (res.status == 1) {
        if(Object.keys(res.result).length > 0 )
        {
          let result = JSON.stringify(res.result);
          sessionStorage.setItem('companyDetails', result);
          //this.loading = false;
          this.loading = this.commonService.loader(false);
        }

        if(Object.keys(res.financialDetails).length > 0 )
        {
          let financialDetails = JSON.stringify(res.financialDetails);
          sessionStorage.setItem('financialDetails', financialDetails);
        }
      }
      else {
        this.loading = this.commonService.loader(false);
      }
    });
    //End of setting required data in session storage
    let formParms = intProcessId + ':' + intServiceId + ':0:' + intProductId + ':' + 1;
    let encSchemeStr = this.encDec.encText(formParms.toString());
    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"] = '';
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"] = '';
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = intServiceId;
    schmSesnArr["FFS_APPLY_SCHEME_MODULE_ID"] = intPolicyId;
    schmSesnArr["FFS_APPLY_SCHEME_PRODUCT_ID"] = intProductId;
    sessionStorage.setItem('REGD_ID',intRegdId);
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
    if(this.intOrganisationTypeId == 1){
      this.router.navigate(['/citizen-portal/apply-form', encSchemeStr]);
    }else if(this.intOrganisationTypeId == 2){
      this.router.navigate(['/citizen-portal/apply-bpo-form', encSchemeStr]);
    }else if(this.intOrganisationTypeId == 3){
      this.router.navigate(['/citizen-portal/apply-datacenter-form', encSchemeStr]);
    }else if(this.intOrganisationTypeId == 4){
      this.router.navigate(['/citizen-portal/apply-electronics-form', encSchemeStr]);
    }
	}
  getCalimPeriod(id:any,bankId:any){
    let policyParam = {
      "intModuleId": bankId,
      "intId": id
    };
    this.IrmsDetailsService.getPolicyCommencementDetails(policyParam).subscribe(res => {
       this.loading = false;
       if(res.status == 200){
       let schmPolicyArr = {};
       schmPolicyArr["COMM_START_DATE"] = res.result.commencementStartDate;
       schmPolicyArr["COMM_END_DATE"] = res.result.commencementEndDate;
       sessionStorage.setItem('SCHEME_POLICY_DET', JSON.stringify(schmPolicyArr));
       }
     });
  }
  newRegistration(){
    const sessionInfo = JSON.parse(sessionStorage.getItem("FFS_SESSION"));
    this.loading = true;
    this.api.applicationStatus({'intProfId':sessionInfo.USER_ID}).subscribe(res => {
      this.loading = false;
      console.log(res);
      if(res.status == 200) {

        if(res.result.applicationStatus < 3){ // For pending
          // this.regFormStatus = 1;
          Swal.fire({
            icon: 'info',
            html: '<p><strong>You have one application pending!</strong><p>'
          });
          this.router.navigate(['/citizen-portal/dashboard']);
        }else if(res.result.applicationStatus == 7 || res.result.applicationStatus == 8){ // For Aoorove & reject
          this.router.navigate(['/citizen-portal/registration']);
        }else if(res.result.applicationStatus == 9){ // For Draft
          this.router.navigate(['/citizen-portal/registration-manage']);
        }else if(res.result.applicationStatus == 10){ // For New
          this.router.navigate(['/citizen-portal/registration']);
        }else if(res.result.applicationStatus == 3){ // For Revert
          Swal.fire({
            title: 'You have one application reverted! Please apply from dashboard...',   
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
          }).then((result) => {
            if (result.isConfirmed){
              this.router.navigate(['/citizen-portal/dashboard']);
            }
          });
        }else{
          Swal.fire({
            icon: 'error',
            html: '<p><strong>Something went wrong! Please try again</strong><p>'
          });
          this.router.navigate(['/citizen-portal/dashboard']);
        }

        // if(res.result.applicationStatus == 9){ // For Draft
        //   this.router.navigate(['/citizen-portal/registration-manage']);
        // }else{
        //   this.router.navigate(['/citizen-portal/registration']);
        // }
      }else{
        Swal.fire({
          icon: 'error',
          html: '<p><strong>Something went wrong! Please try again</strong><p>'
        });
        this.router.navigate(['/citizen-portal/dashboard']);
      }
    });
  }

}
