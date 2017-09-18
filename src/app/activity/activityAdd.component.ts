/**
 * Created by asus on 2017/8/15.
 */

import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Common } from '../shared/Common';
import { ActivityService } from './activity.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
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
  form: FormGroup;
  title: FormControl;
  content;
  address: FormControl;
  startTime;
  endTime;
  publish_user_contact: FormControl;
  elementRef: ElementRef;
  imageList = [];
  showSpinner = false;
  label: String = '';
  labelList: Array<any> = [];
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
  constructor( @Inject(ElementRef) elementRef: ElementRef,
    private store: Store<any>, private location: Location, private formBuilder: FormBuilder,
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
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.activityType = params.id;
      } else {
        this.router.navigate(['/404']);
      }
    });
    this.store.select('user').subscribe(data => {
      this.user = data;
    });
    this.title = new FormControl('', [Validators.required, Validators.maxLength(30)]);
    this.address = new FormControl('', [Validators.required, Validators.maxLength(50)]);
    this.publish_user_contact = new FormControl('', [Validators.required]);

    this.form = this.formBuilder.group({
      title: this.title,
      address: this.address,
      publish_user_contact: this.publish_user_contact,
    });
  }

  imageUploaded(e) {
    this.renderer.setElementProperty(this.elementRef.nativeElement.querySelector('.clear span'), 'innerHTML', '清除所有');
    this.renderer.setElementStyle(this.elementRef.nativeElement.querySelector('.clear'), 'background-color', '#eb7350');
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

  lableChange(e) {
    this.labelList = e.split(' ').filter(a => !!a);
  }

  commit() {
    this.showSpinner = true;
    this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
    if (this.user.user.id) {
      this.schoolId = this.user.user.schoolId;
      for (let i = 0; i < this.imageList.length; i++) {
        this.imageList[i] = '\"' + this.imageList[i] + '\"';
      }
      this.content = $('#summernote').summernote('code');
      this.activityService.insert(this.form.value, this.startTime, this.endTime,
        this.content, this.user.user.id, this.activityType, this.schoolId, [this.imageList]).subscribe(data => {
          this.router.navigate(['../list'], { relativeTo: this.route });
        });
    } else {
      alert('登陆超时，请重新登录');
    }
  }

  back() {
    this.location.back();
  }
  home() {
    this.router.navigate(['/activity']);
  }

  ngOnDestroy() {
  }
}
