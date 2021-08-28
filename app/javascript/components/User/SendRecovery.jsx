import {Field, reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import React from 'react';
import { connect } from 'react-redux';
import validator from 'validator';

import User from './index';
import { withUser } from './../../hoc/withUser';
import { renderField } from './../../helpers/redux_form';
import { sendRecovery } from './../../actions/user';

class SendRecovery extends User {
    state = { validated: false, submitDisabled: false, resendButtonDisabled: false, resendSuccess: null,
        resendError: null };
    
    submitForm(values, dispatch) {
        const { sendRecovery } = this.props;
        dispatch(clearSubmitErrors('sendRecovery'));
        return new Promise((resolve, reject) => {
            const errors = validate(values, this.props);
            if (Object.keys(errors).length > 0) { // or Boolean(Object.keys(errors)[0])
                reject(new SubmissionError(errors));
            } else {
                resolve(values);
            }
        }).then(async ({email}) => {
            this.setState({validated: true, submitDisabled: true});
            try {
                await sendRecovery(email);
                this.setState({email});
            } catch(e) {
                return Promise.reject(new SubmissionError({
                    'email': 'გაგზავნა ვერ მოხერხდა',
                }))
            } finally {
                this.setState({validated: false, submitDisabled: false});
            }
        });
    }

    renderForm() {
        const { validated, submitDisabled } = this.state;

        return (
            <div>
                <span>Forgot password</span>
                <div>
                    <form onSubmit={this.props.handleSubmit(this.submitForm.bind(this))} validated={validated}
                          noValidate>
                        <div>
                            <strong>
                                დამავიწყდა პაროლი
                            </strong>
                            <Field name="email" type="email" label="ელ-ფოსტა" placeholder="თქვენი ელ-ფოსტა"
                                   component={renderField} />
                            <div className="text-right" style={{marginTop: '15px'}}>
                                <button disabled={submitDisabled} type="submit" color="primary" style={{marginTop: '10px'}}>
                                    { submitDisabled ? 'იტვირთება...' : 'გაგზავნა' }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    async resend() {
        const { sendRecovery } = this.props;
        const email = this._getEmailFromState();

        try {
            await sendRecovery(email);
            this.setState({resendSuccess: 'წერილი გაიგზავნა ახლიდან', resendError: null})
        } catch(e) {
            this.setState({resendError: 'ხელახალი წერილის გაგზავნა ვერ მოხერხდა', resendSuccess: null})
        }
    }

    renderResend() {
        const { resendButtonDisabled, resendError, resendSuccess } = this.state;
        const email = this._getEmailFromState();

        return (
            <div>
                <div>Sent to {email}</div>
                <div>{this.state.resendSuccess && <div className="text-success">{this.state.resendSuccess}</div>}</div>
                <div>{this.state.resendError && <div className="text-danger">{this.state.resendError}</div>}</div>
                <div>
                    <button onClick={this.resend.bind(this)} disabled={resendButtonDisabled} type="submit" color="primary" style={{marginTop: '10px'}}>
                        { resendButtonDisabled ? 'იტვირთება...' : 'ხელახლა გაგზავნა' }
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const email = this._getEmailFromState();

        if (email) {
            return this.renderResend();
        }

        return this.renderForm();
    }

    _getEmailFromState() {
        return this.state.email || ((this.props.location || {}).state || {}).email;
    }
}

const validate = values => {
    const errors = {};

    if (!values.email) {
        errors.email = 'ელ-ფოსტა ცარიელია';
    } else if (!validator.isEmail(values.email)) {
        errors.email = 'არასწორი ელ-ფოსტა';
    }

    return errors;
};

export default reduxForm({
    form: 'sendRecovery',
    persistentSubmitErrors: true
})(connect(null, {sendRecovery})((withUser({
    noAuthorized: true,
    redirectAuthorized: '/current_user'
})(SendRecovery))));

