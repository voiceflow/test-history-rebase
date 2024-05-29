import { UserRole } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Identifier } from '@/styles/constants';

import InlineContainer from './components/InlineContainer';
import MemberRow from './components/MemberRow';

interface MemberSectionProps {
  members: Realtime.AnyWorkspaceMember[];
  resendInvite: (email: string, role: UserRole) => Promise<void>;
}

const MemberSection: React.FC<MemberSectionProps> = ({ members, resendInvite }) => (
  <InlineContainer id={Identifier.MEMBERS_CONTAINER}>
    {members.map((member, index) => (
      <MemberRow key={member.email} member={member} isLast={index === members.length - 1} resendInvite={resendInvite} />
    ))}
  </InlineContainer>
);

export default MemberSection;
