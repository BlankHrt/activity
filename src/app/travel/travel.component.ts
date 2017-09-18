import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TravelService } from './travel.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Common } from '../shared/Common';
import { CookieService } from '../shared/lib/ngx-cookie/cookie.service';

/**
 * Created by asus on 2017/8/15.
 */

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
})

export class TravelComponent implements OnInit {
  articleType = Common.ArticleType.gonglue;
  user = {
    isLogin: null,
    user: {
      id: null
    }
  };
  index;
  notificationLength = 0;
  constructor(private cookieService: CookieService, private store: Store<any>,
    private travelService: TravelService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.store.select('user').subscribe((data: any) => {
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
    setInterval(() => {
      notification.subscribe(data => {
        this.notificationLength = data[0] + data[1];
      });
    }, 2000);
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
}
