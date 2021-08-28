import React, { Component } from 'react';
import {Field, reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { renderField } from './../../helpers/redux_form';
import { recover } from './../../actions/user';

class RecoveryForm extends Component {
    state = { validated: false, submitDisabled: false, success: false };

    submitForm(values, dispatch) {
        const { recover } = this.props;
        const { token } = this.props.match.params;
        dispatch(clearSubmitErrors('recover'));
        return new Promise((resolve, reject) => {
            const errors = validate(values, this.props);
            if (Object.keys(errors).length > 0) { // or Boolean(Object.keys(errors)[0])
                reject(new SubmissionError(errors));
            } else {
                resolve(values);
            }
        }).then(async ({password}) => {
            this.setState({validated: true, submitDisabled: true});
            try {
                await recover(password, token);
                this.setState({success: true});
            } catch(e) {
                this.setState({validated: false, submitDisabled: false});

                return Promise.reject(new SubmissionError({
                    '_error': 'პაროლის განახლება ვერ მოხერხდა',
                    'password': true,
                    'password_confirmation': true
                }))
            }
        });
    }

    render() {
        const { validated, submitDisabled, success } = this.state;
        const { error } = this.props; // Global submission error

        if (success) {
            return (
              <div>
                  <strong>პაროლი შეიცვალა</strong>
                  <div>
                      <Link to="/sign_in">ახლა შეგიძლიათ გამოიყენოთ ახალი პაროლი</Link>
                  </div>
              </div>
            );
        }

        return (
            <div>
                <span>Set new password</span>
                <div>
                    <form onSubmit={this.props.handleSubmit(this.submitForm.bind(this))} validated={validated}
                          noValidate>
                        <div>
                            <strong>
                                დააყენეთ ახალი პაროლი
                            </strong>
                            { error && <p className="text-danger">{error}</p>}
                            <Field name="password" type="password" label="პაროლი" placeholder="ახალი პაროლი"
                                   component={renderField} />
                            <Field name="password_confirmation" type="password" label="გაიმეორეთ პაროლი" placeholder="გაიმეორეთ პაროლი"
                                   component={renderField} />
                            <div className="text-right" style={{marginTop: '15px'}}>
                                <button disabled={submitDisabled} type="submit" color="primary" style={{marginTop: '10px'}}>
                                    { submitDisabled ? 'იტვირთება...' : 'შეცვლა' }
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

    if (!values.password) {
        errors.password = 'პაროლი ცარიელია';
    } else if (values.password.length < 6) {
        errors.password = 'პაროლი მოკლეა (6 სიმ.)'
    }

    if (values.password_confirmation !== values.password) {
        errors.password_confirmation = 'პაროლები ერთმანეთს არ ემთხვევა';
    }

    return errors;
};

export default reduxForm({
    form: 'recover',
    persistentSubmitErrors: true
})(connect(null, {recover})(RecoveryForm));