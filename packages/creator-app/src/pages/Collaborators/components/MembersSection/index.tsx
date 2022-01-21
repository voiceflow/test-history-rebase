import { UserRole } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Identifier } from '@/styles/constants';

import Container from './components/Container';
import InlineContainer from './components/InlineContainer';
import MemberRow from './components/MemberRow';

interface MemberSectionProps {
  inline?: boolean;
  members: Realtime.DBMember[];
  resendInvite: (email: string, permissionType: UserRole | null, showToast?: boolean | undefined) => Promise<void>;
}

const MemberSection: React.FC<MemberSectionProps> = ({ inline, members, resendInvite }) => {
  const Wrapper = (inline ? InlineContainer : Container) as typeof InlineContainer;

  return (
    <Wrapper id={Identifier.MEMBERS_CONTAINER}>
      {members.map((member, index) => (
        <MemberRow
          key={member.email}
          inline={inline}
          member={member}
          pending={!member.creator_id}
          isLast={index === members.length - 1}
          resendInvite={resendInvite}
        />
      ))}
    </Wrapper>
  );
};

export default MemberSection;
