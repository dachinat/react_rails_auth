import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import CurrentUser from './User/CurrentUser';
import SignIn from './User/SignIn';
import SignUp from './User/SignUp';
import SendConfirmation from './User/SendConfirmation';
import Confirm from './User/Confirm';
import SendRecovery from './User/SendRecovery';
import Recover from './User/Recover';
import SendUnlock from './User/SendUnlock';
import Unlock from './User/Unlock';
import EditPassword from './User/EditPassword';
import EditEmail from './User/EditEmail';
import { Provider as UserProvider } from './../contexts/user';
import {signOut} from "../actions/user";

const App = (props) => {
    return (
        <UserProvider>
            <HashRouter>
                {props.userSignedIn ? <button onClick={props.signOut}>Sign out</button> : null}
                <div>React Rails Auth</div>
                <div>
                    <Route path="/current_user/" component={CurrentUser}/>
                    <Route path="/sign_in" render={()=><SignIn {...props} />}/>
                    <Route path="/sign_up" component={SignUp}/>
                    <Route path="/send_confirmation" component={SendConfirmation}/>
                    <Route path="/confirm/:token" render={()=><Confirm {...props} />}/>
                    <Route path="/send_recovery" component={SendRecovery}/>
                    <Route path="/recover/:token" render={()=><Recover {...props} />}/>
                    <Route path="/send_unlock" component={SendUnlock}/>
                    <Route path="/unlock/:token" render={()=><Unlock {...props} />}/>
                    <Route path="/edit_password" component={EditPassword}/>
                    <Route path="/edit_email" component={EditEmail} />
                </div>
                <div>
                    <nav>
                        <Link to="/current_user/">CurrentUser</Link><br/>
                        <Link to="/sign_in/">SignIn</Link><br/>
                        <Link to="/sign_up/">SignUp</Link><br/>
                        <Link to="/send_confirmation/">SendConfirmation</Link><br/>
                        <Link to="/send_recovery/">Reset password</Link><br/>
                        <Link to="/send_unlock/">Unlock</Link><br/>
                        <Link to="/edit_password/">Edit password</Link><br/>
                        <Link to="/edit_email/">Edit email</Link><br/>
                    </nav>
                </div>
            </HashRouter>
        </UserProvider>
    )
};

const mapStateToProps = ({user}) => {
    return { userSignedIn: user.userSignedIn };
}

export default connect(mapStateToProps, {signOut})(App);