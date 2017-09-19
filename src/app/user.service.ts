import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { Common } from './shared/Common';
import { CookieService } from './shared/lib/ngx-cookie/cookie.service';

@Injectable()
export class UserService {
  HttpUrl = Common.HttpUrl;

  constructor(private cookieService: CookieService, private http: Http) {
  }

  private setOptions(): RequestOptions {
    const headers = new Headers();
    headers.append('Authorization', this.cookieService.get('token'));
    return new RequestOptions({ headers: headers });
  }

  insert(content: any, isLogin: any, userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('content', content);
    urlSearchParams.append('isLogin', isLogin);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/feedback/insert', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  loginWC() {
    return this.http.post(this.HttpUrl + '/auth/loginWC', {}, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getMessage(phone: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', phone);
    return this.http.post(this.HttpUrl + '/user/getMessage', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getForgetMessage(phone: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', phone);
    return this.http.post(this.HttpUrl + '/user/getForgetMessage', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllProvince() {
    const urlSearchParams = new URLSearchParams();
    return this.http.post(this.HttpUrl + '/province/getAllProvince', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  getSchoolByProvince(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('provinceID', id);
    return this.http.post(this.HttpUrl + '/school/getSchoolByProvince', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  validatePhoneIsExist(phone: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', phone);
    return this.http.post(this.HttpUrl + '/user/validatePhoneIsExist', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getArticleByUserAndArticleType(userID: any, articleType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('articleType', articleType);
    return this.http.post(this.HttpUrl + '/article/getArticleByUserAndArticleType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteArticlebyId(id: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/article/deleteArticlebyId', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteActivitybyId(id: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/deleteActivitybyId', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  getActivityByUser(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivityByUser', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityByUserJoin(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivityByUserJoin', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getArticleSupportByUserIdAndArticleType(userID: any, articleID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('articleID', articleID);
    return this.http.post(this.HttpUrl + '/article/getArticleSupportByUserIdAndArticleType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  getArticleCommentByUserIdAndArticleType(userID: any, articleID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('articleID', articleID);
    return this.http.post(this.HttpUrl + '/article/getArticleCommentByUserIdAndArticleType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  getActivitySupportByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivitySupportByUserIdAndActivityType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityCommentByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivityCommentByUserIdAndActivityType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivitySponsorByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/joinActivity/getActivitySponsorByUserIdAndActivityType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityParticipantByUserIdAndActivityType(activityType: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/joinActivity/getActivityParticipantByUserIdAndActivityType', urlSearchParams, this.setOptions())
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

    return this.http.post(this.HttpUrl + '/user/update', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  updatePassword(user: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('phone', user.phone);
    urlSearchParams.append('password', user.password);

    return this.http.post(this.HttpUrl + '/user/updatePassword', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBriefPersonInfo(userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/user/getBriefPersonInfo', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  readArticleComment(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/article/readArticleComment', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }
  readActivityComment(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/readActivityComment', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  readActivityJoin(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/readActivityJoin', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  participantReadActivityJoin(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/participantReadActivityJoin', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  readArticleSupport(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/article/readArticleSupport', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  readActivitySupport(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/readActivitySupport', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateHead(head: any, userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('head', head);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/user/updateHead', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  login(user: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('username', user.name);
    urlSearchParams.append('password', user.password);
    return this.http.post(this.HttpUrl + '/auth/login', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  logout() {
    return this.http.post(this.HttpUrl + '/auth/logout', {}, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  register(user: any, schoolID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('name', user.name);
    urlSearchParams.append('phone', user.mobile);
    urlSearchParams.append('password', user.password);
    urlSearchParams.append('schoolID', schoolID);
    return this.http.post(this.HttpUrl + '/user/register', urlSearchParams, this.setOptions())
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
