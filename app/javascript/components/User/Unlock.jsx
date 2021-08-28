import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import User from './index';
import { withUser } from './../../hoc/withUser';
import { unlock } from './../../actions/user';
import { InvalidToken } from './../../errors/user';

class Unlock extends User {
    state = { invalidToken: false, error: false };

    async componentDidMount() {
        const { unlock } = this.props;
        const { token } = this.props.match.params;
        try {
            await unlock(token);
            this.setState({success: true});
        } catch(e) {
            if (e instanceof InvalidToken) return this.setState({invalidToken: true});
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
                                <Link to="/send_unlock">მიიღეთ ინსტრუქციები ახლიდან</Link>
                            </div>
                        </div>
                    ) : error ? (
                        <div>
                            <div>
                                <strong>წარმოიშვა ამოუცნობი შეცდომა</strong>
                            </div>
                            <div>
                                <Link to="/send_unlock">მიიღეთ ინსტრუქციები ახლიდან</Link>
                            </div>
                        </div>
                    ) : success ? (
                        <div>
                            <div>
                                <strong>თქვენი ანგარიში აღარაა დაბლოკილი</strong>
                            </div>
                            <div>
                                <Link to="/sign_in">ახლა შეგიძლიათ გაიაროთ ავტორიზაცია</Link>
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

export default connect(null, {unlock})((withUser({
    noAuthorized: true,
    redirectAuthorized: '/current_user'
})(Unlock)));

