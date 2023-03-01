import { BaseModels } from '@voiceflow/base-types';
import { Snackbar, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import * as Creator from '@/ducks/creator';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';

const ReturnToInstanceSnackbar: React.FC = () => {
  const snackbar = Snackbar.useSnackbar();
  const activeDiagram = useSelector(DiagramV2.active.diagramSelector);
  const goToComponentInstance = useDispatch(Router.goToDiagramHistoryPop);
  const { diagramID, nodeID } = useSelector(Creator.previousDiagramHistoryStateSelector) ?? {};

  React.useEffect(() => {
    if (activeDiagram?.type === BaseModels.Diagram.DiagramType.COMPONENT && diagramID && nodeID) {
      snackbar.open();
    }
  }, [diagramID, nodeID, activeDiagram]);

  if (!snackbar.isOpen) return null;

  return (
    <Snackbar showOverlay>
      <Snackbar.ClickableBody onClick={goToComponentInstance}>
        <Snackbar.Icon icon="systemBack" />

        <Snackbar.Text>Return to Instance</Snackbar.Text>
      </Snackbar.ClickableBody>

      <Snackbar.DarkButton onClick={stopPropagation(snackbar.close)} icon="close" iconProps={{ size: 14 }} />
    </Snackbar>
  );
};

export default ReturnToInstanceSnackbar;
