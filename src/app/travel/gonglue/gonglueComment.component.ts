/**
 * Created by asus on 2017/8/15.
 */

import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { TravelService } from '../travel.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-gonglue-comment',
    templateUrl: './gonglueComment.component.html',
})

export class GonglueCommentComponent implements OnInit, OnDestroy {
    commentList;
  // unsubscribe :forms,router,render service,Infinite Observables ,Redux Store
  // don't unsubscribe:Async pipe,@HostListener ,Finite Observable
  routerSubscribe: Subscription;
    constructor(private store: Store<any>, private location: Location,
        private router: Router, private travelService: TravelService,
        private route: ActivatedRoute) { }


    ngOnInit() {
      this.routerSubscribe = this.route.queryParams.subscribe((data: any) => {
            this.commentList = JSON.parse(data.comment);
        });
    }

    back() {
        this.location.back();
    }

    home() {
        this.router.navigate(['/travel']);
    }

    ngOnDestroy(): void {
      this.routerSubscribe.unsubscribe();
    }
}
