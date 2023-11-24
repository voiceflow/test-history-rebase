import { UserRole } from '@voiceflow/internal';
import { Box, toast, useSetup } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { LimitType } from '@/constants/limits';
import * as Session from '@/ducks/session';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useGetPlanLimitedConfig } from '@/hooks/planLimitV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';
import { useOnAddSeats } from '@/hooks/workspace';
import { copyWithToast } from '@/utils/clipboard';
import { isEditorUserRole } from '@/utils/role';

export const useInviteLink = ({ initialUserRole = UserRole.VIEWER }: { initialUserRole?: UserRole } = {}) => {
  const [link, setLink] = React.useState('');
  const [userRole, setUserRole] = React.useState<UserRole>(initialUserRole);

  const projectID = useSelector(Session.activeProjectIDSelector);
  const numberOfSeats = useSelector(WorkspaceV2.active.numberOfSeatsSelector);
  const usedEditorSeats = useSelector(WorkspaceV2.active.usedEditorSeatsSelector);

  const getWorkspaceInviteLink = useDispatch(WorkspaceV2.getWorkspaceInviteLink);

  const onAddSeats = useOnAddSeats();
  const [trackingEvents] = useTrackingEvents();
  const getEditorSeatLimit = useGetPlanLimitedConfig(LimitType.EDITOR_SEATS, { limit: numberOfSeats });

  const onFetchLink = async (role: UserRole) => {
    try {
      setLink('');

      const link = await getWorkspaceInviteLink(role);

      setLink(link);
    } catch (error) {
      client.log.error(error);

      toast.error('Failed to fetch invite link');
    }
  };

  const onCopy = async () => {
    copyWithToast(link, 'Link copied to your clipboard, this link expires in 72 hours.')();

    trackingEvents.trackInvitationLinkCopy({ projectID });

    if (!isEditorUserRole(userRole)) return;

    const editorSeatLimit = getEditorSeatLimit({ value: usedEditorSeats });

    if (editorSeatLimit) {
      toast.warn(
        <Box.Flex gap={5} column>
          <span>
            No available editor seats on this workspace. Collaborators will be added to this workspace as viewers if no editor seats are created.
          </span>

          <Box.Flex color="#5d9df5" alignSelf="flex-end">
            Add Editor Seats
          </Box.Flex>
        </Box.Flex>,
        { delay: 1000, onClick: () => onAddSeats() }
      );
    }
  };

  const onChangeRole = (role: UserRole) => {
    setUserRole(role);
    onFetchLink(role);
  };

  useSetup(() => onFetchLink(userRole));

  return {
    link,
    onCopy,
    userRole,
    onRefetch: () => onFetchLink(userRole),
    onChangeRole,
  };
};
