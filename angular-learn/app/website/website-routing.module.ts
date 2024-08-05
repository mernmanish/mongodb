import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { SchemeListComponent } from './scheme-list/scheme-list.component';
import { WebsiteComponent } from './website.component';
import { ContentComponent } from './content/content.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ErrorComponent } from '../error/error.component';
import { SearchComponent } from './search/search.component';
import { ServicesComponent } from './services/services.component';
import { HowToApplyComponent } from './how-to-apply/how-to-apply.component';
import { KnowYourStatusComponent } from './know-your-status/know-your-status.component';
import { FaqComponent } from './faq/faq.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { TrackStatusComponent } from './track-status/track-status.component';
import { PoliciesComponent } from './policies/policies.component';
import { PolicyInnerComponent } from './policy-inner/policy-inner.component';



const routes: Routes = [
  {
    path: '', pathMatch: 'full', component: HomePageComponent
  },
  {
    path: '', component: WebsiteComponent,
    children: [
      { path: 'scheme-list', component: SchemeListComponent },
      { path: 'scheme-list/:id', component: SchemeListComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'services/:id', component: ServicesComponent },
      { path: 'content/:id', component: ContentComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'search', component: SearchComponent },
      { path: 'howtoapply', component: HowToApplyComponent },
      { path: 'knowyourstatus', component: KnowYourStatusComponent },
      { path: 'how-to-use', component: HowToUseComponent },
      { path: 'track-status', component: TrackStatusComponent},
      { path: 'policies', component: PoliciesComponent},
      { path: 'policy-inner', component: PolicyInnerComponent},
    ]
  },
  {
    path:'**',component:ErrorComponent
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
