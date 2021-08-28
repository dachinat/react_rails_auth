import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import User from './index';
import { withUser } from './../../hoc/withUser';
import { checkRecoveryToken } from './../../actions/user';
import { InvalidToken } from './../../errors/user';
import RecoveryForm from './RecoveryForm';

class Recover extends User {
    state = { invalidToken: false, error: false };

    async componentDidMount() {
        const { checkRecoveryToken } = this.props;
        const { token } = this.props.match.params;
        try {
            await checkRecoveryToken(token);
            this.setState({success: true});
        } catch(e) {
            if (e instanceof InvalidToken) return this.setState({invalidToken: true});
            console.log(e);
            this.setState({error: true});
        }
    }

    render() {
        const { invalidToken, error, success } = this.state;

        return (
            <div>
                {
                   invalidToken ? (
                        <div>
                            <div>
                                <strong>არასწორი კოდი, სცადეთ ახლიდან</strong>
                            </div>
                            <div>
                                <Link to="/send_recovery">მიიღეთ ინსტრუქციები ახლიდან</Link>
                            </div>
                        </div>
                    ) : error ? (
                        <div>
                            <div>
                                <strong>წარმოიშვა ამოუცნობი შეცდომა</strong>
                            </div>
                            <div>
                                <Link to="/send_recovery">მიიღეთ ინსტრუქციები ახლიდან</Link>
                            </div>
                        </div>
                    ) : success ? (
                        <div>
                            <div>
                                <strong>კოდი სწორია დააყენეთ ახალი პაროლი</strong>
                                <div>
                                    <RecoveryForm {...this.props} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div>
                                <strong>იტვირთება</strong>
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

export default connect(null, {checkRecoveryToken})((withUser({
    noAuthorized: true,
    redirectAuthorized: '/current_user'
})(Recover)));

