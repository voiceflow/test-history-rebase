import { stopPropagation, System } from '@voiceflow/ui';
import React from 'react';

import * as Creator from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { isComponentDiagram } from '@/utils/diagram.utils';

const ReturnToInstanceSnackbar: React.FC = () => {
  const activeDiagram = useSelector(DiagramV2.active.diagramSelector);
  const goToComponentInstance = useDispatch(Router.goToDiagramHistoryPop);
  const { diagramID, nodeID } = useSelector(Creator.previousDiagramHistoryStateSelector) ?? {};

  const snackbar = System.Snackbar.useAPI();

  React.useEffect(() => {
    if (isComponentDiagram(activeDiagram?.type) && diagramID && nodeID) {
      snackbar.open();
    }
  }, [diagramID, nodeID, activeDiagram]);

  if (!snackbar.isOpen) return null;

  return (
    <System.Snackbar.Base onClick={goToComponentInstance}>
      <System.Snackbar.Icon icon="systemBack" />

      <System.Snackbar.Text>Return to Instance</System.Snackbar.Text>

      <System.Snackbar.CloseButton onClick={stopPropagation(snackbar.close)} />
    </System.Snackbar.Base>
  );
};

export default ReturnToInstanceSnackbar;
