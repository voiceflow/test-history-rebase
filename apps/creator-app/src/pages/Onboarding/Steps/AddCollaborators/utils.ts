import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import _toLower from 'lodash/toLower';

import { CollaboratorType } from '@/pages/Onboarding/types';

export const MAX_EDITOR_SEATS = 3;

export const withPlaceholderCollaborators = (collaborators: CollaboratorType[]) => {
  if (collaborators.length < MAX_EDITOR_SEATS) {
    return [
      ...collaborators,
      ...new Array<CollaboratorType>(MAX_EDITOR_SEATS - collaborators.length).fill({ email: '', permission: UserRole.EDITOR }),
    ];
  }

  return collaborators;
};

export const getError = (members: CollaboratorType[], member: CollaboratorType, index: number) => {
  if (!member.email) {
    return '';
  }

  if (!Utils.emails.isValidEmail(member.email)) {
    return 'Email is not valid.';
  }

  const loweredEmail = _toLower(member.email);

  const sourceMember = members.slice(0, index).find(({ email }) => _toLower(email) === loweredEmail);

  if (sourceMember) {
    if (sourceMember.permission === UserRole.ADMIN) {
      return 'This is your email.';
    }

    return 'Duplicate email.';
  }

  return '';
};
