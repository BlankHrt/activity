/**
 * Created by asus on 2017/8/17.
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})

export class RegisterComponent implements OnInit {
  showProtocal = false;
  followProtocal = false;
  provinceList: Array<any>;
  schoolList: Array<any>;
  selectedProvince: any;
  selectedSchool: any;
  serverCode: any;
  @ViewChild('mobile') mobileTmp;

  // form
  UserRegister = {
    name: null,
    mobile: null,
    code: null,
    password: null,
    passwordAgain: null,
  };

  constructor(private location: Location,
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
        this.snackBar.open('手机号已存在');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      } else {
        this.userService.getMessage(this.UserRegister.mobile).subscribe((data: string) => {
          this.serverCode = data.toString();
          this.snackBar.open('验证码已发送');
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 1500);
        }, error => this.errorHandle(error));
      }
    }, error => this.errorHandle(error));
  }

  mobileChange(e) {
    setTimeout(() => {
      if (this.mobileTmp.valid) {
        this.getMessage();
      }
    }, 0);
  }

  register() {
    if (!this.UserRegister.name) {
      this.snackBar.open('用户名不能为空');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (!this.selectedSchool) {
      this.snackBar.open('学校不能为空');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (!this.UserRegister.mobile) {
      this.snackBar.open('手机号不能为空');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (this.UserRegister.code !== this.serverCode) {
      this.snackBar.open('验证码不正确');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (!this.UserRegister.password) {
      this.snackBar.open('密码不能为空');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (this.UserRegister.password.length < 6) {
      this.snackBar.open('密码过短');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (this.UserRegister.password !== this.UserRegister.passwordAgain) {
      this.snackBar.open('两次密码不一致');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (this.followProtocal) {
      this.snackBar.open('请认真阅读用户协议');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else {
      this.userService.register(this.UserRegister, this.selectedSchool).subscribe(data => {
        this.snackBar.open('注册成功，即将前往登录页面');
        setTimeout(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/user/login']);
        }, 1500);
      }, error => this.errorHandle(error));
    }
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
