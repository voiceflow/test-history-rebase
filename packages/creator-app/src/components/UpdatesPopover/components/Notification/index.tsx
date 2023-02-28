import { Box, Link } from '@voiceflow/ui';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import React from 'react';

import * as Notifications from '@/ducks/notifications';

import * as S from './styles';

const CLASS_MAPPINGS: Record<Notifications.NotificationType, { label: string }> = {
  [Notifications.NotificationType.FEATURE]: {
    label: 'New Feature',
  },
  [Notifications.NotificationType.UPDATE]: {
    label: 'Update',
  },
  [Notifications.NotificationType.CHANGE]: {
    label: 'Change',
  },
};

export interface NotificationProps {
  data: Notifications.Notification;
}

const Notification: React.FC<NotificationProps> = ({ data: { details, created, isNew, type } }) => (
  <S.Container>
    {isNew && type && <S.Content type={type}>&bull; {CLASS_MAPPINGS[type].label}:&nbsp;</S.Content>}

    <Box mr={4}>
      <Markdown options={{ overrides: { a: Link } }}>{details}</Markdown>
    </Box>

    <S.TimeContainer>{created ? dayjs(created).fromNow() : ''}</S.TimeContainer>
  </S.Container>
);

export default Notification;
