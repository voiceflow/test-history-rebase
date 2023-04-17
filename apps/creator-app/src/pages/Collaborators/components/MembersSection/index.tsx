import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Identifier } from '@/styles/constants';

import Container from './components/Container';
import InlineContainer from './components/InlineContainer';
import MemberRow from './components/MemberRow';

interface MemberSectionProps {
  inline?: boolean;
  members: Realtime.AnyWorkspaceMember[];
  resendInvite: (email: string, role: UserRole) => Promise<void>;
}

const MemberSection: React.FC<MemberSectionProps> = ({ inline, members, resendInvite }) => {
  const Wrapper = (inline ? InlineContainer : Container) as typeof InlineContainer;

  return (
    <Wrapper id={Identifier.MEMBERS_CONTAINER}>
      {members.map((member, index) => (
        <MemberRow key={member.email} inline={inline} member={member} isLast={index === members.length - 1} resendInvite={resendInvite} />
      ))}
    </Wrapper>
  );
};

export default MemberSection;
