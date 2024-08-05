import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { NewregisterComponent } from './newregister/newregister.component';
import { ForgotPasswordComponent } from './citizen-portal/forgot-password/forgot-password.component';
import { SignupdetailsComponent } from './signupdetails/signupdetails.component';
const routes: Routes = [
  //   { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent},
  
  {
    path: '', pathMatch: 'full', redirectTo: '/home'
  }, {
    path: 'home',
    loadChildren: () => import('./website/website.module').then(m => m.WebsiteModule)
  },
  {
    path: 'citizen-portal',
    loadChildren: () => import('./citizen-portal/citizen-portal.module').then(m => m.CitizenPortalModule)
  },
  { path: 'login', component: LoginComponent},
  { path: 'Newregister', component: NewregisterComponent},
  { path: 'Forgot-password', component: ForgotPasswordComponent},
  { path: 'Signupdetails', component: SignupdetailsComponent},

  {path:'**',component:ErrorComponent}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
