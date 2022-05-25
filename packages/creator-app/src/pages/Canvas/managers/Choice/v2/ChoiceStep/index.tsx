import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Step, { ConnectedStep, Item, NoMatchStepItemV2, NoReplyItemV2, Section, StepButton } from '@/pages/Canvas/components/Step';
import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';

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
  variant,
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
              variant={variant}
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
        <Item label={WAITING_FOR_INTENT_PLACEHOLDER} icon={CHOICE_PLACEHOLDER_ICON} variant={variant} v2 />
      )}

      <NoMatchStepItemV2 nodeID={nodeID} portID={noMatchPortID} noMatch={noMatch} nestedWithIcon />
      <NoReplyItemV2 nodeID={nodeID} portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedChoiceStep: ConnectedStep<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({
  data,
  ports,
  variant,
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
      variant={variant}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      onOpenEditor={() => engine.setActive(data.nodeID)}
    />
  );
};

export default ConnectedChoiceStep;
