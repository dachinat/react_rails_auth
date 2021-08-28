import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import validator from 'validator';
import { connect } from 'react-redux';

import User from './index';
import { withUser } from '../../hoc/withUser';
import { signIn } from './../../actions/user';
import { UnknownError, InvalidCredentials } from './../../errors/user';
import { renderField } from './../../helpers/redux_form';

class SignIn extends User {
    state = { validated: false, submitDisabled: false };

    submitForm(values) {
        const { signIn } = this.props;

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
                await signIn(email, password);
            } catch(e) {
                console.log(e);
                if (e instanceof InvalidCredentials) {
                    return Promise.reject(new SubmissionError({
                        email: "ელ-ფოსტა ან პაროლი არასწორია"
                    }));
                } else if (e instanceof UnknownError) {
                    return Promise.reject(new SubmissionError({
                        email: "წარმოიშვა შეცდომა, სცადეთ ახლიდან"
                    }));
                } else {
                    return Promise.reject(new SubmissionError({
                        email: "წარმოიშვა გაურკვეველი შეცდომა"
                    }));
                }
            } finally {
                console.log(this.props);
                this.setState({validated: false, submitDisabled: false});
            }
        });
    }

    render() {
        const { validated, submitDisabled, oauthError } = this.state;

        return (
            <div>
                <span>Sign-in</span>
                <div>
                    <form onSubmit={this.props.handleSubmit(this.submitForm.bind(this))} validated={validated}
                          noValidate>
                        <div>
                            <strong>
                                ავტორიზაცია
                            </strong>
                            <div id="alert-here">
                                {this._oauthErrorToReadable()}
                            </div>
                            <Field name="email" type="email" label="ელ-ფოსტა" placeholder="თქვენი ელ-ფოსტა"
                                   component={renderField} />
                            <Field name="password" type="password" label="პაროლი" placeholder="თქვენი პაროლი"
                                   component={renderField} />
                            <div className="text-right" style={{marginTop: '15px'}}>
                                <button disabled={submitDisabled} type="submit" color="primary" style={{marginTop: '10px'}}>
                                    { submitDisabled ? 'იტვირთება...' : 'შესვლა' }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    _oauthErrorToReadable() {
        const { oauth_error } = this.props;
        switch(oauth_error) {
            case 'no_email':
                return 'No email from OAuth2 provider';
            case 'no_user':
                return 'Could not find user when authenticating through OAuth2';
            case 'failure':
                return 'Failed to complete OAuth2 authentication';
            default:
                return null;
        }
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
    } else if (values.password.length < 5) {
        errors.password = 'პაროლი მოკლეა (5 სიმ.)'
    }

    return errors;
};

export default reduxForm({
    form: 'signIn',
    persistentSubmitErrors: true
})(connect(null, { signIn })((withUser({
    noAuthorized: true,
    redirectAuthorized: '/current_user'
})(SignIn))));

