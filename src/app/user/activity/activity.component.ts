/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { Location } from '@angular/common';
import { Common } from '../../shared/Common';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
})

export class ActivityComponent implements OnInit {
  user;
  activityType;
  pulishActivityList;
  joinActivityList;
  index = 0;
  constructor(private location: Location,
    private store: Store<any>, private router: Router, private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.activityType = Common.ActivityType.xiaoyuan;
        this.store.select('activity_tab').subscribe((data: any) => {
          this.index = data.index;
        });

        this.userService.getActivityByUser(this.activityType, params.id).subscribe(pulishActivityList => {
          this.pulishActivityList = pulishActivityList;
        });
        this.userService.getActivityByUserJoin(this.activityType, params.id).subscribe(joinActivityList => {
          this.joinActivityList = joinActivityList;
        });
      } else {
        this.router.navigate(['/404']);
      }
    });
  }
  back() {
    this.location.back();
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

