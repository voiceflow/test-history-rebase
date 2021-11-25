import { Button, Input, Link, toast } from '@voiceflow/ui';
import React from 'react';

// import client from '@/client';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
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
    try {
      toast.success('Password successfully updated');
      reset();
      close();
    } catch (e) {
      toast.error('Unable to update password, try again later');
      setSaving(false);
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
          placeholder="Current password"
        />
        <br />
        <Input onKeyPress={withEnterPress(handleSave)} value={nextPassword} onChange={withTargetValue(setNextPassword)} placeholder="New password" />
        <br />
        <Input
          onKeyPress={withEnterPress(handleSave)}
          value={confirmPassword}
          onChange={withTargetValue(setConfirmPassword)}
          placeholder="Confirm new password"
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
