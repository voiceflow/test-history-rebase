import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { connect } from '@/hocs';

import { Container, Warning } from './components';

const CanvasNotifications = ({ errors }) => (
  <Container>
    <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
      {errors.map((error, index) => (
        <Warning error={error} index={index} key={index} />
      ))}
    </ReactCSSTransitionGroup>
  </Container>
);

const mapStateToProps = (state) => ({
  errors: state.userSetting.canvasError,
});

export default connect(mapStateToProps)(CanvasNotifications);
