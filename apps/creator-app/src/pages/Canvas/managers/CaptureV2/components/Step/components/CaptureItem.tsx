import { Popper, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import type { HSLShades } from '@/constants';
import { Item, StepButton } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../../../constants';
import type { CaptureSlot } from '../types';
import CapturePreview from './CapturePreview';

export interface CaptureItemProps {
  slot?: CaptureSlot;
  label?: React.ReactNode;
  isLast: boolean;
  isFirst: boolean;
  palette: HSLShades;
  nextPortID: string;
  onOpenEditor: () => void;
}

export const CaptureItem: React.FC<CaptureItemProps> = ({
  slot,
  label,
  isFirst,
  isLast,
  nextPortID = null,
  palette,
  onOpenEditor,
}) => {
  const icon = isFirst ? NODE_CONFIG.icon! : null;
  const portID = isLast ? nextPortID : null;

  const name = slot?.slot?.name;
  const slotPrompt = slot?.prompt;

  if (!slot?.id || !slot?.slot) {
    return (
      <Item
        icon={icon}
        portID={portID}
        palette={palette}
        wordBreak
        withNewLines
        placeholder="Select entity to capture"
        label={label}
      />
    );
  }

  return (
    <Popper
      placement="right"
      renderContent={({ onClose }) => (
        <CapturePreview prompt={slotPrompt} onOpenEditor={onOpenEditor} onClose={onClose} />
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Item
          icon={icon}
          label={
            name && (
              <>
                Capture <Text style={{ wordBreak: 'keep-all' }}>{`{${name}}`}</Text>
              </>
            )
          }
          portID={portID}
          palette={palette}
          wordBreak
          attachment={
            slotPrompt?.content && (
              <StepButton ref={ref} icon="setV2" isActive={isOpened} onClick={stopPropagation(onToggle)} />
            )
          }
          withNewLines
        />
      )}
    </Popper>
  );
};

export default CaptureItem;
