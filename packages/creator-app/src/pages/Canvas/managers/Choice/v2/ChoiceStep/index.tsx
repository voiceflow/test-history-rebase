import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Step, { Item, NoMatchStepItemV2, NoReplyStepItemV2, Section, StepButton } from '@/pages/Canvas/components/Step';
import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import ChoicePreview from '../ChoicePreview';
import { CHOICE_ICON, CHOICE_PLACEHOLDER_ICON, CHOICE_PREVIEW_ICON } from '../constants';
import { ChoiceStepProps } from '../types';
import { useChoiceStep } from './hooks';

export const ChoiceStepV2: React.FC<ChoiceStepProps> = ({
  nodeID,
  choices,
  noMatch,
  noReply,
  noMatchPortID,
  noReplyPortID,
  palette,
  onOpenEditor,
}) => (
  <Step nodeID={nodeID}>
    <Section v2 withIcon>
      {choices.length ? (
        choices.map(({ key, label, linkedLabel, portID, prompts, withAttachment, withPreview, onGoToLinkedIntent }, index) => {
          const previewButton = withPreview ? (
            <Popper
              placement="right-start"
              borderRadius="8px"
              renderContent={({ onClose }) => <ChoicePreview prompts={prompts} onClose={onClose} onOpenEditor={onOpenEditor} />}
            >
              {({ onToggle, ref, isOpened }) => (
                <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon={CHOICE_PREVIEW_ICON} isActive={isOpened} />
              )}
            </Popper>
          ) : null;

          const linkedLabelAttachment = withAttachment ? <StepButton icon="clip" onClick={stopPropagation(onGoToLinkedIntent)} /> : null;

          const attachment = previewButton || linkedLabelAttachment;

          return (
            <Item
              key={key}
              icon={index === 0 ? CHOICE_ICON : null}
              nestedWithIcon={index !== 0}
              label={label}
              portID={portID}
              iconColor="#8da2b5"
              palette={palette}
              attachment={attachment}
              linkedLabel={linkedLabel}
              placeholder="Select intent"
              multilineLabel
              labelLineClamp={5}
              v2
            />
          );
        })
      ) : (
        <Item label={WAITING_FOR_INTENT_PLACEHOLDER} icon={CHOICE_PLACEHOLDER_ICON} palette={palette} v2 />
      )}

      <NoMatchStepItemV2 nodeID={nodeID} portID={noMatchPortID} noMatch={noMatch} nestedWithIcon />
      <NoReplyStepItemV2 nodeID={nodeID} portID={noReplyPortID} noReply={noReply} nestedWithIcon />
    </Section>
  </Step>
);

const ConnectedChoiceStep: ConnectedStep<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({
  data,
  ports,
  palette,
  platform,
  engine,
}) => {
  const { choices } = useChoiceStep({ data, ports, platform });

  return (
    <ChoiceStepV2
      nodeID={data.nodeID}
      choices={choices}
      noMatch={data.noMatch}
      noReply={data.noReply}
      palette={palette}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      onOpenEditor={() => engine.setActive(data.nodeID)}
    />
  );
};

export default ConnectedChoiceStep;
