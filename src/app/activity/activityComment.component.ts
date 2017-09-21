/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { ActivityService } from './activity.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-activity-comment',
    templateUrl: './activityComment.component.html',
})

export class ActivityCommentComponent implements OnInit, OnDestroy {
    commentList;
    // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
    // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
    routerSubscribe: Subscription;
    constructor(private store: Store<any>, private location: Location,
        private router: Router, private activityService: ActivityService,
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
        this.router.navigate(['/activity']);
    }

    gotoPersonDetail(e, hot) {
        e.stopPropagation();
        this.router.navigate(['/user/personDetail'], { queryParams: { id: hot.userId } });
    }
    ngOnDestroy(): void {
        this.routerSubscribe.unsubscribe();
    }
}
