import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TravelService } from './travel.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Common } from '../shared/Common';
import { CookieService } from '../shared/lib/ngx-cookie/cookie.service';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import {MdSnackBar} from '@angular/material';

/**
 * Created by asus on 2017/8/15.
 */

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
})

export class TravelComponent implements OnInit , OnDestroy {
  articleType = Common.ArticleType.gonglue;
  user = {
    isLogin: null,
    user: {
      id: null
    }
  };
  index;
  notificationLength = 0;

  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  storeSubscribe: Subscription;
  intervalSubscribe;
  constructor(private cookieService: CookieService, private store: Store<any>, public snackBar: MdSnackBar,
    private travelService: TravelService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.storeSubscribe = this.store.select('user').subscribe((data: any) => {
      this.user = data;
      if (this.user && this.user.user.id) {
        this.getNotification(this.user.user.id);
      }
    });
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
        url: '/travel'
      }
    });
    this.travelService.logout().subscribe();
  }

  register() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    this.router.navigate(['/user/register']);
  }

  personInformation() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    this.router.navigate(['/user/personInformation']);
  }

  personDongDong() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    this.router.navigate(['/user/personDongDong'], { queryParams: { title: '我的旅游' } });
  }

  personMessage() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    this.router.navigate(['/user/personMessage'], { queryParams: { title: '我的旅游' } });
  }

  getNotification(id) {
    const notification = Observable.combineLatest(
      this.travelService.getUnReadArticleSupportByUserIDAndArticleType(id, this.articleType),
      this.travelService.getUnReadArticleCommentByUserIDAndArticleType(id, this.articleType)
    );
    this.intervalSubscribe = Observable.interval(2000).subscribe(() => {
      notification.subscribe(data => {
        this.notificationLength = data[0] + data[1];
      });
    });
  }

  feedback() {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
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
