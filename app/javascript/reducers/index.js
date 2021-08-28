import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';

import userReducer from './user';

export default combineReducers({
    form: reduxForm,
    user: userReducer
});