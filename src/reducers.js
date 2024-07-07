// 如果你有多个reducer，你可以使用combineReducers来组合它们  
import { combineReducers } from 'redux';
import { LOGIN_STATUS } from './common'

const initialState = {
    isLogIn: false,
};

export const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_STATUS.LOG_IN:
            return { ...state, isLogIn: true };
        case LOGIN_STATUS.SIGN_OUT:
            return { ...state, isLogIn: false };
        default:
            return state;
    }
};

export default combineReducers({
    counter: counterReducer,
    // 其他reducers...  
});