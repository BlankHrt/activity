/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Common } from '../shared/Common';
import { HotService } from './hot.service';
import { Subscription } from 'rxjs/Subscription';

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

    // form
    article = {
        title: null,
        content: null
    };

    elementRef: ElementRef;

    imageList = [];
    showSpinner = false;

    // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
    // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
    storeSubscribe: Subscription;
    routerSubscribe: Subscription;

    @ViewChild('commitButton') commitButton: ElementRef;

    constructor( @Inject(ElementRef) elementRef: ElementRef,
        private renderer: Renderer, private store: Store<any>, private formBuilder: FormBuilder,
        private router: Router, private hotService: HotService,
        private route: ActivatedRoute) {
        this.elementRef = elementRef;
    }

    ngOnInit() {
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
                this.hotService.select(this.user.user.id).subscribe(school => {
                    this.schoolId = school.schoolId;
                });
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
                    });
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
}
