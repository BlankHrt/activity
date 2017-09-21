/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { Common } from '../../shared/Common';
import {MdSnackBar} from '@angular/material';

@Component({
  selector: 'app-person-message',
  templateUrl: './personMessage.component.html',
})

export class PersonMessageComponent implements OnInit {
  user;
  articleSupportList;
  articleCommentList;
  activitySupportList;
  activityCommentList;
  articleType;
  commentList = [];
  supportList = [];
  index = 0;

  constructor(
    private store: Store<any>, private router: Router, public snackBar: MdSnackBar,
    private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
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

    this.store.select('hot_tab').subscribe((data: any) => {
      this.index = data.index;
    });

    this.store.select('user').subscribe((data: any) => {
      this.user = data.user;
      if (this.user.id && this.articleType === Common.ArticleType.xiaoyuan) {
        this.userService.getArticleSupportByUserIdAndArticleType(this.user.id, this.articleType).subscribe(supportList => {
          this.supportList = supportList;
        });
        this.userService.getArticleCommentByUserIdAndArticleType(this.user.id, this.articleType).subscribe(commentList => {
          this.commentList = commentList;
        });
      } else if (this.user.id && this.articleType === Common.ArticleType.gonglue) {
        this.userService.getArticleSupportByUserIdAndArticleType(this.user.id, this.articleType).subscribe(supportList => {
          this.supportList = supportList;
        });
        this.userService.getArticleCommentByUserIdAndArticleType(this.user.id, this.articleType).subscribe(commentList => {
          this.commentList = commentList;
        });
      } else {
        this.router.navigate(['/user/login']);
      }
    });
  }
  gotoCommentDetail(comment) {
    if (this.user.id && this.articleType === Common.ArticleType.xiaoyuan) {
      this.userService.readArticleComment(comment.id).subscribe(() => { }, error => this.errorHandle(error));
      this.router.navigate(['/hot/detail'], { queryParams: { id: comment.article.id } });
    } else if (this.user.id && this.articleType === Common.ArticleType.gonglue) {
      this.userService.readArticleComment(comment.id).subscribe(() => { }, error => this.errorHandle(error));
      this.router.navigate(['/travel/gonglueDetail'], { queryParams: { id: comment.article.id } });
    }
  }
  gotoSupportDetail(support) {
    if (this.user.id && this.articleType === Common.ArticleType.xiaoyuan) {
      this.userService.readArticleSupport(support.id).subscribe(() => { }, error => this.errorHandle(error));
      this.router.navigate(['/hot/detail'], { queryParams: { id: support.article.id } });
    } else if (this.user.id && this.articleType === Common.ArticleType.gonglue) {
      this.userService.readArticleSupport(support.id).subscribe(() => { }, error => this.errorHandle(error));
      this.router.navigate(['/travel/gonglueDetail'], { queryParams: { id: support.article.id } });
    }
  }
  back() {
    if (this.articleType === Common.ArticleType.xiaoyuan) {
      this.router.navigate(['/hot']);
    } else if (this.articleType === Common.ArticleType.gonglue) {
      this.router.navigate(['/travel']);
    }
  }
  selectChange() {
    this.store.dispatch({
      type: 'SAVE_HOT_TAB',
      payload: {
        index: this.index
      }
    });
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

