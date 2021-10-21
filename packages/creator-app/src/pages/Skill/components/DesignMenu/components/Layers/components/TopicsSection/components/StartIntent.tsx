import React from 'react';

import * as Creator from '@/ducks/creator';
import * as Router from '@/ducks/router';
import * as Version from '@/ducks/version';
import { useDispatch, useEventualEngine, useSelector } from '@/hooks';
import { Nullable } from '@/types';

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
  const isRootDiagramActive = useSelector(Version.isRootDiagramActiveSelector);

  const onClickRootItem = () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    if (isActive) {
      engine.focusHome({ open: true });
    } else {
      goToDiagram(diagramID, 'start');
    }
  };

  return (
    <IntentContainer isActive={isRootDiagramActive && startNodeID === focusedNodeID} onClick={onClickRootItem}>
      Project starts here
    </IntentContainer>
  );
};

export default StartIntent;
