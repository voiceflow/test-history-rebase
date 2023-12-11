import { Button, ButtonVariant, Input, Modal, SectionV2, TippyTooltip, toast } from '@voiceflow/ui';
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import _get from 'lodash/get';
import React from 'react';

import client from '@/client';
import { useTrackingEvents } from '@/hooks/tracking';
import { PASSWORD_REGEXES, PasswordVerification } from '@/pages/Auth/components';

import manager from '../../manager';

const verifyPassword = (password: string) => PASSWORD_REGEXES.every((regex) => password.match(regex));

const AccountPassword = manager.create('AccountPassword', () => ({ api, type, opened, hidden, animated }) => {
  const [saving, setSaving] = React.useState(false);
  const [nextPassword, setNextPassword] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isValid, setIsValid] = React.useState(true);

  const [trackingEvents] = useTrackingEvents();

  const handleSave = async () => {
    if (!currentPassword.trim() || saving) return;

    if (nextPassword !== confirmPassword) {
      toast.error('New passwords do not match');
    } else if (!verifyPassword(nextPassword)) {
      setIsValid(false);
    } else {
      setIsValid(false);
      setSaving(true);

      try {
        await client.identity.user.updatePassword(currentPassword, nextPassword);

        setSaving(false);

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
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />} border>
        Edit Password
      </Modal.Header>

      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            Current Password
          </SectionV2.Title>
        }
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: false }}
      >
        <Input
          autoFocus
          type="password"
          value={currentPassword}
          placeholder="Current password"
          onChangeText={setCurrentPassword}
          onEnterPress={handleSave}
        />
      </SectionV2.SimpleContentSection>

      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            New Password
          </SectionV2.Title>
        }
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: false }}
      >
        <TippyTooltip
          offset={[0, 5]}
          visible={!!nextPassword && !isValid && !verifyPassword(nextPassword)}
          content={<PasswordVerification password={nextPassword} />}
          placement="bottom-start"
        >
          <Input
            type="password"
            required={false}
            value={nextPassword}
            placeholder="New password"
            onEnterPress={handleSave}
            onChangeText={setNextPassword}
          />
        </TippyTooltip>
      </SectionV2.SimpleContentSection>
      <SectionV2.SimpleContentSection
        header={
          <SectionV2.Title bold secondary>
            Confirm Password
          </SectionV2.Title>
        }
        headerProps={{ bottomUnit: 1.5 }}
        contentProps={{ bottomOffset: 4 }}
      >
        <Input
          type="password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onEnterPress={handleSave}
          placeholder="Confirm new password"
        />
      </SectionV2.SimpleContentSection>

      <Modal.Footer gap={12}>
        <Button variant={ButtonVariant.TERTIARY} onClick={api.onClose} squareRadius>
          Cancel
        </Button>

        <Button disabled={!nextPassword || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default AccountPassword;
