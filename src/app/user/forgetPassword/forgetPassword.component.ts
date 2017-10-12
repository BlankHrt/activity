/**
 * Created by asus on 2017/8/17.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UserService } from '../../user.service';
import { Store } from '@ngrx/store';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forget',
  templateUrl: './forgetPassword.component.html',
})

export class ForgetPasswordComponent implements OnInit {
  serverCode;
  // form

  @ViewChild('mobile') mobileTmp;

  ForgetPas = {
    phone: null,
    code: null,
    password: null
  };

  constructor(
    public meta: Meta, public title: Title, private store: Store<any>, public snackBar: MatSnackBar,
    private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.title.setTitle('忘记密码');
    this.meta.addTags([
      { name: 'keywords', content: '动动七号忘记密码' },
      { name: 'description', content: '动动七号忘记密码' }
    ]);
  }
  ngOnInit() {

  }
  home() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }

  mobileChange(e) {
    setTimeout(() => {
      if (this.mobileTmp.valid) {
        this.getMessage(this.ForgetPas.phone);
      }
    }, 0);
  }

  confirm() {
    if (!this.ForgetPas.phone) {
      this.snackBar.open('请输入手机号');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (!this.ForgetPas.code) {
      this.snackBar.open('请输入验证码');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (!this.ForgetPas.password) {
      this.snackBar.open('请输入密码');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (this.ForgetPas.password.length < 6) {
      this.snackBar.open('密码过短');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else {
      if (this.ForgetPas.code === this.serverCode) {
        this.userService.updatePassword({ phone: this.ForgetPas.phone, password: this.ForgetPas.password }).subscribe(() => {
          this.snackBar.open('修改成功,即将前往登录页面');
          setTimeout(() => {
            this.snackBar.dismiss();
            this.router.navigate(['/user/login']);
          }, 1500);
        }, error => this.errorHandle(error));
      } else {
        this.snackBar.open('验证码错误');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      }
    }
  }

  getMessage(phone) {
    this.userService.validatePhoneIsExist(phone).subscribe(user => {
      if (user.id) {
        this.userService.getForgetMessage(phone).subscribe((data: string) => {
          this.serverCode = data.toString();
          this.snackBar.open('验证码已发送');
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 1500);
        }, error => this.errorHandle(error));
      } else {
        this.snackBar.open('手机号不存在');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      }
    }, error => this.errorHandle(error));
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
