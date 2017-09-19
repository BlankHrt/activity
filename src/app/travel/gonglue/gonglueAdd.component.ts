/**
 * Created by asus on 2017/8/15.
 */

import {Component, OnInit, AfterViewInit, Renderer, ElementRef, Inject, ViewChild, OnDestroy} from '@angular/core';
import { TravelService } from '../travel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Common } from '../../shared/Common';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import {Subscription} from "rxjs/Subscription";
declare var $;
@Component({
  selector: 'app-travel-gonglue-add',
  templateUrl: './gonglueAdd.component.html',
})

export class TravelGonglueAddComponent implements OnInit, AfterViewInit, OnDestroy {
  user;
  schoolId;
  HttpUrl = Common.HttpUrl;
  ArticleUpload = Common.ArticleUpload;
  ArticleUrl = Common.ArticleUpload;
  articleType;
  form: FormGroup;
  title: FormControl;
  content;
  address: FormControl;
  imageList = [];
  elementRef: ElementRef;
  showSpinner = false;

  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  storeSubscribe: Subscription;
  routerSubscribe: Subscription;

  @ViewChild('commitButton') commitButton: ElementRef;

  constructor( @Inject(ElementRef) elementRef: ElementRef,
    private store: Store<any>, private location: Location, private formBuilder: FormBuilder,
    private travelService: TravelService, private router: Router,
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
        // ['insert', ['picture']]
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

  sendFile(file) {
    const data = new FormData();
    data.append('file', file);
    $.ajax({
      data: data,
      type: 'POST',
      url: this.ArticleUpload,
      cache: false,
      contentType: false,
      processData: false,
      success: function (url) {
        $('#summernote').summernote('insertImage', url, function ($image) {
          $image.css('width', '80%');
          $image.css('margin', '0 auto');
          $image.css('display', 'block');
          $image.attr('data-filename', 'retriever');
        });
      }
    });
  }
  ngOnInit() {
    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.articleType = params.id;
      } else {
        this.router.navigate(['/404']);
      }
    });
    this.storeSubscribe = this.store.select('user').subscribe(data => {
      this.user = data;
      if (this.user && this.user.isLogin) {
        this.schoolId = this.user.user.schoolId;
      }
    });
    this.title = new FormControl('', [Validators.required, Validators.maxLength(30)]);
    this.address = new FormControl('', [Validators.required, Validators.maxLength(50)]);

    this.form = this.formBuilder.group({
      title: this.title,
      address: this.address,
    });
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

  imageUploaded(e) {
    this.renderer.setElementProperty(this.elementRef.nativeElement.querySelector('.clear span'), 'innerHTML', '清除所有');
    this.renderer.setElementStyle(this.elementRef.nativeElement.querySelector('.clear'), 'background-color', '#eb7350');
    this.imageList.push(
      e.serverResponse.text()
    );
    console.log(this.imageList);
  }

  commit() {
    this.showSpinner = true;
    this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
    if (this.user.user.id) {
      for (let i = 0; i < this.imageList.length; i++) {
        this.imageList[i] = '\"' + this.imageList[i] + '\"';
      }
      this.content = $('#summernote').summernote('code');
      this.travelService.insert(this.form.value, this.content, this.user.user.id,
        this.articleType, this.schoolId, [this.imageList]).subscribe(data => {
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
    this.router.navigate(['/travel']);
  }

  ngOnDestroy() {
    this.storeSubscribe.unsubscribe();
    this.routerSubscribe.unsubscribe();
  }
}
