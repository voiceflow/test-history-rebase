import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { OverflowTippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
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

  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const startNodeData = useSelector(CreatorV2.nodeDataByIDSelector, { id: startNodeID }) as Realtime.NodeData<Realtime.NodeData.Start> | null;
  const isRootDiagramActive = useSelector(CreatorV2.isRootDiagramActiveSelector);

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
