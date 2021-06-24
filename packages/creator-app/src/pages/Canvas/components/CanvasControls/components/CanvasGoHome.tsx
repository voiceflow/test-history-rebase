import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import FlowControlsContainer, { FlowControlsContainerProps } from './FlowControlsContainer';
import HomeButton from './HomeButton';

export type CanvasGoHomeProps = FlowControlsContainerProps;

const CanvasGoHome: React.FC<CanvasGoHomeProps & ConnectedCanvasGoHomeProps> = ({ goToRootDiagram, ...props }) => (
  <FlowControlsContainer {...props}>
    <HomeButton onClick={goToRootDiagram}>
      <SvgIcon icon="returnHome" size={13} color="currentColor" />
      <span>Home</span>
    </HomeButton>
  </FlowControlsContainer>
);

const mapDispatchToProps = {
  goToRootDiagram: Router.goToRootDiagram,
};

type ConnectedCanvasGoHomeProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(CanvasGoHome) as React.FC<CanvasGoHomeProps>;
