import {Field, reduxForm, SubmissionError, clearSubmitErrors } from 'redux-form';
import React from 'react';
import { connect } from 'react-redux';

import User from './index';
import { withUser } from './../../hoc/withUser';
import { renderField } from './../../helpers/redux_form';
import { editPassword } from './../../actions/user';
import { InvalidPassword } from './../../errors/user';

class EditPassword extends User {
    state = { validated: false, submitDisabled: false, success: false };

    submitForm(values, dispatch) {
        const { editPassword } = this.props;
        dispatch(clearSubmitErrors('editPassword'));
        return new Promise((resolve, reject) => {
            const errors = validate(values, this.props);
            if (Object.keys(errors).length > 0) { // or Boolean(Object.keys(errors)[0])
                reject(new SubmissionError(errors));
            } else {
                resolve(values);
            }
        }).then(async ({current_password, password}) => {
            this.setState({validated: true, submitDisabled: true});
            try {
                await editPassword(current_password, password);
                this.setState({success: true});
            } catch(e) {
                this.setState({success: false});
                if (e instanceof InvalidPassword) {
                    return Promise.reject(new SubmissionError({
                        '_error': 'პაროლის შეცვლა ვერ მოხერხდა',
                        'current_password': 'არასწორი მიმდინარე პაროლი',
                    }));
                }
                return Promise.reject(new SubmissionError({
                    '_error': 'პაროლის შეცვლა ვერ მოხერხდა',
                    'current_password': true,
                    'password': true,
                    'password_confirmation': true
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
                <span>Edit password</span>
                <div>
                    <form onSubmit={this.props.handleSubmit(this.submitForm.bind(this))} validated={validated}
                          noValidate>
                        <div>
                            <strong>
                                პაროლის ცვლილება
                            </strong>

                            { error && <p className="text-danger">{error}</p>}
                            { success && <p className="text-success">OK</p>}

                            {currentUser.encrypted_password ? (
                                <Field name="current_password" type="password" label="მიმდინარე პაროლი" placeholder="თქვენი ამჟამინდელი პაროლი"
                                       component={renderField} />
                            ) : null}

                            <Field name="password" type="password" label="ახალი პაროლი" placeholder="ახალი პაროლი"
                                   component={renderField} />
                            <Field name="password_confirmation" type="password" label="გაიმეორეთ პაროლი" placeholder="გაიმეორეთ ახალი პაროლი"
                                   component={renderField} />
                            <div className="text-right" style={{marginTop: '15px'}}>
                                <button disabled={submitDisabled} type="submit" color="primary" style={{marginTop: '10px'}}>
                                    { submitDisabled ? 'იტვირთება...' : 'პაროლის შეცვლა' }
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

    if (props.currentUser.password_secured) {
        if (!values.current_password) {
            errors.current_password = 'მიმდინარე პაროლი ცარიელია';
        } else if (values.current_password.length < 6) {
            errors.current_password = 'მიმდინარე პაროლი მოკლეა (5 სიმ.)'
        }
    }

    if (!values.password) {
        errors.password = 'პაროლი ცარიელია';
    } else if (values.password.length < 6) {
        errors.password = 'პაროლი მოკლეა (5 სიმ.)'
    }

    if (values.password_confirmation !== values.password) {
        errors.password_confirmation = 'პაროლები ერთმანეთს არ ემთხვევა';
    }

    return errors;
};

export default reduxForm({
    form: 'editPassword',
    persistentSubmitErrors: true
})(connect(null, {editPassword})((withUser({
    protected: true,
    redirectProtected: '/sign_in'
})(EditPassword))));

