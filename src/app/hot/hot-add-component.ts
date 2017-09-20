/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Common } from '../shared/Common';
import { HotService } from './hot.service';
import { Subscription } from 'rxjs/Subscription';
import { MdSnackBar } from '@angular/material';

@Component({
    selector: 'app-hot-add',
    templateUrl: './hot-add.component.html',
})

export class HotAddComponent implements OnInit, OnDestroy {
    user;
    schoolId;
    HttpUrl = Common.HttpUrl;
    ArticleUrl = Common.ArticleUpload;
    articleType;
    en: any;
    date;
    // form
    article = {
        title: null,
        content: null
    };


    imageList = [];
    showSpinner = false;

    // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
    // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
    storeSubscribe: Subscription;
    routerSubscribe: Subscription;

    @ViewChild('commitButton') commitButton: ElementRef;

    constructor(
        private renderer: Renderer, private store: Store<any>,
        private router: Router, private hotService: HotService,
        private route: ActivatedRoute, public snackBar: MdSnackBar) {
    }

    ngOnInit() {
        this.en = {
            firstDayOfWeek: 0,
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
        this.routerSubscribe = this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.articleType = params.id;
            } else {
                this.router.navigate(['/404']);
            }
        });
        this.storeSubscribe = this.store.select('user').subscribe(data => {
            this.user = data;
            if (this.user && this.user.user.id) {
                this.schoolId = this.user.user.schoolId;
            }
        });

    }

    commit() {
        if (this.article.title) {
            this.showSpinner = true;
            this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
            if (this.user.user.id) {
                for (let i = 0; i < this.imageList.length; i++) {
                    this.imageList[i] = '\"' + this.imageList[i] + '\"';
                }
                this.hotService.insert(this.article, this.user.user.id, this.articleType,
                    this.schoolId, this.imageList).subscribe(data => {
                        this.router.navigate(['../list'], { relativeTo: this.route });
                    }, error => this.errorHandle(error));
            } else {
                alert('登陆超时，请重新登录');
            }
        }
    }

    back() {
        this.router.navigate(['/hot']);
    }

    home() {
        this.router.navigate(['/hot']);
    }

    imageRemoved(e) {
        for (let i = 0; i < this.imageList.length; i++) {
            if (this.imageList[i] === e.serverResponse.text()) {
                this.imageList.splice(i, 1);
                break;
            }
        }
    }

    imageUploaded(e) {
        this.imageList.push(
            e.serverResponse.text()
        );
    }

    ngOnDestroy() {
        this.storeSubscribe.unsubscribe();
        this.routerSubscribe.unsubscribe();
    }

    errorHandle(error) {
        if (error.status === 401) {
            this.store.dispatch({ type: 'DELETE_USER', payload: {} });
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
