import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import { Item, StepButton } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../../../constants';
import { ButtonItem as ButtonItemType } from '../types';
import ButtonPreview from './ButtonPreview';

interface ButtonItemProps extends ButtonItemType {
  index: number;
  palette: HSLShades;
  onOpenEditor: VoidFunction;
}

const ButtonItem: React.FC<ButtonItemProps> = ({ index, label, portID, prompts, palette, linkedLabel, onOpenEditor }) => (
  <Item
    v2
    icon={index === 0 ? NODE_CONFIG.icon! : null}
    label={label}
    portID={portID}
    palette={palette}
    attachment={
      !!prompts?.length && (
        <Popper
          placement="right-start"
          renderContent={({ onClose }) => <ButtonPreview prompts={prompts} onClose={onClose} onOpenEditor={onOpenEditor} />}
        >
          {({ onToggle, ref, isOpened }) => <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="setV2" isActive={isOpened} />}
        </Popper>
      )
    }
    placeholder="Add button label"
    linkedLabel={linkedLabel}
    withNewLines
    labelVariant={StepLabelVariant.PRIMARY}
    multilineLabel
    labelLineClamp={100}
    nestedWithIcon={index > 0}
  />
);

export default ButtonItem;
