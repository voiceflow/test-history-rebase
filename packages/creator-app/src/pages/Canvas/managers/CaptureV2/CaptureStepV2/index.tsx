import { BaseModels, BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
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
  captureType: BaseNode.CaptureV2.CaptureType;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  palette: HSLShades;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({
  slots,
  nodeID,
  noReply,
  noMatch = null,
  palette,
  variable,
  nextPortID,
  captureType,
  noMatchPortID,
  noReplyPortID,
}) => (
  <Step nodeID={nodeID}>
    <Section>
      {captureType === BaseNode.CaptureV2.CaptureType.QUERY ? (
        <CaptureItem
          isLast
          isFirst
          label={
            <>
              Capture user reply{' '}
              {variable && (
                <>
                  to <Text>{`{${variable}}`}</Text>
                </>
              )}
            </>
          }
          nextPortID={nextPortID}
          palette={palette}
        />
      ) : (
        slots.map((slot, index) => (
          <CaptureItem key={index} isFirst={index === 0} isLast={index === slots.length - 1} slot={slot} nextPortID={nextPortID} palette={palette} />
        ))
      )}

      <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({
  data,
  ports,
  palette,
  projectType,
}) => {
  const slotMap = React.useContext(SlotMapContext)!;
  const slots = data.intent?.slots.map((intentSlot) => ({ ...intentSlot, slot: slotMap[intentSlot.id] }));

  return (
    <CaptureStep
      slots={slots?.length ? slots : [Realtime.Utils.slot.intentSlotFactoryCreator(projectType)({ id: '' })]}
      nodeID={data.nodeID}
      noReply={data.noReply}
      noMatch={data.noMatch}
      palette={palette}
      variable={data.variable}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      captureType={data.captureType}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
    />
  );
};

export default ConnectedCaptureStep;
