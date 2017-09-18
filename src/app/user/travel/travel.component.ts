/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { Common } from '../../shared/Common';
import { Location } from '@angular/common';

@Component({
    selector: 'app-travel',
    templateUrl: './travel.component.html',
})

export class TravelComponent implements OnInit {
    user;
    articleType = Common.ArticleType.gonglue;
    articleList;
    activityList;
    constructor(private location: Location,
        private store: Store<any>, private router: Router, private route: ActivatedRoute, private userService: UserService) {
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
        this.router.navigate(['/travel/gonglueDetail'], { queryParams: { id: id } });
    }

}

