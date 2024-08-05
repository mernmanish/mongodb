/**
 * Component Name: policy-inner.component
 * Description: policy details
 * Developed By: Bindurekha Nayak
 * Created On: 25-03-2024
 * */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-policy-inner',
  templateUrl: './policy-inner.component.html',
  styleUrls: ['./policy-inner.component.css']
})
export class PolicyInnerComponent implements OnInit {
  processList: any=[];
  contentList: any;
  processDetailsList:any;
  processContentList:any;
  routerSubscription: Subscription;
  processAllIncentiveList:any=[];
  policyCount:any;
  public loading = false;
  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url !== '/home/policy-inner') {
          localStorage.removeItem('processList');
          localStorage.removeItem('contentList');
          localStorage.removeItem('processDetailslist');
        }
      }
    });
    this.getContentDetails();
  }
  /**
 * Function Name: getContentDetails
 * Description: This function is used to fetch all the policy details.
 * Created By: Bindurekha Nayak
 * Created On: 25-03-2024
 */
  getContentDetails(){
    this.loading = true;
    const storedProcessList = localStorage.getItem('processList');
    const storedContentList = localStorage.getItem('contentList');
    const storedProcessDetailslist = localStorage.getItem('processDetailslist');
    if (storedProcessList) {
      this.processDetailsList = JSON.parse(storedProcessList);
      this.loading = false;
    }
    if (storedContentList) {
      this.processContentList = JSON.parse(storedContentList);
      this.loading = false;
    }
    if (storedProcessDetailslist) {
      this.processAllIncentiveList = JSON.parse(storedProcessDetailslist);
      this.policyCount = this.processAllIncentiveList.length;
      this.loading = false;
    }
  }
  /**
 * Function Name: handleProcessClick
 * Description: This function is used to fetch all the policy details.
 * Created By: Bindurekha Nayak
 * Created On: 25-03-2024
 */

handleProcessClick(process: any,) {
  this.processDetailsList = process;
  this.processContentList = process.txtContentPolicy;
}
}
