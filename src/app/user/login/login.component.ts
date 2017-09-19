/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { CookieService } from '../../shared/lib/ngx-cookie/cookie.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
  name;
  password;
  showError = false;
  constructor(private cookieService: CookieService, private store: Store<any>, private router: Router, private route: ActivatedRoute,
    public snackBar: MdSnackBar, private userService: UserService
  ) { }
  ngOnInit() {
  }
  login() {
    if (!this.name) {
      this.snackBar.open('请填写手机号或者邮箱');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (!this.password) {
      this.snackBar.open('请填写密码');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else {
      this.userService.login({ name: this.name, password: this.password }).subscribe((data: any) => {
        console.log(data);
        if (data.token) {
          this.store.dispatch({
            type: 'SAVE_USER',
            payload: {
              isLogin: true,
              user: data.user
            }
          });
          this.cookieService.put('token', data.token);
          this.showError = false;
          this.store.select('router').subscribe((x: any) => {
            this.router.navigate([x.url]);
          });
        } else {
          this.showError = true;
        }
      });
    }
  }
  home() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }
}

