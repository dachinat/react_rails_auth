import axios from 'axios';

import { FETCH_USER } from './';
import { InvalidCredentials, UnknownError, AlreadyConfirmed, InvalidToken, InvalidPassword,
    EmailTaken } from '../errors/user';

export const fetchUser = () => async dispatch =>  {
    const { data } = await axios.get('/users/current_user');

    dispatch({
        type: FETCH_USER,
        payload: data
    });
};

export const signIn = (email, password) => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            delete axios.defaults.headers.common['authorization'];

            const {data, headers} = await axios.post('/users/sign_in', { user: { email, password } });

            if (!data.id) return reject(new UnknownError('Could not find <id> attribute on user'));

            localStorage.setItem('authorization', headers.authorization);
            axios.defaults.headers.common['authorization'] = headers.authorization;

            dispatch(fetchUser());
            resolve(data);
        } catch (e) {
            if (e.response.status === 401) return reject(new InvalidCredentials(e.message));
            reject(new UnknownError(e.message));
        }
    });
};

export const signInWithJWT = authorization => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            delete axios.defaults.headers.common['authorization'];

            const {data, headers} = await axios.post(
                '/users/sign_in',
                { },
                {headers: { authorization }}
            );

            if (!data.id) return reject(new UnknownError('Could not find <id> attribute on user'));

            localStorage.setItem('authorization', headers.authorization);
            axios.defaults.headers.common['authorization'] = headers.authorization;

            dispatch(fetchUser());
            resolve(data);
        } catch (e) {
            if (e.response.status === 401) return reject(new InvalidCredentials(e.message));
            reject(new UnknownError(e.message));
        }
    });
};

export const signOut = () => async dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.delete('/users/sign_out');
            dispatch(fetchUser());
            resolve();
        } catch (e) {
            reject(new UnknownError(e.message))
        }
    });
};

export const signUp = (email, password) => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.post('/users', { user: { email, password }});
            if (!data.id) return reject(new UnknownError('Could not find <id> attribute on user'));
            resolve(data);
        } catch (e) {
            reject(new UnknownError(e.message));
        }
    });
};

export const sendConfirmation = email => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.post('/users/confirmation', { user: { email }});
            resolve();
        } catch (e) {
            reject(new UnknownError(e.message));
        }
    });
};

export const confirm = token => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.get(`/users/confirmation?confirmation_token=${token}`);
            dispatch(fetchUser());
            resolve();
        } catch (e) {
            const { response: { status, data } } = e;

            if (status === 422) {
                if (data.email) {
                    return reject(new AlreadyConfirmed(e.message));
                } else if (data['confirmation_token']) {
                    return reject(new InvalidToken(e.message));
                }
            }
            reject(new UnknownError(e.message));
        }
    });
};

export const sendRecovery = email => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.post('/users/password', { user: { email }});
            resolve();
        } catch (e) {
            reject(new UnknownError(e.message));
        }
    });
};

export const checkRecoveryToken = token => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            const {data} = await axios.get(`/users/password/check?reset_password_token=${token}`);
            if (data.valid) return resolve();
            reject(new InvalidToken(token));
        } catch (e) {
            reject(new UnknownError(e.message));
        }
    });
};

export const recover = (password, reset_password_token) => dispatch => {
    console.log(password, reset_password_token);
    return new Promise(async (resolve, reject) => {
        try {
            await axios.put('/users/password', {user: {password, reset_password_token}});
            resolve();
            dispatch(fetchUser());
        } catch (e) {
            reject(new UnknownError(e.message));
        }
    });
};

export const sendUnlock = email => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.post('/users/unlock', { user: { email }});
            resolve();
        } catch (e) {
            reject(new UnknownError(e.message));
        }
    });
};

export const unlock = token => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.get(`/users/unlock?unlock_token=${token}`);
            resolve();
        } catch (e) {
            const { response: { status, data } } = e;
            if (status === 422 && data['unlock_token']) return reject(new InvalidToken(e.message));
            reject(new UnknownError(e.message));
        }
    });
};

export const editPassword = (currentPassword, password) => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.put('/users', { user: { current_password: currentPassword, password }});
            dispatch(fetchUser());
            resolve();
        } catch ({ response: { status, data }, message }) {
            if (data.errors.current_password) return reject(new InvalidPassword(message));
            reject(new UnknownError(e.message));
        }
    });
};

export const editEmail = (currentPassword, email) => dispatch => {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.put('/users', { user: { current_password: currentPassword, email }});
            dispatch(fetchUser());
            resolve();
        } catch ({ response: { status, data }, message }) {
            if (data.errors.current_password) return reject(new InvalidPassword(message));
            if (data.errors.email) return reject(new EmailTaken(message));
            reject(new UnknownError(e.message));
        }
    });
};