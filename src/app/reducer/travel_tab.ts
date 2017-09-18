/**
 * Created by lenovo on 2017/4/11.
 */
import { Action } from '@ngrx/store';
export interface CustomAction extends Action {
    type: string;
    payload?: any;
}
export const ActionTypes = {
    SAVE_HOT_TAB: 'SAVE_TRAVEL_TAB',
};

export interface TRAVEL_TAB {
    index: number;
}
const initialState: TRAVEL_TAB = {
    index: 0,
};
export function reducer(state = initialState, action: CustomAction): TRAVEL_TAB {
    switch (action.type) {
        case ActionTypes.SAVE_HOT_TAB:
            return action.payload;
        default:
            return state;
    }
}


