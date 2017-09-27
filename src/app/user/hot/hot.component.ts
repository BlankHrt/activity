/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { Common } from '../../shared/Common';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'app-hot',
    templateUrl: './hot.component.html',
})

export class HotComponent implements OnInit {
    user;
    articleType = Common.ArticleType.xiaoyuan;
    articleList;
    activityList;
    constructor(private location: Location,
        public meta: Meta, public title: Title,
        private store: Store<any>, private router: Router, private route: ActivatedRoute, private userService: UserService) {
        this.title.setTitle('话题列表');
        this.meta.addTags([
            { name: 'keywords', content: '用户话题列表' },
            { name: 'description', content: '用户话题列表' }
        ]);
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params: any) => {
            if (params.id) {
                this.userService.getArticleByUserAndArticleType(params.id, this.articleType).subscribe(articleList => {
                    this.articleList = articleList;
                });
            } else {
                this.router.navigate(['/404']);
            }
        });
    }

    back() {
        this.location.back();
    }

    gotoArticleDetail(id) {
        this.router.navigate(['/hot/detail'], { queryParams: { id: id } });
    }

}

