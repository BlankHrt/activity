import { NgModule } from '@angular/core';
import { PageRouterModule } from './page.router.module';
import { PageNotFoundComponent } from './pageNotFound.component';

@NgModule({
    imports: [PageRouterModule],
    declarations: [PageNotFoundComponent]
})
export class PageModule {
}
