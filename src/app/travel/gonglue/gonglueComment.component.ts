/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { TravelService } from '../travel.service';

@Component({
    selector: 'app-gonglue-comment',
    templateUrl: './gonglueComment.component.html',
})

export class GonglueCommentComponent implements OnInit {
    commentList;
    constructor(private store: Store<any>, private location: Location,
        private router: Router, private travelService: TravelService,
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
        this.router.navigate(['/travel']);
    }
}
