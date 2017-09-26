/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { CookieService } from '../../shared/lib/ngx-cookie/cookie.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
  name;
  password;
  showError = false;
  constructor(private location: Location, private cookieService: CookieService,
    private store: Store<any>, private router: Router, private route: ActivatedRoute,
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
        if (data.token) {
          this.store.dispatch({
            type: 'SAVE_USER',
            payload: {
              isLogin: true,
              user: data.user
            }
          });
          this.cookieService.put('token', data.token, { expires: (new Date(Date.now() + 2592000 * 1000)).toString() });
          this.showError = false;
          this.store.select('router').subscribe((x: any) => {
            this.router.navigate([x.url]);
          });
        } else {
          this.showError = true;
        }
      }, () => {
        this.showError = true;
      });
    }
  }
  home() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }
  back() {
    this.location.back();
  }
  errorHandle(error) {
    if (error.status === 401) {
      this.snackBar.open('认证失败，请登录先');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (error.status === 403) {
      this.snackBar.open('对不起，您暂无权限');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (error.status === 500) {
      this.snackBar.open('操作失败', '请重试');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    }
  }
}

