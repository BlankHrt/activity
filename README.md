# ActivityFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.2.

using jquery

# Contributions

lqh,kj

# Bug

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
## 所有logout 加   this.hotService.logout().subscribe(); 参考hot
## 时间 参考hot-add.component,html


