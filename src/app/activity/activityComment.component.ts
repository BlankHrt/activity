/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { ActivityService } from './activity.service';
import { Subscription } from 'rxjs/Subscription';
import { Meta, Title } from '@angular/platform-browser';

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
        public meta: Meta, public title: Title, private router: Router, private activityService: ActivityService,
        private route: ActivatedRoute) {
        this.title.setTitle('更多评论');
        this.meta.addTags([
            { name: 'keywords', content: '大学生活动评论' },
            { name: 'description', content: '大学生活动评论' }
        ]);
    }


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
