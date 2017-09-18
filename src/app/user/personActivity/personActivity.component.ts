/**
 * Created by asus on 2017/9/4.
 */

import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { Common } from '../../shared/Common';
import { Location } from '@angular/common';
import { MdSnackBar } from '@angular/material';
@Component({
  selector: 'app-person-activity',
  templateUrl: './personActivity.component.html',
})

export class PersonActivityComponent implements OnInit {

  user;
  activityType;
  pulishActivityList;
  joinActivityList;
  index = 0;
  constructor(private store: Store<any>, private router: Router, private location: Location,
    public snackBar: MdSnackBar, private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.activityType = Common.ActivityType.xiaoyuan;
    this.store.select('activity_tab').subscribe((data: any) => {
      this.index = data.index;
    });
    this.store.select('user').subscribe((data: any) => {
      this.user = data.user;
    });
    if (this.user.id) {
      this.userService.getActivityByUser(this.activityType, this.user.id).subscribe(pulishActivityList => {
        this.pulishActivityList = pulishActivityList;

      });
      this.userService.getActivityByUserJoin(this.activityType, this.user.id).subscribe(joinActivityList => {
        this.joinActivityList = joinActivityList;
      });
    } else {
      this.router.navigate(['/user/login']);
    }
  }

  back() {
    this.location.back();
  }

  deletePulish(e, publish) {
    e.stopPropagation();
    if (confirm('确认?')) {
      this.userService.deleteActivitybyId(publish.id).subscribe(() => {
        this.userService.getActivityByUser(this.activityType, this.user.id).subscribe(pulishActivityList => {
          this.pulishActivityList = pulishActivityList;
        });
        this.snackBar.open('删除成功');
        setTimeout(() => {
          this.snackBar.dismiss();
        }, 1500);
      });
    }
  }


  gotoActivityDetail(id) {
    this.router.navigate(['/activity/activityDetail'], { queryParams: { id: id } });
  }

  selectChange() {
    this.store.dispatch({
      type: 'SAVE_ACTIVITY_TAB',
      payload: {
        index: this.index
      }
    });
  }

}
