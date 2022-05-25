import { Popper, stopPropagation, Text } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import { Item, StepButton } from '@/pages/Canvas/components/Step';

import CapturePreview from '../../CapturePreview';
import { CAPTURE_STEP_ICON } from '../../constants';
import { CaptureSlot } from '../../types';

export interface CaptureItemProps {
  slot?: CaptureSlot;
  label?: React.ReactNode;
  isLast: boolean;
  isFirst: boolean;
  nextPortID: string;
  variant: BlockVariant;
  onOpenEditor: () => void;
}

export const CaptureItem: React.FC<CaptureItemProps> = ({ slot, label, isFirst, isLast, nextPortID = null, variant, onOpenEditor }) => {
  const icon = isFirst ? CAPTURE_STEP_ICON : null;
  const portID = isLast ? nextPortID : null;

  const name = slot?.slot?.name;
  const slotPrompt = slot?.prompt;

  if (!slot?.id || !slot?.slot) {
    return <Item icon={icon} portID={portID} variant={variant} wordBreak withNewLines placeholder="Select entity to capture" label={label} v2 />;
  }

  return (
    <Popper placement="right" renderContent={({ onClose }) => <CapturePreview prompt={slotPrompt} onOpenEditor={onOpenEditor} onClose={onClose} />}>
      {({ ref, onToggle, isOpened }) => (
        <Item
          icon={icon}
          variant={variant}
          label={
            name ? (
              <>
                Capture <Text style={{ wordBreak: 'keep-all' }}>{`{${name}}`}</Text>
              </>
            ) : (
              ''
            )
          }
          portID={portID}
          wordBreak
          withNewLines
          attachment={slotPrompt?.content && <StepButton ref={ref} icon="systemSet" isActive={isOpened} onClick={stopPropagation(onToggle)} />}
          v2
        />
      )}
    </Popper>
  );
};

export default CaptureItem;
