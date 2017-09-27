/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HotService } from './hot.service';
import { Common } from '../shared/Common';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-hot-more',
    templateUrl: './hot-more.component.html',
})
export class HotMoreComponent implements OnInit {
    articleType = Common.ArticleType.xiaoyuan;
    articleList: Array<any> = [];
    constructor(private location: Location,
        public meta: Meta, public title: Title,
        private hotService: HotService, private router: Router
    ) {
        this.title.setTitle('话题榜');
        this.meta.addTags([
            { name: 'keywords', content: '大学生话题，大学生话题榜,大学生有趣话题' },
            { name: 'description', content: '大学生话题排行榜' }
        ]);
    }


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
