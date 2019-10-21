import React from 'react';
import { Redirect } from 'react-router-dom';

import { authTokenSelector } from '@/ducks/session';
import { connect } from '@/hocs';

class PublicComponent extends React.Component {
  shouldComponentUpdate(prevProps) {
    return prevProps.location !== this.props.location;
  }

  render() {
    const { authToken, component: Component, ...props } = this.props;

    return authToken ? (
      <Redirect
        to={{
          pathname: '/dashboard',
          search: props.location.search,
          state: { from: props.location },
        }}
      />
    ) : (
      <Component {...props} />
    );
  }
}

const mapStateToProps = {
  authToken: authTokenSelector,
};

export default connect(mapStateToProps)(PublicComponent);
