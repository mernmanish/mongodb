import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ValidatorchklistService } from 'src/app/validatorchklist.service';
import Swal from 'sweetalert2';
import { CitizenAuthService } from '../service-api/citizen-auth.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [CitizenAuthService]
})
export class ChangepasswordComponent implements OnInit {
  public fg: FormGroup;
  constructor( private router: Router,public authService: CitizenAuthService,private fb: FormBuilder,public vldChkLst: ValidatorchklistService) { }
  currentPassword : any = '';
  newPassword : any = '';
  confirmPassword : any = '';
  loading = false;
  passwordType:any;
  newPasswordType:any;
  conPasswordType:any;
  show = false;
  newShow = false;
  conShow = false;
  ngOnInit(): void {
    this.passwordType = 'password';
    this.newPasswordType = 'password';
    this.conPasswordType = 'password';
    
  }
  changePassword()
  {
    let vSts = true;
    if (!this.vldChkLst.blankCheck(this.currentPassword, "Enter Current Password")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(this.newPassword, "Enter new Password")) {
      vSts = false;
    }
    else if (!this.vldChkLst.blankCheck(this.confirmPassword, "Enter Confirm Password")) {
      vSts = false;
    }else if(this.newPassword != this.confirmPassword){
      Swal.fire({
        icon: 'error',
        text: 'New Password and Confirm Password mismatch'
      });
      vSts = false;
    }
    else {
      vSts = true;
    }

    if(vSts)
    {
      this.loading = true;
      let farmerInfo = JSON.parse(sessionStorage.getItem('FFS_SESSION'));
      let decNewPassword = CryptoJS.SHA256(this.newPassword).toString(CryptoJS.enc.Hex);
      let decCurPassword = CryptoJS.SHA256(this.currentPassword).toString(CryptoJS.enc.Hex);
      // let hashedNewPassword = CryptoJS.SHA256(this.newPassword).toString(CryptoJS.enc.Hex);
      let regParam = {
        "currentpassword": this.currentPassword,
        "newpassword": this.newPassword,
        "confirmpassword": this.confirmPassword,
        "decNewPassword": decNewPassword,
        "decCurPassword": decCurPassword,
        'user':farmerInfo.USER_ID
      };
      

      this.authService.changePassword(regParam).subscribe(res => {
        if (res.status == 1) {
          this.authService.logout();
          this.router.navigateByUrl('/login');
          Swal.fire({
            icon: 'success',
            html: '<p>Password changed successfully, <b>Please Login with new Password</b> !<p>'
          });
          let result = res.result;
                 
        }else if(res.status == 2){
          Swal.fire({
            icon: 'error',
            html: 'New Password and Confirm Password mismatch'
          });
          let result = res.result;
        }
        else {
          Swal.fire({
            icon: 'error',
            text: 'Given Current password is Incorrect'
          });
          this.loading = false;
        
        }
      });

    }else{
      this.clearAll();
    }
  }

  clearAll()
  {
    this.currentPassword='';
    this.newPassword='';
    this.confirmPassword='';
  }

  /*
  * Function: toggleFieldTextType
  * Description: To toggle Password field b/w text & Pass
  * Created By: Manish Kumar
  * Date: 29 May 2024
  */
  toggleOldFieldTextType() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.show = true;
    } else {
      this.passwordType = 'password';
      this.show = false;
    }
  }
  toggleNewFieldTextType () {
    if (this.newPasswordType === 'password') {
      this.newPasswordType = 'text';
      this.newShow = true;
    } else {
      this.newPasswordType = 'password';
      this.newShow = false;
    }
  }
  toggleConFieldTextType () {
    if (this.conPasswordType === 'password') {
      this.conPasswordType = 'text';
      this.conShow = true;
    } else {
      this.conPasswordType = 'password';
      this.conShow = false;
    }
  }
}
