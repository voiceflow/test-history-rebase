import { Button, Input, Link, toast } from '@voiceflow/ui';
import _get from 'lodash/get';
import React from 'react';

import client from '@/client';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import { MIN_PASSWORD_LENGTH } from '@/pages/Auth/constants';
import { withEnterPress, withTargetValue } from '@/utils/dom';

const ChangePasswordModal: React.FC = () => {
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [nextPassword, setNextPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const { isOpened, close } = useModals(ModalType.CHANGE_PASSWORD_MODAL);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setSaving(false);
    setCurrentPassword('');
    setConfirmPassword('');
    setNextPassword('');
  };

  React.useEffect(() => {
    if (isOpened) {
      nameInputRef.current?.focus();
    }
  }, [isOpened]);

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
        reset();
        close();
      } catch (e) {
        const errText = _get(e, ['body', 'data']) || false;
        const errToast = errText || 'Unable to update password';
        setSaving(false);
        toast.error(errToast);
      }
    }
  };

  if (!isOpened) return null;

  return (
    <Modal id={ModalType.CHANGE_PASSWORD_MODAL} title="Change Password">
      <ModalBody>
        <Input
          onKeyPress={withEnterPress(handleSave)}
          ref={nameInputRef}
          value={currentPassword}
          onChange={withTargetValue(setCurrentPassword)}
          type="password"
          placeholder="Current password"
        />
        <br />
        <Input
          onKeyPress={withEnterPress(handleSave)}
          value={nextPassword}
          onChange={withTargetValue(setNextPassword)}
          placeholder="New password"
          type="password"
        />
        <br />
        <Input
          onKeyPress={withEnterPress(handleSave)}
          value={confirmPassword}
          onChange={withTargetValue(setConfirmPassword)}
          placeholder="Confirm new password"
          type="password"
        />
      </ModalBody>
      <ModalFooter>
        <Link onClick={() => close()} style={{ marginRight: '33px', fontWeight: 600 }}>
          Cancel
        </Link>
        <Button disabled={!nextPassword || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Submit'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangePasswordModal;
