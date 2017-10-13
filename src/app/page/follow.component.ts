import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-follow',
    template: `
    <mat-toolbar style="margin: 0;padding: 0;width: 100%;background-color:#87cefa">
      <button mat-icon-button (click)="back()">
        <i class="fa fa-long-arrow-left" style="float:left"></i>
    </button>
      <div style="text-align:center;width:100%">加入我们</div>
  </mat-toolbar>
    <img src="../assets/img/dd_7.jpg" width="100%" style="margin-top:20px;"/>
    <div style="font-size:18px;margin:10px;padding:10px;text-align:center">
    <div> <strong> 长按二维码关注我们</strong></div>
    <div> <strong> 大学生的动动七号欢迎你的加入</strong></div>
    </div>
    `,
})
export class AppFollowComponent implements OnInit {
  constructor(private location: Location) {
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }
}
