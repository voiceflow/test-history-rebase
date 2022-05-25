import { BaseModels, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, NoMatchStepItemV2, NoReplyItemV2, Section, StepButton } from '@/pages/Canvas/components/Step';
import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';

import ButtonsPreview from '../ButtonsPreview';
import { BUTTONS_ICON, PLACEHOLDER_ICON } from '../constants';
import { ButtonItem } from '../types';
import { useButtons } from './hooks';

export interface ButtonsStepProps {
  nodeID: string;
  buttons: ButtonItem[];
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  dynamicPortIDs: string[];
  variant: BlockVariant;
  onOpenEditor: () => void;
}

export const ButtonsStep: React.FC<ButtonsStepProps> = ({
  nodeID,
  buttons,
  noMatch,
  noReply,
  variant,
  noMatchPortID,
  noReplyPortID,
  onOpenEditor,
}) => {
  return (
    <Step nodeID={nodeID}>
      <Section>
        {buttons.length ? (
          buttons.map((button, index) => {
            const previewAttachment = button.withRequiredEntitiesAttachment ? (
              <Popper
                placement="right-start"
                borderRadius="8px"
                renderContent={({ onClose }) => <ButtonsPreview prompts={button.prompts} onClose={onClose} onOpenEditor={onOpenEditor} />}
              >
                {({ onToggle, ref, isOpened }) => <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="systemSet" isActive={isOpened} />}
              </Popper>
            ) : null;

            const linkedLabelAttachment = button.withLinkedLabelsAttachment ? (
              <StepButton icon="clip" onClick={stopPropagation(button.onGoToLinkedIntent)} />
            ) : null;

            const attachment = previewAttachment || linkedLabelAttachment;

            return (
              <Item
                key={button.id}
                icon={index === 0 ? BUTTONS_ICON : null}
                nestedWithIcon={index > 0}
                label={button.label}
                portID={button.portID}
                variant={variant}
                attachment={attachment}
                placeholder="Add button label"
                withNewLines
                labelVariant={StepLabelVariant.PRIMARY}
                linkedLabel={!previewAttachment && button.linkedLabel}
                multilineLabel
                labelLineClamp={100}
                v2
              />
            );
          })
        ) : (
          <Item label={WAITING_FOR_INTENT_PLACEHOLDER} icon={PLACEHOLDER_ICON} variant={variant} v2 />
        )}

        <NoMatchStepItemV2 nodeID={nodeID} portID={noMatchPortID} noMatch={noMatch} nestedWithIcon />
        <NoReplyItemV2 nodeID={nodeID} portID={noReplyPortID} noReply={noReply} />
      </Section>
    </Step>
  );
};

const ConnectedButtonsStep: ConnectedStep<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = ({ ports, data, variant, engine }) => {
  const { buttons } = useButtons({ ports, data });

  return (
    <ButtonsStep
      nodeID={data.nodeID}
      buttons={buttons}
      noMatch={data.noMatch}
      noReply={data.noReply}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
      dynamicPortIDs={ports.out.dynamic}
      variant={variant}
      onOpenEditor={() => engine.setActive(data.nodeID)}
    />
  );
};

export default ConnectedButtonsStep;
