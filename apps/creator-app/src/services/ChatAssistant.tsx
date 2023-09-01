import { UserRole } from '@voiceflow/internal';
import React from 'react';

import HideVoiceflowAssistant from '@/components/HideVoiceflowAssistant';
import { CLOUD_ENV } from '@/config';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import VoiceflowAssistant from '@/vendors/voiceflowAssistant';

const ChatAssistant: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const userRole = useSelector(WorkspaceV2.active.userRoleSelector);
  const activeProject = useSelector(ProjectV2.active.projectSelector);
  const activeWorkspace = useSelector(WorkspaceV2.active.workspaceSelector);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);

  React.useEffect(() => {
    if (!user.creator_id || !user.email) return undefined;

    VoiceflowAssistant.setup();

    return () => {
      VoiceflowAssistant.cleanup();
    };
  }, [user.creator_id]);

  React.useEffect(() => {
    if (!user.creator_id || !user.email) return;

    VoiceflowAssistant.setUser({
      id: `${CLOUD_ENV}-${user.creator_id}`,
      name: user.name ?? 'Unknown',
      role: userRole ?? UserRole.VIEWER,
      email: user.email,
      image: user.image ?? undefined,
    });
  }, [user.email, user.name, user.image, userRole]);

  React.useEffect(() => {
    VoiceflowAssistant.setActiveProject(activeProject);
  }, [activeProject?.id, activeProject?.name, activeProject?.locales]);

  React.useEffect(() => {
    VoiceflowAssistant.setActiveWorkspace(activeWorkspace);
  }, [activeWorkspace?.id, activeWorkspace?.name, activeWorkspace?.plan]);

  return !isLoggedIn ? <HideVoiceflowAssistant /> : null;
};

export default React.memo(ChatAssistant);
