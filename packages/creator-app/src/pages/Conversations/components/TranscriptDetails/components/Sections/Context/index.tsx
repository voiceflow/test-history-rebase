import React from 'react';

import { useActiveWorkspace } from '@/hooks';

import { Container } from '../components';
import TranscriptContext, { CreatorListParams } from './TranscriptContext';

const Context: React.FC = () => {
  const workspace = useActiveWorkspace();
  const activeMembers = workspace?.members ?? [];
  const creatorIDList: number[] = [];
  const creatorList: CreatorListParams[] = [];

  activeMembers.forEach((member) => {
    creatorIDList.push(member.creator_id);
    creatorList.push({ name: member.name, image: member.image });
  });

  return (
    <Container topExtend>
      <TranscriptContext creatorIDList={creatorIDList} creatorList={creatorList} />
    </Container>
  );
};

export default Context;
