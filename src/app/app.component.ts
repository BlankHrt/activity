import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from './shared/lib/ngx-cookie/cookie.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<any>, private cookieService: CookieService,
    private userService: UserService) { }

  ngOnInit(): void {
    if (this.cookieService.get('phone') && this.cookieService.get('token')) {
      this.userService.loginWC({
        name: this.cookieService.get('phone'),
        password: this.cookieService.get('token')
      }).subscribe(data => {
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
    }
  }
}
