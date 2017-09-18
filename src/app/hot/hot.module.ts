import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HotService } from './hot.service';
import { HotComponent } from './hot.component';
import { HotDialogComponent } from './hot.dialog';
import { HotAddComponent } from './hot-add-component';
import { HotDetailComponent } from './hot-detail.component';
import { HotMoreComponent } from './hot-more-component';
import { HotCommentComponent } from './hot-comment.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'list', component: HotComponent },
      { path: 'add', component: HotAddComponent },
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
    HotDialogComponent,
    HotAddComponent,
    HotDetailComponent,
    HotMoreComponent,
    HotCommentComponent
  ],
  providers: [HotService],
  entryComponents: [HotDialogComponent]
})
export class HotModule {

}
