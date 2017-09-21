/**
 * Created by asus on 2017/9/4.
 */
import { Component, OnInit } from '@angular/core';
import { Common } from '../../shared/Common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';
import {MdSnackBar} from '@angular/material';
@Component({
  selector: 'app-person-message-activity',
  templateUrl: './personMessageActivity.component.html',
})

export class PersonMessageActivityComponent implements OnInit {

  user;
  index = 0;
  activityType;
  commentList = [];
  supportList = [];
  sponsorList = [];
  participantList = [];
  constructor(private store: Store<any>, private router: Router, public snackBar: MdSnackBar,
    private route: ActivatedRoute, private userService: UserService) { }
  ngOnInit() {
    this.activityType = Common.ActivityType.xiaoyuan;
    this.store.select('activity_tab').subscribe((data: any) => {
      this.index = data.index;
    });
    this.store.select('user').subscribe((data: any) => {
      this.user = data.user;
      if (this.user.id) {
        this.userService.getActivitySupportByUserIdAndActivityType(this.activityType, this.user.id).subscribe(supportList => {
          this.supportList = supportList;
        });
        this.userService.getActivityCommentByUserIdAndActivityType(this.activityType, this.user.id).subscribe(commentList => {
          this.commentList = commentList;
        });
        this.userService.getActivitySponsorByUserIdAndActivityType(this.activityType, this.user.id).subscribe(sponsorList => {
          this.sponsorList = sponsorList;
        });
        this.userService.getActivityParticipantByUserIdAndActivityType(this.activityType, this.user.id).subscribe(participantList => {
          this.participantList = participantList;
        });
      } else {
        this.router.navigate(['/user/login']);
      }
    });
  }

  gotoCommentDetail(comment) {
    if (this.user.id) {
      this.userService.readActivityComment(comment.id).subscribe(() => { }, error => this.errorHandle(error));
      this.router.navigate(['/activity/activityDetail'], { queryParams: { id: comment.activity.id } });
    }
  }

  gotoSponsorActivityDetail(activityJoin) {
    if (this.user.id) {
      if (activityJoin.activity.publishUserId === this.user.id) {
        this.userService.readActivityJoin(activityJoin.id).subscribe(() => { }, error => this.errorHandle(error));
        this.router.navigate(['/activity/activityDetail'], { queryParams: { id: activityJoin.activity.id } });
      }
    }
  }
  gotoParticipantActivityDetail(activityJoin) {
    if (this.user.id) {
      if (activityJoin.activity.publishUserId !== this.user.id) {
        this.userService.participantReadActivityJoin(activityJoin.id).subscribe(() => { }, error => this.errorHandle(error));
        this.router.navigate(['/activity/activityDetail'], { queryParams: { id: activityJoin.activity.id } });
      }
    }
  }
  gotoSupportDetail(support) {
    if (this.user.id) {
      this.userService.readActivitySupport(support.id).subscribe(() => { }, error => this.errorHandle(error));
      this.router.navigate(['/activity/activityDetail'], { queryParams: { id: support.activity.id } });
    }
  }

  back() {
    this.router.navigate(['/activity']);
  }

  selectChange() {
    this.store.dispatch({
      type: 'SAVE_ACTIVITY_TAB',
      payload: {
        index: this.index
      }
    });
  }

  errorHandle(error) {
    if (error.status === 401) {
      this.snackBar.open('认证失败，请登陆先');
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
