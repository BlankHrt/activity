import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Common } from '../shared/Common';
import { DatePipe } from '@angular/common';


@Injectable()
export class ActivityService {
  HttpUrl = Common.HttpUrl;

  constructor(private http: Http, private datePipe: DatePipe) {
  }

  private setOptions(): RequestOptions {
    const headers = new Headers();
    return new RequestOptions({ headers: headers });
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
    urlSearchParams.append('publish_user_contact', params.publish_user_contact);
    urlSearchParams.append('imageList', imageList);
    return this.http.post(this.HttpUrl + '/activity/insert', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  joinInsert(activityId: any, userId: any, contact: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityId', activityId);
    urlSearchParams.append('userId', userId);
    urlSearchParams.append('contact', contact);
    return this.http.post(this.HttpUrl + '/joinActivity/joinInsert', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  support(id: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/support', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  unSupport(id: any, userID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/unSupport', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  read(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/read', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityByIdWithUser(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/getActivityByIdWithUser', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityByPage(page: any, type: any, isLogin: any, userID: any): Observable<any> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('startPage', page);
    urlSearchParams.append('activityType', type);
    urlSearchParams.append('isLogin', isLogin);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivityByPage', urlSearchParams)
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
    return this.http.post(this.HttpUrl + '/activity/getActivityByPageAndTitleAndType', urlSearchParams)
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
    return this.http.post(this.HttpUrl + '/activity/getSelfSchoolActivityByPage', urlSearchParams)
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
    return this.http.post(this.HttpUrl + '/activity/getSearchSelfSchoolActivityByPage', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getActivityImageByActivityId(activityID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityID', activityID);
    return this.http.post(this.HttpUrl + '/activity/getActivityImageByActivityId', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  comment(id: any, userID: any, comment: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('comment', comment);
    return this.http.post(this.HttpUrl + '/activity/comment', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  childComment(parentCommentID: any, activityID: any, userID: any, comment: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('parentCommentID', parentCommentID);
    urlSearchParams.append('activityID', activityID);
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('comment', comment);
    return this.http.post(this.HttpUrl + '/activity/childComment', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // 根据登录的用户ID，判断该用户是否已经报名
  getActivityJoinWithUser(activityId: any, joinUserId: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityId', activityId);
    urlSearchParams.append('joinUserId', joinUserId);
    return this.http.post(this.HttpUrl + '/joinActivity/getActivityJoinWithUser', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllCommentByActivityId(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/getAllCommentByActivityId', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getAllJoinByActivityId(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/joinActivity/getAllJoinByActivityId', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getPublishUserId(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/activity/getPublishUserId', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }
  joinActivitySuccessUpdate(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/joinActivity/UpdateIsSuccess', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);

  }
  joinActivityFailUpdate(id: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('id', id);
    return this.http.post(this.HttpUrl + '/joinActivity/UpdateIsSuccessFail', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);

  }

  getActivitySupportByUserIdAndActivityID(userID: any, activityID: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('activityID', activityID);
    urlSearchParams.append('userID', userID);
    return this.http.post(this.HttpUrl + '/activity/getActivitySupportByUserIdAndActivityID', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivitySupportByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl + '/activity/getUnReadActivitySupportByUserIDAndActivityType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivityCommentByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl + '/activity/getUnReadActivityCommentByUserIDAndActivityType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivityJoinSponsorByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl + '/joinActivity/getUnReadActivityJoinSponsorByUserIDAndActivityType', urlSearchParams)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getUnReadActivityJoinParticipantByUserIDAndActivityType(userID: any, activityType: any) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userID', userID);
    urlSearchParams.append('activityType', activityType);
    return this.http.post(this.HttpUrl + '/joinActivity/getUnReadActivityJoinParticipantByUserIDAndActivityType', urlSearchParams)
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
