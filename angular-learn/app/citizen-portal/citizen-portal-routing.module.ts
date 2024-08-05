import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitizenDashboardComponent } from './citizen-dashboard/citizen-dashboard.component';
import { CitizenLoginComponent } from './citizen-login/citizen-login.component';
import { CitizenAuthGuardGuard } from './citizen-auth-guard.guard';
import { CitizenPortalComponent } from './citizen-portal.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationConfirmationComponent } from './registration-confirmation/registration-confirmation.component';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { SchemeApplyComponent } from './scheme-apply/scheme-apply.component';
import { SchemePreviewComponent } from './scheme-preview/scheme-preview.component';
import { SuccessComponent } from './success/success.component';
import { TrackstatusComponent } from './trackstatus/trackstatus.component';
import { SchemeDocumentComponent } from './scheme-document/scheme-document.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { AppliedSchemeDetailsComponent } from './applied-scheme-details/applied-scheme-details.component';
import { UpdateschemestatusComponent } from './updateschemestatus/updateschemestatus.component';
import { UploadPaymentReceiptComponent } from './upload-payment-receipt/upload-payment-receipt.component';
import { ErrorComponent } from '../error/error.component';
import { ServicesListComponent } from './services-list/services-list.component';
import { SchemeQueryReplyComponent } from './scheme-query-reply/scheme-query-reply.component';
import { AllActivitiesComponent } from './all-activities/all-activities.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MobilePageComponent } from './mobile-page/mobile-page.component';
import { SchemeDirectorateComponent } from './scheme-directorate/scheme-directorate.component';
import { ServicesDirectorateComponent } from './services-directorate/services-directorate.component';
import { FailureComponent } from './failure/failure.component';
import { ApplicantProfileComponent } from './applicant-profile/applicant-profile.component';
import { ApplyFormComponent } from './apply-form/apply-form.component';
import { ApplyElectronicsFormComponent } from './apply-electronics-form/apply-electronics-form.component';
import { ApplyBpoFormComponent } from './apply-bpo-form/apply-bpo-form.component';
import { ApplyDatacenterFormComponent } from './apply-datacenter-form/apply-datacenter-form.component';
import { RegistionViewComponent } from './registion-view/registion-view.component';
import { RegistrationManageComponent } from './registration-manage/registration-manage.component';
import { PreviewFormComponent } from './preview-form/preview-form.component';
import { InstructionsComponent } from './instructions/instructions.component';
const routes: Routes = [

  {
    path: '', component: CitizenPortalComponent,
    children: [
      { path: '', component: CitizenLoginComponent },
      { path: 'login', component: CitizenLoginComponent },
      { path: 'registration', component: RegistrationComponent, canActivate: [CitizenAuthGuardGuard] },
      { path: 'registration/:id', component: RegistrationComponent, canActivate: [CitizenAuthGuardGuard] },
      { path: 'registration-view/:id', component: RegistionViewComponent, canActivate: [CitizenAuthGuardGuard] },
      { path: 'registration-manage', component: RegistrationManageComponent, canActivate: [CitizenAuthGuardGuard] },
      { path: 'registration-confirmation/:id', component: RegistrationConfirmationComponent, },
      { path: 'dashboard', component: CitizenDashboardComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'instructions', component: InstructionsComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'profile-update/:id', component: ProfileUpdateComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-directorate', component: SchemeDirectorateComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'service-directorate', component: ServicesDirectorateComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-list/:id', component: SchemeListComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-apply/:id', component: SchemeApplyComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-document/:id', component: SchemeDocumentComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-preview/:id', component: SchemePreviewComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'success/:id', component: SuccessComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'trackstatus', component: TrackstatusComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'changepassword', component: ChangepasswordComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-applied/:id', component: AppliedSchemeDetailsComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'updateSchemestatus/:id', component: UpdateschemestatusComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'upload-payment-receipt/:id', component: UploadPaymentReceiptComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'AllActivities/:id', component: AllActivitiesComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'services-list/:id', component: ServicesListComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'scheme-query-reply/:id', component: SchemeQueryReplyComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'forgotpassword', component: ForgotPasswordComponent },
      { path: 'mobilepage', component: MobilePageComponent },
      { path: 'failure', component: FailureComponent },
      { path: 'applicant-profile', component: ApplicantProfileComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'apply-form/:id', component: ApplyFormComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'apply-electronics-form/:id', component: ApplyElectronicsFormComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'apply-bpo-form/:id', component: ApplyBpoFormComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'apply-datacenter-form/:id', component: ApplyDatacenterFormComponent,canActivate: [CitizenAuthGuardGuard] },
      { path: 'preview-form/:id', component: PreviewFormComponent,canActivate: [CitizenAuthGuardGuard] },
    ]
  },
  {
    path:'**',component:ErrorComponent
  }
  // ,canActivate: [CitizenAuthGuardGuard]
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CitizenPortalRoutingModule { }
