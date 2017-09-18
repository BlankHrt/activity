/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit, ElementRef, Inject, Renderer, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Common } from '../shared/Common';
import { HotService } from './hot.service';

@Component({
    selector: 'app-hot-add',
    templateUrl: './hot-add.component.html',
})

export class HotAddComponent implements OnInit, OnDestroy {
    user;
    schoolId;
    HttpUrl = Common.HttpUrl;
    ArticleUrl = Common.ArticleUpload;
    ArticleUpload = Common.ArticleUpload;
    articleType;
    form: FormGroup;
    title: FormControl;
    content: FormControl;
    label: String = '';
    labelList: Array<any> = [];
    elementRef: ElementRef;

    imageList = [];
    showSpinner = false;
    @ViewChild('commitButton') commitButton: ElementRef;
    constructor( @Inject(ElementRef) elementRef: ElementRef,
        private renderer: Renderer, private store: Store<any>, private formBuilder: FormBuilder,
        private router: Router, private hotService: HotService,
        private route: ActivatedRoute) {
        this.elementRef = elementRef;

    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.id) {
                this.articleType = params.id;
            } else {
                this.router.navigate(['/404']);
            }
        });
        this.store.select('user').subscribe(data => {
            this.user = data;
            if (this.user && this.user.user.id) {
                this.hotService.select(this.user.user.id).subscribe(data => {
                    this.schoolId = data.schoolId;
                });
            }
        });
        this.title = new FormControl('', [Validators.required, Validators.maxLength(30)]);
        this.content = new FormControl('', [Validators.maxLength(50)]);

        this.form = this.formBuilder.group({
            title: this.title,
            content: this.content,
        });
    }
    lableChange(e) {
        this.labelList = e.split(' ').filter(a => !!a);
    }
    commit() {
        this.showSpinner = true;
        this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
        if (this.user.user.id) {
            for (let i = 0; i < this.imageList.length; i++) {
                this.imageList[i] = '\"' + this.imageList[i] + '\"';
            }
            this.hotService.insert(this.form.value, this.user.user.id, this.articleType,
                this.schoolId, [this.imageList]).subscribe(data => {
                    this.router.navigate(['../list'], { relativeTo: this.route });
                });
        } else {
            alert('登陆超时，请重新登录');
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
        console.log(this.imageList);
    }

    imageUploaded(e) {
        this.imageList.push(
            e.serverResponse.text()
        );
        console.log(this.imageList);
    }

    ngOnDestroy() {
    }
}
