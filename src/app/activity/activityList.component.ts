/**
 * Created by asus on 2017/8/15.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ActivityService } from './activity.service';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import {Subscription} from "rxjs/Subscription";

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
    private activityService: ActivityService, private router: Router,
    private route: ActivatedRoute) {
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
        console.log('您访问的页面不存在');
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
    });
  }

  getPublishUserId(id: any) {
    this.activityService.getPublishUserId(id).subscribe((data: any) => {
      this.publishUserId = data.publishUserId;
    });
  }

  back() {
    this.location.back();
  }

  joinActivitySuccess(wait: any) {
    this.activityService.joinActivitySuccessUpdate(wait.id).subscribe((data: any) => {
      wait.isSuccess = 2;
      this.dealJoinList(this.joinList);
    });
  }

  joinActivityFail(wait: any) {
    this.activityService.joinActivityFailUpdate(wait.id).subscribe((data: any) => {
      wait.isSuccess = 0;
      this.dealJoinList(this.joinList);
    });
  }
  ngOnDestroy() {
    this.routerSubscribe.unsubscribe();
    this.storeSubscribe.unsubscribe();
  }
}
