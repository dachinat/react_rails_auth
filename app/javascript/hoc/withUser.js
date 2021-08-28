import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Consumer as UserConsumer } from './../contexts/user';
import { withConsumer } from './withConsumer';

const getDisplayName = WrappedComponent => {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

const initialConfig = {
    protected: false,
    redirectProtected: null,
    noAuthorized: false,
    redirectAuthorized: null
};

export const withUser = (config = {}) => WrappedComponent => {
    config = Object.assign(Object.assign({}, initialConfig), config);

    class WithUser extends Component {
        state = {
            userSignedIn: null // Will redirect to noAuthorized when true
        };

        static WrappedComponent = WrappedComponent;

        static propTypes = {
            userSignedIn: PropTypes.bool,
            currentUser: PropTypes.object,
            history: PropTypes.object.isRequired,
        };

        static getDerivedStateFromProps(nextProps, prevState) {
            if (config.noAuthorized && nextProps.userSignedIn) {
                return {userSignedIn: true};
            } else if (config.protected && nextProps.userSignedIn === false) {
                return {userSignedIn: false};
            }
            return null;
        }

        componentDidMount() {
            console.log(this.props);
            const {userSignedIn} = this.props;
            // protected: true
            if (config.protected && userSignedIn === false) {
                this._handleUnauthorized();
            }
            // noAuthorized: true
            if (config.noAuthorized && userSignedIn) {
                this._handleAuthorized();
            }
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.state.userSignedIn && this.state.userSignedIn !== prevState.userSignedIn) {
                this._handleAuthorized(true);
            } else if (this.state.userSignedIn === false && this.state.userSignedIn !== prevState.userSignedIn) {
                this._handleUnauthorized(true);
            }
        }

        _handleUnauthorized(noText = false) {
            const { history } = this.props;
            if (!noText) alert('please authorize');
            history.push(config.redirectProtected);
        }

        _handleAuthorized(noText = false) {
            const { history } = this.props;
            if (!noText) alert('already logged in');
            history.push(config.redirectAuthorized);
        }

        render() {
            if ((!this.state.userSignedIn && !this.props.userSignedIn) && config.protected) return null;
            return <WrappedComponent {...this.props}/>;
        }
    }

    WithUser.displayName = `WithUser(${getDisplayName(WrappedComponent)})`;
    return withRouter(withConsumer(UserConsumer)(WithUser));
};