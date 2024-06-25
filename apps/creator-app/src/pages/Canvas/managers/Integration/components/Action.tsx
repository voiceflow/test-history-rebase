import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { ConnectedAction, ConnectedActionProps } from '../../types';
import ApiAction from './Api/Action';

const Action: ConnectedAction<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  return (
    <ApiAction
      {...(props as ConnectedActionProps<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>)}
    />
  );
};

export default Action;
