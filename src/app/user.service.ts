import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Common } from './shared/Common';

@Injectable()
export class UserService {
  HttpUrl = Common.HttpUrl;

  constructor(private http: Http) {
  }

  private setOptions(): RequestOptions {
    const headers = new Headers();
    return new RequestOptions({ headers: headers });
  }

  insert(params: any, isLogin: any, userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('content', params.content);
    urlSearchParams.append('isLogin', isLogin);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/feedback/insert', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  loginWC(user: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', user.name);
    urlSearchParams.append('password', user.password);
    return this.http.post(this.HttpUrl + '/user/loginWC', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMessage(phone: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', phone);
    return this.http.post(this.HttpUrl + '/user/getMessage', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getForgetMessage(phone: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', phone);
    return this.http.post(this.HttpUrl + '/user/getForgetMessage', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllProvince() {
    const urlSearchParams = new URLSearchParams();
    return this.http.post(this.HttpUrl + '/province/getAllProvince', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getSchoolByProvince(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('provinceID', id);
    return this.http.post(this.HttpUrl + '/school/getSchoolByProvince', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  validatePhoneIsExist(phone: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', phone);
    return this.http.post(this.HttpUrl + '/user/validatePhoneIsExist', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getArticleByUserAndArticleType(userID: any, articleType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('articleType', articleType);
    return this.http.post(this.HttpUrl + '/article/getArticleByUserAndArticleType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteArticlebyId(id: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/article/deleteArticlebyId', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteActivitybyId(id: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/deleteActivitybyId', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getActivityByUser(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivityByUser', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityByUserJoin(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivityByUserJoin', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getArticleSupportByUserIdAndArticleType(userID: any, articleID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('articleID', articleID);
    return this.http.post(this.HttpUrl + '/article/getArticleSupportByUserIdAndArticleType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getArticleCommentByUserIdAndArticleType(userID: any, articleID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('articleID', articleID);
    return this.http.post(this.HttpUrl + '/article/getArticleCommentByUserIdAndArticleType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getActivitySupportByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivitySupportByUserIdAndActivityType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityCommentByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivityCommentByUserIdAndActivityType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivitySponsorByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/joinActivity/getActivitySponsorByUserIdAndActivityType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityParticipantByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/joinActivity/getActivityParticipantByUserIdAndActivityType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  update(user: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', user.id);
    urlSearchParams.append('name', user.name);
    urlSearchParams.append('nickname', user.nickname);
    urlSearchParams.append('sex', user.sex);
    urlSearchParams.append('description', user.description);
    urlSearchParams.append('schoolId', user.schoolId);

    return this.http.post(this.HttpUrl + '/user/update', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  updatePassword(user: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', user.phone);
    urlSearchParams.append('password', user.password);

    return this.http.post(this.HttpUrl + '/user/updatePassword', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBriefPersonInfo(userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/user/getBriefPersonInfo', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  readArticleComment(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/article/readArticleComment', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  readActivityComment(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/readActivityComment', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  readActivityJoin(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/readActivityJoin', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  participantReadActivityJoin(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/participantReadActivityJoin', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  readArticleSupport(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/article/readArticleSupport', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  readActivitySupport(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/readActivitySupport', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateHead(head: any, userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('head', head);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/user/updateHead', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  login(user: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', user.name);
    urlSearchParams.append('password', user.password);
    return this.http.post(this.HttpUrl + '/user/login', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  logout(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/article/read', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  register(user: any, schoolID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', user.name);
    urlSearchParams.append('phone', user.mobile);
    urlSearchParams.append('password', user.password);
    urlSearchParams.append('schoolID', schoolID);
    return this.http.post(this.HttpUrl + '/user/register', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  extractData(res: Response) {
    return res.text() ? res.json() : {};
  }

  handleError(error: Response | any) {
    return Observable.throw(error);
  }


}
