/**
 * Created by asus on 2017/8/15.
 */
import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TravelService } from '../travel.service';
import { Common } from '../../shared/Common';
import { MdDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { TravelDialogComponent } from '../travel.dialog';
import { CookieService } from '../../shared/lib/ngx-cookie/cookie.service';

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
    { 'thumbnails': false, 'preview': true, 'imageSwipe': true },
    { 'breakpoint': 500, 'width': '100%', 'height': '300px' }
  ];
  constructor(private renderer: Renderer, public dialog: MdDialog, private cookieService: CookieService,
    private store: Store<any>, private travelService: TravelService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.select('user').subscribe(data => {
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
              medium: '\'' + imageList[j].url + '\'',
              // big: '\'' + imageList[j].url + '\'',
            });
          }
          travelList[i].imageList = list;
          this.viewList.forEach(view => {
            this.renderer.listen(view.nativeElement, 'click', (event) => {
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
    });
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
                medium: '\'' + imageList[j].url + '\'',
                // big: '\'' + imageList[j].url + '\'',
              });
            }
            searchTravelList[i].imageList = list;
            this.viewList.forEach(view => {
              this.renderer.listen(view.nativeElement, 'click', (event) => {
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
      });
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

  unSupport(e, travelGonglue) {
    e.stopPropagation();
    if (this.user.isLogin) {
      travelGonglue.countSupportNumber--;
      travelGonglue.articleUserSupport = false;
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

  gotoAddDetail() {
    if (this.user.isLogin) {
      this.router.navigate(['../gonglueAdd'], { relativeTo: this.route, queryParams: { id: this.ArticleType } });
    } else {
      const dialogRef = this.dialog.open(TravelDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.login();
        }
      });
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
    // this.notification.unSubscribe();
  }

}
