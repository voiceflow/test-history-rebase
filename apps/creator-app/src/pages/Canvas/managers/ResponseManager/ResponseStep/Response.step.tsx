import { NodeSystemPortType } from '@voiceflow/dtos';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ResponseMapFirstVariantByResponseIDContext } from '@/pages/Canvas/contexts/ReduxContexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isTextResponseVariant } from '@/utils/response.util';

import { ResponseStepPlaceholder } from './ResponseStepPlaceholder.component';
import { ResponseStepTextVariant } from './ResponseStepTextVariant.component';

export const ResponseStep: ConnectedStep<Realtime.NodeData.Response> = ({ data, ports, palette }) => {
  const { responseID } = data;
  const responseMapFirstVariantByResponseID = React.useContext(ResponseMapFirstVariantByResponseIDContext)!;
  const variant = responseID ? responseMapFirstVariantByResponseID[responseID] : null;
  const nextPortID = ports.out.byKey[NodeSystemPortType.NEXT];

  if (!variant) {
    return <ResponseStepPlaceholder nextPortID={nextPortID} palette={palette} nodeID={data.nodeID} />;
  }

  if (isTextResponseVariant(variant)) {
    return <ResponseStepTextVariant variant={variant} nextPortID={nextPortID} palette={palette} nodeID={data.nodeID} />;
  }

  return null;
};
