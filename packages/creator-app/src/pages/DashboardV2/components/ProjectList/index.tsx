import { AssistantCard, AssistantCardProps, Banner, Button } from '@voiceflow/ui';
import React from 'react';

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

const customProp = {
  title: 'Webchat - Book a Demo',
  icon: 'dialogflowCX',
  status: 'By Voiceflow',
} as AssistantCardProps;

const ProjectList: React.FC = () => {
  return (
    <S.ProjectListWrapper>
      <Banner
        title="Learn Voiceflow with video tutorials"
        subtitle="In this course you’ll find everything you need to get started with Voiceflow from the ground up."
        buttonText="Start Course"
        onClick={() => {}}
      />
      <S.Item>
        <AssistantCard
          {...props}
          status="Active"
          image="https://cm4-production-assets.s3.amazonaws.com/1667337752059-screen-shot-2022-11-01-at-18.22.20.png"
          title="Lorem Ipsum dolor sit amet consectetur adipiscing elit"
        />
      </S.Item>
      <S.Item>
        <AssistantCard {...props} />
      </S.Item>
      <S.Item>
        <AssistantCard {...props} />
      </S.Item>
      <S.Item>
        <AssistantCard {...props} />
      </S.Item>

      <S.Footer>
        <S.Title>Start with a template</S.Title>
        <S.Item>
          <AssistantCard {...customProp}>
            <Button squareRadius variant={Button.Variant.PRIMARY}>
              Copy Template
            </Button>
          </AssistantCard>
        </S.Item>
        <S.Item>
          <AssistantCard {...customProp}>
            <Button squareRadius variant={Button.Variant.PRIMARY}>
              Copy Template
            </Button>
          </AssistantCard>
        </S.Item>
        <S.Item>
          <AssistantCard {...customProp}>
            <Button squareRadius variant={Button.Variant.PRIMARY}>
              Copy Template
            </Button>
          </AssistantCard>
        </S.Item>
      </S.Footer>
    </S.ProjectListWrapper>
  );
};

export default ProjectList;
