import React from 'react';

import { goToDiagram } from '@/ducks/router';
import { connect } from '@/hocs';
import { stopPropagation } from '@/utils/dom';

import EnterFlowButton from './FlowButton';

const EnterFlow = ({ goToDiagram }) => (
  <EnterFlowButton variant="secondary" onClick={stopPropagation(goToDiagram)}>
    Enter Flow
  </EnterFlowButton>
);

const mapDispatchToProps = {
  goToDiagram,
};

const mergeProps = (_, { goToDiagram }, { diagramID }) => ({
  goToDiagram: () => goToDiagram(diagramID),
});

export default connect(
  null,
  mapDispatchToProps,
  mergeProps
)(EnterFlow);
