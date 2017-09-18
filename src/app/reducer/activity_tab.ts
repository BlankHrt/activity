/**
 * Created by asus on 2017/9/5.
 */

import { Action } from '@ngrx/store';
export interface CustomAction extends Action {
  type: string;
  payload?: any;
}
export const ActionTypes = {
  SAVE_ACTIVITY_TAB: 'SAVE_ACTIVITY_TAB',
};

export interface ACTIVITY_TAB {
  index: number;
}
const initialState: ACTIVITY_TAB = {
  index: 0,
};
export function reducer(state = initialState, action: CustomAction): ACTIVITY_TAB {
  switch (action.type) {
    case ActionTypes.SAVE_ACTIVITY_TAB:
      return action.payload;
    default:
      return state;
  }
}
