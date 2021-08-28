import { LOGIN_USER, LOGOUT_USER, FETCH_USER } from './../actions';

export default function reducer(state = { userSignedIn: null, currentUser: null }, action = {}) {
    switch (action.type) {
        case LOGIN_USER:
            return;
        case LOGOUT_USER:
            return;
        case FETCH_USER:
            return (action.payload && action.payload.id) ?
                { ...state, userSignedIn: true, currentUser: action.payload } :
                { ...state, userSignedIn: false, currentUser: null };
        default: return state;
    }
}
