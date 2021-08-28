import {Field, reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import React from 'react';
import { connect } from 'react-redux';
import validator from 'validator';

import User from './index';
import { withUser } from './../../hoc/withUser';
import { renderField } from './../../helpers/redux_form';
import { editEmail } from './../../actions/user';
import { InvalidPassword, EmailTaken } from './../../errors/user';

class EditEmail extends User {
    state = { validated: false, submitDisabled: false, success: false };

    submitForm(values, dispatch) {
        const { editEmail } = this.props;
        dispatch(clearSubmitErrors('editEmail'));
        return new Promise((resolve, reject) => {
            const errors = validate(values, this.props);
            if (Object.keys(errors).length > 0) { // or Boolean(Object.keys(errors)[0])
                reject(new SubmissionError(errors));
            } else {
                resolve(values);
            }
        }).then(async ({current_password, email}) => {
            this.setState({validated: true, submitDisabled: true});
            try {
                await editEmail(current_password, email);
                this.setState({success: true});
            } catch(e) {
                this.setState({success: false});
                if (e instanceof InvalidPassword) {
                    return Promise.reject(new SubmissionError({
                        '_error': 'ელ-ფოსტის შეცვლა ვერ მოხერხდა',
                        'current_password': 'არასწორი მიმდინარე პაროლი',
                    }));
                }
                if (e instanceof EmailTaken) {
                    return Promise.reject(new SubmissionError({
                        '_error': 'ელ-ფოსტის შეცვლა ვერ მოხერხდა',
                        'email': 'დაკავებული ან არასწორი ელ-ფოსტაs',
                    }));
                }
                return Promise.reject(new SubmissionError({
                    '_error': 'ელ-ფოსტის შეცვლა ვერ მოხერხდა',
                    'current_password': true,
                    'email': true
                }))
            } finally {
                this.setState({validated: false, submitDisabled: false});
            }
        });
    }

    render() {
        const { validated, submitDisabled, success } = this.state;
        const { error, currentUser } = this.props; // Global submission error

        return (
            <div>
                <span>Edit email</span>
                <div>
                    {currentUser.unconfirmed_email ? <p>ელ-ფოსტა {currentUser.unconfirmed_email} საჭიროებს დამოწმებას</p>
                        : <p>თქვენი ელ-ფოსტა დამოწმებულია</p>}
                </div>
                <div>
                    <form onSubmit={this.props.handleSubmit(this.submitForm.bind(this))} validated={validated}
                          noValidate>
                        <div>
                            <strong>
                                email-ის ცვლილება
                            </strong>
                            { error && <p className="text-danger">{error}</p>}
                            { success && <p className="text-success">OK mail sent</p>}
                            <Field name="email" type="email" label="ახალი ელ-ფოსტა-ფოსტა" placeholder="ახალი ელ-ფოსტა"
                                   component={renderField} />
                            <Field name="current_password" type="password" label="მიმდინარე პაროლი" placeholder="თქვენი ამჟამინდელი პაროლი"
                                   component={renderField} />
                            <div className="text-right" style={{marginTop: '15px'}}>
                                <button disabled={submitDisabled} type="submit" color="primary" style={{marginTop: '10px'}}>
                                    { submitDisabled ? 'იტვირთება...' : 'ელ-ფოსტის შეცვლა' }
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}


const validate = (values, props) => {
    const errors = {};
    if (!values.current_password) {
        errors.current_password = 'მიმდინარე პაროლი ცარიელია';
    } else if (values.current_password.length < 6) {
        errors.current_password = 'მიმდინარე პაროლი მოკლეა (5 სიმ.)'
    }
    if (!values.email) {
        errors.email = 'ელ-ფოსტა ცარიელია';
    } else if (!validator.isEmail(values.email)) {
        errors.email = 'არასწორი ელ-ფოსტა';
    } else if (values.email === props.currentUser.email) {
        errors.email = 'საჭიროა ახალი ელ-ფოსტა';
    }
    return errors;
};

export default reduxForm({
    form: 'editEmail',
    persistentSubmitErrors: true
})(connect(null, {editEmail})((withUser({
    protected: true,
    redirectProtected: '/sign_in'
})(EditEmail))));

