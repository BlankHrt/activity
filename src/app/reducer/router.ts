import {Action} from '@ngrx/store';
export interface CustomAction extends Action {
  type: string;
  payload?: any;
}
export const ActionTypes = {
  SAVE_PREV_ROUTER: 'SAVE_PREV_ROUTER',
};

export interface ROUTER {
  url: String;
}
const initialState: ROUTER = {
  url: '/',
};
export function reducer(state = initialState, action: CustomAction): ROUTER {
  switch (action.type) {
    case ActionTypes.SAVE_PREV_ROUTER:
      return action.payload;
    default:
      return state;
  }
}


