import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getAuth } from '../ducks/account';

class PublicComponent extends Component {
  shouldComponentUpdate(prevProps) {
    return prevProps.location !== this.props.location;
  }

  render() {
    const props = this.props;
    return getAuth() ? (
      <Redirect
        to={{
          pathname: '/dashboard',
          search: props.location.search,
          state: { from: props.location },
        }}
      />
    ) : (
      <props.component {...props} />
    );
  }
}

export default connect(
  null,
  { getAuth }
)(PublicComponent);
