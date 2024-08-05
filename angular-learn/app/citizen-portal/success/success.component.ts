import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitizenSchemeService } from '../service-api/citizen-scheme.service';
import { EncryptDecryptService } from 'src/app/encrypt-decrypt.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  

  constructor(private route:ActivatedRoute,private router: Router, private objSchm:CitizenSchemeService,private encDec: EncryptDecryptService) { }
  
  applicantId:any;
  schemeId:any;
  applctnId: any;
  applctnNo:any;
  applctnNm:any;
  loading = false;

  ngOnInit(): void {
    
    if(this.route.snapshot.paramMap.get('id').includes(':1')){
      let schemeStr = this.route.snapshot.paramMap.get('id');
      let schemeArr = schemeStr.split(':');
      this.schemeId = schemeArr[0];
      this.applctnId = schemeArr[1];
      let encAppCtnId = this.encDec.encText((this.schemeId + ':' + this.applctnId).toString());
      // console.log(encAppCtnId); 
      // return;
      this.router.navigate(['/citizen-portal/success', encAppCtnId]).then(() => {
        window.location.reload();
      });;
    }

    let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
    this.applicantId = farmerInfo.USER_ID;
    let encSchemeId  = this.route.snapshot.paramMap.get('id');
    let schemeStr    = this.encDec.decText(encSchemeId);
    let schemeArr    = schemeStr.split(':');
    this.schemeId    = schemeArr[0];
    this.applctnId   = schemeArr[1]; 
    // console.log(schemeArr);return;
    let params = {
      "schemeId":this.schemeId,
      "profId":this.applicantId,
      "applctnId":this.applctnId
    };
    this.getAppldSchmLst(params);  
  }



  getAppldSchmLst(params:any)
  {
    this.loading = true;
    this.objSchm.getAppldSchmLst(params).subscribe(res => {
      if (res.status == 1) {
        this.loading = false;
        let respList = res.result;
       
        if(respList[0]['processId']==environment.sujogPortal){
          this.applctnNo = respList[0]['integrationReferenceNo'];
        }else{
          this.applctnNo = respList[0]['strAppltnNo'];
        }        
        this.applctnNm = respList[0]['strSchmServcNm'];
        
      }
      else {
        Swal.fire({
          icon: 'error',
          text: res.msg
        });
        this.loading = false;
      }
    },
    error => {
      this.loading = false;
      Swal.fire({
        icon: 'error',
        text: environment.errorMsg
      });
    });
  }

}
