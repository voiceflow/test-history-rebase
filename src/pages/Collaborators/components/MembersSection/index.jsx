import React from 'react';

import { UserRole } from '@/constants';

import Container from './components/Container';
import MemberRow from './components/MemberRow';

function MemberSection({ members, removeMember, resendInvite }) {
  return (
    <Container>
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
}

export default MemberSection;
