import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
    selector: 'app-hot-dialog',
    template: `
    <h2 md-dialog-title>您尚未登陆</h2>
    <md-dialog-content>是否跳转到登陆页面</md-dialog-content>
    <md-dialog-actions>
      <button md-button [md-dialog-close]=false>No</button>
      <button md-button [md-dialog-close]=true>Yes</button>
    </md-dialog-actions>
    `,
})
export class TravelDialogComponent {
    constructor(public dialogRef: MdDialogRef<TravelDialogComponent>) { }
}
