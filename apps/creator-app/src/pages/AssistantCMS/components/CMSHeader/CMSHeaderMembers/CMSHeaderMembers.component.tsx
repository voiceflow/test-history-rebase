import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { Permission } from '@/constants/permissions';
import { Assistant, Session } from '@/ducks';
import { useModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/store.hook';
import { Modals } from '@/ModalsV2';
import { HEADER_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { getMemberColorByCreatorID, isMemberColorImage } from '@/utils/member.util';

export const CMSHeaderMembers: React.FC = () => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const viewers = useSelector(Assistant.Awareness.selectors.viewersByAssistantID, { assistantID: activeProjectID });

  const inviteModal = useModal(Modals.Workspace.Invite);
  const [canInviteMembers] = usePermission(Permission.WORKSPACE_INVITE);

  const list = useMemo(
    () =>
      viewers.map((viewer) => ({
        src: !isMemberColorImage(viewer.image) ? viewer.image : undefined,
        name: viewer.name ?? '',
        variant: getMemberColorByCreatorID(viewer.creatorID),
      })),
    [viewers]
  );

  return (
    <Header.AvatarList
      list={list}
      testID={tid(HEADER_TEST_ID, 'members')}
      onButtonClick={canInviteMembers ? () => inviteModal.openVoid() : undefined}
    />
  );
};
