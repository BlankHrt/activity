import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forgetPassword/forgetPassword.component';
import { PersonInformationComponent } from './personInformation/personInformation.component';
import { PersonMessageComponent } from './personMessage/personMessage.component';
import { PersonDongDongComponent } from './personDongDong/personDongDong.component';
import { PersonDetailComponent } from './personDetail/personDetail.component';
import { HotComponent } from './hot/hot.component';
import { TravelComponent } from './travel/travel.component';
import { ActivityComponent } from './activity/activity.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { PersonActivityComponent } from './personActivity/personActivity.component';
import { PersonMessageActivityComponent } from './personMessageActivity/personMessageActivity.component';

/**
 * Created by asus on 2017/8/17.
 */

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgetpassword', component: ForgetPasswordComponent },
      { path: 'personInformation', component: PersonInformationComponent },
      { path: 'personDongDong', component: PersonDongDongComponent },
      { path: 'personMessage', component: PersonMessageComponent },
      { path: 'personMessageActivity', component: PersonMessageActivityComponent },
      { path: 'personDetail', component: PersonDetailComponent },
      { path: 'personActivity', component: PersonActivityComponent },
      { path: 'hot', component: HotComponent },
      { path: 'travel', component: TravelComponent },
      { path: 'activity', component: ActivityComponent },
      { path: 'feedback', component: FeedbackComponent },
      { path: '', redirectTo: '/user/login', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    PersonInformationComponent,
    PersonMessageComponent,
    PersonMessageActivityComponent,
    PersonDongDongComponent,
    PersonDetailComponent,
    PersonActivityComponent,
    HotComponent,
    TravelComponent,
    ActivityComponent,
    FeedbackComponent
  ],
  providers: []
})
export class UserModule {

}
