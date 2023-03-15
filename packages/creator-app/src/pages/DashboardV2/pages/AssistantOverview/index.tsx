import { Box } from '@voiceflow/ui';
import React from 'react';

import { AssistantCard } from '@/components/AssistantCard';
import Page from '@/components/Page';
import * as Domains from '@/ducks/domain';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

import { Sidebar } from '../../components';
import { getProjectStatusAndMembers } from '../../utils';
import { DomainsTable, Header, TopicsTable } from './components';

const AssistantOverview: React.FC = () => {
  const project = useSelector(ProjectV2.active.projectSelector);
  const domainsCount = useSelector(Domains.domainsCountSelector);
  const activeViewers = useSelector(ProjectV2.active.allAwarenessViewersSelector);
  const getMemberByIDSelector = useSelector(WorkspaceV2.active.getMemberByIDSelector);

  const goToCanvasWithVersionID = useDispatch(Router.goToCanvasWithVersionID);

  return (
    <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
      {project && (
        <Page.Content>
          <Box mb={20}>
            <AssistantCard
              {...getProjectStatusAndMembers({ project, activeViewers, getMemberByIDSelector })}
              onClickDesigner={() => goToCanvasWithVersionID(project.versionID)}
              project={project}
              isHovered
            />
          </Box>

          {domainsCount > 1 ? <DomainsTable /> : <TopicsTable />}
        </Page.Content>
      )}
    </Page>
  );
};

export default AssistantOverview;
