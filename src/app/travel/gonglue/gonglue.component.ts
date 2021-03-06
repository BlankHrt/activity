/**
 * Created by asus on 2017/8/15.
 */
import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TravelService } from '../travel.service';
import { Common } from '../../shared/Common';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { CookieService } from '../../shared/lib/ngx-cookie/cookie.service';
import { Subscription } from 'rxjs/Subscription';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-travel-gonglue',
  templateUrl: './gonglue.component.html',
})

export class TravelGonglueComponent implements OnInit, OnDestroy {
  @ViewChildren('view', { read: ElementRef }) viewList: QueryList<any>;
  user: any = { id: 0 };
  ArticleType = Common.ArticleType.gonglue;
  travelGonglueList = [];
  searchWord = '';
  nowPage = 1;
  searchStatus = 0;
  bottomStatus = 0;
  galleryOptions = [
    {
      'thumbnails': false, 'preview': false, previewCloseOnClick: true, previewSwipe: true
      , arrowPrevIcon: false, arrowNextIcon: false, imageArrows: false, 'imageSwipe': true
    },
    { 'breakpoint': 500, 'width': '100%', 'height': '300px' }
  ];
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  storeSubscribe: Subscription;
  constructor(private render: Renderer2, private cookieService: CookieService, public snackBar: MatSnackBar,
    public meta: Meta, public title: Title,
    private store: Store<any>, private travelService: TravelService, private router: Router, private route: ActivatedRoute) {
    title.setTitle('大学生旅游');
    meta.addTags([
      { name: 'keywords', content: '大学生,大学生旅游,大学生旅游攻略,动动七号' },
      { name: 'description', content: '大学生旅游攻略中心' }
    ]);
  }

  ngOnInit() {
    this.storeSubscribe = this.store.select('user').subscribe(data => {
      this.user = data;
      this.getGonglue();
    });
  }

  getGonglue() {
    this.travelService.getArticleByPage(this.nowPage, this.ArticleType, this.user.isLogin, this.user.user.id).subscribe(travelList => {
      if (this.nowPage > 1 && (travelList.length === 0)) {
        this.bottomStatus = 1;
      }
      for (let i = 0; i < travelList.length; i++) {
        this.travelService.getArticleImageByArticleId(travelList[i].id).subscribe(imageList => {
          const list = [];
          for (let j = 0; j < imageList.length; j++) {
            list.push({
              medium: imageList[j].url,
              big: imageList[j].url,
            });
          }
          travelList[i].imageList = list;
          this.viewList.forEach(view => {
            this.render.listen(view.nativeElement, 'click', (event) => {
              event.stopPropagation();
            });
          });
        });
      }
      if (this.nowPage === 1) {
        this.travelGonglueList = travelList;
      } else {
        this.travelGonglueList = this.travelGonglueList.concat(travelList);
      }
    }, error => this.errorHandle(error));
  }

  getSearchGonglue() {
    this.travelService.getArticleByPageAndTitleAndType(this.searchWord, this.nowPage,
      this.ArticleType, this.user.isLogin, this.user.user.id).subscribe(searchTravelList => {

        if (this.nowPage > 1 && (searchTravelList.length === 0)) {
          this.bottomStatus = 1;
        }
        for (let i = 0; i < searchTravelList.length; i++) {
          this.travelService.getArticleImageByArticleId(searchTravelList[i].id).subscribe(imageList => {
            const list = [];
            for (let j = 0; j < imageList.length; j++) {
              list.push({
                medium: imageList[j].url,
                big: imageList[j].url,
              });
            }
            searchTravelList[i].imageList = list;
            this.viewList.forEach(view => {
              this.render.listen(view.nativeElement, 'click', (event) => {
                event.stopPropagation();
              });
            });
          });
        }
        if (this.nowPage === 1) {
          this.travelGonglueList = searchTravelList;
        } else {
          this.travelGonglueList = this.travelGonglueList.concat(searchTravelList);
        }
      }, error => this.errorHandle(error));
  }

  refresh() {
    this.searchStatus = 0;
    this.searchWord = '';
    this.nowPage = 1;
    this.bottomStatus = 0;
    this.getGonglue();
  }

  search() {

    this.bottomStatus = 0;

    if (this.searchWord.trim()) {
      this.nowPage = 1;
      this.searchStatus = 1;
      this.getSearchGonglue();
    } else {
      this.searchStatus = 0;
      this.nowPage = 1;
      this.getGonglue();
    }
  }

  gotoGonglueDetail(travelGonglue) {
    this.router.navigate(['../gonglueDetail'], { relativeTo: this.route, queryParams: { id: travelGonglue.id } });
  }

  support(e, travelGonglue) {
    e.stopPropagation();
    if (this.user.isLogin) {
      travelGonglue.countSupportNumber++;
      travelGonglue.articleUserSupport = true;
      this.travelService.support(travelGonglue.id, this.user.user.id).subscribe(() => { }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  unSupport(e, travelGonglue) {
    e.stopPropagation();
    if (this.user.isLogin) {
      travelGonglue.countSupportNumber--;
      travelGonglue.articleUserSupport = false;
      this.travelService.unSupport(travelGonglue.id, this.user.user.id).subscribe(() => { }, error => this.errorHandle(error));
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
  }

  gotoAddDetail() {
    if (this.user.isLogin) {
      this.router.navigate(['../gonglueAdd'], { relativeTo: this.route, queryParams: { id: this.ArticleType } });
    } else {
      if (confirm('您尚未登录,是否跳转登录页面?')) {
        this.login();
      }
    }
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
    this.travelService.logout().subscribe();
  }

  gotoPersonDetail(e, gongnue) {
    this.store.dispatch({
      type: 'SAVE_PREV_ROUTER',
      payload: {
        url: '/travel'
      }
    });
    e.stopPropagation();
    this.router.navigate(['/user/personDetail'], { queryParams: { id: gongnue.publishUserId } });
  }

  loadMoreALL() {
    this.nowPage += 1;
    this.getGonglue();
  }

  loadMoreSearch() {
    this.nowPage += 1;
    this.getSearchGonglue();
  }
  ngOnDestroy(): void {
    this.storeSubscribe.unsubscribe();
  }
  errorHandle(error) {
    if (error.status === 401) {
      this.snackBar.open('认证失败，请登录先');
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
