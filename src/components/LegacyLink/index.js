// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

function Link(props) {
  const { to, onRef, match, history, location, staticContext, component: Component, ...ownProps } = props;

  return <Component ref={onRef} onClick={() => history.push(to)} {...ownProps} />;
}

Link.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onRef: PropTypes.func,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

Link.defaultProps = {
  component: 'div',
};

export default withRouter(Link);
