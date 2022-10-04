import { Box, Button, Input, Modal, SectionV2, SvgIcon, toast } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useDispatch } from '@/hooks';

import manager from '../../manager';

const AccountEmail = manager.create('AccountEmail', () => ({ api, type, opened, hidden, animated }) => {
  const [saving, setSaving] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [nextEmail, setNextEmail] = React.useState('');

  const sendUpdateEmailEmail = useDispatch(Account.sendUpdateEmailEmail);

  const onSave = async () => {
    if (!password.trim() || saving) return;

    setSaving(true);

    try {
      await sendUpdateEmailEmail(nextEmail, password);

      toast.success('Validation email successfully sent');

      api.close();
    } catch (error) {
      toast.error(error?.message ? `Unable to verify email: ${error.massage}` : 'Unable to verify email, try again later');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Change Email</Modal.Header>

      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            Email
          </SectionV2.Title>
        }
        headerProps={{ topUnit: 0, bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: false }}
      >
        <Input value={nextEmail} autoFocus onChangeText={setNextEmail} placeholder="New Email" onEnterPress={onSave} />
      </SectionV2.SimpleContentSection>

      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            Password
          </SectionV2.Title>
        }
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: 3 }}
      >
        <Input value={password} type="password" onEnterPress={onSave} onChangeText={setPassword} placeholder="Confirm Voiceflow password" />
      </SectionV2.SimpleContentSection>

      <SectionV2.Divider />

      <SectionV2.SimpleSection isAccent>
        <Box.Flex>
          <SvgIcon icon="info" color="#3d82e2" mr={16} mb={16} />

          <SectionV2.InfoMessage>
            We will send a validation email to your new email address. Click the "Confirm email" button inside to complete the change.
          </SectionV2.InfoMessage>
        </Box.Flex>
      </SectionV2.SimpleSection>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => api.close()} squareRadius>
          Cancel
        </Button>

        <Button disabled={!nextEmail || saving} onClick={onSave} squareRadius>
          {saving ? 'Saving...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default AccountEmail;
