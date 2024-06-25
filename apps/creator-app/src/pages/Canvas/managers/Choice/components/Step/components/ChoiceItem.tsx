import { Popper, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import type { HSLShades } from '@/constants';
import { Item, StepButton } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../../../constants';
import type { ChoiceItem as ChoiceItemType } from '../types';
import ChoicePreview from './ChoicePreview';

interface ChoiceItemProps extends ChoiceItemType {
  index: number;
  palette?: HSLShades;
  onOpenEditor: VoidFunction;
}

const ChoiceItem: React.FC<ChoiceItemProps> = ({ label, portID, index, prompts, palette, onOpenEditor }) => (
  <Item
    v2
    icon={index === 0 ? NODE_CONFIG.icon! : null}
    label={label}
    portID={portID}
    palette={palette}
    iconColor="#8da2b5"
    attachment={
      !!prompts?.length && (
        <Popper
          placement="right-start"
          renderContent={({ onClose }) => (
            <ChoicePreview prompts={prompts} onClose={onClose} onOpenEditor={onOpenEditor} />
          )}
        >
          {({ onToggle, ref, isOpened }) => (
            <StepButton ref={ref} onClick={stopPropagation(onToggle)} icon="setV2" isActive={isOpened} />
          )}
        </Popper>
      )
    }
    placeholder="Select intent"
    multilineLabel
    nestedWithIcon={index !== 0}
    labelLineClamp={5}
  />
);

export default ChoiceItem;
