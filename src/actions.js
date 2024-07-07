import { LOGIN_STATUS } from './common'
export const loghIn = () => ({
    type: LOGIN_STATUS.LOG_IN,
});

export const signOut = () => ({
    type: LOGIN_STATUS.SIGN_OUT,
});

