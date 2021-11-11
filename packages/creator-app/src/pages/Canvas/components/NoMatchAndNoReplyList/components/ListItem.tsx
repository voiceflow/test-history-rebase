import React from 'react';

import SpeakAudioItem, { SpeakAudioItemProps } from '@/pages/Canvas/components/SpeakAudioItem';
import TextListItem, { TextListItemProps } from '@/pages/Canvas/components/TextListItem';

export type ChatListItemProps = Omit<TextListItemProps, 'header' | 'formControlProps'>;

export type VoiceListItemProps = Omit<SpeakAudioItemProps, 'header' | 'formControlProps'>;

const createPlatformListItem = <P extends ChatListItemProps | VoiceListItemProps>(
  Component: React.NamedExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<HTMLElement>>
) =>
  React.forwardRef<HTMLElement, P>((props, ref) => (
    <Component {...props} ref={ref} header={`Reprompt ${props.index + 1}`} formControlProps={{ contentBottomUnits: 2.5 }} />
  ));

export const ChatListItem = createPlatformListItem<ChatListItemProps>(TextListItem);

export const VoiceListItem = createPlatformListItem<VoiceListItemProps>(SpeakAudioItem);
