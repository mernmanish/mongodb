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
@Component({
  selector: 'app-trackstatus',
  templateUrl: './trackstatus.component.html',
  styleUrls: ['./trackstatus.component.scss']
})
export class TrackstatusComponent implements OnInit {
 

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
    private WebCommonService : WebcommonservicesService
  ) { }

  ngOnInit(): void {
    sessionStorage.removeItem("REGD_ID");
    this.getRegistrationDetails();
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
      this.loading = true;
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
            Swal.fire({
              icon: 'success',
              html: '<p><b>No Record</b> Found !<p>'
            });
          } 
          this.loading = false;       
        }
        else {
          this.loading = false;
        }
      });
  }

  getIncentiveDetails()
  { 
    
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
        this.loading = true;
        const ctrlParms = {
          'intProcessId' : prod.intProcessId,
          'intOnlineServiceId' : prod.intOnlineServiceId,
          'intProfileId' : farmerInfo.USER_ID
        }
        this.IrmsDetailsService.createCloneApplication(ctrlParms).subscribe(res => {
          this.loading = false;
          let formParms = prod.intProcessId+':'+res.result.intOnlineServiceId+':'+0;
          let encSchemeStr = this.encDec.encText(formParms.toString());
          this.router.navigate(['/citizen-portal/registration',encSchemeStr])
        })   
      }
    })    
        
  }
  async gotoincentives(prod: any) {
    sessionStorage.setItem('REGD_ID',prod.intId);
    await this.router.navigate(['/citizen-portal/scheme-directorate']);
  }

  incentiveEdit(intProcessId:any, intServiceId:any, intProductId:any){

    let formParms = intProcessId + ':' + intServiceId + ':0:' + intProductId;
		let encSchemeStr = this.encDec.encText(formParms.toString());
		this.router.navigate(['/citizen-portal/apply-form', encSchemeStr]);

  }
}
