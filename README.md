# ActivityFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.2.

using jquery

# Contributions

lqh,kj

# Bug

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
###
详情页面去掉 **thumbnails** 参考 hot-detail.component
```html
 galleryOptions = [
    { 'thumbnails': false, 'preview': false, 'imageSwipe': true},
    { 'breakpoint': 500, 'width': '100%', 'height': '400px' }
  ];
```

###
评论样式 参考 hot-detail.component
####style

###更多评论 
设置查看个人资料

###JWT 认证
## 所有service前加,所有http请求最好一个参数加 **, this.setOptions()**
```javascript
private setOptions(): RequestOptions {
        const headers = new Headers();
        headers.append('Authorization', this.cookieService.get('token'));
        return new RequestOptions({ headers: headers });
    }

     return this.http.post(this.HttpUrl + '/article/getArticleByPageAndTitleAndType', urlSearchParams, this.setOptions())
            .map(this.extractData)
            .catch(this.handleError);
```
## 所有component加 错误处理函数 所有http请求调用错误处理

