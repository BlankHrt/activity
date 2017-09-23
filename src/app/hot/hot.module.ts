import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HotService } from './hot.service';
import { HotComponent } from './hot.component';
import { HotAddComponent } from './hot-add-component';
import { HotDetailComponent } from './hot-detail.component';
import { HotMoreComponent } from './hot-more-component';
import { HotCommentComponent } from './hot-comment.component';
import { LoginAuthGuard } from '../auth/login.auth';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: HotComponent },
      { path: 'add', component: HotAddComponent, canActivate: [LoginAuthGuard] },
      { path: 'detail', component: HotDetailComponent },
      { path: 'more', component: HotMoreComponent },
      { path: 'comment', component: HotCommentComponent },
      { path: '', redirectTo: '/hot/list', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    HotComponent,
    HotAddComponent,
    HotDetailComponent,
    HotMoreComponent,
    HotCommentComponent
  ],
  providers: [HotService, LoginAuthGuard]
})
export class HotModule {

}
