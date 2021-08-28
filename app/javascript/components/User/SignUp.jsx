import {Field, reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import React from 'react';
import { connect } from 'react-redux';
import validator from 'validator';

import User from './index';
import { withUser } from './../../hoc/withUser';
import { renderField } from './../../helpers/redux_form';
import { signUp } from './../../actions/user';


class SignUp extends User {
    state = { validated: false, submitDisabled: false };

    submitForm(values, dispatch) {
        const { signUp, history } = this.props;
        dispatch(clearSubmitErrors('signUp'));
        return new Promise((resolve, reject) => {
            const errors = validate(values, this.props);
            if (Object.keys(errors).length > 0) { // or Boolean(Object.keys(errors)[0])
                reject(new SubmissionError(errors));
            } else {
                resolve(values);
            }
        }).then(async ({email, password}) => {
            this.setState({validated: true, submitDisabled: true});
            try {
                await signUp(email, password);
                history.push({ pathname: '/send_confirmation', state: { email }});
            } catch(e) {
                this.setState({validated: false, submitDisabled: false});

                return Promise.reject(new SubmissionError({
                    '_error': 'რეგისტრაცია ვერ მოხერხდა',
                    'email': true,
                    'password': true,
                    'password_confirmation': true
                }))
            }
        });
    }

    render() {
        const { validated, submitDisabled } = this.state;
        const { error } = this.props; // Global submission error

        return (
            <div>
                <span>Sign-up</span>
                <div>
                    <form onSubmit={this.props.handleSubmit(this.submitForm.bind(this))} validated={validated}
                          noValidate>
                      <div>
                        <strong>
                            რეგისტრაცია
                        </strong>
                        { error && <p className="text-danger">{error}</p>}
                        <Field name="email" type="email" label="ელ-ფოსტა" placeholder="თქვენი ელ-ფოსტა"
                               component={renderField} />
                        <Field name="password" type="password" label="პაროლი" placeholder="თქვენი პაროლი"
                               component={renderField} />
                        <Field name="password_confirmation" type="password" label="გაიმეორეთ პაროლი" placeholder="გაიმეორეთ პაროლი"
                               component={renderField} />
                        <div className="text-right" style={{marginTop: '15px'}}>
                            <button disabled={submitDisabled} type="submit" color="primary" style={{marginTop: '10px'}}>
                                { submitDisabled ? 'იტვირთება...' : 'რეგისტრაცია' }
                            </button>
                        </div>
                     </div>
                    </form>
                </div>
            </div>
        );
    }
}


const validate = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'ელ-ფოსტა ცარიელია';
    } else if (!validator.isEmail(values.email)) {
        errors.email = 'არასწორი ელ-ფოსტა';
    }

    if (!values.password) {
        errors.password = 'პაროლი ცარიელია';
    } else if (values.password.length < 0) {
        errors.password = 'პაროლი მოკლეა (5 სიმ.)'
    }

    if (values.password_confirmation !== values.password) {
        errors.password_confirmation = 'პაროლები ერთმანეთს არ ემთხვევა';
    }

    return errors;
};

export default reduxForm({
    form: 'signUp',
    persistentSubmitErrors: true
})(connect(null, {signUp})((withUser({
    noAuthorized: true,
    redirectAuthorized: '/current_user'
})(SignUp))));

