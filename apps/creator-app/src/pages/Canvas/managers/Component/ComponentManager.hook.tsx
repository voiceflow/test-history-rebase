import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';

import { DiagramMapContext } from '../../contexts';

interface UseGoToDiagramProps {
  diagramID: string | null | undefined;
  activeNodeID: string;
}

export const useGoToDiagram = ({ diagramID, activeNodeID }: UseGoToDiagramProps) => {
  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);
  const diagramMap = React.useContext(DiagramMapContext)!;

  return () => {
    if (diagramID && diagramMap[diagramID]) {
      goToDiagramHistoryPush(diagramID, undefined, activeNodeID);
    }
  };
};
