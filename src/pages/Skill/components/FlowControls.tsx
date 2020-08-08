import React from 'react';

import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { CanvasGoHome } from '@/pages/Canvas/components/CanvasControls/components';
import FlowBar from '@/pages/Canvas/components/FlowBar';
import { useEditingMode, usePrototypingMode } from '@/pages/Skill/hooks';
import { activeFlowStructureSelector } from '@/store/selectors';
import { ConnectedProps } from '@/types';

const FlowBarComponent = FlowBar as React.FC<any>;

const FlowControls: React.FC<ConnectedFlowControlsProps> = ({ flow, isRootDiagram }) => {
  const isPrototypingMode = usePrototypingMode();
  const isEditingMode = useEditingMode();
  const showFlowControls = !isPrototypingMode && !isRootDiagram && flow;

  if (!showFlowControls) return null;

  return (
    <>
      <CanvasGoHome withMenu={false} withDrawer={isEditingMode} />
      <FlowBarComponent withMenu withDrawer={isEditingMode} flow={flow} />
    </>
  );
};

const mapStateToProps = {
  flow: activeFlowStructureSelector,
  isRootDiagram: Skill.isRootDiagramSelector,
};

type ConnectedFlowControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(FlowControls);
