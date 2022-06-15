import { BaseModels, BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import Step, { NoMatchStepItemV2, NoReplyItemV2, Section } from '@/pages/Canvas/components/Step';
import { SlotMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformSlotIntoPrompt } from '@/pages/Canvas/utils';

import { CaptureSlot } from '../types';
import CaptureItem from './components/CaptureItem';

export interface CaptureStepProps {
  nodeID: string;
  slots: CaptureSlot[];
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatch?: Nullable<Realtime.NodeData.NoMatch>;
  variable?: Nullable<string>;
  nextPortID: string;
  captureType: BaseNode.CaptureV2.CaptureType;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  palette: HSLShades;
  onOpenEditor: () => void;
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
  onOpenEditor,
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
          onOpenEditor={onOpenEditor}
        />
      ) : (
        slots.map((slot, index) => (
          <CaptureItem
            key={index}
            isFirst={index === 0}
            isLast={index === slots.length - 1}
            slot={slot}
            nextPortID={nextPortID}
            palette={palette}
            onOpenEditor={onOpenEditor}
          />
        ))
      )}

      <NoMatchStepItemV2 portID={noMatchPortID} noMatch={noMatch} nodeID={nodeID} nestedWithIcon />
      <NoReplyItemV2 portID={noReplyPortID} noReply={noReply} nodeID={nodeID} />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({
  data,
  ports,
  palette,
  projectType,
  engine,
}) => {
  const slotMap = React.useContext(SlotMapContext)!;

  const slots: CaptureSlot[] = React.useMemo(() => {
    const allSlots = data.intent?.slots.map((intentSlot) => ({
      ...intentSlot,
      slot: slotMap[intentSlot.id],
      prompt: transformSlotIntoPrompt(slotMap[intentSlot.id], intentSlot),
    }));

    if (allSlots && allSlots?.length) return allSlots;

    return [Realtime.Utils.slot.intentSlotFactoryCreator(projectType)({ id: '' })];
  }, [data.intent?.slots, slotMap]);

  return (
    <CaptureStep
      slots={slots}
      nodeID={data.nodeID}
      noReply={data.noReply}
      noMatch={data.noMatch}
      palette={palette}
      variable={data.variable}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      captureType={data.captureType}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      onOpenEditor={() => engine.setActive(data.nodeID)}
    />
  );
};

export default ConnectedCaptureStep;
