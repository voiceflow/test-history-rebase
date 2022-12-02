import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { AssistantCard, Box } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { VersionSubscriptionGate } from '@/gates';
import { withBatchLoadingGate } from '@/hocs';
import { useProjectOptions, useSelector } from '@/hooks';

import { Sidebar } from '../../components';
import { getProjectStatusAndMembers } from '../../utils';
import { DomainsTable, Header } from './components';

export const domains = [
  {
    id: 'did1',
    live: true,
    name: 'Simplified Refund Support: Reactive Fee Decisioning',
    topicIDs: ['topic 1', 'topic 2'],
    rootDiagramID: 'id',
    modified: 1668962644712,
    status: BaseModels.Version.DomainStatus.REVIEW,
  },

  {
    id: 'did3',
    live: true,
    name: 'Product Enquiry Flow - All Products',
    topicIDs: ['topic 1', 'topic 2'],
    rootDiagramID: 'id2',
    modified: 1668962644712,
    status: BaseModels.Version.DomainStatus.DESIGN,
  },
  {
    id: 'did2',
    live: true,
    name: 'Online or In-store Disambiguation',
    topicIDs: ['topic 1', 'topic 2', 'topic 3', 'topic 4'],
    rootDiagramID: 'id2',
    modified: 1669962644712,
    status: BaseModels.Version.DomainStatus.DESIGN,
  },
  {
    id: 'did5',
    live: true,
    name: 'Product Enquiry SKU Item - In-store Products long long titel lorem ipsum dolor sit amet consectetur adipiscing elit consequat',
    topicIDs: ['topic 1', 'topic 2', 'topic 3', 'topic 4', 'topic 5', 'topic 6'],
    rootDiagramID: 'id2',
    modified: 1678136426266,
    status: BaseModels.Version.DomainStatus.DESIGN,
  },
  {
    id: 'did4',
    live: true,
    name: 'Simplified Refund Support: Proactive Fee Resolution',
    topicIDs: ['topic 1', 'topic 2'],
    rootDiagramID: 'id2',
    modified: 1668131426266,
    status: BaseModels.Version.DomainStatus.COMPLETE,
  },
];

const AssistantOverview: React.FC = () => {
  const project = useSelector(ProjectV2.active.projectSelector);
  const userRole = useSelector(WorkspaceV2.active.userRoleSelector);
  const activeViewers = useSelector(ProjectV2.active.allAwarenessViewersSelector);
  const getMemberByIDSelector = useSelector(WorkspaceV2.active.getMemberByIDSelector);

  const projectTypeConfig = Platform.Config.getTypeConfig({ type: project?.type, platform: project?.platform });

  const projectOptions = useProjectOptions({
    v2: true,
    projectID: project?.id,
    versionID: project?.versionID,
    withInvite: true,
    projectName: project?.name,
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
              userRole={userRole ?? undefined}
              iconColor={projectTypeConfig?.icon.color}
            />
          </Box>

          <DomainsTable domains={domains} />
        </Page.Content>
      )}
    </Page>
  );
};

export default withBatchLoadingGate(VersionSubscriptionGate)(AssistantOverview);
