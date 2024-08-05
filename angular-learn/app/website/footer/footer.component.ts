import { Component, OnInit, ElementRef,ViewChild, HostListener, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgbDateStruct, NgbModal, ModalDismissReasons  } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NG_ASYNC_VALIDATORS, Validators } from '@angular/forms';
import { WebsiteApiService } from '../website-api.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  error: any;
  DistrictNames: any;
  BankNames: any;
  ifscForm: any;
  Banks: any[];
  siteURL = environment.siteURL;
  apiUrl=environment.apiUrl;
  ifscSubmitted = false;
  isIFSCFlag = false;
  impLinks :any;
  socYTLink = environment.soc_yt_link;
  language:any= 'English';
  respSts: any;
  menuitems: any;
  public loading = false;

  @ViewChild('someModal') someModalRef:ElementRef;
  constructor(private modalService: NgbModal,
     private apilist:WebsiteApiService, private renderer: Renderer2, private el: ElementRef
 
    ) { }

  ngOnInit(): void {
    // this.language=localStorage.getItem('locale');
    this.getImpUrls();
    this.getMenu();
   
  }

  getImpUrls(){

    let params = { };
    this.loading = true;
    this.apilist.getImportantLink(params).subscribe(res=>{
      if (res['status'] == '200') {
        this.impLinks = res.result['important_links'];
        this.loading = false;
      }else{
        this.loading = false;
        this.menuitems = [];
      }
       
    });
  }
  open(content:any) {
  
    this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }
  close(content:any) {
  
    this.modalService.open(content, {size: 'lg',backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 100) {
      this.showScrollUpButton(true);
    } else {
      this.showScrollUpButton(false);
    }
  }
  
  showScrollUpButton(show: boolean): void {
    const scrollupButton = this.el.nativeElement.querySelector('.scrollup');
    if (scrollupButton) {
      if (show) {
        this.renderer.setStyle(scrollupButton, 'display', 'block');
      } else {
        this.renderer.setStyle(scrollupButton, 'display', 'none');
      }
    }
  }
  
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getMenu() {
    let params = {
      "mType": 3,
      "lang": localStorage.getItem('locale')
    };
    this.loading = true;
     this.apilist.footerMenu(params).subscribe(res => {
      if (res['status'] == '200') {
        this.respSts = res.status;
        this.menuitems = res.result;
        this.loading = false;
      }else{
        this.loading = false;
        this.menuitems = [];
      }
    });
  }

}
