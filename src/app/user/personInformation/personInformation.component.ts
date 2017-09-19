/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { Location } from '@angular/common';
import { Common } from '../../shared/Common';
import { CookieService } from '../../shared/lib/ngx-cookie/cookie.service';

@Component({
  selector: 'app-person-information',
  templateUrl: './personInformation.component.html',
})

export class PersonInformationComponent implements OnInit {
  elementRef: ElementRef;
  user;
  show = false;
  HeadUpload = Common.HeadUpload;
  provinceList: Array<any>;
  schoolList: Array<any>;
  selectedProvince: any;
  selectedSchool: any;
  @ViewChild('imageView') imageView;

  constructor( @Inject(ElementRef) elementRef: ElementRef, private renderer: Renderer,
    private location: Location, private cookieService: CookieService,
    private store: Store<any>, private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.store.select('user').subscribe((data: any) => {
      this.user = data.user;
    });
  }

  showUpload() {
    // const x = this.elementRef.nativeElement.querySelector('#imageView');

    const event = new MouseEvent('click', { bubbles: true });
    this.renderer.invokeElementMethod(
      this.imageView.inputElement.nativeElement, 'dispatchEvent', [event]);
  }

  imageUploaded(e) {
    this.renderer.setElementProperty(this.elementRef.nativeElement.querySelector('.clear span'), 'innerHTML', '清除所有');
    this.renderer.setElementStyle(this.elementRef.nativeElement.querySelector('.clear'), 'background-color', '#eb7350');

    this.user.headUrl = e.serverResponse.text();
    this.userService.updateHead(e.serverResponse.text(), this.user.id).subscribe();
  }

  save() {
    this.show = !this.show;
    this.user.schoolId = this.selectedSchool;
    this.userService.update(this.user).subscribe(() => {
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
    });
  }

  edit() {
    this.userService.getAllProvince().subscribe(data => {
      this.provinceList = data;
    });
    this.show = !this.show;
  }
  getSchoolByProvince(id: any) {
    this.userService.getSchoolByProvince(id).subscribe(data => {
      this.schoolList = data;
    });
  }
  back() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }

  home() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }

}

