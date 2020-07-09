import cn from 'classnames';
import Markdown from 'markdown-to-jsx';
import moment from 'moment';
import React from 'react';

import * as Notifications from '@/ducks/notifications';

import { Container, TimeContainer } from './components';

const CLASS_MAPPINGS: Record<Notifications.NotificationType, { class: string; label: string }> = {
  [Notifications.NotificationType.FEATURE]: {
    class: 'update-modal-feature',
    label: 'New Feature',
  },
  [Notifications.NotificationType.UPDATE]: {
    class: 'update-modal-update',
    label: 'Update',
  },
  [Notifications.NotificationType.CHANGE]: {
    class: 'update-modal-change',
    label: 'Change',
  },
};

export type NotificationProps = {
  data: Notifications.Notification;
};

const Notification: React.FC<NotificationProps> = ({ data: { details, created, isNew, type } }) => (
  <Container>
    {isNew && <p className={cn('d-inline-block mb-0 ', CLASS_MAPPINGS[type].class)}>&bull; {CLASS_MAPPINGS[type].label}:&nbsp;</p>}

    <Markdown style={{ marginRight: '4px' }}>{details}</Markdown>

    <TimeContainer>{created ? moment(created).fromNow() : ''}</TimeContainer>
  </Container>
);

export default Notification;
