/**
 * Component Name: policies.component
 * Description: policy details
 * Developed By: Bindurekha Nayak
 * Created On: 25-03-2024
 * */
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { WebsiteApiService } from '../website-api.service';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
declare let require: any;
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent implements OnInit {
  domainUrl = environment.domainUrl;
  staticUrl = environment.staticFileUrl;
  userManualFileUrl = environment.staticUserManualFileUrl;
  irmsImgUrl = environment.irmsHomeUrl;
  siteURL = environment.siteURL;
  htuYtLink : SafeResourceUrl;
  electronics_Policy_2021: SafeResourceUrl;
  electronics_Policy_2022:SafeResourceUrl;
  bpo_Policy: SafeResourceUrl;
  datacenter_Policy:SafeResourceUrl;
  public loading = false;
  arrPolicyList:any[];
  vchLink:SafeResourceUrl;
  activeTabIndex: number = 4;
  contentlist:any;
  processList:any=[];
  processDetailslist:any=[];
  searchTerm: string = ''; 
  filteredProcess: any; 
  policyDet:any[];

  setActiveIndex(index: number): void {
    this.activeTabIndex = index;
  }
  receivedValue: number;
  private subscription: Subscription;
  /**
 * Function Name: filterProcesses
 * Description: This function is used to filterProcesses all the policy details.
 * Created By: Bindurekha Nayak
 * Created On: 25-03-2024
 */
  filterProcesses(searchTerm: string, policyDetails: any): void {
    this.searchTerm = searchTerm.trim();
    if (this.searchTerm === '') {
        this.filteredProcess = null;
    } else {
        const processes = policyDetails.processes.filter(process =>
            process.vchProcessName.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
        this.filteredProcess = processes.length > 0 ? processes : null;
    }
}
  constructor(
    public sanitizer:DomSanitizer,
    private serviceList:WebsiteApiService,
    private router: Router,
    private http: HttpClient
  ) { this.subscription = this.serviceList.selectedValue$.subscribe(value => {
    this.receivedValue = value;
    this.activeTabIndex = value !== null ? value : 4; 
  });}

  ngOnInit(): void {
     this.getAllPoliciesDet();
     $(".service-panel-toggle").on("click", function () {
      $(".customizer").toggleClass("show-service-panel");
  }),
      $(".pagetop").on("click", function () {
          $(".customizer").removeClass("show-service-panel");
      });
}
/**
 * Function Name: getAllPolicies
 * Description: This function is used to fetch all the policy details.
 * Created By: Bindurekha Nayak
 * Created On: 22-03-2024
 */
getAllPoliciesDet(){
  this.loading = true;
  this.serviceList.getAllPoliciesDet().subscribe(res=>{
    this.loading = true;
    if(res.status==200){
      this.arrPolicyList  = res.result;
      this.loading = false;
    }
    else{
      this.loading = false;
    }  
  });
}
/**
 * Function Name: handleProcessClick
 * Description: This function is used to fetch all the policy details.
 * Created By: Bindurekha Nayak
 * Created On: 22-03-2024
 */


handleProcessClick(data: any): void {
  this.processList = data.process;
  this.contentlist = data.txtContentPolicy;
  this.processDetailslist = data.policyDet;
  localStorage.setItem('processList', JSON.stringify(this.processList));
  localStorage.setItem('contentList', JSON.stringify(this.contentlist));
  localStorage.setItem('processDetailslist', JSON.stringify(this.processDetailslist));
  this.router.navigate(['/home/policy-inner']);
 
}
/**
 * Function Name: downloadFile
 * Description: This function is used to download pdf.
 * Created By: Bindurekha Nayak
 * Created On: 01-04-2024
 */
downloadFile(fileUrl: string, fileTypeName: string) {
  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = (fileTypeName) ? fileTypeName : 'OIMS.pdf'; // Replace 'OIMS.pdf' with the default filename
    link.click();
    window.URL.revokeObjectURL(link.href);
  });
}
ngOnDestroy() {
  this.subscription.unsubscribe();
}


}
