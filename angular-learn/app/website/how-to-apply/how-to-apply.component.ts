import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
@Component({
  selector: 'app-how-to-apply',
  templateUrl: './how-to-apply.component.html',
  styleUrls: ['./how-to-apply.component.css']
})
export class HowToApplyComponent implements OnInit {
  domainUrl = environment.domainUrl;
  irmsImgUrl = environment.irmsHomeUrl;
  siteURL = environment.siteURL;
  htuYtLink : SafeResourceUrl;
  electronics_Policy_2021: SafeResourceUrl;
  electronics_Policy_2022:SafeResourceUrl;
  bpo_Policy: SafeResourceUrl;
  datacenter_Policy:SafeResourceUrl; 
  constructor(
    public sanitizer:DomSanitizer, 
  ) { }

  ngOnInit(): void {
    this.electronics_Policy_2021='assets/files/OEP-OG-V2.pdf';
    this.electronics_Policy_2022='assets/files/OITP-OG-V1.pdf';
    this.bpo_Policy='assets/files/BPO-OG_Master_V1.pdf';  
    this.datacenter_Policy='assets/files/OITP-OG-V1.pdf';
    this.electronics_Policy_2021 = this.sanitizer.bypassSecurityTrustResourceUrl(environment.siteURL+this.electronics_Policy_2021);
    this.electronics_Policy_2022 = this.sanitizer.bypassSecurityTrustResourceUrl(environment.siteURL+this.electronics_Policy_2022);
    this.bpo_Policy = this.sanitizer.bypassSecurityTrustResourceUrl(environment.siteURL+this.bpo_Policy);
    this.datacenter_Policy = this.sanitizer.bypassSecurityTrustResourceUrl(environment.siteURL+this.datacenter_Policy);  
    
  }

}
