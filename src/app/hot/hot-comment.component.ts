/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Common } from '../shared/Common';
import { HotService } from './hot.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-hot-comment',
    templateUrl: './hot-comment.component.html',
})

export class HotCommentComponent implements OnInit {
    commentList;
    constructor(private store: Store<any>, private location: Location,
        private router: Router, private hotService: HotService,
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
        this.router.navigate(['/hot']);
    }
}
