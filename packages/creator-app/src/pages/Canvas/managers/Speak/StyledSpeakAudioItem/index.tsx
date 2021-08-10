import React from 'react';

import { DialogType } from '@/constants';
import SpeakAudioItem, { SpeakAudioItemProps } from '@/pages/Canvas/components/SpeakAudioItem';

type StyledSpeakAudioItemProps = Omit<SpeakAudioItemProps, 'header' | 'formControlProps'> & {
  isDeprecated?: boolean;
};

const getHeader = ({ index, isVoice, isDeprecated }: { index: number; isVoice: boolean; isDeprecated?: boolean }): string => {
  if (isDeprecated) {
    return isVoice ? 'System Says' : 'Audio';
  }

  return `${isVoice ? 'Speak' : 'Audio'} Variant ${index + 1}`;
};

const StyledSpeakAudioItem: React.ForwardRefRenderFunction<HTMLElement, StyledSpeakAudioItemProps> = ({ isDeprecated, ...props }, ref) => (
  <SpeakAudioItem
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

export default React.forwardRef(StyledSpeakAudioItem);
