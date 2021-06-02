import React from 'react';

import { UserRole } from '@/constants';
import { Identifier } from '@/styles/constants';

import Container from './components/Container';
import MemberRow from './components/MemberRow';

const MemberSection = ({ members, removeMember, resendInvite }) => (
  <Container id={Identifier.MEMBERS_CONTAINER}>
    {members.map((member, i) => (
      <MemberRow
        key={`${member.email}-${i}`}
        index={i}
        member={member}
        isOwner={member.role === UserRole.ADMIN}
        pending={!member.creator_id}
        removeMember={removeMember}
        resendInvite={resendInvite}
      />
    ))}
  </Container>
);

export default MemberSection;
