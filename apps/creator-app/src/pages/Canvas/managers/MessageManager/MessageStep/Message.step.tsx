import { NodeSystemPortType } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ResponseMapFirstMessageByResponseIDContext } from '@/pages/Canvas/contexts/ReduxContexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { ResponseStepPlaceholder } from './MessageStepPlaceholder.component';
import { ResponseStepTextVariant } from './MessageStepTextVariant.component';

export const MessageStep: ConnectedStep<Realtime.NodeData.Message> = ({ data, ports, palette }) => {
  const { messageID: responseID } = data;
  const responseMapFirstVariantByResponseID = React.useContext(ResponseMapFirstMessageByResponseIDContext)!;
  const message = responseID ? responseMapFirstVariantByResponseID[responseID] : null;
  const nextPortID = ports.out.byKey[NodeSystemPortType.NEXT];

  if (!message) {
    return <ResponseStepPlaceholder nextPortID={nextPortID} palette={palette} nodeID={data.nodeID} />;
  }

  return <ResponseStepTextVariant message={message} nextPortID={nextPortID} palette={palette} nodeID={data.nodeID} />;
};
