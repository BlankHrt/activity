/**
 * Created by asus on 2017/8/15.
 */

import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder,  } from '@angular/forms';
import { Common } from '../shared/Common';
import { ActivityService } from './activity.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
import {MdSnackBar} from "@angular/material";
declare var $;

@Component({
  selector: 'app-activity-add',
  templateUrl: './activityAdd.component.html',
})

export class ActivityAddComponent implements OnInit, AfterViewInit, OnDestroy {
  user;
  schoolId;
  HttpUrl = Common.HttpUrl;
  ActivityUrl = Common.ActivityUpload;
  activityType;
  content;
  startTime;
  endTime;
  elementRef: ElementRef;
  imageList = [];
  showSpinner = false;
  label: String = '';
  labelList: Array<any> = [];

  // form
  activity = {
    title: null,
    address: null,
    publishUserContact: null
  };

  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  storeSubscribe: Subscription;
  routerSubscribe: Subscription;
  @ViewChild('commitButton') commitButton: ElementRef;

  datepickerOpts = {
    autoclose: true,
    todayBtn: 'linked',
    todayHighlight: true,
    assumeNearbyYear: true,
    format: 'yyyy-mm-dd',
    icon: 'fa fa-calendar',
    placeholder: '日期'
  };
  timepickerOpts = {
    icon: 'fa fa-clock-o',
    placeholder: '时间',
    showMeridian: false
  };
  ActivityUpload = Common.ActivityUpload;
  constructor( @Inject(ElementRef) elementRef: ElementRef, public snackBar: MdSnackBar,
    private store: Store<any>, private location: Location,
    private activityService: ActivityService, private router: Router,
    private route: ActivatedRoute, private renderer: Renderer) {
    this.elementRef = elementRef;
  }

  ngAfterViewInit(): void {
    $('#summernote').summernote({
      height: 200,
      toolbar: [
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['fontsize', ['fontsize']],
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['insert', ['picture']]
      ],
      callbacks: {
        onImageUpload: (files) => {
          this.sendFile(files[0]);
        },
      },
      dialogsInBody: true,
      dialogsFade: true
    });
  }

  sendFile(file: any) {
    const data = new FormData();
    data.append('file', file);
    $.ajax({
      data: data,
      type: 'POST',
      url: this.ActivityUpload,
      cache: false,
      contentType: false,
      processData: false,
      success: function (url) {
        $('#summernote').summernote('insertImage', url, function ($image) {
          $image.css('width', $image.width() / 5);
          $image.attr('data-filename', 'retriever');
        });
      }
    });
  }

  ngOnInit() {
    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.activityType = params.id;
      } else {
        this.router.navigate(['/404']);
      }
    });
    this.storeSubscribe = this.store.select('user').subscribe(data => {
      this.user = data;
    });
  }

  imageUploaded(e) {
    this.imageList.push(
      e.serverResponse.text()
    );
  }

  imageRemoved(e) {
    for (let i = 0; i < this.imageList.length; i++) {
      if (this.imageList[i] === e.serverResponse.text()) {
        this.imageList.splice(i, 1);
        break;
      }
    }
    console.log(this.imageList);
  }

  commit() {
      if (this.activity.title && this.activity.address && this.activity.publishUserContact) {
        this.showSpinner = true;
        this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
        if (this.user.user.id) {
          this.schoolId = this.user.user.schoolId;
          for (let i = 0; i < this.imageList.length; i++) {
            this.imageList[i] = '\"' + this.imageList[i] + '\"';
          }
          this.content = $('#summernote').summernote('code');
          this.activityService.insert(this.activity, this.startTime, this.endTime,
            this.content, this.user.user.id, this.activityType, this.schoolId, [this.imageList]).subscribe(data => {
            this.router.navigate(['../list'], {relativeTo: this.route});
          }, error => this.errorHandle(error));
        } else {
          alert('登陆超时，请重新登录');
        }
      }//if
  }

  back() {
    this.location.back();
  }
  home() {
    this.router.navigate(['/activity']);
  }

  ngOnDestroy() {
    this.storeSubscribe.unsubscribe();
    this.routerSubscribe.unsubscribe();
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
