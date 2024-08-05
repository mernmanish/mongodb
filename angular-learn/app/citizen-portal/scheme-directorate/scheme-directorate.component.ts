import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { EncryptDecryptService } from '../../encrypt-decrypt.service';
import { environment } from '../../../environments/environment';
import { CitizenMasterService } from '../../citizen-portal/service-api/citizen-master.service';
import { CitizenAuthService } from '../../citizen-portal/service-api/citizen-auth.service';
import { IrmsDetailsService } from '../service-api/irms-details-service';
import { CommonService } from '../../common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scheme-directorate',
  templateUrl: './scheme-directorate.component.html',
  styleUrls: ['./scheme-directorate.component.css']
})
export class SchemeDirectorateComponent implements OnInit {
  loginSts: any;
  responseSts: any;
  loading = false;
  regdInfo : any =[];
  schemeId: any;
  applicantId: any;
  applctnId: any;
  farmerInfo: any;
  cateStatus = false;
  applicantName = '';
  emailId = '';
  mobileNo = '';
  gender = '';
  castCatg = '';
  fatherNm = '';
  districtId = 0;
  blockId = 0;
  gpId = 0;
  villageId = 0;
  address = '';
  dobV = '';
  aadhaarNo = '';
  applicationDetails: any;
  appldetcnt: any;
  public innerWidth: any;
  masterNotificationObj: any = {};
  NotificationList: any = [];
  contentTypeOfPage: any = '0';
  intOnlineServiceId: any;
  remark: any;
  intProcessId: any;
  districts: any;
  respSts: any;
  respList: any;
  branches: any;
  banks: any= [];
  public allBanks = false;
  public allProducts = false;
  block: any;
  bankbranchs: any = [];
  isFlag: any;
  selBank: any;
  uploadDocument: any;
  imgExtnArr: any[] = ['jpg', 'jpeg', 'png', 'pdf'];
  imgFileSize = 1;
  profImgUrl: any = '';
  profDefImgUrl: any = '';
  isProfImgUrl = false;
  downloadList: any;

  incentiveDetails: any = [];
  dirIcons = environment.directoryListicons;
  showMore = true;
  loadData = {
    page: 0,
    total: null,
    perpage: 8,
    pages: null
  };
  lengthCheck:any;
  data = [];
  selDistId:any=0;
  selBlockId:any=0;

  intEmpTotal: any = 0;
  intUserId: any = 0;
  intOrganisationTypeId: any;
  regdId: any;
  devMode = environment.devMode;
  constructor(
    private router: Router,
    private objSchm: CitizenSchemeService,
    public masterService: CitizenMasterService,
    public authService: CitizenAuthService,
    private encDec: EncryptDecryptService,
    private commonService: CommonService,
    public IrmsDetailsService: IrmsDetailsService
  ) {}

  ngOnInit(): void {
    //this.getDirectorates();
    this.loginSts = this.authService.isLoggedIn();
    this.farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    let REGD_ID = sessionStorage.getItem('REGD_ID');
    let intUserId = this.farmerInfo.USER_ID;
    this.intUserId = intUserId;
    let intOrgTypeId = (this.farmerInfo.USER_ORG_TYPE) ? this.farmerInfo.USER_ORG_TYPE : 0;
    this.intOrganisationTypeId = intOrgTypeId;
    this.regdId = REGD_ID;
    let intProdId = sessionStorage.getItem('REGD_ID');
    this.getRegEmpTotal(intProdId);
    this.getFinancialDetails(intProdId);
    this.getIncentiveList(intUserId,intOrgTypeId,this.regdId);
     
  }
 
  /**
   * Function Name: getIncentiveList
   * Description: This function is used to fetch the Incentive list.
   * Created By: Bibhuti Bhusan Sahoo
   * Created On: 10th Apr 2023
   * Modified By: Bindurekha Nayak
   * Updated On: 
   */
  getIncentiveList(userId: any,orgTypeId: any, regdId:any) {

    let params = {
      "intprofileId": userId,
      "orgTypeId": orgTypeId,
      "regdId": regdId
     };
     //this.loading = true;
    this.loading = this.commonService.loader(true);
    this.objSchm.getIncentiveList(params).subscribe(res => {
      if (res['status'] == '200') {
        //this.loading = false;
       this.loading = this.commonService.loader(false);
        this.respSts = res.status;
        this.respList = res.result['products'];
        this.allProducts = true;
      }else {
        this.loading = this.commonService.loader(false);
      }
      this.getSingleRegdDetails();
   });
  }
 
  viewAppliedScheme(schemeStr: any) {
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    this.router.navigate(['/citizen-portal/scheme-applied', encSchemeStr]);
  }
  doSchemeApply(schemeStr: any, schemeName: any, schmServTypeId: any, schmServTypeNm: any, bankId: any, draft: any,revertApp: any) {
    let productId = schemeStr.split(':')[3];
    this.setSchmServSesNm(schemeName, schmServTypeId, schmServTypeNm, bankId, productId);
    let encSchemeStr = this.encDec.encText(schemeStr.toString());
    
  console.log("draft",draft);
  if(draft > 0){ // For pending
      Swal.fire({
        icon: 'info',
        html: '<p><strong>You have one application pending!</strong><p>'
      });
      this.router.navigate(['/citizen-portal/dashboard']);
    }else if (revertApp>0){
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
    let REGD_ID = sessionStorage.getItem('REGD_ID');
    let policyParam = {
      "intModuleId": bankId,
      "intId": REGD_ID
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
  // mthod to set scheme session details
  setSchmServSesNm(schemeName: any, schmServTypeId: any, schmServTypeNm: any, bankId: any,productId: any) {
    let schmSesnArr = {};
    schmSesnArr["FFS_APPLY_SCHEME_NAME"] = schemeName;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE"] = schmServTypeNm;
    schmSesnArr["FFS_APPLY_SCHEME_TYPE_ID"] = schmServTypeId;
    schmSesnArr["FFS_APPLY_SCHEME_MODULE_ID"] = bankId;
    schmSesnArr["FFS_APPLY_SCHEME_PRODUCT_ID"] = productId;
    sessionStorage.setItem('FFS_SESSION_SCHEME', JSON.stringify(schmSesnArr));
  }
  modalLoanProduct(prod: any) {
    this.incentiveDetails = prod;

  }

  getSingleRegdDetails()
  {
    let REGD_ID = sessionStorage.getItem('REGD_ID');
       //this.loading = true;
      this.loading = this.commonService.loader(true);
      let regParam = {
        'intId':REGD_ID
      };
      this.IrmsDetailsService.getSingleRegdDetails(regParam).subscribe(res => {
        if(res.status == 1) {
          this.regdInfo = res.result;
        }
        //this.loading = false;
      this.loading = this.commonService.loader(false);
      });
  }
  getFinancialDetails(intProdId){
    /**
     * Start
     * Code added for fetching the company details
     */
    //this.loading = true;
   this.loading = this.commonService.loader(true);
    let regParam = {
      'intId':intProdId
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
        //this.loading = false;
        this.loading = this.commonService.loader(false);
      }
    });
    /* End */
  }

  getRegEmpTotal(id:any){
    //this.loading = true;
    this.loading = this.commonService.loader(true);
    let regParam = {
      'intId':id
    };
    this.IrmsDetailsService.getRegEmpTotal(regParam).subscribe(res => {
      if(res.status == 1) {
        this.intEmpTotal = res.result.empTotalValue;
        //this.intEmpTotal = 20;
        let mdName = (res.result.managingDirector) ?? '';
        let companyRegDate = (res.result.registrationDate) ?? '1970-01-01';
        let commencementDate = (res.result.commencementDate) ?? '1970-01-01';
        sessionStorage.setItem('totalEmpCount', this.intEmpTotal);
        sessionStorage.setItem('mdName', mdName);
        sessionStorage.setItem('companyRegDate', companyRegDate);
        sessionStorage.setItem('companyCommencementDate', commencementDate);
      }
      //this.loading = false;
      this.loading = this.commonService.loader(false);
    });
  }
/**
   * Function Name: getSerialNumber
   * Description: This function is used to fetch the data condition wise.
   * Created By: Bindurekha Nayak
   * Created On: 14th may 2024
   */
  getSerialNumber(index: number): number {
    let serialNumber = 0;
    for (let i = 0; i <= index; i++) {
      if (this.shouldDisplay(this.respList[i])) { // Check if the product should be displayed
        serialNumber++;
      }
    }
    return serialNumber;
  }
  /**
   * Function Name: shouldDisplay
   * Description: This function is used to fetch the data condition wise.
   * Created By: Bindurekha Nayak
   * Created On: 14th may 2024
   */
  shouldDisplay(prod: any): boolean {
    //Check if intEmpTotal is greater than 40 and exclude certain prodIds
    if (!this.devMode) {
      if (this.intEmpTotal > 40 && [19, 22, 105, 86, 87].includes(prod.prodId)) {
        return false;
      }
    
      // Check other conditions
      if (prod.prodId === 35 && this.regdInfo.vch_vfxunit_Exist === 2) {
        return false;
      }

    // Check other conditions
    if (prod.activeAppCount=== 1 && [27, 109].includes(prod.prodId)) {
      return false;
    }
    // Check other conditions
    if (prod.activeAppCount=== 2 && [94, 47, 31, 69].includes(prod.prodId)) {
      return false;
    }
    // Check other conditions
    if (prod.activeAppCount=== 3 && [104, 128, 111, 69, 95, 114, 122].includes(prod.prodId)) {
      return false;
    }
  }
    // Default condition
    return true;
  }
  
}
