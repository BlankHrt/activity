import { NgModule } from '@angular/core';
import { ActivityComponent } from './activity.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ActivityDetailComponent } from './activityDetail.component';
import { ActivityService } from './activity.service';
import { ActivityAddComponent } from './activityAdd.component';
import { ActivityDialogComponent } from './activity.dialog';
import { DatePipe } from '@angular/common';
import { ActivityJoinDialogComponent } from './activityjoin.dialog';
import { ActivityListComponent } from './activityList.component';
import { ActivityCommentComponent } from './activityComment.component';
import { LoginAuthGuard } from '../auth/login.auth';
const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: ActivityComponent },
      { path: 'activityAdd', component: ActivityAddComponent, canActivate: [LoginAuthGuard] },
      { path: 'activityList', component: ActivityListComponent },
      { path: 'activityDetail', component: ActivityDetailComponent },
      { path: 'activityComment', component: ActivityCommentComponent },
      { path: '', redirectTo: '/activity/list', pathMatch: 'full' },
    ]
  },
];
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ActivityComponent,
    ActivityDetailComponent,
    ActivityAddComponent,
    ActivityDialogComponent,
    ActivityJoinDialogComponent,
    ActivityListComponent,
    ActivityCommentComponent
  ],
  entryComponents: [ActivityDialogComponent, ActivityJoinDialogComponent],
  providers: [ActivityService, DatePipe, LoginAuthGuard]
})
export class ActivityModule {

}
