/* eslint-disable jsx-a11y/no-autofocus */
import { Button, ButtonVariant, Input, Modal, toast } from '@voiceflow/ui';
import _get from 'lodash/get';
import React from 'react';

import client from '@/client';
import { useTrackingEvents } from '@/hooks';
import { MIN_PASSWORD_LENGTH } from '@/pages/Auth/constants';

import manager from '../../manager';

const ChangePassword = manager.create('ChangePassword', () => ({ api, type, opened, hidden, animated }) => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [nextPassword, setNextPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [trackingEvents] = useTrackingEvents();

  const handleSave = async () => {
    if (!currentPassword.trim() || saving) return;

    setSaving(true);

    if (nextPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      setSaving(false);
    } else if (nextPassword.length < MIN_PASSWORD_LENGTH) {
      toast.error(`New password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      setSaving(false);
    } else {
      try {
        await client.user.updatePassword(currentPassword, nextPassword);
        toast.success('Password successfully updated');
        trackingEvents.trackProfilePasswordChanged();
        api.close();
      } catch (e) {
        setSaving(false);

        toast.error(_get(e, ['body', 'data']) ?? 'Unable to update password');
      }
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Change Password</Modal.Header>
      <Modal.Body>
        <Input
          autoFocus
          type="password"
          value={currentPassword}
          placeholder="Current password"
          onChangeText={setCurrentPassword}
          onEnterPress={handleSave}
        />

        <br />

        <Input type="password" value={nextPassword} placeholder="New password" onEnterPress={handleSave} onChangeText={setNextPassword} />

        <br />

        <Input
          type="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onEnterPress={handleSave}
          placeholder="Confirm new password"
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant={ButtonVariant.TERTIARY} onClick={() => api.close()} style={{ marginRight: '15px' }}>
          Cancel
        </Button>

        <Button disabled={!nextPassword || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ChangePassword;
