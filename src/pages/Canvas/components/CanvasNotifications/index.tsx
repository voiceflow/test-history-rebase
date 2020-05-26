import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import * as User from '@/ducks/user';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { Container, Warning } from './components';

const CanvasNotifications: React.FC<ConnectedCanvasNotificationsProps> = ({ errors }) => (
  <Container>
    <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
      {errors.map((error, index) => (
        <Warning error={error} index={index} key={index} />
      ))}
    </ReactCSSTransitionGroup>
  </Container>
);

const mapStateToProps = {
  errors: User.canvasErrorSelector,
};

type ConnectedCanvasNotificationsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(CanvasNotifications);
