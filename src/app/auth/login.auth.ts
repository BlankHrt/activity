/**
 * Created by lenovo on 2017/3/15.
 */
import { Injectable } from '@angular/core';
import {
    CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild,
    Route, CanLoad
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

@Injectable()
export class LoginAuthGuard implements CanActivate {

    constructor(private store: Store<any>, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const url: string = state.url;

        return this.store.select('user').map((user: any) => {
            if (user.isLogin) {
                return true;
            } else {
                const redirectUrl = url.split('\/');
                this.router.navigate([redirectUrl[1]]);
                return false;
            }
        });
    }

}
