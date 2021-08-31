import React from 'react';

import SpeakAudioItem, { SpeakAudioItemProps } from '@/pages/Canvas/components/SpeakAudioItem';
import TextListItem, { TextListItemProps } from '@/pages/Canvas/components/TextListItem';

export type ChatNoMatchItemProps = Omit<TextListItemProps, 'header' | 'formControlProps'>;

export type VoiceNoMatchItemProps = Omit<SpeakAudioItemProps, 'header' | 'formControlProps'>;

const createPlatformNoMatchItem = <P extends ChatNoMatchItemProps | VoiceNoMatchItemProps>(
  Component: React.NamedExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<HTMLElement>>
) =>
  React.forwardRef<HTMLElement, P>((props, ref) => (
    <Component {...props} ref={ref} header={`Reprompt ${props.index + 1}`} formControlProps={{ contentBottomUnits: 2.5 }} />
  ));

export const ChatNoMatchItem = createPlatformNoMatchItem<ChatNoMatchItemProps>(TextListItem);
export const VoiceNoMatchItem = createPlatformNoMatchItem<VoiceNoMatchItemProps>(SpeakAudioItem);
