import { Component, OnInit, OnDestroy, Renderer2, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Common } from '../shared/Common';
import { ActivityService } from './activity.service';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { CookieService } from '../shared/lib/ngx-cookie/cookie.service';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit, OnDestroy {

  ACCESS_TOKEN;
  shaObj;
  signature;
  url = Common.Url;
  newUrl;
  str;
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
  galleryOptions = [
    {
      'thumbnails': false, 'preview': false, previewCloseOnClick: true, previewSwipe: true
      , arrowPrevIcon: false, arrowNextIcon: false, imageArrows: false, 'imageSwipe': true
    },
    { 'breakpoint': 500, 'width': '100%', 'height': '250px' }
  ];

  status = 0;
  searchStatus = 0;
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  storeSubscribe: Subscription;
  intervalSubscribe;

  constructor(public meta: Meta, public title: Title,
    public snackBar: MatSnackBar, private renderer: Renderer2, private cookieService: CookieService,
    private store: Store<any>, private activityService: ActivityService, private router: Router, private route: ActivatedRoute) {
    title.setTitle('大学生活动');
    meta.addTags([
      { name: 'keywords', content: '大学生,大学生活动,大学生活动中心,动动七号' },
      { name: 'description', content: '大学生活动中心' }
    ]);
  }

  changeStatus() {
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

    this.storeSubscribe = this.store.select('user').subscribe((data: any) => {
      this.user = data;
      if (this.user.isLogin) {
        this.schoolId = data.user.schoolId;
      }
      this.getAllSchool();
      if (this.user && this.user.user.id) {
        this.getNotification(this.user.user.id);
      }
    });
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
                medium: imageList[j].url,
                big: imageList[j].url,
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
      }, error => this.errorHandle(error));
  }

  gotoActivityDetail(activity: any) {
    this.router.navigate(['../activityDetail'], { relativeTo: this.route, queryParams: { id: activity.id } });
  }

  support(e: any, activity: any) {
    e.stopPropagation();
    if (this.user.isLogin) {
      activity.countSupportNumber++;
      activity.activityUserSupport = true;
      this.activityService.support(activity.id, this.user.user.id).subscribe(() => {
      }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  unSupport(e: any, activity: any) {
    e.stopPropagation();
    if (this.user.isLogin) {
      activity.countSupportNumber--;
      activity.activityUserSupport = false;
      this.activityService.unSupport(activity.id, this.user.user.id).subscribe(() => {
      }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  gotoAddDetail() {
    if (this.user.isLogin) {
      this.router.navigate(['../activityAdd'], { relativeTo: this.route, queryParams: { id: this.ActivityType } });
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  getSelfSchool() {
    if (this.user.isLogin) {
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
                  medium: imageList[j].url,
                  big: imageList[j].url,
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
        }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      } else {
        this.status = 0;
      }
    }
  }

  getSearchSelfSchool() {
    if (this.user.isLogin) {
      this.activityService.getSearchSelfSchoolActivityByPage(this.searchWord, this.searchPage,
        this.ActivityType, this.user.isLogin, this.user.user.id, this.schoolId).subscribe(activityList => {
          if (this.searchPage > 1 && (activityList.length === 0)) {
            this.bottomStatus = 1;
          }
          for (let i = 0; i < activityList.length; i++) {
            this.activityService.getActivityImageByActivityId(activityList[i].id).subscribe(imageList => {
              const list = [];
              for (let j = 0; j < imageList.length; j++) {
                list.push({
                  medium: imageList[j].url,
                  big: imageList[j].url,
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
        }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  getAllSchool() {
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
                medium: imageList[j].url,
                big: imageList[j].url,
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
        } else {
          this.activityList = this.activityList.concat(activityList);
        }
      }, error => this.errorHandle(error));
  }

  join(e: any, activity: any) {
    e.stopPropagation();
    if (this.user.isLogin) {
      if (!activity.activityJoin) {
        const result = prompt('请填写您的联系方式(必填)', '');
        if (result) {
          this.activityService.joinInsert(activity.id, this.user.user.id, result).subscribe(data => {
            activity.activityJoin = {
              isSuccess: 1
            };
          }, error => this.errorHandle(error));
        }
      }
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  gotoAttendanceList(e: any, activity: any) {
    e.stopPropagation();
    this.router.navigate(['../activityList'], { relativeTo: this.route, queryParams: { id: activity.id } });
  }

  loadMoreALL() {
    this.nowPage += 1;
    this.getAllSchool();
  }

  loadMoreALLSearch() {
    this.searchPage += 1;
    this.getSearch();
  }

  loadMoreSelf() {
    this.nowPageSelfSchool += 1;
    this.getSelfSchool();
  }

  loadMoreSelfSearch() {
    this.searchPage += 1;
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
    if (this.intervalSubscribe) {
      this.intervalSubscribe.unsubscribe();
    }
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
    this.activityService.logout().subscribe();
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
    const notification = Observable.combineLatest(
      this.activityService.getUnReadActivitySupportByUserIDAndActivityType(id, this.ActivityType),
      this.activityService.getUnReadActivityCommentByUserIDAndActivityType(id, this.ActivityType),
      this.activityService.getUnReadActivityJoinSponsorByUserIDAndActivityType(id, this.ActivityType),
      this.activityService.getUnReadActivityJoinParticipantByUserIDAndActivityType(id, this.ActivityType),
    );
    this.intervalSubscribe = Observable.interval(2000).subscribe(() => {
      notification.subscribe(data => {
        this.notificationLength = data[0] + data[1] + data[2] + data[3];
      });
    });
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

  ngOnDestroy(): void {
    if (this.intervalSubscribe) {
      this.intervalSubscribe.unsubscribe();
    }
    this.storeSubscribe.unsubscribe();
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
