import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TravelComponent } from './travel.component';
import { TravelGonglueComponent } from './gonglue/gonglue.component';
import { TravelService } from './travel.service';
import { TravelGonglueAddComponent } from './gonglue/gonglueAdd.component';
import { TravelGonglueDetailComponent } from './gonglue/gongluedetail.component';
import { TravelDialogComponent } from './travel.dialog';
import { GonglueCommentComponent } from './gonglue/gonglueComment.component';
import { LoginAuthGuard } from '../auth/login.auth';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: TravelComponent },
      { path: 'gonglueDetail', component: TravelGonglueDetailComponent },
      { path: 'gonglueAdd', component: TravelGonglueAddComponent, canActivate: [LoginAuthGuard] },
      { path: 'gonglueComment', component: GonglueCommentComponent },
      { path: '', redirectTo: '/travel/list', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TravelComponent,
    TravelGonglueComponent,
    TravelGonglueAddComponent,
    TravelGonglueDetailComponent,
    TravelDialogComponent,
    GonglueCommentComponent
  ],
  providers: [TravelService, LoginAuthGuard],
  entryComponents: [TravelDialogComponent]
})
export class TravelModule {

}
