import { BoxFlexApart, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { currentSelectedTranscriptSelector } from '@/ducks/transcript';
import { Workspace } from '@/models';

import { ContextSubtext, ContextTitle, StyledLogo, StyledUser, UserContainer } from './components';

export type CreatorListParams = Pick<Workspace, 'name' | 'image'>;
interface TranscriptContextProps {
  creatorIDList: number[];
  creatorList: CreatorListParams[];
}

const TranscriptContext: React.FC<TranscriptContextProps> = ({ creatorIDList, creatorList }) => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const { device, os, browser, creator_id } = currentTranscript;

  const index = creatorIDList.indexOf(Number(creator_id));

  const userName = creatorIDList.includes(Number(creator_id)) ? creatorList[index].name : '';
  const userImage = creatorIDList.includes(Number(creator_id)) ? creatorList[index].image : '';

  return (
    <>
      <BoxFlexApart>
        <StyledLogo>
          <SvgIcon icon="voiceflowV" size={24} color="#fff" />
        </StyledLogo>
        {userImage ? <UserContainer src={userImage} /> : <StyledUser icon="userPlaceholder" size={48} color="#f0f0f0" />}
      </BoxFlexApart>
      <ContextTitle>Conversation between your assistant and {userName || 'a test user'}</ContextTitle>
      <ContextSubtext>
        {device}&nbsp; •&nbsp; {os}&nbsp; •&nbsp; {browser}
      </ContextSubtext>
    </>
  );
};

export default TranscriptContext;
