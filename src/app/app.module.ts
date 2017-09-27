import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { reducer } from './reducer/index';
import { SharedModule } from './shared/shared.module';
import { PageModule } from './page/page.module';
import { CookieModule } from './shared/lib/ngx-cookie/index';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ang4-seo-pre' }),
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    StoreModule.forRoot(reducer),
    SharedModule,
    PageModule,
    CookieModule.forRoot()
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
