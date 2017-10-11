/**
 * Created by asus on 2017/8/15.
 */
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from './activity.service';
import { MdSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Common } from '../shared/Common';
declare var $;
import { Meta, Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import * as jsSHA from '../shared/lib/wx/sha.js';
declare var wx;

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activityDetail.component.html',
})
export class ActivityDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  ACCESS_TOKEN;
  shaObj;
  signature;
  url = Common.Url;
  newUrl;
  str;
  showSpinner = false;
  showChildSpinner = false;
  imageList = [{ medium: '#' }];
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
    address: null,
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
    {
      'thumbnails': false, 'preview': false, previewCloseOnClick: true, previewSwipe: true
      , imageArrows: false, 'imageSwipe': true
    },
    { 'breakpoint': 500, 'width': '100%', 'height': '400px' }
  ];
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  routerSubscribe: Subscription;
  storeSubscribe: Subscription;

  @ViewChild('commitButton') commitButton: ElementRef;
  @ViewChild('commitChildButton') commitChildButton: ElementRef;

  constructor(private store: Store<any>, private renderer: Renderer, public snackBar: MdSnackBar,
    public meta: Meta, public title: Title,
    private location: Location, private activityService: ActivityService, private router: Router, private route: ActivatedRoute) {
    this.title.setTitle('活动详情');
  }

  ngOnInit() {
    alert(location.href.split('#')[0])
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
              medium: imageList[j].url,
              big: imageList[j].url,
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
        // wx
        this.store.select('wx').subscribe(data => {
          if (data.JsapiTicket) {
            this.newUrl = this.url + '/activity/activityDetail?id=' + params.id;
            console.log("this.newUrl")
            console.log(this.newUrl)
            this.activityService.signature(data.JsapiTicket, data.nonceStr, data.timestamp, this.newUrl).subscribe( data2 => {
              wx.config({
                debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: 'wx3b6fe19df1feedfa', // 必填，公众号的唯一标识
                timestamp: data2.timestamp, // 必填，生成签名的时间戳
                nonceStr: data2.nonceStr, // 必填，生成签名的随机串
                signature: data2.signature, // 必填，签名，见附录1
                jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
              });
            })
          }
        });
        // wx
      } else {
        this.router.navigate(['/404']);
      }
    });
    wx.onMenuShareAppMessage({
      title: this.activity.title, // 分享标题
      desc: $('#summernote')[0].innerText, // 分享描述
      link: this.newUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: this.imageList[0].medium, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareTimeline({
      title: this.activity.title, // 分享标题
      link: this.newUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: this.imageList[0].medium, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareQQ({
      title: this.activity.title, // 分享标题
      desc: $('#summernote')[0].innerText, // 分享描述
      link: this.newUrl, // 分享链接
      imgUrl: this.imageList[0].medium, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareQZone({
      title: this.activity.title, // 分享标题
      desc: $('#summernote')[0].innerText, // 分享描述
      link: this.newUrl, // 分享链接
      imgUrl: this.imageList[0].medium, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        this.snackBar.open('分享成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
  }//ngOnInit

  ngAfterViewInit(): void {
  }

  // 根据登录的用户ID，判断该用户是否已经报名
  getActivityJoinWithUser(activityId: any, joinUserId: any) {
    this.activityService.getActivityJoinWithUser(activityId, joinUserId).subscribe((data: any) => {
      if (data.id) {
        this.aJoin = data;
        this.activityJoinStatus = true;

      }
    }, error => this.errorHandle(error));
  }

  getActivityByIdWithUser(id: any) {
    this.activityService.getActivityByIdWithUser(id).subscribe(data => {
      this.activity = data;
      this.meta.addTags([
        { name: 'keywords', content: this.activity.title },
        { name: 'description', content: this.activity.content }
      ]);
      $('#summernote').html(this.activity.content);
    }, error => this.errorHandle(error));
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
      }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      } else {
        this.showSpinner = false;
        this.comment = '';
      }
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
      this.activityService.childComment(comment.id, this.activity.id, this.user.user.id, this.childComment[index]).subscribe(data => {
        //  this.getAllCommentByArticleId(this.article.id);
        this.childComment = [];
        this.activity.countCommentNumber++;
        this.showChildSpinner = false;
        comment.showChildComment = false;
      }, error => {
        this.showChildSpinner = false;
        this.errorHandle(error);
      });
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      } else {
        this.showChildSpinner = false;
      }
    }
  }

  getAllCommentByActivityId(id: any) {
    this.activityService.getAllCommentByActivityId(id).subscribe(data => {
      this.commentList = data;
    }, error => this.errorHandle(error));
  }

  back() {
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
        const result = prompt('请填写您的联系方式(必填)', '');
        if (result) {
          this.activityService.joinInsert(activity.id, this.user.user.id, result).subscribe(data => {
            this.activityJoinStatus = true;
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

  support(activity: any) {
    if (this.user.isLogin) {
      activity.countSupportNumber++;
      this.isUserSupport = true;
      this.activityService.support(activity.id, this.user.user.id).subscribe(() => { }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  unSupport(activity: any) {
    if (this.user.isLogin) {
      activity.countSupportNumber--;
      this.isUserSupport = false;
      this.activityService.unSupport(activity.id, this.user.user.id).subscribe(() => { }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
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
  childCommentCancel(e, childComment) {
    e.stopPropagation();
    childComment.showChildComment = false;
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
