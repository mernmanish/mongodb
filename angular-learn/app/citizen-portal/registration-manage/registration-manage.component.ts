
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute,Router} from '@angular/router';
import { WebcommonservicesService } from 'src/app/webcommonservices.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
//import { ViewAppListService } from 'src/app/services/view-app-list.service';
import { ViewAppListService } from 'src/app/view-app-list.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registration-manage',
  templateUrl: './registration-manage.component.html',
  styleUrls: ['./registration-manage.component.css']
})
export class RegistrationManageComponent implements OnInit {
  @Input() fromadmin: any;
  loading = false;
  formsList: any='';
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  pageSizes = [10, 20, 50, 100, 500, 1000];
  dataResult: any;
  dataCols: any;
  processId: any = 21;
  projectPrefix:any = environment.projectPrefix;
  constructor(private router : ActivatedRoute,private WebCommonService : WebcommonservicesService , public encDec : EncryptDecryptService,private route: Router, private appListService: ViewAppListService ) {}
  
  ngOnInit(): void {
    let schemeArr:any = [];
    //let encSchemeId = this.router.snapshot.paramMap.get('id');  
    // if(encSchemeId != ""){
    //   let schemeStr = this.encDec.decText(encSchemeId);
    //   console.log(schemeStr);
    //    schemeArr = schemeStr.split(':');
    //    this.processId = schemeArr[0];
    // }    
    if (this.processId > 0) {
      this.getApplList(this.processId);
    }

  }

  multilingual(test: any) {
    return test;
  }
  getApplList(processId: any) {
    
    const sessionInfo = JSON.parse(sessionStorage.getItem("FFS_SESSION"));	
    let param = { itemId: processId, pendingAt: 0, pageType: "sum" , pgStatus:"1",profileId: sessionInfo.USER_ID };
    this.loading=true;
    this.appListService.getApplicationListRegd(param).subscribe(
      (res) => {
        this.dataCols = res.result.cols;
        this.dataResult = res.result.dataRes;     
        this.formsList = this.dataResult; 
        this.loading=false;    
      },
      (error) => {
        // console.log("Error fetching application list:", error);
        this.loading = false;
      }
    );
  }
  onTableDataChange(event: any) {
    this.page = event;
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  goToTakeAction(intId: any, serviceId: any) {
    let encParam = this.encDec.encText(
      this.processId + ':' + serviceId + ':' + intId
    );
    this.route.navigateByUrl('admin/application/take-action/' + encParam);
  }

  getStatus(rows: any) {
    let status = 0;
    let pendingAuths = '';
    let appStatus = '';
    let statusDate = '';
    if (rows) {
      status = rows.tinStatus;
      pendingAuths = rows.pendingAuth;
      statusDate = rows.dtmStatusDate != '' ? rows.dtmStatusDate : '';

      if (status == 8) {
        appStatus = '<div>Application Approved</div>';
        if (statusDate) {
          appStatus += '<small>On : ' + rows.dtmStatusDate + '</small>';
        }
      } else {
        appStatus = '<div>Application is pending for approval</div><small>';

        if (statusDate) {
          appStatus += '<small>From : ' + rows.dtmStatusDate + '</small>';
        }
      }
    }
    return appStatus;
  }

  gotoPreview(onlineServiceId:any)
  {  
            let formParms  = this.processId+':'+onlineServiceId+':'+0;
            let encSchemeStr = this.encDec.encText(formParms.toString());
            this.route.navigate(['/website/formPreview',encSchemeStr]);
  }
  gotoPreviewquery(onlineServiceId:any)
  {  
             let formParms  = this.processId+':'+onlineServiceId+':'+0;
             let encSchemeStr = this.encDec.encText(formParms.toString());
            this.route.navigate(['/website/scheme-query-reply']);
  }

  // gotoPreviewquery(onlineServiceId:any) {  
  //   let formParms  = this.processId+':'+onlineServiceId+':'+0;
  //   let encSchemeStr = this.encDec.encText(formParms.toString());
  //   this.route.navigate(['/website/scheme-query-reply']);
  // }

  editApplication(onlineServiceId:any) {
    let formParms  = this.processId+':'+onlineServiceId+':'+0;   
    let encSchemeStr = this.encDec.encText(formParms.toString());
    this.route.navigate(['/citizen-portal/registration',encSchemeStr]);
  }
  
}
