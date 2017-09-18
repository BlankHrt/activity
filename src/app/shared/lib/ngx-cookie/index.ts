import { NgModule, ModuleWithProviders } from '@angular/core';

import { COOKIE_OPTIONS, CookieOptionsProvider } from './cookie-options-provider';
import { CookieService } from './cookie.service';
import { CookieOptions } from './cookie-options.model';
import { cookieServiceFactory } from './cookie.factory';

export * from './cookie.service';
export * from './cookie-backend.service';
export * from './cookie-options.model';
export * from './cookie-options-provider';
export * from './cookie.factory';
export * from './utils';

@NgModule({
  providers: [CookieOptionsProvider]
})
export class CookieModule {
  /**
   * Use this method in your root module to provide the CookieService
   * @param {CookieOptions} options
   * @returns {ModuleWithProviders}
   */
  static forRoot(options: CookieOptions = {}): ModuleWithProviders {
    return {
      ngModule: CookieModule,
      providers: [
        {provide: COOKIE_OPTIONS, useValue: options},
        {provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider]}
      ]
    };
  }

  /**
   * Use this method in your other (non root) modules to import the directive/pipe
   * @param {CookieOptions} options
   * @returns {ModuleWithProviders}
   */
  static forChild(options: CookieOptions = {}): ModuleWithProviders {
    return {
      ngModule: CookieModule,
      providers: [
        {provide: COOKIE_OPTIONS, useValue: options},
        {provide: CookieService, useFactory: cookieServiceFactory, deps: [CookieOptionsProvider]}
      ]
    };
  }
}
