import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import { useModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/store.hook';
import { Modals } from '@/ModalsV2';
import { getMemberColorByCreatorID, isMemberColorImage } from '@/utils/member.util';

export const CMSHeaderMembers: React.FC = () => {
  const viewers = useSelector(ProjectV2.active.allAwarenessViewersSelector);

  const inviteModal = useModal(Modals.Workspace.Invite);
  const [canInviteMembers] = usePermission(Permission.INVITE);

  return (
    <Header.AvatarList
      list={viewers.map((viewer) => ({
        src: !isMemberColorImage(viewer.image) ? viewer.image : undefined,
        name: viewer.name ?? '',
        variant: getMemberColorByCreatorID(viewer.creatorID),
      }))}
      onButtonClick={canInviteMembers ? () => inviteModal.openVoid() : undefined}
    />
  );
};
