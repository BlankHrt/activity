/**
 * Created by asus on 2017/8/17.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { UserService } from '../../user.service';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forget',
  templateUrl: './forgetPassword.component.html',
})

export class ForgetPasswordComponent implements OnInit {
  form;
  code;
  serverCode;
  phone;
  password;
  timer = 60;
  hasCode: Boolean = false;
  constructor(
    private formBuilder: FormBuilder, private store: Store<any>, public snackBar: MdSnackBar,
    private router: Router, private route: ActivatedRoute, private userService: UserService) { }
  ngOnInit() {
    this.phone = new FormControl('', [Validators.required, Validators.maxLength(11),
    Validators.pattern('^1[34578][0-9]{9}$')]);
    this.code = new FormControl('', [Validators.required, Validators.maxLength(6)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(6)]);

    this.form = this.formBuilder.group({
      phone: this.phone,
      code: this.code,
      password: this.password,
    });
  }
  home() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }
  confirm() {
    if (this.phone.value && this.password.value) {
      if (this.code.value === this.serverCode) {
        this.userService.updatePassword({ phone: this.phone.value, password: this.password.value }).subscribe(() => {
          this.snackBar.open('修改成功,即将前往登陆页面');
          setTimeout(() => {
            this.snackBar.dismiss();
            this.router.navigate(['/user/login']);
          }, 1500);
        });
      } else {
        this.snackBar.open('验证码错误');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      }
    } else {
      this.snackBar.open('请按要求填写，ok？');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    }
  }

  getMessage() {
    this.hasCode = true;
    const timer = setInterval(() => {
      this.timer--;
      if (this.timer === 0) {
        this.hasCode = false;
        this.timer = 60;
        clearInterval(timer);
      }
    }, 1000);
    this.userService.validatePhoneIsExist(this.phone.value).subscribe(user => {
      if (user.id) {
        clearInterval(timer);
        let timer0;
        if (this.phone) {
          this.userService.getForgetMessage(this.phone.value).subscribe((data: string) => {
            this.serverCode = data.toString();
          });
          this.hasCode = true;
          timer0 = setInterval(() => {
            this.timer--;
            if (this.timer === 0) {
              this.hasCode = false;
              this.timer = 60;
              clearInterval(timer0);
            }
          }, 1000);
        } else {
          clearInterval(timer0);
          this.snackBar.open('请输入手机号');
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 1500);
        }
      } else {
        this.snackBar.open('手机号不存在');
        this.hasCode = false;
        this.timer = 60;
        clearInterval(timer);
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      }
    });
  }
}
