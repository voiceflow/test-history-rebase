import { Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import { Box, Button, Members, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import InputError from '@/components/InputError';
import SelectInputGroup from '@/components/SelectInputGroup';
import { Identifier } from '@/styles/constants';

import * as S from './styles';

interface InviteByEmailProps {
  buttonLabel?: string;
  onAddMembers: (emails: string[], role: UserRole) => void | Promise<void>;
}

const isEmailsValid = (emails: string[]) => emails.every(Utils.emails.isValidEmail);
const parseEmails = (emailInputValue: string) => emailInputValue.split(',').map((email) => email.trim());

const InviteByEmail: React.FC<InviteByEmailProps> = ({ buttonLabel = 'Add', onAddMembers }) => {
  const [role, setRole] = React.useState<UserRole>(UserRole.EDITOR);
  const [error, setError] = React.useState('');
  const [emails, setEmails] = React.useState('');

  const onSendInviteClick = async () => {
    setError('');
    const emailsToInvite = parseEmails(emails);

    if (!isEmailsValid(emailsToInvite)) {
      setError(emailsToInvite.length > 1 ? 'Some emails are invalid.' : 'Invalid email address');
      return;
    }

    try {
      onAddMembers(emailsToInvite, role);
      setEmails('');
    } catch (error) {
      if (error instanceof Error && error.message) {
        setError(error.message);
      }
    }
  };

  return (
    <Box width="100%">
      <Box.Flex gap={12} fullWidth>
        <SelectInputGroup
          renderInput={(props) => (
            <S.EmailInput
              {...props}
              icon={!emails ? 'email' : undefined}
              value={emails}
              error={!!error}
              onFocus={() => setError('')}
              iconProps={{ variant: SvgIcon.Variant.STANDARD, opacity: true }}
              placeholder="Email, comma separated"
              onChangeText={setEmails}
            />
          )}
        >
          {() => (
            <Box top={-1} position="relative">
              <Members.RoleSelect value={role} onChange={setRole} />
            </Box>
          )}
        </SelectInputGroup>

        <Button id={Identifier.COLLAB_SEND_INVITE_BUTTON} onClick={onSendInviteClick} disabled={!!error || !emails} variant={Button.Variant.PRIMARY}>
          {buttonLabel}
        </Button>
      </Box.Flex>

      {error && (
        <InputError mb={0} mt={11} color="#BD425F">
          {error}
        </InputError>
      )}
    </Box>
  );
};

export default InviteByEmail;
