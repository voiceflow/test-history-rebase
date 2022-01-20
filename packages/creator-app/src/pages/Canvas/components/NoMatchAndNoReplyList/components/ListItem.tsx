import React from 'react';

import SpeakAudioItem, { SpeakAudioItemProps } from '@/pages/Canvas/components/SpeakAudioItem';
import TextListItem, { TextListItemProps } from '@/pages/Canvas/components/TextListItem';

export type ChatListItemProps = Omit<TextListItemProps, 'header' | 'formControlProps'>;

export type VoiceListItemProps = Omit<SpeakAudioItemProps, 'header' | 'formControlProps'>;

const createPlatformListItem = <P extends ChatListItemProps | VoiceListItemProps>(
  Component: React.NamedExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<HTMLElement>>,
  headerPrefix: string
) =>
  React.forwardRef<HTMLElement, P>((props, ref) => (
    <Component {...props} ref={ref} header={`${headerPrefix} ${props.index + 1}`} formControlProps={{ contentBottomUnits: 2.5 }} />
  ));

export const NoMatchChatListItem = createPlatformListItem<ChatListItemProps>(TextListItem, 'No Match');
export const NoMatchVoiceListItem = createPlatformListItem<VoiceListItemProps>(SpeakAudioItem, 'No Match');

export const NoReplyChatListItem = createPlatformListItem<ChatListItemProps>(TextListItem, 'No Reply');
export const NoReplyVoiceListItem = createPlatformListItem<VoiceListItemProps>(SpeakAudioItem, 'No Reply');
