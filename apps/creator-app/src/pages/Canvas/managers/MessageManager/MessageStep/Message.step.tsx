import { NodeSystemPortType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ResponseMapFirstVariantByResponseIDContext } from '@/pages/Canvas/contexts/ReduxContexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { ResponseStepPlaceholder } from './MessageStepPlaceholder.component';
import { ResponseStepTextVariant } from './MessageStepTextVariant.component';

export const MessageStep: ConnectedStep<Realtime.NodeData.Response> = ({ data, ports, palette }) => {
  const { responseID } = data;
  const responseMapFirstVariantByResponseID = React.useContext(ResponseMapFirstVariantByResponseIDContext)!;
  const message = responseID ? responseMapFirstVariantByResponseID[responseID] : null;
  const nextPortID = ports.out.byKey[NodeSystemPortType.NEXT];

  if (!message) {
    return <ResponseStepPlaceholder nextPortID={nextPortID} palette={palette} nodeID={data.nodeID} />;
  }

  return <ResponseStepTextVariant message={message} nextPortID={nextPortID} palette={palette} nodeID={data.nodeID} />;
};
