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
import {Subscription} from 'rxjs/Subscription';
import {MdSnackBar} from "@angular/material";
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
  content;
  imageList = [];
  elementRef: ElementRef;
  showSpinner = false;

  // form
  article = {
    title: null,
    address: null
  };
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  storeSubscribe: Subscription;
  routerSubscribe: Subscription;

  @ViewChild('commitButton') commitButton: ElementRef;

  constructor( @Inject(ElementRef) elementRef: ElementRef, public snackBar: MdSnackBar,
    private store: Store<any>, private location: Location,
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
    this.imageList.push(
      e.serverResponse.text()
    );
    console.log(this.imageList);
  }

  commit() {
    if (this.article.title && this.article.address) {
        this.showSpinner = true;
        this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
        if (this.user.user.id) {
          for (let i = 0; i < this.imageList.length; i++) {
            this.imageList[i] = '\"' + this.imageList[i] + '\"';
          }
          this.content = $('#summernote').summernote('code');
          this.travelService.insert(this.article, this.content, this.user.user.id,
            this.articleType, this.schoolId, [this.imageList]).subscribe(data => {
            this.router.navigate(['../list'], {relativeTo: this.route});
          }, error => this.errorHandle(error));
        } else {
          alert('登陆超时，请重新登录');
        }
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
