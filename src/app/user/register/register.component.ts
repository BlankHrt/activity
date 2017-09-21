/**
 * Created by asus on 2017/8/17.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})

export class RegisterComponent implements OnInit {

  provinceList: Array<any>;
  schoolList: Array<any>;
  selectedProvince: any;
  selectedSchool: any;
  serverCode: any;
  timer = 60;
  hasCode: Boolean = false;
  isPhoneExist: Boolean = false;

  // form
  UserRegister = {
    name: null,
    mobile: null,
    code: null,
    password: null,
    passwordAgain: null,
  };

  constructor(
    public snackBar: MdSnackBar, private userService: UserService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    this.userService.getAllProvince().subscribe(data => {
      this.provinceList = data;
    });
  }
  getSchoolByProvince(id: any) {
    this.userService.getSchoolByProvince(id).subscribe(data => {
      this.schoolList = data;
    }, error => this.errorHandle(error));
  }
  getMessage() {
    this.userService.validatePhoneIsExist(this.UserRegister.mobile).subscribe(user => {
      if (user.id) {
        this.isPhoneExist = true;
      } else {
        this.isPhoneExist = false;
        if (this.UserRegister) {
          this.userService.getMessage(this.UserRegister.mobile).subscribe((data: string) => {
            this.serverCode = data.toString();
          }, error => this.errorHandle(error));
          this.hasCode = true;
          const timer = setInterval(() => {
            this.timer--;
            if (this.timer === 0) {
              this.hasCode = false;
              this.timer = 60;
              clearInterval(timer);
            }
          }, 1000);
        } else {
          this.snackBar.open('请输入手机号');
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 1500);
        }
      }
    }, error => this.errorHandle(error));
  }

  register() {
    if ( !this.UserRegister.password ) {this.snackBar.open('密码不能为空'); }
    if (this.UserRegister.password !== this.UserRegister.passwordAgain) {
      this.snackBar.open('两次密码不一致');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (this.UserRegister.code !== this.serverCode) {
      this.snackBar.open('验证码不正确');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else {
      this.userService.register(this.UserRegister, this.selectedSchool).subscribe(data => {
        this.snackBar.open('注册成功，即将前往登陆页面');
        setTimeout(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/user/login']);
        }, 1500);
      }, error => this.errorHandle(error));
    }
  }
  errorHandle(error) {
    if (error.status === 401) {
      this.snackBar.open('认证失败，请登陆先');
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
