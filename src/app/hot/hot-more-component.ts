/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HotService } from './hot.service';
import { Common } from '../shared/Common';
import { Router } from '@angular/router';
@Component({
    selector: 'app-hot-more',
    templateUrl: './hot-more.component.html',
})

export class HotMoreComponent implements OnInit {
    articleType = Common.ArticleType.xiaoyuan;
    articleList: Array<any> = [];
    constructor(private location: Location,
        private hotService: HotService, private router: Router
    ) { }


    ngOnInit() {
        this.hotService.getHotByPageAndLimitNumber(this.articleType, 50).subscribe(data => {
            this.articleList = data;
        });
    }

    gotoHotDetail(hot) {
        this.router.navigate(['/hot/detail'], { queryParams: { id: hot.id } });
    }
    back() {
        this.location.back();
    }
}
