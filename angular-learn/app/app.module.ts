import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule ,HttpClientXsrfModule, HttpClient} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorComponent } from './error/error.component';
import { NgOtpInputModule } from  'ng-otp-input';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { NewregisterComponent } from './newregister/newregister.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { PolicyInnerComponent } from './website/policy-inner/policy-inner.component';
import { SignupdetailsComponent } from './signupdetails/signupdetails.component';
import { WebsiteModule } from './website/website.module';
import { MatPaginatorModule } from '@angular/material/paginator';

export const HttpLoaderFactory= (http:HttpClient) =>{
  let siteURL= environment.siteURL;
  return new TranslateHttpLoader(http,siteURL+'assets/i18n/','.json')
}

@NgModule({
  declarations: [
   AppComponent,
   ErrorComponent,
   LoginComponent,
   NewregisterComponent,
   PolicyInnerComponent,
   SignupdetailsComponent,
 
   
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule,
    NgbModule,
    BrowserAnimationsModule,
    NgOtpInputModule,
    FormsModule,
    ReactiveFormsModule,
    WebsiteModule,
    MatPaginatorModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    DatePipe,
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
