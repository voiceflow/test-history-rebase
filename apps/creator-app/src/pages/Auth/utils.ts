import { toast } from '@voiceflow/ui';

export const replaceSpaceWithPlus = (email?: string) => email?.replace(' ', '+') || email;

export const inviteEmailMatches = (query: { invite?: string; email?: string }, emailField: string | undefined) => {
  const { invite, email } = query;
  if (invite && email && replaceSpaceWithPlus(email) !== emailField) {
    toast.error('This email does not match the email associated with the invitation');
    return false;
  }
  return true;
};
