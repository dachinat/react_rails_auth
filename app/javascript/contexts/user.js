import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const UserContext = React.createContext();

const UserProvider = props => {
    const {userSignedIn, currentUser} = props.user;

    return (
        <UserContext.Provider value={{userSignedIn, currentUser}}>
            {props.children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    user: PropTypes.object.isRequired,
    children: PropTypes.node
};

const UserConsumer = props => {
    return (
        <UserContext.Consumer>
            {props.children}
        </UserContext.Consumer>
    );
};

UserConsumer.propTypes = {
    children: PropTypes.func
};

export default UserContext;
export const Provider = connect(({user}) => ({user}))(UserProvider);
export const Consumer = UserConsumer;
