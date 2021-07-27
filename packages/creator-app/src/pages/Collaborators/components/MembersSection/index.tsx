import { UserRole } from '@voiceflow/internal';
import React from 'react';

import { DBWorkspace } from '@/models';
import { Identifier } from '@/styles/constants';

import Container from './components/Container';
import InlineContainer from './components/InlineContainer';
import MemberRow from './components/MemberRow';

interface MemberSectionProps {
  inline?: boolean;
  members: DBWorkspace.Member[];
  resendInvite: (email: string, permissionType: UserRole | null, showToast?: boolean | undefined) => Promise<boolean>;
}

const MemberSection: React.FC<MemberSectionProps> = ({ inline, members, resendInvite }) => {
  const Wrapper = (inline ? InlineContainer : Container) as typeof InlineContainer;

  return (
    <Wrapper id={Identifier.MEMBERS_CONTAINER}>
      {members.map((member) => (
        <MemberRow key={member.email} inline={inline} member={member} pending={!member.creator_id} resendInvite={resendInvite} />
      ))}
    </Wrapper>
  );
};

export default MemberSection;
