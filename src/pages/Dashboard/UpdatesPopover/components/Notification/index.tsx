import cn from 'classnames';
import Markdown from 'markdown-to-jsx';
import moment from 'moment';
import React from 'react';

import { Container, TimeContainer } from './components';

export enum NotificationTypes {
  FEATURE = 'FEATURE',
  UPDATE = 'UPDATE',
  CHANGE = 'CHANGE',
}

const CLASS_MAPPINGS: Record<NotificationTypes, { class: string; label: string }> = {
  FEATURE: {
    class: 'update-modal-feature',
    label: 'New Feature',
  },
  UPDATE: {
    class: 'update-modal-update',
    label: 'Update',
  },
  CHANGE: {
    class: 'update-modal-change',
    label: 'Change',
  },
};

export type NotificationType = {
  details: string;
  created: string;
  isNew: boolean;
  type: NotificationTypes;
};

export type NotificationProps = {
  data: NotificationType;
};

const Notification: React.FC<NotificationProps> = ({ data }) => {
  const { details, created, isNew, type } = data;
  return (
    <Container>
      {isNew && <p className={cn('d-inline-block mb-0 ', CLASS_MAPPINGS[type].class)}>&bull; {CLASS_MAPPINGS[type].label}:&nbsp;</p>}

      <Markdown style={{ marginRight: '4px' }}>{details}</Markdown>

      <TimeContainer>{created ? moment(created).fromNow() : ''}</TimeContainer>
    </Container>
  );
};

export default Notification;
