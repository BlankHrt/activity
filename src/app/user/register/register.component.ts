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
  form: FormGroup;

  mobile: FormControl;
  name: FormControl;
  password: FormControl;
  passwordAgain: FormControl;
  code: FormControl;
  provinceList: Array<any>;
  schoolList: Array<any>;
  selectedProvince: any;
  selectedSchool: any;
  serverCode: any;
  timer = 60;
  hasCode: Boolean = false;
  isPhoneExist: Boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MdSnackBar, private userService: UserService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.mobile = new FormControl('', [Validators.required, Validators.maxLength(11),
    Validators.pattern('^1[34578][0-9]{9}$')]);
    this.name = new FormControl('', [Validators.required, Validators.maxLength(10)]);
    this.code = new FormControl('', [Validators.required, Validators.maxLength(6)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(16), Validators.minLength(6)]);
    this.passwordAgain = new FormControl('', [Validators.required, Validators.maxLength(16)]);

    this.userService.getAllProvince().subscribe(data => {
      this.provinceList = data;
    });
    this.form = this.formBuilder.group({
      mobile: this.mobile,
      name: this.name,
      code: this.code,
      password: this.password,
    });
  }
  getSchoolByProvince(id: any) {
    this.userService.getSchoolByProvince(id).subscribe(data => {
      this.schoolList = data;
    });
  }
  getMessage() {
    this.userService.validatePhoneIsExist(this.mobile.value).subscribe(user => {
      if (user.id) {
        this.isPhoneExist = true;
      } else {
        this.isPhoneExist = false;
        if (this.mobile.value) {
          this.userService.getMessage(this.mobile.value).subscribe((data: string) => {
            this.serverCode = data.toString();
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
    if (this.password.value !== this.passwordAgain.value) {
      this.snackBar.open('两次密码不一致');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (this.code.value !== this.serverCode) {
      this.snackBar.open('验证码不正确');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else {
      this.userService.register(this.form.value, this.selectedSchool).subscribe(data => {
        this.snackBar.open('注册成功，即将前往登陆页面');
        setTimeout(() => {
          this.snackBar.dismiss();
          this.router.navigate(['/user/login']);
        }, 1500);
      });
    }
  }
}
