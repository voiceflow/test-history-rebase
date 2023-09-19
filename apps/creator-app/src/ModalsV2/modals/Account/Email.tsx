import { Alert, Button, Input, Modal, SectionV2 } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as Account from '@/ducks/account';
import { useDispatch } from '@/hooks/realtime';
import { getErrorMessage } from '@/utils/error';

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
      const message = getErrorMessage(error);

      toast.error(`Unable to verify email: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>Change Email</Modal.Header>

      <SectionV2.SimpleSection headerProps={{ topUnit: 0.5, bottomUnit: 2.5 }}>
        <Alert title={<Alert.Title>Editing email address</Alert.Title>}>
          On submission of the form below, we will send a validation to your new email. You must open that email and confirm the change to see it
          appear in Voiceflow.
        </Alert>
      </SectionV2.SimpleSection>

      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            New Email
          </SectionV2.Title>
        }
        headerProps={{ topUnit: 0, bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: false }}
      >
        <Input value={nextEmail} autoFocus onChangeText={setNextEmail} placeholder="Enter new email" onEnterPress={onSave} />
      </SectionV2.SimpleContentSection>

      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            Password
          </SectionV2.Title>
        }
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: 4 }}
      >
        <Input value={password} type="password" onEnterPress={onSave} onChangeText={setPassword} placeholder="Confirm Voiceflow password" />
      </SectionV2.SimpleContentSection>

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
