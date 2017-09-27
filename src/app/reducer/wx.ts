/**
 * Created by lenovo on 2017/4/11.
 */
import {Action} from '@ngrx/store';
export interface CustomAction extends Action {
  type: string;
  payload?: any;
}
export const ActionTypes = {
  SAVE_WX: 'SAVE_WX',
};

export interface WX {
  timestamp: String;
  nonceStr: String;
  access_token: String;
  JsapiTicket: String;
}
const initialState: WX = {
  timestamp: null,
  nonceStr: null,
  access_token: null,
  JsapiTicket: null
};
export function reducer(state = initialState, action: CustomAction): WX {
  switch (action.type) {
    case ActionTypes.SAVE_WX:
      return action.payload;
    default:
      return state;
  }
}


