import { Component, OnInit, OnDestroy, Renderer, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../shared/Common';
import { ActivityService } from './activity.service';
import { Store } from '@ngrx/store';
import { MdDialog } from '@angular/material';
import { ActivityDialogComponent } from './activity.dialog';
import { ActivityJoinDialogComponent } from './activityjoin.dialog';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { CookieService } from '../shared/lib/ngx-cookie/cookie.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit, OnDestroy {

  @ViewChildren('view', { read: ElementRef }) viewList: QueryList<any>;
  user: any = { id: 0 };
  ActivityType = Common.ActivityType.xiaoyuan;
  activityList = [];
  searchWord = '';
  contact;
  schoolId;
  nowPage = 1;
  nowPageSelfSchool = 1;
  searchPage = 1;
  bottomStatus = 0;
  notificationLength = 0;
  notification: Observable<any>;
  galleryOptions = [
    { 'thumbnails': false, 'preview': true, 'imageSwipe': true },
    { 'breakpoint': 500, 'width': '100%', 'height': '300px' }
  ];

  status = 0;
  searchStatus = 0;

  constructor(private renderer: Renderer, public dialog: MdDialog, private cookieService: CookieService,
    private store: Store<any>, private activityService: ActivityService, private router: Router, private route: ActivatedRoute) {
  }

  changeStatus() {
    console.log(this.status);
    this.searchWord = '';
    this.searchStatus = 0;
    this.bottomStatus = 0;

    if (this.status === 0) {
      this.nowPage = 1;
      this.getAllSchool();
    }
    if (this.status === 1) {
      this.nowPageSelfSchool = 1;
      this.getSelfSchool();
    }
  }

  ngOnInit() {
    this.store.select('user').subscribe((data: any) => {
      this.user = data;
      if (this.user.isLogin) {
        this.schoolId = data.user.schoolId;
      }
      this.getAllSchool();
      if (this.user && this.user.user.id) {
        this.getNotification(this.user.user.id);
      }
    });
    /*this.hotService.getHotByPageAndLimitNumber(this.articleType, 10).subscribe(data => {
     this.todayHotList = data;
     });*/
  }

  search() {

    this.bottomStatus = 0;

    if (this.status === 0) {

      if (this.searchWord.trim()) {
        this.searchPage = 1;
        this.getSearch();
        this.searchStatus = 1;
      } else {
        this.nowPage = 1;
        this.searchStatus = 0;
        this.getAllSchool();
      }
    }
    if (this.status === 1) {

      if (this.searchWord.trim()) {
        this.searchPage = 1;
        this.getSearchSelfSchool();
        this.searchStatus = 1;
      } else {
        this.nowPageSelfSchool = 1;
        this.searchStatus = 0;
        this.getSelfSchool();
      }

    }
  }

  refresh() {

    this.searchWord = '';
    this.searchStatus = 0;
    this.bottomStatus = 0;
    if (this.status === 0) {
      this.nowPage = 1;
      this.getAllSchool();
    }
    if (this.status === 1) {
      this.nowPageSelfSchool = 1;
      this.getSelfSchool();
    }
  }

  getSearch() {
    this.activityService.getActivityByPageAndTitleAndType(this.searchWord, this.searchPage,
      this.ActivityType, this.user.isLogin, this.user.user.id).subscribe(activityList => {
        if (this.searchPage > 1 && (activityList.length === 0)) {
          this.bottomStatus = 1;
        }
        for (let i = 0; i < activityList.length; i++) {
          this.activityService.getActivityImageByActivityId(activityList[i].id).subscribe(imageList => {
            const list = [];
            for (let j = 0; j < imageList.length; j++) {
              list.push({
                medium: '\'' + imageList[j].url + '\'',
                // big: '\'' + imageList[j].url + '\'',
              });
            }
            activityList[i].imageList = list;
            this.viewList.forEach(view => {
              this.renderer.listen(view.nativeElement, 'click', (event) => {
                event.stopPropagation();
              });
            });
          });
        }

        if (this.searchPage === 1) {
          this.activityList = activityList;
        } else {
          this.activityList = this.activityList.concat(activityList);
        }
      });
  }

  gotoActivityDetail(activity: any) {
    this.router.navigate(['../activityDetail'], { relativeTo: this.route, queryParams: { id: activity.id } });
  }

  support(e: any, activity: any) {
    e.stopPropagation();
    if (this.user.isLogin) {
      activity.countSupportNumber++;
      activity.activityUserSupport = true;
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

  unSupport(e: any, activity: any) {
    e.stopPropagation();
    if (this.user.isLogin) {
      activity.countSupportNumber--;
      activity.activityUserSupport = false;
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

  gotoAddDetail() {
    if (this.user.isLogin) {
      this.router.navigate(['../activityAdd'], { relativeTo: this.route, queryParams: { id: this.ActivityType } });
    } else {
      const dialogRef = this.dialog.open(ActivityDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
    }
  }

  getSelfSchool() {
    if (this.user.isLogin) {
      console.log('this.nowPageSelfSchool/getself=' + this.nowPageSelfSchool);
      this.activityService.getSelfSchoolActivityByPage(this.nowPageSelfSchool, this.ActivityType,
        this.user.isLogin, this.user.user.id, this.schoolId).subscribe(activityList => {
          if (this.nowPageSelfSchool > 1 && (activityList.length === 0)) {
            this.bottomStatus = 1;
          }
          for (let i = 0; i < activityList.length; i++) {
            this.activityService.getActivityImageByActivityId(activityList[i].id).subscribe(imageList => {
              const list = [];
              for (let j = 0; j < imageList.length; j++) {
                list.push({
                  medium: '\'' + imageList[j].url + '\'',
                  // big: '\'' + imageList[j].url + '\'',
                });
              }
              activityList[i].imageList = list;
              this.viewList.forEach(view => {
                this.renderer.listen(view.nativeElement, 'click', (event) => {
                  event.stopPropagation();
                });
              });
            });
          }
          if (this.nowPageSelfSchool === 1) {
            this.activityList = activityList;
          } else {
            this.activityList = this.activityList.concat(activityList);
          }
        });
    } else {
      const dialogRef = this.dialog.open(ActivityDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        } else {
          this.status = 0;
        }
      });
    }
  }

  getSearchSelfSchool() {
    if (this.user.isLogin) {
      console.log('this.searchPage/getSearchSelfSchool=' + this.searchPage);
      this.activityService.getSearchSelfSchoolActivityByPage(this.searchWord, this.searchPage,
        this.ActivityType, this.user.isLogin, this.user.user.id, this.schoolId).subscribe(activityList => {
          console.log('activityList.length= ' + activityList.length);
          if (this.searchPage > 1 && (activityList.length === 0)) {
            this.bottomStatus = 1;
          }
          for (let i = 0; i < activityList.length; i++) {
            this.activityService.getActivityImageByActivityId(activityList[i].id).subscribe(imageList => {
              const list = [];
              for (let j = 0; j < imageList.length; j++) {
                list.push({
                  medium: '\'' + imageList[j].url + '\'',
                  // big: '\'' + imageList[j].url + '\'',
                });
              }
              activityList[i].imageList = list;
              this.viewList.forEach(view => {
                this.renderer.listen(view.nativeElement, 'click', (event) => {
                  event.stopPropagation();
                });
              });
            });
          }
          if (this.searchPage === 1) {
            this.activityList = activityList;
          } else {
            this.activityList = this.activityList.concat(activityList);
          }
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

  getAllSchool() {
    console.log('this.nowPage/getAll=' + this.nowPage);
    this.activityService.getActivityByPage(this.nowPage, this.ActivityType,
      this.user.isLogin, this.user.user.id).subscribe(activityList => {

        if (this.nowPage > 1 && (activityList.length === 0)) {
          this.bottomStatus = 1;
        }
        for (let i = 0; i < activityList.length; i++) {
          this.activityService.getActivityImageByActivityId(activityList[i].id).subscribe(imageList => {
            const list = [];
            for (let j = 0; j < imageList.length; j++) {
              list.push({
                medium: '\'' + imageList[j].url + '\'',
                // big: '\'' + imageList[j].url + '\'',
              });
            }
            activityList[i].imageList = list;
            this.viewList.forEach(view => {
              this.renderer.listen(view.nativeElement, 'click', (event) => {
                event.stopPropagation();
              });
            });
          });
        }

        if (this.nowPage === 1) {
          this.activityList = activityList;
          console.log('activityList.length/page=1 =' + this.activityList.length);
        } else {
          this.activityList = this.activityList.concat(activityList);
          console.log('activityList.length/page!=1 =' + this.activityList.length);
        }
      });
  }

  join(e: any, activity: any) {
    e.stopPropagation();
    if (this.user.isLogin) {
      if (!activity.activityJoin) {
        const dialogJoinRef = this.dialog.open(ActivityJoinDialogComponent);
        dialogJoinRef.afterClosed().subscribe(result => {
          if (result) {
            this.activityService.joinInsert(activity.id, this.user.user.id, result).subscribe(data => {
              activity.activityJoin = {
                isSuccess: 1
              };
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

  loadMoreALL() {
    this.nowPage += 1;
    console.log('status= ' + this.status);
    console.log('this.nowPage/LOADALL= ' + this.nowPage);
    this.getAllSchool();
  }

  loadMoreALLSearch() {
    this.searchPage += 1;
    console.log('status= ' + this.status);
    console.log('this.searchPage/loadMoreALLSearch= ' + this.searchPage);
    this.getSearch();
  }

  loadMoreSelf() {
    this.nowPageSelfSchool += 1;
    console.log('status= ' + this.status);
    console.log('this.nowPageSelfSchool/LAODSELF= ' + this.nowPageSelfSchool);
    this.getSelfSchool();
  }

  loadMoreSelfSearch() {
    this.searchPage += 1;
    console.log('status= ' + this.status);
    console.log('this.nowPageSelfSchool/LAODSELF= ' + this.nowPageSelfSchool);
    this.getSearchSelfSchool();
  }

  gotoPersonDetail(e: any, activity: any) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: activity.publishUserId } });
  }

  personInformation() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    this.router.navigate(['/user/personInformation']);
  }

  personActivity() {
    /*this.store.dispatch({
     type: 'SAVE_PREV_ROUTER',
     payload: {
     url: '/activity'
     }
     });*/
    this.router.navigate(['/user/personActivity'], { queryParams: { title: '我的活动' } });
  }

  personMessageActivity() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    this.router.navigate(['/user/personMessageActivity'], { queryParams: { title: '我的消息' } });
  }

  logout() {
    this.cookieService.removeAll();
    this.store.dispatch({
      type: 'DELETE_USER',
      payload: {
        isLogin: false,
        user: {}
      }
    });
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
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

  register() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    this.router.navigate(['/user/register']);
  }

  getNotification(id) {
    this.notification = Observable.combineLatest(
      this.activityService.getUnReadActivitySupportByUserIDAndActivityType(id, this.ActivityType),
      this.activityService.getUnReadActivityCommentByUserIDAndActivityType(id, this.ActivityType),
      this.activityService.getUnReadActivityJoinSponsorByUserIDAndActivityType(id, this.ActivityType),
      this.activityService.getUnReadActivityJoinParticipantByUserIDAndActivityType(id, this.ActivityType),
    );
    setInterval(() => {
      this.notification.subscribe(data => {
        this.notificationLength = data[0] + data[1] + data[2] + data[3];
      });
    }, 2000);
  }

  feedback() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/activity'
      }
    });
    this.router.navigate(['/user/feedback']);
  }
  home() { }
  ngOnDestroy(): void {
    // this.notification.unSubscribe();
  }
}
