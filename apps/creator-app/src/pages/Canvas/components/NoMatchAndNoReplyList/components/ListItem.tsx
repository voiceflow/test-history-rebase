import React from 'react';

import SpeakAudioItem, { SpeakAudioItemProps } from '@/pages/Canvas/components/SpeakAudioItem';
import TextListItem, { TextListItemProps } from '@/pages/Canvas/components/TextListItem';

const createPlatformListItem = <P extends SpeakAudioItemProps | TextListItemProps>(
  Component: React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<HTMLElement>>,
  headerPrefix: string
) =>
  React.forwardRef<HTMLElement, Omit<P, 'header'>>((props, ref) => (
    <Component {...(props as React.PropsWithoutRef<P>)} ref={ref} header={`${headerPrefix} ${props.index + 1}`} />
  ));

export const NoMatchChatListItem = createPlatformListItem<TextListItemProps>(TextListItem, 'No Match');
export const NoMatchVoiceListItem = createPlatformListItem<SpeakAudioItemProps>(SpeakAudioItem, 'No Match');

export const NoReplyChatListItem = createPlatformListItem<TextListItemProps>(TextListItem, 'No Reply');
export const NoReplyVoiceListItem = createPlatformListItem<SpeakAudioItemProps>(SpeakAudioItem, 'No Reply');
