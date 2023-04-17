import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ConnectedAction, ConnectedActionProps } from '../../types';
import ApiAction from './Api/Action';

const Action: ConnectedAction<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  if (props.data.selectedIntegration !== BaseNode.Utils.IntegrationType.CUSTOM_API) return null;

  return <ApiAction {...(props as ConnectedActionProps<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts>)} />;
};

export default Action;
