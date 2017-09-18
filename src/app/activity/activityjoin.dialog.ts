import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-activityjoin-dialog',
  template: `
    <h2 md-dialog-title>报名</h2>
    <md-dialog-content>
      <h4><i class="fa fa-map-marker"></i>联系方式<span style="color:red">(必填)</span></h4>
      <md-input-container>
        <input mdInput [(ngModel)]="contact">
      </md-input-container>
    </md-dialog-content>
    <md-dialog-actions>
      <button class="btn btn-danger" [md-dialog-close]="contact" [disabled]="!contact">报名</button>
      <button md-button [md-dialog-close]="false">取消</button>
    </md-dialog-actions>
  `,
})
export class ActivityJoinDialogComponent {
  contact;
  constructor(public dialogRef: MdDialogRef<ActivityJoinDialogComponent>) {
  }
}
