import { Utils } from '@voiceflow/common';
import { Box, Popper } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import UpdatesPopover from '@/components/UpdatesPopover';
import { Notification, notificationsSelector, NotificationType, readNotifications } from '@/ducks/notifications';
import { useSelector } from '@/hooks';

import * as S from './styles';

const DEFAULT_MESSAGE = [
  {
    details: 'There are no new updates available.',
    type: NotificationType.UPDATE,
    created: 0,
  } as unknown as Notification,
];

const NotificationButton: React.FC = () => {
  const notifications = useSelector(notificationsSelector);
  const newNotifications = React.useMemo(() => notifications.filter(({ isNew }) => isNew), [notifications]);

  const areNewNotifications = newNotifications.length > 0;

  return (
    <Popper
      maxHeight={500}
      placement="bottom-end"
      renderContent={() => <UpdatesPopover notifications={areNewNotifications ? newNotifications : DEFAULT_MESSAGE} />}
    >
      {({ ref, isOpened, onToggle }) => (
        <Box position="relative">
          <Page.Header.IconButton
            ref={ref}
            icon="notificationsOutline"
            active={isOpened}
            onClick={Utils.functional.chainVoid(onToggle, readNotifications)}
            tooltip={{
              content: 'Notifications',
              popperOptions: {
                modifiers: [{ name: 'offset', options: { offset: [0, 3] } }],
              },
            }}
          />

          {areNewNotifications && <S.UpdateBubble />}
        </Box>
      )}
    </Popper>
  );
};

export default NotificationButton;
