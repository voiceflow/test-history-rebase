import { BaseModels, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, NoMatchStepItemV2, NoReplyStepItemV2, Section, StepButton } from '@/pages/Canvas/components/Step';
import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

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
  palette: HSLShades;
  onOpenEditor: () => void;
}

export const ButtonsStep: React.FC<ButtonsStepProps> = ({
  nodeID,
  buttons,
  noMatch,
  noReply,
  palette,
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
                palette={palette}
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
          <Item label={WAITING_FOR_INTENT_PLACEHOLDER} icon={PLACEHOLDER_ICON} palette={palette} v2 />
        )}

        <NoMatchStepItemV2 nodeID={nodeID} portID={noMatchPortID} noMatch={noMatch} nestedWithIcon />
        <NoReplyStepItemV2 nodeID={nodeID} portID={noReplyPortID} noReply={noReply} nestedWithIcon />
      </Section>
    </Step>
  );
};

const ConnectedButtonsStep: ConnectedStep<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = ({ ports, data, palette, engine }) => {
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
      palette={palette}
      onOpenEditor={() => engine.setActive(data.nodeID)}
    />
  );
};

export default ConnectedButtonsStep;
