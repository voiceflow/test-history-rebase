import { Box, Button, ButtonVariant, Input, Modal, stopImmediatePropagation, SvgIcon, toast } from '@voiceflow/ui';
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import _get from 'lodash/get';
import React from 'react';

import client from '@/client';
import UpgradeContainer from '@/components/Upgrade/UpgradeContainer';

import manager from '../../manager';

const AccountEmail = manager.create('AccountEmail', () => ({ api, type, opened, hidden, animated }) => {
  const [saving, setSaving] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [nextEmail, setNextEmail] = React.useState('');

  const handleSave = async () => {
    if (!password.trim() || saving) return;

    setSaving(true);

    try {
      await client.user.updateEmail(password, nextEmail);

      setSaving(false);

      toast.success('Validation email successfully sent');
      api.close();
    } catch (e) {
      const errText = _get(e, ['body', 'data']) || false;
      const errToast = errText || 'Unable to update email, try again later';

      setSaving(false);

      toast.error(errToast);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Change Email</Modal.Header>

      <Modal.Body>
        <div style={{ color: '#62778c', marginBottom: '12px', fontWeight: 600 }}>Email</div>

        <Input autoFocus value={nextEmail} onChangeText={setNextEmail} placeholder="New Email" onEnterPress={handleSave} />

        <br />

        <div style={{ color: '#62778c', marginBottom: '12px', fontWeight: 600 }}>Password</div>

        <Input onEnterPress={handleSave} value={password} onChangeText={setPassword} placeholder="Confirm Voiceflow password" type="password" />

        <br />
        <br />
        <br />

        <Box position="absolute" left={0} right={0} bottom={0}>
          <UpgradeContainer onClick={stopImmediatePropagation()} style={{ padding: '32px' }}>
            <SvgIcon icon="info" color="#3d82e2" mr={16} mb={16} />
            We will send a validation email to your new email address. Click the "Confirm email" button inside to complete the change. &nbsp;
          </UpgradeContainer>
        </Box>
      </Modal.Body>

      <Modal.Footer>
        <Button variant={ButtonVariant.TERTIARY} onClick={() => api.close()} style={{ marginRight: '12px' }}>
          Cancel
        </Button>

        <Button disabled={!nextEmail || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default AccountEmail;
