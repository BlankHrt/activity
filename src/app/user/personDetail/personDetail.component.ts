/**
 * Created by asus on 2017/8/17.
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-person-detail',
  templateUrl: './personDetail.component.html',
})

export class PersonDetailComponent implements OnInit {
  user = {
    name: '',
    nickname: '',
    sex: false,
    phone: '',
    description: '',
    headUrl: '',
    school: null
  };
  userID: any;
  constructor(private location: Location,
    private store: Store<any>, private router: Router, private route: ActivatedRoute, private userService: UserService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.userID = params.id;
        this.userService.getBriefPersonInfo(this.userID).subscribe(data => {
          this.user = data;
        });
      } else {
        this.router.navigate(['/404']);
      }
    });
  }

  gotoActivity() {
    this.router.navigate(['/user/activity'], { queryParams: { id: this.userID } });
  }
  gotoTravel() {
    this.router.navigate(['/user/travel'], { queryParams: { id: this.userID } });
  }
  gotoHot() {
    this.router.navigate(['/user/hot'], { queryParams: { id: this.userID } });
  }
  back() {
    this.location.back();
  }
  home() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
    });
  }
}
