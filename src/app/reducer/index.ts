/**
 * Created by lenovo on 2017/4/12.
 */
import * as userReducer from './user';
import * as hotTabReducer from './hot_tab';
import * as travelTabReducer from './travel_tab';
import * as activityTabReducer from './activity_tab';
import * as routerReducer from './router';

import { ActionReducerMap } from '@ngrx/store';

export interface State {
  user: userReducer.USER;
  hot_tab: hotTabReducer.HOT_TAB;
  activity_tab: activityTabReducer.ACTIVITY_TAB;
  travel_tab: travelTabReducer.TRAVEL_TAB;
  router: routerReducer.ROUTER;
}
const reducers = {
  user: userReducer.reducer,
  hot_tab: hotTabReducer.reducer,
  activity_tab: activityTabReducer.reducer,
  travel_tab: travelTabReducer.reducer,
  router: routerReducer.reducer
};

export const reducer: ActionReducerMap<State> = {
  user: userReducer.reducer,
  hot_tab: hotTabReducer.reducer,
  activity_tab: activityTabReducer.reducer,
  travel_tab: travelTabReducer.reducer,
  router: routerReducer.reducer
};

