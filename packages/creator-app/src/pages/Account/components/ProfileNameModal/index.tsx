import { Button, Input, Link, toast } from '@voiceflow/ui';
import React from 'react';

// import client from '@/client';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import { useModals, useSelector } from '@/hooks';
import { withEnterPress, withTargetValue } from '@/utils/dom';

const ProfileNameModal: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const [saveName, setSaveName] = React.useState(user.name ?? '');
  const [saving, setSaving] = React.useState(false);
  const { isOpened, close } = useModals(ModalType.PROFILE_NAME_MODAL);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setSaving(false);
    setSaveName('');
  };

  React.useEffect(() => {
    if (isOpened) {
      nameInputRef.current?.focus();
    }
  }, [isOpened]);

  const handleSave = async () => {
    if (!saveName.trim() || saving) return;
    setSaving(true);
    try {
      toast.success('Name successfully updated');
      reset();
      close();
    } catch (e) {
      toast.error('Unable to save name, try again later');
      setSaving(false);
    }
  };

  return isOpened ? (
    <Modal id={ModalType.PROFILE_NAME_MODAL} title="Change Name">
      <ModalBody>
        <div style={{ color: '#62778c', marginBottom: '12px', fontWeight: 600 }}>Name</div>
        <Input
          onKeyPress={withEnterPress(handleSave)}
          ref={nameInputRef}
          value={saveName}
          onChange={withTargetValue(setSaveName)}
          placeholder="Enter name"
        />
      </ModalBody>
      <ModalFooter>
        <Link onClick={() => close()} style={{ marginRight: '33px', fontWeight: 600 }}>
          Cancel
        </Link>
        <Button disabled={!saveName || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </ModalFooter>
    </Modal>
  ) : null;
};

export default ProfileNameModal;
