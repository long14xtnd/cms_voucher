import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './AuthReducer';

const authenSetup = {
  key: 'root',
  storage,
  whitelist: ['detail']
};

const rootReducer = combineReducers({
  authReducer: persistReducer(authenSetup, authReducer),
});

export default rootReducer;
