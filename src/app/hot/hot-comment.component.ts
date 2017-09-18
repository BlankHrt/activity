/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Common } from '../shared/Common';
import { HotService } from './hot.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-hot-comment',
    templateUrl: './hot-comment.component.html',
})

export class HotCommentComponent implements OnInit, OnDestroy {
    commentList;

    // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
    // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
    routerSubscribe: Subscription;
    constructor(private store: Store<any>, private location: Location,
        private router: Router, private hotService: HotService,
        private route: ActivatedRoute) { }


    ngOnInit() {
        this.routerSubscribe = this.route.queryParams.subscribe((data: any) => {
            this.commentList = JSON.parse(data.comment);
        });
    }

    back() {
        this.location.back();
    }

    home() {
        this.router.navigate(['/hot']);
    }

    ngOnDestroy(): void {
        this.routerSubscribe.unsubscribe();
    }
}
