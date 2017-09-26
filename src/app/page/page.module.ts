import { NgModule } from '@angular/core';
import { PageRouterModule } from './page.router.module';
import { PageNotFoundComponent } from './pageNotFound.component';
import { AppFollowComponent } from './follow.component';
import { MdToolbarModule, MdButtonModule } from '@angular/material';

@NgModule({
    imports: [PageRouterModule, MdToolbarModule, MdButtonModule,
    ],
    declarations: [PageNotFoundComponent, AppFollowComponent]
})
export class PageModule {
}
