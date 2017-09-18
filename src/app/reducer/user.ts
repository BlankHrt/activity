/**
 * Created by lenovo on 2017/4/11.
 */
import { Action } from '@ngrx/store';
export interface CustomAction extends Action {
    type: string;
    payload?: any;
}
export const ActionTypes = {
    SAVE_USER: 'SAVE_USER',
    DELETE_USER: 'DELETE_USER'
};
export interface USER {
    isLogin: boolean;
    user: any;
}
const initialState: USER = {
    isLogin: false,
    user: {}
};
export function reducer(state = initialState, action: CustomAction): USER {
    switch (action.type) {
        case ActionTypes.SAVE_USER:
            return action.payload;
        case ActionTypes.DELETE_USER:
            return initialState;
        default:
            return state;
    }
}


