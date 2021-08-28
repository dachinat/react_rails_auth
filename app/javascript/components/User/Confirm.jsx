import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import User from './index';
import { withUser } from './../../hoc/withUser';
import { confirm } from './../../actions/user';
import { AlreadyConfirmed, InvalidToken } from './../../errors/user';

class Confirm extends User {
    state = { alreadyConfirmed: false, invalidToken: false, error: false };

    async componentDidMount() {
        const {  confirm } = this.props;
        const { token } = this.props.match.params;
        try {
            await confirm(token);
            this.setState({success: true});
        } catch(e) {
            if (e instanceof AlreadyConfirmed) return this.setState({alreadyConfirmed: true});
            if (e instanceof InvalidToken) return this.setState({invalidToken: true});
            this.setState({error: true});
        }
    }

    render() {
        const { alreadyConfirmed, invalidToken, error, success } = this.state;

        return (
            <div>
                {
                    alreadyConfirmed ? (
                        <div>
                            <div>
                                <strong>ეს ანგარიში უკვე დამოწმებულია</strong>
                            </div>
                            <div>
                                <Link to="/sign_in">გაიარეთ ავტორიზაცია</Link>
                            </div>
                        </div>
                    ) : invalidToken ? (
                        <div>
                            <div>
                                <strong>არასწორი კოდი, სცადეთ ახლიდან</strong>
                            </div>
                            <div>
                                <Link to="/send_confirmation">მიიღეთ ინსტრუქციები ახლიდან</Link>
                            </div>
                        </div>
                    ) : error ? (
                        <div>
                            <div>
                                <strong>წარმოიშვა ამოუცნობი შეცდომა</strong>
                            </div>
                            <div>
                                <Link to="/send_confirmation">მიიღეთ ინსტრუქციები ახლიდან</Link>
                            </div>
                        </div>
                    ) : success ? (
                        <div>
                            <div>
                                <strong>თქვენი ანგარიში დამოწმდა</strong>
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

export default connect(null, {confirm})((withUser({})(Confirm)));

