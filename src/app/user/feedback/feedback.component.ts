/**
 * Created by asus on 2017/8/17.
 */
import { Component, ElementRef, Inject, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
})

export class FeedbackComponent implements OnInit {

  user;
  content;
  showSpinner = false;
  @ViewChild('commitButton') commitButton: ElementRef;
  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute,
    public meta: Meta, public title: Title, private userService: UserService, private renderer: Renderer, public snackBar: MatSnackBar) {
    this.title.setTitle('反馈');
    this.meta.addTags([
      { name: 'keywords', content: '动动七号反馈' },
      { name: 'description', content: '动动七号反馈' }
    ]);
  }

  ngOnInit() {
    this.store.select('user').subscribe(data => {
      this.user = data;
    });
  }

  commit() {
    if (this.content) {
      this.showSpinner = true;
      this.renderer.setElementAttribute(this.commitButton.nativeElement, 'disabled', 'true');
      this.userService.insert(this.content, this.user.isLogin, this.user.user.id).subscribe(() => {
        this.store.select('router').subscribe((data: any) => {
          this.router.navigate([data.url]);
        });
      }, error => this.errorHandle(error));
    }
  }
  back() {
    this.store.select('router').subscribe((x: any) => {
      this.router.navigate([x.url]);
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

