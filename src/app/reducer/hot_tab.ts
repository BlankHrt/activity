/**
 * Created by lenovo on 2017/4/11.
 */
import { Action } from '@ngrx/store';
export interface CustomAction extends Action {
    type: string;
    payload?: any;
}
export const ActionTypes = {
    SAVE_HOT_TAB: 'SAVE_HOT_TAB',
};

export interface HOT_TAB {
    index: number;
}
const initialState: HOT_TAB = {
    index: 0,
};
export function reducer(state = initialState, action: CustomAction): HOT_TAB {
    switch (action.type) {
        case ActionTypes.SAVE_HOT_TAB:
            return action.payload;
        default:
            return state;
    }
}


