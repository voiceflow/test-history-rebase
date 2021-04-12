import React from 'react';

import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { CanvasGoHome } from '@/pages/Canvas/components/CanvasControls/components';
import { useEditingMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { activeFlowStructureSelector } from '@/store/selectors';
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
  flow: activeFlowStructureSelector,
  isRootDiagram: Skill.isRootDiagramSelector,
};

type ConnectedFlowControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(FlowControls) as React.FC<FlowControlsProps>;
