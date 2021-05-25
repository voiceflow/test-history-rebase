import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { CanvasGoHome } from '@/pages/Canvas/components/CanvasControls/components';
import { useEditingMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { ConnectedProps } from '@/types';

type FlowControlsProps = {
  render: boolean;
};

const FlowControls: React.FC<FlowControlsProps & ConnectedFlowControlsProps> = ({ render, flow, isRootDiagram }) => {
  const isPrototypingMode = usePrototypingMode();
  const isEditingMode = useEditingMode();
  const showFlowControls = !isPrototypingMode && !isRootDiagram && flow;

  if (!showFlowControls || !render) return null;

  return (
    <>
      <CanvasGoHome withMenu={false} withDrawer={isEditingMode} />
    </>
  );
};

const mapStateToProps = {
  flow: Diagram.activeDiagramStructureSelector,
  isRootDiagram: Version.isRootDiagramActiveSelector,
};

type ConnectedFlowControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(FlowControls) as React.FC<FlowControlsProps>;
