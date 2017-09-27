import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {CookieService} from './shared/lib/ngx-cookie/cookie.service';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<any>, private cookieService: CookieService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.loginWC().subscribe(data => {
      if (data.id) {
        this.store.dispatch({
          type: 'SAVE_USER',
          payload: {
            isLogin: true,
            user: data
          }
        });
      }
    });
    this.getToken();
    setInterval(() => this.getToken(), 1000 * 60 * 59 * 2);
  }

  getToken() {
    if (!this.cookieService.get('access_token')) {
      console.log(1)
      this.cookieService.put('timestamp', this.functionTimestamp());
      this.cookieService.put('nonceStr', this.functionNonceStr());
      this.userService.getAccessToken().subscribe((data) => {
        this.cookieService.put('access_token', data.access_token, {expires: (new Date(Date.now() + data.expires_in * 1000)).toString()});
        this.userService.getJsapiTicket(this.cookieService.get('access_token')).subscribe((data2) => {
          this.cookieService.put('JsapiTicket', data2.ticket, {expires: (new Date(Date.now() + data2.expires_in * 1000)).toString()});
          this.store.dispatch({
            type: 'SAVE_WX',
            payload: {
              timestamp:  this.cookieService.get('timestamp'),
              nonceStr: this.cookieService.get('nonceStr'),
              access_token: data.access_token,
              JsapiTicket: data2.ticket
            }
          });
        });
      });
    }else {
      console.log(2)
      this.store.dispatch({
        type: 'SAVE_WX',
        payload: {
          timestamp:  this.cookieService.get('timestamp'),
          nonceStr: this.cookieService.get('nonceStr'),
          access_token: this.cookieService.get('access_token'),
          JsapiTicket: this.cookieService.get('JsapiTicket')
        }
      })
    }
  }//getToken

  functionNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  }

  functionTimestamp() {
    return parseInt((new Date().getTime() / 1000).toString(), 10) + '';
  }
}
