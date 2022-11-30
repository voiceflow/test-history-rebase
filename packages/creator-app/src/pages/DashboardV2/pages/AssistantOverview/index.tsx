import { BaseModels } from '@voiceflow/base-types';
import { AssistantCard, AssistantCardProps } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Router from '@/ducks/router';
import { useActiveWorkspace, useDispatch } from '@/hooks';
import { DashboardClassName } from '@/styles/constants';

import { Sidebar } from '../../components';
import AssistantDomainsTable from '../../components/AssistantDomainsTable';
import { BodyWrapper, ContentWrapper, DashboardWrapper } from '../../components/styles';
import Header from './components/Header';
import * as S from './styles';

const props = {
  members: [
    {
      name: 'Mark Doe',
      image: '697986|EEF0F1',
      creator_id: 853632,
    },
    {
      name: 'Ronny Doe',
      image: '5891FB|EFF5FF',
      creator_id: 85362,
    },
    {
      name: 'John Doe',
      image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
      creator_id: 98226,
    },
    {
      name: 'Filipe Merker',
      image: 'https://avatars.githubusercontent.com/u/9748039?s=400&u=ce4d00fa41942fdd0b3fd4cf6fd711efb8238b89&v=4',
      creator_id: 85363,
    },
  ],
  options: [
    { label: 'Rename', onClick: () => {} },
    { label: 'Duplicate', onClick: () => {} },
    { label: 'Download (.vf)', onClick: () => {} },
    { label: 'Copy clone link', onClick: () => {} },
    { label: 'Convert to domain', onClick: () => {} },
    { label: 'divider', divider: true },
    { label: 'Manage access', onClick: () => {} },
    { label: 'Settings', onClick: () => {} },
    { label: 'divider', divider: true },
    { label: 'Delete', onClick: () => {} },
  ],
  title: 'Acme Chatbot',
  icon: 'googleAssistant',
  userRole: 'owner',
  status: 'Edited 4 hours ago',
} as AssistantCardProps;

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
  const workspace = useActiveWorkspace();
  const workspaceID = workspace?.id;
  const goTo = useDispatch(Router.goTo);

  return (
    <DashboardWrapper id="app" className={DashboardClassName.DASHBOARD}>
      <BodyWrapper>
        <Sidebar />
        <ContentWrapper>
          <Header workspace={workspace!} title="ACME chat assistant" onBackButtonClick={() => goTo(generatePath(Path.WORKSPACE, { workspaceID }))} />
          <S.AssistantOverviewWrapper>
            <S.Item>
              <AssistantCard
                {...props}
                status="Active"
                image="https://cm4-production-assets.s3.amazonaws.com/1667337752059-screen-shot-2022-11-01-at-18.22.20.png"
                title="Lorem Ipsum dolor sit amet consectetur adipiscing elit"
              />
            </S.Item>
            <AssistantDomainsTable domains={domains} />
          </S.AssistantOverviewWrapper>
        </ContentWrapper>
      </BodyWrapper>
    </DashboardWrapper>
  );
};

export default AssistantOverview;
