import { BaseModels, BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Section } from '@/pages/Canvas/components/Step';

export interface CardStepV2Props {
  nodeID: string;
  variant: BlockVariant;

  cards: BaseNode.CardV2.Card[];
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const CardStepV2: React.FC<CardStepV2Props> = ({ nodeID }) => (
  <Step nodeID={nodeID}>
    <Section></Section>
  </Step>
);

const ConnectedCardStepV2: ConnectedStep<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = ({ ports, data, variant }) => {
  return (
    <CardStepV2
      nodeID={data.nodeID}
      cards={data.cards}
      noMatch={data.noMatch}
      noReply={data.noReply}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      variant={variant}
    />
  );
};

export default ConnectedCardStepV2;
