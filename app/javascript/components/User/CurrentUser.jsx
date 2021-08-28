import React, { Component } from 'react';
import { connect } from 'react-redux';

import User from './index';
import { withUser } from './../../hoc/withUser';

class CurrentUser extends User {
    componentDidMount() {
    }

    render() {
        return (
          <div>
              User: {JSON.stringify(this.props.currentUser, undefined, 2)}
          </div>
        );
    }
}

export default withUser({})(CurrentUser);