import React from 'react';

import LoadingGate from '@/components/LoadingGate';
import { FeatureFlag } from '@/config/features';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Prototype from '@/ducks/prototype';
import * as Session from '@/ducks/session';
import { withFeatureSwitcher } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

import DiagramSubscriptionGate from './DiagramSubscriptionGate';

const DiagramLoadingGate: React.FC = ({ children }) => {
  const loadDiagram = useDispatch(Creator.initializeCreatorForActiveDiagram);
  const prototypeMode = useSelector(Prototype.activePrototypeModeSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const creatorDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  React.useEffect(() => {
    if (!creatorDiagramID || activeDiagramID !== creatorDiagramID) {
      loadDiagram();
    }
  }, [activeDiagramID, creatorDiagramID]);

  return (
    <LoadingGate
      key={creatorDiagramID}
      label="Diagrams"
      isLoaded={!!creatorDiagramID}
      withoutSpinner={prototypeMode === Prototype.PrototypeMode.DISPLAY}
    >
      {children}
    </LoadingGate>
  );
};

export default withFeatureSwitcher(FeatureFlag.ATOMIC_ACTIONS_PHASE_2, DiagramSubscriptionGate)(DiagramLoadingGate);
