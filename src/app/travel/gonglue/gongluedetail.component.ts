/**
 * Created by asus on 2017/8/15.
 */

import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer, ViewChild} from '@angular/core';
import { TravelService } from '../travel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { MdDialog } from '@angular/material';
import { TravelDialogComponent } from '../travel.dialog';
import {Subscription} from 'rxjs/Subscription';
declare var $;

@Component({
  selector: 'app-travel-gonglue-detail',
  templateUrl: './gongluedetail.component.html',
})

export class TravelGonglueDetailComponent implements OnInit, OnDestroy {

  showSpinner = false;
  showChildSpinner = false;
  imageList = [];
  commentList: any = [];
  user: any;
  comment: any;
  childComment = [];
  isUserSupport = false;
  article = {
    content: '',
    id: '',
    title: '',
    user: {
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
  constructor(public dialog: MdDialog, private store: Store<any>, private renderer: Renderer,
    private location: Location, private travelService: TravelService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.travelService.read(params.id).subscribe();
        this.getArticleByIdWithUser(params.id);
        this.getAllCommentByArticleId(params.id);
        this.travelService.getArticleImageByArticleId(params.id).subscribe(imageList => {
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
            this.travelService.getArticleSupportByUserIdAndArticleID(this.user.user.id, params.id).subscribe(support => {
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
    this.travelService.getArticleByIdWithUser(id).subscribe(data => {
      this.article = data;
      $('#summernote').html(this.article.content);
    });
  }

  publish() {
    this.showSpinner = true;
    this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
    if (this.user.isLogin && this.comment) {
      this.travelService.comment(this.article.id, this.user.user.id, this.comment).subscribe(data => {
        this.getAllCommentByArticleId(this.article.id);
        this.comment = '';
        this.article.countCommentNumber++;
        this.showSpinner = false;
      });
    } else {
      const dialogRef = this.dialog.open(TravelDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  childPublish(comment, index) {
    console.log(comment);
    console.log(index);
    console.log(this.childComment);
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
      console.log(comment);
      this.travelService.childComment(comment.id, this.article.id, this.user.user.id, this.childComment[index]).subscribe(data => {
        //  this.getAllCommentByArticleId(this.article.id);
        this.childComment = [];
        this.article.countCommentNumber++;
        this.showChildSpinner = false;
      });
    } else {
      const dialogRef = this.dialog.open(TravelDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  getAllCommentByArticleId(id) {
    this.travelService.getAllCommentByArticleId(id).subscribe(data => {
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
        url: '/travel'
      }
    });

    this.router.navigate(['/user/login']);
  }

  support(travelGonglue) {
    if (this.user.isLogin) {
      travelGonglue.countSupportNumber++;
      this.isUserSupport = true;
      this.travelService.support(travelGonglue.id, this.user.user.id).subscribe();
    } else {
      const dialogRef = this.dialog.open(TravelDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  unSupport(travelGonglue) {
    if (this.user.isLogin) {
      travelGonglue.countSupportNumber--;
      this.isUserSupport = false;
      this.travelService.unSupport(travelGonglue.id, this.user.user.id).subscribe();
    } else {
      const dialogRef = this.dialog.open(TravelDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  loadMoreChildComment(childComponent) {
    this.router.navigate(['/travel/gonglueComment'], { queryParams: { comment: JSON.stringify(childComponent.childrenCommentList) } });
  }
  home() {
    this.router.navigate(['/travel']);
  }

  gotoPublishPersonDetail(e: any, article: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: article.publishUserId } });
  }

  gotoFirstPersonDetail(e: any, comment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: comment.userId } });
  }
  gotoChildPersonDetail(e: any, childComment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
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
