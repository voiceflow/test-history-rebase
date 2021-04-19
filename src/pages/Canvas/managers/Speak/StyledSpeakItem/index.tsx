import React from 'react';

import { DialogType } from '@/constants';
import SpeakItem, { SpeakItemProps } from '@/pages/Canvas/components/SpeakItem';

type StyledSpeakItemProps = Omit<SpeakItemProps, 'header' | 'formControlProps'> & {
  isDeprecated?: boolean;
};

const getHeader = ({ index, isVoice, isDeprecated }: { index: number; isVoice: boolean; isDeprecated?: boolean }): string => {
  if (isDeprecated) {
    return isVoice ? 'System Says' : 'Audio';
  }

  return `${isVoice ? 'Speak' : 'Audio'} Variant ${index + 1}`;
};

const StyledSpeakItem: React.ForwardRefRenderFunction<HTMLElement, StyledSpeakItemProps> = ({ isDeprecated, ...props }, ref) => (
  <SpeakItem
    {...props}
    ref={ref}
    header={getHeader({
      index: props.index,
      isVoice: props.item.type === DialogType.VOICE,
      isDeprecated,
    })}
    formControlProps={{ contentBottomUnits: 2.5 }}
  />
);

export default React.forwardRef(StyledSpeakItem);
