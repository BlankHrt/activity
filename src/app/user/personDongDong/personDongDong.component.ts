/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { Common } from '../../shared/Common';
import { MatSnackBar } from '@angular/material';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-person-dongdong',
  templateUrl: './personDongDong.component.html',
})

export class PersonDongDongComponent implements OnInit {
  user;
  title = '';
  articleType;
  articleList;
  activityList;
  constructor(public snackBar: MatSnackBar,
    public meta: Meta, public pageTitle: Title,
    private store: Store<any>, private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.pageTitle.setTitle('我的驿站');
    this.meta.addTags([
      { name: 'keywords', content: '个人话题,动动七号个人话题' },
      { name: 'description', content: '动动七号个人话题' }
    ]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.title = params.title;
      switch (params.title) {
        case '我的驿站':
          this.articleType = Common.ArticleType.xiaoyuan;
          break;
        case '我的旅游':
          this.articleType = Common.ArticleType.gonglue;
          break;
        default:
          this.router.navigate(['/404']);
      }
    });

    this.store.select('user').subscribe((data: any) => {
      this.user = data.user;
      if (this.user.id && this.articleType === Common.ArticleType.xiaoyuan) {
        this.userService.getArticleByUserAndArticleType(this.user.id, this.articleType).subscribe(articleList => {
          this.articleList = articleList;
        });
      } else if (this.user.id && this.articleType === Common.ArticleType.gonglue) {
        this.userService.getArticleByUserAndArticleType(this.user.id, this.articleType).subscribe(articleList => {
          this.articleList = articleList;
        });
      } else {
        this.router.navigate(['/user/login']);
      }
    });
  }

  back() {
    if (this.articleType === Common.ArticleType.xiaoyuan) {
      this.router.navigate(['/hot']);
    } else if (this.articleType === Common.ArticleType.gonglue) {
      this.router.navigate(['/travel']);
    }
  }

  gotoArticleDetail(id) {
    if (this.articleType === Common.ArticleType.xiaoyuan) {
      this.router.navigate(['/hot/detail'], { queryParams: { id: id } });
    } else if (this.articleType === Common.ArticleType.gonglue) {
      this.router.navigate(['/travel/gonglueDetail'], { queryParams: { id: id } });
    }
  }

  gotoActivityDetail(id) {
    this.router.navigate(['/activity/activityDetail'], { queryParams: { id: id } });
  }

  delete(e, travel) {
    e.stopPropagation();
    if (confirm('确认?')) {
      if (this.articleType === Common.ArticleType.xiaoyuan || this.articleType === Common.ArticleType.gonglue) {
        this.userService.deleteArticlebyId(travel.id).subscribe(() => {
          this.userService.getArticleByUserAndArticleType(this.user.id, this.articleType).subscribe(articleList => {
            this.articleList = articleList;
          }, error => this.errorHandle(error));
          this.snackBar.open('删除成功');
          setTimeout(() => {
            this.snackBar.dismiss();
          }, 1500);
        }, error => this.errorHandle(error));
      }
    }
  }
  errorHandle(error) {
    if (error.status === 401) {
      this.snackBar.open('认证失败，请登录先');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (error.status === 403) {
      this.snackBar.open('对不起，您暂无权限');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    } else if (error.status === 500) {
      this.snackBar.open('操作失败', '请重试');
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 1500);
    }
  }
}

