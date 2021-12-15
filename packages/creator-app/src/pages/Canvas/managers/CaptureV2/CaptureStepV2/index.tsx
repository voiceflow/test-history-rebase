import { Models, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { getPlatformNewSlotsCreator } from '@/ducks/intent/utils';
import Step, { ConnectedStep, Item, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';
import { SlotMapContext } from '@/pages/Canvas/contexts';

import { NODE_CONFIG } from '../constants';

export interface CaptureStepProps {
  nodeID: string;
  slots: (Realtime.IntentSlot & { slot?: Realtime.Slot })[];
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatch?: Nullable<Realtime.NodeData.NoMatch>;
  nextPortID: string;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({ slots, nodeID, nextPortID, noReply, noMatch, noMatchPortID, noReplyPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      {slots.map((slot, index) => {
        const isLast = index === slots.length - 1;
        const name = slot.slot?.name;
        return (
          <Item
            key={index}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={name && `Capture {${name}}`}
            portID={isLast ? nextPortID : null}
            placeholder="Select entity to capture"
          />
        );
      })}

      {noMatch && <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />}
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({ data, node, platform }) => {
  const slotMap = React.useContext(SlotMapContext)!;
  const slots = data.intent?.slots.map((intentSlot) => ({ ...intentSlot, slot: slotMap[intentSlot.id] }));

  return (
    <CaptureStep
      slots={slots?.length ? slots : [getPlatformNewSlotsCreator(platform)('')]}
      nodeID={data.nodeID}
      noReply={data.noReply}
      noMatch={data.noMatch}
      nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
      noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
      noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
    />
  );
};

export default ConnectedCaptureStep;
