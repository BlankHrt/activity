/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { ActivityService } from './activity.service';

@Component({
    selector: 'app-activity-comment',
    templateUrl: './activityComment.component.html',
})

export class ActivityCommentComponent implements OnInit {
    commentList;
    constructor(private store: Store<any>, private location: Location,
        private router: Router, private activityService: ActivityService,
        private route: ActivatedRoute) { }


    ngOnInit() {
        this.route.queryParams.subscribe((data: any) => {
            this.commentList = JSON.parse(data.comment);
        });
    }

    back() {
        this.location.back();
    }

    home() {
        this.router.navigate(['/activity']);
    }
}
