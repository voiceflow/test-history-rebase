import * as Platform from '@voiceflow/platform-config';
import { AssistantCard, Box } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import * as Domains from '@/ducks/domain';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { usePermission } from '@/hooks/permission';
import { useProjectOptions } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

import { Sidebar } from '../../components';
import { getProjectStatusAndMembers } from '../../utils';
import { DomainsTable, Header } from './components';

const AssistantOverview: React.FC = () => {
  const project = useSelector(ProjectV2.active.projectSelector);
  const domains = useSelector(Domains.allDomainsSelector);
  const activeViewers = useSelector(ProjectV2.active.allAwarenessViewersSelector);
  const getMemberByIDSelector = useSelector(WorkspaceV2.active.getMemberByIDSelector);

  const goToCanvasWithVersionID = useDispatch(Router.goToCanvasWithVersionID);

  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);

  const projectTypeConfig = Platform.Config.getTypeConfig({ type: project?.type, platform: project?.platform });

  const projectOptions = useProjectOptions({
    v2: true,
    projectID: project?.id,
    versionID: project?.versionID,
    withInvite: true,
    withConvertToDomain: true,
  });

  return (
    <Page renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
      {project && (
        <Page.Content>
          <Box mb={20}>
            <AssistantCard
              {...getProjectStatusAndMembers({ project, activeViewers, getMemberByIDSelector })}
              icon={projectTypeConfig.icon.name}
              image={project.image}
              title={project.name}
              options={projectOptions}
              isViewer={!canEditProject}
              iconColor={projectTypeConfig?.icon.color}
              onClickCTA={() => goToCanvasWithVersionID(project.versionID)}
            />
          </Box>

          <DomainsTable domains={domains} />
        </Page.Content>
      )}
    </Page>
  );
};

export default AssistantOverview;
