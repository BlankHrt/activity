import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Common } from '../shared/Common';


@Injectable()
export class HotService {
    HttpUrl = Common.HttpUrl;

    constructor(private http: Http) {
    }

    getHotByPage(page: any, type: any, isLogin: any, userID: any): Observable<any> {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('startPage', page);
        urlSearchParams.append('articleType', type);
        urlSearchParams.append('isLogin', isLogin);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/getArticleByPage', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getHotByPageAndLimitNumber(type: any, number: any): Observable<any> {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('articleType', type);
        urlSearchParams.append('number', number);
        return this.http.post(this.HttpUrl + '/article/getTodayHot', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getArticleByPageAndTitleAndType(val: any, page: any, type: any, isLogin: any, userID: any): Observable<any> {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('title', val);
        urlSearchParams.append('startPage', page);
        urlSearchParams.append('articleType', type);
        urlSearchParams.append('isLogin', isLogin);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/getArticleByPageAndTitleAndType', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getArticleByIdWithUser(id: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        return this.http.post(this.HttpUrl + '/article/getArticleByIdWithUser', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllCommentByArticleId(id: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        return this.http.post(this.HttpUrl + '/article/getAllCommentByArticleId', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUnReadArticleSupportByUserIDAndArticleType(userID: any, articleType: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('articleType', articleType);
        return this.http.post(this.HttpUrl + '/article/getUnReadArticleSupportByUserIDAndArticleType', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getUnReadArticleCommentByUserIDAndArticleType(userID: any, articleType: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('articleType', articleType);
        return this.http.post(this.HttpUrl + '/article/getUnReadArticleCommentByUserIDAndArticleType', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }
    comment(id: any, userID: any, comment: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('comment', comment);
        return this.http.post(this.HttpUrl + '/article/comment', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    childComment(parentCommentID: any, articleID: any, userID: any, comment: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('parentCommentID', parentCommentID);
        urlSearchParams.append('articleID', articleID);
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('comment', comment);
        return this.http.post(this.HttpUrl + '/article/childComment', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    support(id: any, userID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/support', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }
    unSupport(id: any, userID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/unSupport', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    select(userId: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('userId', userId);
        return this.http.post(this.HttpUrl + '/user/select', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }

    insert(params: any, userID: any, articleType: any, schoolId: any, imageList: any): Observable<any> {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('title', params.title);
        urlSearchParams.append('content', params.content);
        urlSearchParams.append('userID', userID);
        urlSearchParams.append('schoolId', schoolId);
        urlSearchParams.append('articleType', articleType);
        urlSearchParams.append('imageList', imageList);
        return this.http.post(this.HttpUrl + '/article/insert', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getArticleSupportByUserIdAndArticleID(userID: any, articleID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('articleID', articleID);
        urlSearchParams.append('userID', userID);
        return this.http.post(this.HttpUrl + '/article/getArticleSupportByUserIdAndArticleID', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }
    read(id: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('id', id);
        return this.http.post(this.HttpUrl + '/article/read', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getArticleImageByArticleId(articleID: any) {
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.append('articleID', articleID);
        return this.http.post(this.HttpUrl + '/article/getArticleImageByArticleId', urlSearchParams)
            .map(this.extractData)
            .catch(this.handleError);
    }
    extractData(res: Response) {
        if (res.text()) {
            return res.json() || [];
        }
        return [];
    }

    handleError(error: Response | any) {
        return Observable.throw(error);
    }
}
