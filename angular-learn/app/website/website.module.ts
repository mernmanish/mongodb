import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';


import { WebsiteRoutingModule } from './website-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WebsiteComponent } from './website.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { DataTablesModule } from 'angular-datatables';
import { ContentComponent } from './content/content.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SearchComponent } from './search/search.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { InternationalizationModule } from '../internationalization/internationalization.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { ServicesComponent } from './services/services.component';
import { HowToApplyComponent } from './how-to-apply/how-to-apply.component';
import { KnowYourStatusComponent } from './know-your-status/know-your-status.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipe } from './filter.pipe';
import { FaqComponent } from './faq/faq.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';
import { TrackStatusComponent } from './track-status/track-status.component';
import { PoliciesComponent } from './policies/policies.component';

// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient);
// }



export const HttpLoaderFactory= (http:HttpClient) =>{
  let siteURL= environment.siteURL;
  return new TranslateHttpLoader(http,siteURL+'assets/i18n/','.json')
}


@NgModule({
  declarations: [HomePageComponent, FooterComponent, HeaderComponent, WebsiteComponent, SchemeListComponent, ContentComponent, NotificationsComponent, FeedbackComponent, SearchComponent, ServicesComponent, HowToApplyComponent, KnowYourStatusComponent, FilterPipe, FaqComponent, HowToUseComponent, TrackStatusComponent, PoliciesComponent],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    NgxPaginationModule,
    NgScrollbarModule,
    SwiperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class WebsiteModule { }
