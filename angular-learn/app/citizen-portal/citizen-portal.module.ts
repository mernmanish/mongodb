import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitizenPortalRoutingModule } from './citizen-portal-routing.module';
import { CitizenLoginComponent } from './citizen-login/citizen-login.component';
import { CitizenDashboardComponent } from './citizen-dashboard/citizen-dashboard.component';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CitizenHeaderComponent } from './citizen-header/citizen-header.component';
import { CitizenFooterComponent } from './citizen-footer/citizen-footer.component';

import { CitizenPortalComponent } from './citizen-portal.component';
import { ProfileUpdateComponent,NgbDateCustomParserFormatter} from './profile-update/profile-update.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationConfirmationComponent } from './registration-confirmation/registration-confirmation.component';



import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SchemeApplyComponent } from './scheme-apply/scheme-apply.component';
import { SchemePreviewComponent } from './scheme-preview/scheme-preview.component';
import { SuccessComponent } from './success/success.component';
import { TrackstatusComponent } from './trackstatus/trackstatus.component';
import { SchemeDocumentComponent } from './scheme-document/scheme-document.component';
import { SchemeTabComponent } from './scheme-tab/scheme-tab.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AppliedSchemeDetailsComponent } from './applied-scheme-details/applied-scheme-details.component';

import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { ServicesListComponent } from './services-list/services-list.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { BlockCopyPasteDirective } from './directive-validations/block-copy-paste.directive';
import { SchemeQueryReplyComponent } from './scheme-query-reply/scheme-query-reply.component'; 
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'; 
import { NgOtpInputModule } from 'ng-otp-input';
import { MobilePageComponent } from './mobile-page/mobile-page.component';
import { UploadPaymentReceiptComponent } from './upload-payment-receipt/upload-payment-receipt.component';
import { SchemeDirectorateComponent } from './scheme-directorate/scheme-directorate.component';
import { ServicesDirectorateComponent } from './services-directorate/services-directorate.component';
import { FailureComponent} from './failure/failure.component';
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';
import { ApplicantProfileComponent } from './applicant-profile/applicant-profile.component';
import { nl2brPipe } from './nl2br.pipe';
import { ApplyFormComponent } from './apply-form/apply-form.component';
import { RegistionViewComponent } from './registion-view/registion-view.component';
import { RegistrationManageComponent } from './registration-manage/registration-manage.component';
import { PreviewFormComponent } from './preview-form/preview-form.component';
import { ApplyElectronicsFormComponent } from './apply-electronics-form/apply-electronics-form.component';
import { ApplyBpoFormComponent } from './apply-bpo-form/apply-bpo-form.component';
import { ApplyDatacenterFormComponent } from './apply-datacenter-form/apply-datacenter-form.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { IsValidDatePipe } from '../is-valid-date.pipe';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker"


export const HttpLoaderFactory= (http:HttpClient) =>{
  let siteURL= environment.siteURL;
  return new TranslateHttpLoader(http,siteURL+'assets/i18n/','.json')
}



@NgModule({
  declarations: [IsValidDatePipe,CitizenLoginComponent, CitizenDashboardComponent, CitizenHeaderComponent, CitizenFooterComponent,  CitizenPortalComponent, ProfileUpdateComponent, RegistrationComponent, RegistrationConfirmationComponent,
    SchemeListComponent,SchemeApplyComponent, SchemePreviewComponent, SuccessComponent, TrackstatusComponent, SchemeDocumentComponent, SchemeTabComponent, ChangepasswordComponent, AppliedSchemeDetailsComponent,  UpdateschemestatusComponent, ServicesListComponent, BlockCopyPasteDirective, AllActivitiesComponent, SchemeQueryReplyComponent, ForgotPasswordComponent, MobilePageComponent, UploadPaymentReceiptComponent, SchemeDirectorateComponent, ServicesDirectorateComponent, FailureComponent,  ApplicantProfileComponent, nl2brPipe, ApplyFormComponent, RegistionViewComponent, RegistrationManageComponent,PreviewFormComponent, ApplyElectronicsFormComponent, ApplyBpoFormComponent, ApplyDatacenterFormComponent, InstructionsComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CitizenPortalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgxPaginationModule,
    NgOtpInputModule,
    NgScrollbarModule,
    BsDatepickerModule.forRoot(),  //added by arpita
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})
export class CitizenPortalModule { 
  

}
