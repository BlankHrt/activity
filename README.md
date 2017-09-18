# ActivityFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.2.

using jquery

# Contributions

lqh,kj

# Bug
###
unsubscribe(activity,travel) 参考hot  
###
换掉form(activity,travel)  参考hot 
###
图片上传
```html
<image-upload [max]="9" [url]="ArticleUrl" [buttonCaption]="'添加图片'" [dropBoxMessage]="'最多上传9张照片'" [extensions]="['jpg','png','gif']"
                (uploadFinished)="imageUploaded($event)" (removed)="imageRemoved($event)"></image-upload>

```
注意这两个方法
__uploadFinished__
__removed__

###
添加timepicker  

###
所有子评论样式，自动聚焦，__autofocus__参考hot-detail,
```html
<div *ngFor="let child of c?.childrenCommentList | limit:2">
            <a style="margin-left:25px;" (click)="gotoChildPersonDetail($event,child)">{{child?.user?.name}}:</a>{{child?.comment}}
          </div>

```
```css
 .child-comment {
    width: 95%;
    margin: 0px auto;
    padding: 10px;
    background: #eee;
  }
```
