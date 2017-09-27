import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/publishReplay';
import {Observable} from 'rxjs/Observable';
import {Common} from '../shared/Common';
import {DatePipe} from '@angular/common';
import {CookieService} from '../shared/lib/ngx-cookie/cookie.service';


@Injectable()
export class ActivityService {
  HttpUrl = Common.HttpUrl;
  getActivityByPageCache: Observable<any>;

  constructor(private cookieService: CookieService, private http: Http, private datePipe: DatePipe) {
  }

  private setOptions(): RequestOptions {
    const headers = new Headers();
    headers.append('Authorization', this.cookieService.get('token'));
    return new RequestOptions({headers: headers});
  }

  private setWxOptions(): RequestOptions {
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    return new RequestOptions({headers: headers});
  }

  insert(params: any, startTime: any, endTime: any, content: any, userID: any
    , activityType: any, schoolId: any, imageList: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('title', params.title);
    urlSearchParams.append('address', params.address);
    urlSearchParams.append('startTime', this.datePipe.transform(startTime, 'yyyy-MM-dd HH:mm:ss'));
    urlSearchParams.append('endTime', this.datePipe.transform(endTime, 'yyyy-MM-dd HH:mm:ss'));
    urlSearchParams.append('content', content);
    urlSearchParams.append('activityType', activityType);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('schoolId', schoolId);
    urlSearchParams.append('publishUserContact', params.publishUserContact);
    urlSearchParams.append('imageList', imageList);
    return this.http.post(this.HttpUrl + '/activity/insert', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  joinInsert(activityId: any, userId: any, contact: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityId', activityId);
    urlSearchParams.append('userId', userId);
    urlSearchParams.append('contact', contact);
    return this.http.post(this.HttpUrl + '/joinActivity/joinInsert', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  logout() {
    return this.http.post(this.HttpUrl + '/auth/logout', {}, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  support(id: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/support', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  unSupport(id: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/unSupport', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  read(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/read', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityByIdWithUser(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/getActivityByIdWithUser', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityByPage(page: any, type: any, isLogin: any, userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('startPage', page);
    urlSearchParams.append('activityType', type);
    urlSearchParams.append('isLogin', isLogin);
    urlSearchParams.append('userID', userID);
    /* if (!this.getActivityByPageCache) {
     this.getActivityByPageCache = this.http.post(this.HttpUrl + '/activity/getActivityByPage', urlSearchParams, this.setOptions())
     .map(this.extractData)
     .publishReplay(1)
     .refCount()
     .catch(this.handleError);
     }
     return this.getActivityByPageCache; */
    return this.getActivityByPageCache = this.http.post(this.HttpUrl + '/activity/getActivityByPage', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityByPageAndTitleAndType(val: any, page: any, type: any, isLogin: any, userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('startPage', page);
    urlSearchParams.append('activityType', type);
    urlSearchParams.append('isLogin', isLogin);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('title', val);
    return this.http.post(this.HttpUrl + '/activity/getActivityByPageAndTitleAndType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSelfSchoolActivityByPage(page: any, type: any, isLogin: any, userID: any, schoolId: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('startPage', page);
    urlSearchParams.append('activityType', type);
    urlSearchParams.append('isLogin', isLogin);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('schoolId', schoolId);
    return this.http.post(this.HttpUrl + '/activity/getSelfSchoolActivityByPage', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSearchSelfSchoolActivityByPage(val: any, page: any, type: any, isLogin: any, userID: any, schoolId: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('startPage', page);
    urlSearchParams.append('activityType', type);
    urlSearchParams.append('isLogin', isLogin);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('schoolId', schoolId);
    urlSearchParams.append('title', val);
    return this.http.post(this.HttpUrl + '/activity/getSearchSelfSchoolActivityByPage', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityImageByActivityId(activityID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityID', activityID);
    return this.http.post(this.HttpUrl + '/activity/getActivityImageByActivityId', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  comment(id: any, userID: any, comment: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('comment', comment);
    return this.http.post(this.HttpUrl + '/activity/comment', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  childComment(parentCommentID: any, activityID: any, userID: any, comment: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('parentCommentID', parentCommentID);
    urlSearchParams.append('activityID', activityID);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('comment', comment);
    return this.http.post(this.HttpUrl + '/activity/childComment', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  // 根据登录的用户ID，判断该用户是否已经报名
  getActivityJoinWithUser(activityId: any, joinUserId: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityId', activityId);
    urlSearchParams.append('joinUserId', joinUserId);
    return this.http.post(this.HttpUrl + '/joinActivity/getActivityJoinWithUser', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCommentByActivityId(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/getAllCommentByActivityId', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllJoinByActivityId(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/joinActivity/getAllJoinByActivityId', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPublishUserId(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/getPublishUserId', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  joinActivitySuccessUpdate(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/joinActivity/UpdateIsSuccess', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);

  }

  joinActivityFailUpdate(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/joinActivity/UpdateIsSuccessFail', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);

  }

  getActivitySupportByUserIdAndActivityID(userID: any, activityID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityID', activityID);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivitySupportByUserIdAndActivityID', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivitySupportByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl + '/activity/getUnReadActivitySupportByUserIDAndActivityType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivityCommentByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl + '/activity/getUnReadActivityCommentByUserIDAndActivityType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivityJoinSponsorByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl +
      '/joinActivity/getUnReadActivityJoinSponsorByUserIDAndActivityType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivityJoinParticipantByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl +
      '/joinActivity/getUnReadActivityJoinParticipantByUserIDAndActivityType', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  signature(jsapi_ticket: any, nonce_str: any, timestamp: any, url: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('jsapi_ticket', jsapi_ticket);
    urlSearchParams.append('nonce_str', nonce_str);
    urlSearchParams.append('timestamp', timestamp);
    urlSearchParams.append('url', url);
    return this.http.post(this.HttpUrl +
      '/user/signature', urlSearchParams, this.setOptions())
      .map(this.extractData)
      .catch(this.handleError);
  }

  clearCache() {
    this.getActivityByPageCache = null;
  }

  extractData(res: Response) {
    return res.text() ? res.json() : {};
  }

  handleError(error: Response | any) {
    return Observable.throw(error);
  }
}
