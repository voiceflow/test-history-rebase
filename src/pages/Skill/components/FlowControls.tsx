import React from 'react';

import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { CanvasGoHome } from '@/pages/Canvas/components/CanvasControls/components';
import FlowBar from '@/pages/Canvas/components/FlowBar';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { activeFlowStructureSelector } from '@/store/selectors';
import { ConnectedProps } from '@/types';

const FlowBarComponent = FlowBar as React.FC<any>;

const FlowControls: React.FC<ConnectedFlowControlsProps> = ({ flow, isRootDiagram }) => {
  const { canEdit, isPrototyping } = React.useContext(EditPermissionContext)!;
  const showFlowControls = !isPrototyping && !isRootDiagram && flow;

  if (!showFlowControls) return null;

  return (
    <>
      <CanvasGoHome withMenu={false} withDrawer={canEdit} />
      <FlowBarComponent withMenu withDrawer={canEdit} flow={flow} />
    </>
  );
};

const mapStateToProps = {
  flow: activeFlowStructureSelector,
  isRootDiagram: Skill.isRootDiagramSelector,
};

type ConnectedFlowControlsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(FlowControls);
