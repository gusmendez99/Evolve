import {
  SIGNIN_USER_SUCCESS,
  SIGNOUT_USER_SUCCESS,
  SIGNUP_USER_SUCCESS,
} from './user.types';

import store from 'store';

const INIT_STATE = {
  authUser: store.get('auth_user'),
};

const user = (state = INIT_STATE, action) => {

  switch (action.type) {

      case SIGNUP_USER_SUCCESS: {
          store.set('auth_user', action.payload);
          return {
              ...state,
              authUser: action.payload,
          }
      }

      case SIGNIN_USER_SUCCESS: {
          store.set('auth_user', action.payload);
          return {
              ...state,
              authUser: action.payload
          }
      }
      
      case SIGNOUT_USER_SUCCESS: {
          store.remove('auth_user');
          return {
              ...state,
              authUser: null,
          }
      }

      default:
          return state;
  }
}

export default user;
