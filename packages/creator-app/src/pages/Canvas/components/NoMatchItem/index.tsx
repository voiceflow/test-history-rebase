import React from 'react';

import SpeakAudioItem, { SpeakAudioItemProps } from '@/pages/Canvas/components/SpeakAudioItem';

export type NoMatchItemProps = Omit<SpeakAudioItemProps, 'header' | 'formControlProps'>;

const NoMatchItem: React.ForwardRefRenderFunction<HTMLElement, NoMatchItemProps> = (props, ref) => {
  return <SpeakAudioItem {...props} header={`Reprompt ${props.index + 1}`} ref={ref} formControlProps={{ contentBottomUnits: 2.5 }} />;
};

export default React.forwardRef<HTMLElement, NoMatchItemProps>(NoMatchItem);
