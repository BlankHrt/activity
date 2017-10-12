import { NgModule } from '@angular/core';
import { PageRouterModule } from './page.router.module';
import { PageNotFoundComponent } from './pageNotFound.component';
import { AppFollowComponent } from './follow.component';
import { MatToolbarModule, MatButtonModule } from '@angular/material';

@NgModule({
    imports: [PageRouterModule, MatToolbarModule, MatButtonModule,
    ],
    declarations: [PageNotFoundComponent, AppFollowComponent]
})
export class PageModule {
}
