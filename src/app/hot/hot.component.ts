import { Component, OnInit, ElementRef, Renderer, ViewChildren, QueryList, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { HotService } from './hot.service';
import { Common } from '../shared/Common';
import { MdDialog } from '@angular/material';
import { HotDialogComponent } from './hot.dialog';
import { CookieService } from '../shared/lib/ngx-cookie/cookie.service';

@Component({
    selector: 'app-hot',
    templateUrl: './hot.component.html',
})

export class HotComponent implements OnInit {

    @ViewChildren('view', { read: ElementRef }) viewList: QueryList<any>;

    articleType = Common.ArticleType.xiaoyuan;
    user = {
        isLogin: null,
        user: {
            id: null,
            headUrl: null,
            name: null
        }
    };
    searchWord = '';
    searchStatus = 0;
    nowPage = 1;
    bottomStatus = 0;
    todayHotList = [];
    hotList = [];
    notificationLength = 0;
    galleryOptions = [
        { 'thumbnails': false, 'preview': true, 'imageSwipe': true },
        { 'breakpoint': 500, 'width': '100%', 'height': '300px' }
    ];
    constructor(private renderer: Renderer, public dialog: MdDialog, private cookieService: CookieService, private store: Store<any>,
        private hotService: HotService, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.store.select('user').subscribe((data: any) => {
            this.user = data;
            this.getHot();
            if (this.user && this.user.user.id) {
                this.getNotification(this.user.user.id);
            }
        });
        this.hotService.getHotByPageAndLimitNumber(this.articleType, 10).subscribe(data => {
            this.todayHotList = data;
        });
    }

    getHot() {
        this.hotService.getHotByPage(this.nowPage, this.articleType, this.user.isLogin, this.user.user.id).subscribe(hotList => {

            if (this.nowPage > 1 && (hotList.length === 0)) {
                this.bottomStatus = 1;
            }

            for (let i = 0; i < hotList.length; i++) {
                this.hotService.getArticleImageByArticleId(hotList[i].id).subscribe(imageList => {
                    const list = [];
                    for (let j = 0; j < imageList.length; j++) {
                        list.push({
                            medium: '\'' + imageList[j].url + '\'',
                            // big: '\'' + imageList[j].url + '\'',
                        });
                    }
                    hotList[i].imageList = list;
                    this.viewList.forEach(view => {
                        this.renderer.listen(view.nativeElement, 'click', (event) => {
                            event.stopPropagation();
                        });
                    });
                });
            }
            if (this.nowPage === 1) {
                this.hotList = hotList;
            } else {
                this.hotList = this.hotList.concat(hotList);
            }
        });
    }

    search() {

        this.bottomStatus = 0;
        if (this.searchWord.trim()) {
            this.nowPage = 1;
            this.searchStatus = 1;
            this.getSearchHot();
        } else {
            this.searchStatus = 0;
            this.nowPage = 1;
            this.getHot();
        }
    }

    getSearchHot() {
        this.hotService.getArticleByPageAndTitleAndType(this.searchWord, this.nowPage,
            this.articleType, this.user.isLogin, this.user.user.id).subscribe(searchHotList => {

                if (this.nowPage > 1 && (searchHotList.length === 0)) {
                    this.bottomStatus = 1;
                }
                for (let i = 0; i < searchHotList.length; i++) {
                    this.hotService.getArticleImageByArticleId(searchHotList[i].id).subscribe(imageList => {
                        const list = [];
                        for (let j = 0; j < imageList.length; j++) {
                            list.push({
                                medium: '\'' + imageList[j].url + '\'',
                                // big: '\'' + imageList[j].url + '\'',
                            });
                        }
                        searchHotList[i].imageList = list;
                        this.viewList.forEach(view => {
                            this.renderer.listen(view.nativeElement, 'click', (event) => {
                                event.stopPropagation();
                            });
                        });
                    });
                }
                if (this.nowPage === 1) {
                    this.hotList = searchHotList;
                } else {
                    this.hotList = this.hotList.concat(searchHotList);
                }
            });
    }

    gotoDetail(hot) {
        this.router.navigate(['/hot/detail'], { queryParams: { id: hot.id } });
    }

    unSupport(e, hot) {
        e.stopPropagation();
        if (this.user.isLogin) {
            hot.countSupportNumber--;
            hot.articleUserSupport = false;
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

    support(e, hot) {
        e.stopPropagation();
        if (this.user.isLogin) {
            hot.countSupportNumber++;
            hot.articleUserSupport = true;
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

    gotoPersonDetail(e, hot) {
        e.stopPropagation();
        this.router.navigate(['/user/personDetail'], { queryParams: { id: hot.publishUserId } });
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
                url: '/hot'
            }
        });
    }

    gotoAddDetail() {
        if (this.user.isLogin) {
            this.router.navigate(['/hot/add'], { queryParams: { id: this.articleType } });
        } else {
            const dialogRef = this.dialog.open(HotDialogComponent);
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.login();
                }
            });
        }
    }

    register() {
        this.store.dispatch({
            type: 'SAVE_PREV_ROUTER',
            payload: {
                url: '/hot'
            }
        });
        this.router.navigate(['/user/register']);
    }

    personInformation() {
        this.store.dispatch({
            type: 'SAVE_PREV_ROUTER',
            payload: {
                url: '/hot'
            }
        });
        this.router.navigate(['/user/personInformation']);
    }

    personDongDong() {
        this.store.dispatch({
            type: 'SAVE_PREV_ROUTER',
            payload: {
                url: '/hot'
            }
        });
        this.router.navigate(['/user/personDongDong'], { queryParams: { title: '我的驿站' } });
    }

    personMessage() {
        this.store.dispatch({
            type: 'SAVE_PREV_ROUTER',
            payload: {
                url: '/hot'
            }
        });
        this.router.navigate(['/user/personMessage'], { queryParams: { title: '我的驿站' } });
    }

    loadMoreALL() {
        this.nowPage += 1;
        this.getHot();
    }

    loadMoreSearch() {
        this.nowPage += 1;
        this.getSearchHot();
    }

    refresh() {
        this.nowPage = 1;
        this.searchStatus = 0;
        this.searchWord = '';
        this.bottomStatus = 0;
        this.getHot();
        this.hotService.getHotByPageAndLimitNumber(this.articleType, 10).subscribe(data => {
            this.todayHotList = data;
        });
    }
    getNotification(id) {
        const notification = Observable.combineLatest(
            this.hotService.getUnReadArticleSupportByUserIDAndArticleType(id, this.articleType),
            this.hotService.getUnReadArticleCommentByUserIDAndArticleType(id, this.articleType)
        );
        setInterval(() => {
            notification.subscribe(data => {
                this.notificationLength = data[0] + data[1];
            });
        }, 2000);
    }

    getMoreHot() {
        this.router.navigate(['/hot/more']);
    }

    feedback() {
        this.store.dispatch({
            type: 'SAVE_PREV_ROUTER',
            payload: {
                url: '/hot'
            }
        });
        this.router.navigate(['/user/feedback']);
    }
}
