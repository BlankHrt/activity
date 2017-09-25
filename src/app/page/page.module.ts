import { NgModule } from '@angular/core';
import { PageRouterModule } from './page.router.module';
import { PageNotFoundComponent } from './pageNotFound.component';
import { AppFollowComponent } from './follow.component';
import { MdToolbarModule } from '@angular/material';

@NgModule({
    imports: [PageRouterModule, MdToolbarModule],
    declarations: [PageNotFoundComponent, AppFollowComponent]
})
export class PageModule {
}
