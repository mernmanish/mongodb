import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteApiService } from '../website-api.service';
import { CitizenMasterService } from '../../citizen-portal/service-api/citizen-master.service';
import { CitizenSchemeService } from '../../citizen-portal/service-api/citizen-scheme.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  public loading = false;
  public allBanks = false;
  public allProducts = false;
  respSts:any;
  respList:any;
  directorates:any;
  sectors:any;
  faqs:any;
  faqTypes:any;
  language:any = 'English';
  checkedIDs: any=[];

  constructor(
    private router:Router,
    private servicesList:WebsiteApiService,
    private objSchm:CitizenSchemeService,
    public masterService:CitizenMasterService,
  ) { }

  ngOnInit(): void {
    localStorage.setItem('locale', 'English');
    this.language=localStorage.getItem('locale');
    this.getFaqs(0);
    this.getFaqTypes();
  }

  getFaqs(e:any){ 
    // alert(this.language);
    
    // if (parm.target.checked) {
    //   this.typesArr.push(new FormControl(parm.target.value));
    // } else {
    //    const index = this.typesArr.controls.findIndex(x => x.value === parm.target.value);
    //    this.typesArr.removeAt(index);
    // }
    //let filteredArray : any=[];
    this.loading = true;
    if(e.checked){
      this.checkedIDs.push(e.value);
    }else{
      this.checkedIDs = this.checkedIDs.filter(evt => evt !== e.value)
    }


     let params = {
      "intTypes": this.checkedIDs
    };
    this.loading = false;
    // this.typesArr=this.fetchCheckedIDs();
    // console.log(this.typesArr);
    this.servicesList.getFaqs(params).subscribe(res=>{
      if(res['status']==200){

      this.respSts  = res.status;
      this.faqs = res.result['faqs'];
      this.loading = false;
    
    
      }
      else{
        this.loading = false;
      }
      
    });
    } 

    getFaqTypes(){ 
      let params = {
      
      };
    this.loading = true;
    this.servicesList.getFaqTypes(params).subscribe(res=>{
      if(res['status']==200){

      this.respSts  = res.status;
      this.faqTypes = res.result['faqTypes'];
      this.loading = false;
    
    
      }
      else{
        this.loading = true;
      }
      
    });
    }

}
