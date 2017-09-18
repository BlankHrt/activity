import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/core';
import { PageNotFoundComponent } from './pageNotFound.component';

export const routes: Routes = [
  { path: 'activity', loadChildren: '../activity/activity.module#ActivityModule' },
  { path: 'travel', loadChildren: '../travel/travel.module#TravelModule' },
  { path: 'hot', loadChildren: '../hot/hot.module#HotModule' },
  { path: 'user', loadChildren: '../user/user.module#UserModule' },
  { path: '404', component: PageNotFoundComponent },
  { path: '', redirectTo: '/activity/list', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

export const PageRouterModule: ModuleWithProviders = RouterModule.forChild(routes);
