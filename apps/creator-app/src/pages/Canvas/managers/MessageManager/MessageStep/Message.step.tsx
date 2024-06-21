import { NodeSystemPortType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import {
  ResponseMapFirstVariantByResponseIDContext,
  ResponseVariantsByResponseIDContext,
} from '@/pages/Canvas/contexts/ReduxContexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { ResponseStepPlaceholder } from './MessageStepPlaceholder.component';
import { ResponseStepTextVariant } from './MessageStepTextVariant.component';

export const MessageStep: ConnectedStep<Realtime.NodeData.Message> = ({ data, ports, palette }) => {
  const { messageID: responseID } = data;
  const responseMapFirstVariantByResponseID = React.useContext(ResponseMapFirstVariantByResponseIDContext)!;
  const responseMapVariantsByResponseID = React.useContext(ResponseVariantsByResponseIDContext)!;

  const message = responseID ? responseMapFirstVariantByResponseID[responseID] : null;
  const variants = responseID ? responseMapVariantsByResponseID?.[responseID] : [];
  const nextPortID = ports.out.byKey[NodeSystemPortType.NEXT];

  if (!message) {
    return <ResponseStepPlaceholder nextPortID={nextPortID} palette={palette} nodeID={data.nodeID} />;
  }

  return (
    <ResponseStepTextVariant
      message={message}
      variants={variants}
      nextPortID={nextPortID}
      palette={palette}
      nodeID={data.nodeID}
    />
  );
};
