/**
 * Created by asus on 2017/8/15.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ActivityService } from './activity.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { MdSnackBar } from '@angular/material';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activityList.component.html',
})
export class ActivityListComponent implements OnInit, OnDestroy {

  publishUserId;
  joinList = [];
  successList = [];
  waitList = [];
  failList = [];
  user = {
    user: {
      id: null
    }
  };
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  routerSubscribe: Subscription;
  storeSubscribe: Subscription;

  constructor(private store: Store<any>, private location: Location, private formBuilder: FormBuilder,
    public meta: Meta, public title: Title,
    private activityService: ActivityService, private router: Router, public snackBar: MdSnackBar,
    private route: ActivatedRoute) {
    this.title.setTitle('报名列表');
    this.meta.addTags([
      { name: 'keywords', content: '活动报名列表,活动报名详情' },
      { name: 'description', content: '活动报名列表详情' }
    ]);
  }

  ngOnInit() {
    this.storeSubscribe = this.store.select('user').subscribe((data: any) => {
      this.user = data;
    });

    this.routerSubscribe = this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.getPublishUserId(params.id);
        this.getAllJoinByActivityId(params.id);
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  dealJoinList(data: any) {
    this.successList = [];
    this.waitList = [];
    this.failList = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].isSuccess === 0) {
        this.failList.push(data[i]);
      } else if (data[i].isSuccess === 1) {
        this.waitList.push(data[i]);
      } else if (data[i].isSuccess === 2) {
        this.successList.push(data[i]);
      }
    }
  }

  getAllJoinByActivityId(id: any) {
    this.activityService.getAllJoinByActivityId(id).subscribe((data: any) => {
      this.joinList = data;
      this.dealJoinList(this.joinList);
    }, error => this.errorHandle(error));
  }

  getPublishUserId(id: any) {
    this.activityService.getPublishUserId(id).subscribe((data: any) => {
      this.publishUserId = data.publishUserId;
    }, error => this.errorHandle(error));
  }

  back() {
    this.location.back();
  }

  joinActivitySuccess(wait: any) {
    this.activityService.joinActivitySuccessUpdate(wait.id).subscribe((data: any) => {
      wait.isSuccess = 2;
      this.dealJoinList(this.joinList);
    }, error => this.errorHandle(error));
  }

  joinActivityFail(wait: any) {
    this.activityService.joinActivityFailUpdate(wait.id).subscribe((data: any) => {
      wait.isSuccess = 0;
      this.dealJoinList(this.joinList);
    }, error => this.errorHandle(error));
  }
  ngOnDestroy() {
    this.routerSubscribe.unsubscribe();
    this.storeSubscribe.unsubscribe();
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
