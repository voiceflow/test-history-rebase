import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { Permission } from '@/constants/permissions';
import { Diagram } from '@/ducks';
import * as Account from '@/ducks/account';
import { useModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/store.hook';
import { Modals } from '@/ModalsV2';
import { HEADER_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { getMemberColorByCreatorID, isMemberColorImage } from '@/utils/member.util';

export const DiagramLayoutHeaderMembers: React.FC = () => {
  const diagramIDs = useSelector(Diagram.allDiagramIDsSelector);
  const viewers = useSelector(Diagram.diagramsViewersByIDsSelector, { ids: diagramIDs });
  const self = useSelector(Account.userSelector);

  const inviteModal = useModal(Modals.Workspace.Invite);
  const [canInviteMembers] = usePermission(Permission.INVITE);

  const list = useMemo(() => {
    const liveViewers = viewers.map((viewer) => ({
      src: !isMemberColorImage(viewer.image) ? viewer.image : undefined,
      name: viewer.name || '',
      variant: getMemberColorByCreatorID(viewer.creatorID),
    }));

    // Ensure the current user is included in live viewers to avoid visual flicker when switching realtime channels
    if (!liveViewers.some((viewer) => viewer.name === self.name)) {
      liveViewers.push({
        src: !isMemberColorImage(self.image) ? self.image || undefined : undefined,
        name: self.name || '',
        variant: getMemberColorByCreatorID(self.creator_id!),
      });
    }

    return liveViewers;
  }, [viewers]);

  return (
    <Header.AvatarList
      list={list}
      testID={tid(HEADER_TEST_ID, 'members')}
      onButtonClick={canInviteMembers ? () => inviteModal.openVoid() : undefined}
    />
  );
};
