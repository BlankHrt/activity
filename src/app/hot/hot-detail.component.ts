/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit, ViewChild, ElementRef, Renderer, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MdDialog } from '@angular/material';
import { HotService } from './hot.service';
import { HotDialogComponent } from './hot.dialog';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-hot-detail',
  templateUrl: './hot-detail.component.html',
})

export class HotDetailComponent implements OnInit, OnDestroy {

  showSpinner = false;
  showChildSpinner = false;
  commentList = [];
  imageList = [];
  user;
  comment;
  childComment = [];
  isUserSupport = false;
  article = {
    content: '',
    id: null,
    title: '',
    user: {
      id: null,
      name: '',
      headUrl: ''
    },
    readNumber: null,
    commentNumber: null,
    countCommentNumber: null,
    publishTime: null
  };

  galleryOptions = [
    { 'thumbnails': true, 'preview': false, 'imageSwipe': true, 'thumbnailsSwipe': true },
    { 'breakpoint': 500, 'width': '100%', 'height': '400px' }
  ];

  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  routerSubscribe: Subscription;
  storeSubscribe: Subscription;

  @ViewChild('commitButton') commitButton: ElementRef;
  @ViewChild('commitChildButton') commitChildButton: ElementRef;

  constructor(public dialog: MdDialog, private store: Store<any>, private hotService: HotService, private renderer: Renderer,
    private location: Location, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.hotService.read(params.id).subscribe();
        this.getArticleByIdWithUser(params.id);
        this.getAllCommentByArticleId(params.id);
        this.hotService.getArticleImageByArticleId(params.id).subscribe(imageList => {
          const list = [];
          for (let j = 0; j < imageList.length; j++) {
            list.push({
              medium: '\'' + imageList[j].url + '\'',
              small: '\'' + imageList[j].url + '\'',
            });
          }
          this.imageList = list;
        });
        this.storeSubscribe = this.store.select('user').subscribe(data => {
          this.user = data;
          if (this.user && this.user.user && this.user.user.id) {
            this.hotService.getArticleSupportByUserIdAndArticleID(this.user.user.id, params.id).subscribe(support => {
              if (!Array.isArray(support)) {
                this.isUserSupport = true;
              }
            });
          }
        });
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  getArticleByIdWithUser(id) {
    this.hotService.getArticleByIdWithUser(id).subscribe(data => {
      this.article = data;
    });
  }

  publish() {
    this.showSpinner = true;
    this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
    if (this.user.isLogin && this.comment) {
      this.hotService.comment(this.article.id, this.user.user.id, this.comment).subscribe(data => {
        this.getAllCommentByArticleId(this.article.id);
        this.comment = '';
        this.article.countCommentNumber++;
        this.showSpinner = false;
      });
    } else {
      const dialogRef = this.dialog.open(HotDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }
  childPublish(comment, index) {
    this.showChildSpinner = true;
    this.renderer.setElementAttribute(this.commitChildButton.nativeElement, 'disabled', 'true');
    comment.showChildComment = false;
    if (this.user.isLogin && this.childComment) {
      if (!comment.childrenCommentList) {
        comment.childrenCommentList = [];
      }
      comment.childrenCommentList.unshift({
        comment: this.childComment[index],
        user: {
          name: this.user.user.name,
          headUrl: this.user.user.headUrl
        }
      });
      this.hotService.childComment(comment.id, this.article.id, this.user.user.id, this.childComment[index]).subscribe(data => {
        //  this.getAllCommentByArticleId(this.article.id);
        this.childComment = [];
        this.article.countCommentNumber++;
        this.showChildSpinner = false;
      });
    } else {
      const dialogRef = this.dialog.open(HotDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  loadMoreChildComment(childComponent) {
    this.router.navigate(['/hot/comment'], { queryParams: { comment: JSON.stringify(childComponent.childrenCommentList) } });
  }

  getAllCommentByArticleId(id) {
    this.hotService.getAllCommentByArticleId(id).subscribe(data => {
      this.commentList = data;
    });
  }

  back() {
    this.location.back();
  }

  login() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/hot'
      }
    });
    this.router.navigate(['/user/login']);
  }

  gotoPersonDetail(comment) {
    this.router.navigate(['/user/personDetail'], { queryParams: { id: comment.userId } });
  }

  support(hot) {
    if (this.user.isLogin) {
      hot.countSupportNumber++;
      this.isUserSupport = true;
      this.hotService.support(hot.id, this.user.user.id).subscribe();
    } else {
      const dialogRef = this.dialog.open(HotDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  unSupport(hot) {
    if (this.user.isLogin) {
      hot.countSupportNumber--;
      this.isUserSupport = false;
      this.hotService.unSupport(hot.id, this.user.user.id).subscribe();
    } else {
      const dialogRef = this.dialog.open(HotDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  home() {
    this.router.navigate(['/hot']);
  }

  gotoPublishPersonDetail(e: any, article: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/hot'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: article.publishUserId } });
  }

  gotoFirstPersonDetail(e: any, comment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/hot'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: comment.userId } });
  }
  gotoChildPersonDetail(e: any, childComment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/hot'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: childComment.userId } });
  }

  ngOnDestroy() {
    this.routerSubscribe.unsubscribe();
    this.storeSubscribe.unsubscribe();
  }
}
