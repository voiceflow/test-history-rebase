import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';

import FlowControlsContainer, { FlowControlsContainerProps } from './FlowControlsContainer';
import HomeButton from './HomeButton';

export type CanvasGoHomeProps = FlowControlsContainerProps & {
  goToRootDiagram: () => void;
};

const CanvasGoHome: React.FC<CanvasGoHomeProps> = ({ goToRootDiagram, ...props }) => (
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

export default connect(null, mapDispatchToProps)(CanvasGoHome);
