import { UserRole } from '@voiceflow/internal';
import { AssistantCard, Button } from '@voiceflow/ui';
import React from 'react';

import { withBox } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainer = withBox({ width: 400, backgroundColor: '#fff', padding: 30, display: 'flex', justifyContent: 'center' });
const wideWrapContainer = withBox({ width: 1200, backgroundColor: '#fff', padding: 30, display: 'flex', justifyContent: 'center' });

const custom = createExample(
  'custom',
  wrapContainer(() => (
    <AssistantCard
      title="Webchat - Book a Demo"
      backgroundImage="https://cm4-production-assets.s3.amazonaws.com/1667337752059-screen-shot-2022-11-01-at-18.22.20.png"
      icon="dialogflowCX"
      status="By Voiceflow"
    >
      <Button squareRadius variant={Button.Variant.PRIMARY}>
        Copy Template
      </Button>
    </AssistantCard>
  ))
);

const viewer = createExample(
  'viewer',
  wrapContainer(() => (
    <AssistantCard
      title="Acme Banking Assistant"
      image="https://cm4-production-assets.s3.amazonaws.com/1667337752059-screen-shot-2022-11-01-at-18.22.20.png"
      icon="dialogflowCX"
      status="Active"
      userRole={UserRole.VIEWER}
      members={[
        {
          name: 'Filipe Merker',
          image: 'E760D4|FCEFFB',
          creator_id: 85363,
        },
        {
          name: 'John Doe',
          image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
          creator_id: 98226,
        },
      ]}
    />
  ))
);

const owner = createExample(
  'owner',
  wrapContainer(() => (
    <AssistantCard
      members={[
        {
          name: 'Mark Doe',
          image: '697986|EEF0F1',
          creator_id: 853632,
        },
        {
          name: 'John Doe',
          image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
          creator_id: 98226,
        },
        {
          name: 'Ronny Doe',
          image: '5891FB|EFF5FF',
          creator_id: 85362,
        },
        {
          name: 'Filipe Merker',
          image: 'https://avatars.githubusercontent.com/u/9748039?s=400&u=ce4d00fa41942fdd0b3fd4cf6fd711efb8238b89&v=4',
          creator_id: 85363,
        },
      ]}
      options={[
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
      ]}
      title="Acme Chatbot"
      icon="googleAssistant"
      userRole="owner"
      status="Edited 4 hours ago"
    />
  ))
);

const wide = createExample(
  'wide',
  wideWrapContainer(() => (
    <AssistantCard
      members={[
        {
          name: 'Mark Doe',
          image: '697986|EEF0F1',
          creator_id: 853632,
        },
        {
          name: 'John Doe',
          image: 'https://cm4-production-assets.s3.amazonaws.com/1667444778988-screen-shot-2022-11-03-at-00.06.09.png',
          creator_id: 98226,
        },
      ]}
      options={[
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
      ]}
      title="Acme Chatbot"
      icon="googleAssistant"
      userRole="owner"
      status="Edited 4 hours ago"
    />
  ))
);

export default createSection('AssistantCard', 'src/components/AssistantCard/index.tsx', [wide, viewer, owner, custom]);
