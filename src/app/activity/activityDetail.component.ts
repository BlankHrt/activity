/**
 * Created by asus on 2017/8/15.
 */
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from './activity.service';
import { MdDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { ActivityDialogComponent } from './activity.dialog';
import { Location } from '@angular/common';
import { ActivityJoinDialogComponent } from './activityjoin.dialog';
import {Subscription} from 'rxjs/Subscription';
declare var $;

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activityDetail.component.html',
})
export class ActivityDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  showSpinner = false;
  showChildSpinner = false;
  imageList = [];
  commentList = [];
  user;
  comment;
  childComment = [];
  aJoin = null;
  activityJoinStatus = false;
  isUserSupport = false;
  activity = {
    content: '',
    id: null,
    title: '',
    publishTime: null,
    publishUserContact: '',
    startTime: null,
    endTime: null,
    publishUserId: null,
    activityJoin: null,
    readNumber: null,
    countCommentNumber: null,
    user: {
      id: null,
      name: '',
      headUrl: ''
    },
    school: {
      name: '',
    },
  };

  galleryOptions = [
    { 'thumbnails': false, 'preview': false, 'imageSwipe': true, 'thumbnailsSwipe': true },
    { 'breakpoint': 500, 'width': '100%', 'height': '400px' }
  ];
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  routerSubscribe: Subscription;
  storeSubscribe: Subscription;

  @ViewChild('commitButton') commitButton: ElementRef;
  @ViewChild('commitChildButton') commitChildButton: ElementRef;

  constructor(public dialog: MdDialog, private store: Store<any>, private renderer: Renderer,
    private location: Location, private activityService: ActivityService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.storeSubscribe = this.store.select('user').subscribe((data: any) => {
      this.user = data;
    });
    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.activityService.read(params.id).subscribe();
        this.getActivityByIdWithUser(params.id);
        this.getAllCommentByActivityId(params.id);
        this.activityService.getActivityImageByActivityId(params.id).subscribe(imageList => {
          const list = [];
          for (let j = 0; j < imageList.length; j++) {
            list.push({
              medium: '\'' + imageList[j].url + '\'',
              small: '\'' + imageList[j].url + '\'',
            });
          }
          this.imageList = list;
        });

        if (this.user && this.user.isLogin) {
          this.getActivityJoinWithUser(params.id, this.user.user.id);
        }

        if (this.user && this.user.user && this.user.user.id) {
          this.activityService.getActivitySupportByUserIdAndActivityID(this.user.user.id, params.id).subscribe(support => {
            if (support.id) {
              this.isUserSupport = true;
            }
          });
        }

      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  // 根据登录的用户ID，判断该用户是否已经报名
  getActivityJoinWithUser(activityId: any, joinUserId: any) {
    this.activityService.getActivityJoinWithUser(activityId, joinUserId).subscribe((data: any) => {
      if (data.id) {
        this.aJoin = data;
        this.activityJoinStatus = true;

      }
    });
  }

  getActivityByIdWithUser(id: any) {
    this.activityService.getActivityByIdWithUser(id).subscribe(data => {
      this.activity = data;
      $('#summernote').html(this.activity.content);
    });
  }

  publish() {
    this.showSpinner = true;
    this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
    if (this.user.isLogin && this.comment) {
      this.activityService.comment(this.activity.id, this.user.user.id, this.comment).subscribe(data => {
        this.getAllCommentByActivityId(this.activity.id);
        this.comment = '';
        this.activity.countCommentNumber++;
        this.showSpinner = false;
      });
    } else {
      const dialogRef = this.dialog.open(ActivityDialogComponent);
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
      this.activityService.childComment(comment.id, this.activity.id, this.user.user.id, this.childComment[index]).subscribe(data => {
        //  this.getAllCommentByArticleId(this.article.id);
        this.childComment = [];
        this.activity.countCommentNumber++;
        this.showChildSpinner = false;
      });
    } else {
      const dialogRef = this.dialog.open(ActivityDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  getAllCommentByActivityId(id: any) {
    this.activityService.getAllCommentByActivityId(id).subscribe(data => {
      this.commentList = data;
    });
  }

  back() {
    // this.router.navigate(['../list'], { relativeTo: this.route });
    this.location.back();
  }

  login() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    this.router.navigate(['/user/login']);
  }

  join(e: any, activity: any) {
    e.stopPropagation();
    if (this.user.isLogin) {
      if (!this.aJoin) {

        const dialogJoinRef = this.dialog.open(ActivityJoinDialogComponent);
        dialogJoinRef.afterClosed().subscribe(result => {
          if (result) {
            this.activityService.joinInsert(activity.id, this.user.user.id, result).subscribe(data => {
              this.activityJoinStatus = true;
            });
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(ActivityDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  gotoAttendanceList(e: any, activity: any) {
    e.stopPropagation();
    this.router.navigate(['../activityList'], { relativeTo: this.route, queryParams: { id: activity.id } });
  }

  support(activity: any) {
    if (this.user.isLogin) {
      activity.countSupportNumber++;
      this.isUserSupport = true;
      this.activityService.support(activity.id, this.user.user.id).subscribe();
    } else {
      const dialogRef = this.dialog.open(ActivityDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  unSupport(activity: any) {
    if (this.user.isLogin) {
      activity.countSupportNumber--;
      this.isUserSupport = false;
      this.activityService.unSupport(activity.id, this.user.user.id).subscribe();
    } else {
      const dialogRef = this.dialog.open(ActivityDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  home() {
    this.router.navigate(['/activity']);
  }

  loadMoreChildComment(childComponent) {
    this.router.navigate(['/activity/activityComment'], { queryParams: { comment: JSON.stringify(childComponent.childrenCommentList) } });
  }

  gotoPublishPersonDetail(e: any, activity: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: activity.publishUserId } });
  }

  gotoFirstPersonDetail(e: any, comment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: comment.userId } });
  }
  gotoChildPersonDetail(e: any, childComment: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
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
