import { Models, Node, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import { getPlatformNewSlotsCreator } from '@/ducks/intent/utils';
import Step, { ConnectedStep, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';
import { SlotMapContext } from '@/pages/Canvas/contexts';

import CaptureItem from './components/CaptureItem';

export interface CaptureStepProps {
  nodeID: string;
  slots: (Realtime.IntentSlot & { slot?: Realtime.Slot })[];
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatch?: Nullable<Realtime.NodeData.NoMatch>;
  variable?: Nullable<string>;
  nextPortID: string;
  captureType: Node.CaptureV2.CaptureType;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  variant: BlockVariant;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({
  slots,
  nodeID,
  nextPortID,
  noReply,
  noMatch,
  variable,
  captureType,
  noMatchPortID,
  noReplyPortID,
  variant,
}) => (
  <Step nodeID={nodeID}>
    <Section>
      {captureType === Node.CaptureV2.CaptureType.QUERY ? (
        <CaptureItem isLast isFirst label={`Capture user reply ${variable ? `to {${variable}}` : ''}`} nextPortID={nextPortID} variant={variant} />
      ) : (
        slots.map((slot, index) => (
          <CaptureItem key={index} isFirst={index === 0} isLast={index === slots.length - 1} slot={slot} nextPortID={nextPortID} variant={variant} />
        ))
      )}
      {noMatch && <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />}
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({
  data,
  node,
  platform,
  variant,
}) => {
  const slotMap = React.useContext(SlotMapContext)!;
  const slots = data.intent?.slots.map((intentSlot) => ({ ...intentSlot, slot: slotMap[intentSlot.id] }));

  return (
    <CaptureStep
      slots={slots?.length ? slots : [getPlatformNewSlotsCreator(platform)('')]}
      nodeID={data.nodeID}
      noReply={data.noReply}
      noMatch={data.noMatch}
      variable={data.variable}
      nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
      captureType={data.captureType}
      noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
      noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
      variant={variant}
    />
  );
};

export default ConnectedCaptureStep;
