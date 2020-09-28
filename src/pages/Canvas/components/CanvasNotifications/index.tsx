import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import * as User from '@/ducks/user';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { Container, Warning } from './components';

const FadeTransition: React.FC = (props) => <CSSTransition {...props} classNames="fade" timeout={{ enter: 500, exit: 300 }} />;

const CanvasNotifications: React.FC<ConnectedCanvasNotificationsProps> = ({ errors }) => (
  <Container>
    <TransitionGroup>
      {errors.map((error, index) => (
        <FadeTransition key={index}>
          <Warning error={error} index={index} />
        </FadeTransition>
      ))}
    </TransitionGroup>
  </Container>
);

const mapStateToProps = {
  errors: User.canvasErrorSelector,
};

type ConnectedCanvasNotificationsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(CanvasNotifications);
