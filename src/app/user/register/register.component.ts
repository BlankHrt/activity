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
    });
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
            console.log(data);
          });
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
    });
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
      });
    }
  }
}
