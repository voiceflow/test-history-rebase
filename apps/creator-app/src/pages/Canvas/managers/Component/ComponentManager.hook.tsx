import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import perf, { PerfAction } from '@/performance';

import { DiagramMapContext } from '../../contexts';

interface useGoToDiagramProps {
  diagramID: string | null | undefined;
  activeNodeID: string;
}

export const useGoToDiagram = ({ diagramID, activeNodeID }: useGoToDiagramProps) => {
  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);
  const diagramMap = React.useContext(DiagramMapContext)!;

  return () => {
    if (diagramID && diagramMap[diagramID]) {
      perf.action(PerfAction.COMPONENT_NODE__LINK_CLICK);

      goToDiagramHistoryPush(diagramID, undefined, activeNodeID);
    }
  };
};
