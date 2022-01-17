import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import OverflowTippyTooltip from '@/components/OverflowTippyTooltip';
import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import { useDispatch, useEventualEngine, useSelector } from '@/hooks';

import IntentContainer from './IntentContainer';

interface StartIntentProps {
  isActive?: boolean;
  diagramID: string;
  focusedNodeID: Nullable<string>;
}

const StartIntent: React.FC<StartIntentProps> = ({ isActive, diagramID, focusedNodeID }) => {
  const getEngine = useEventualEngine();
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const startNodeID = useSelector(Creator.startNodeIDSelector);
  const getStartNodeData = useSelector(Creator.dataByNodeIDSelector);
  const isRootDiagramActive = useSelector(Creator.isRootDiagramActiveSelector);

  const onClickRootItem = () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    if (isActive) {
      engine.focusStart({ open: true });
    } else {
      goToDiagram(diagramID, 'start');
    }
  };

  const startNodeData = startNodeID ? getStartNodeData<Realtime.NodeData.Start>(startNodeID) : null;

  const startIntentLabel = startNodeData?.label || 'Project starts here';

  return (
    <OverflowTippyTooltip title={startIntentLabel}>
      {(ref) => (
        <IntentContainer ref={ref} isActive={isRootDiagramActive && startNodeID === focusedNodeID} onClick={onClickRootItem}>
          {startIntentLabel}
        </IntentContainer>
      )}
    </OverflowTippyTooltip>
  );
};

export default StartIntent;
