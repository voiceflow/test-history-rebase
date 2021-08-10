import React from 'react';

import SpeakAudioItem, { SpeakAudioItemProps } from '@/pages/Canvas/components/SpeakAudioItem';
import { convertToWord } from '@/utils/number';
import { capitalizeFirstLetter } from '@/utils/string';

export type NoMatchItemProps = Omit<SpeakAudioItemProps, 'header' | 'formControlProps'>;

const NoMatchItem: React.ForwardRefRenderFunction<HTMLElement, NoMatchItemProps> = (props, ref) => {
  const number = capitalizeFirstLetter(convertToWord(props.index + 1));

  return <SpeakAudioItem {...props} header={`Reprompt ${number}`} ref={ref} formControlProps={{ contentBottomUnits: 2.5 }} />;
};

export default React.forwardRef<HTMLElement, NoMatchItemProps>(NoMatchItem);
