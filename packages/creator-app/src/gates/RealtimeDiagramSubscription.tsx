import React from 'react';

import * as Session from '@/ducks/session';
import { useDiagramSubscription, useSelector } from '@/hooks';

const RealtimeDiagramSubscription: React.FC = () => {
  const diagramID = useSelector(Session.activeDiagramIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);

  useDiagramSubscription(projectID, diagramID);

  return null;
};

export default RealtimeDiagramSubscription;
