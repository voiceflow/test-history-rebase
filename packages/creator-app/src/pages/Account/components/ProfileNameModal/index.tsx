import { Button, Input, Link, toast } from '@voiceflow/ui';
import _get from 'lodash/get';
import React from 'react';

import client from '@/client';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Account from '@/ducks/account';
import { useDispatch, useModals, useSelector } from '@/hooks';

const ProfileNameModal: React.FC = () => {
  const user = useSelector(Account.userSelector);
  const updateAccount = useDispatch(Account.updateAccount);
  const [saveName, setSaveName] = React.useState(user.name ?? '');
  const [saving, setSaving] = React.useState(false);
  const { isOpened, close } = useModals(ModalType.PROFILE_NAME_MODAL);
  const nameInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpened) {
      nameInputRef.current?.focus();
    }
  }, [isOpened]);

  const handleSave = async () => {
    if (!saveName.trim() || saving) return;
    setSaving(true);
    try {
      await client.user.updateProfileName(saveName);
      updateAccount({ name: saveName });
      toast.success('Name successfully updated');
      setSaving(false);
      close();
    } catch (e) {
      const errText = _get(e, ['body', 'data']) || false;
      const errToast = errText || 'Unable to update name';
      setSaving(false);
      toast.error(errToast);
    }
  };

  return isOpened ? (
    <Modal id={ModalType.PROFILE_NAME_MODAL} title="Change Name">
      <ModalBody>
        <div style={{ color: '#62778c', marginBottom: '12px', fontWeight: 600 }}>Name</div>
        <Input ref={nameInputRef} value={saveName} placeholder="Enter name" onChangeText={setSaveName} onEnterPress={handleSave} />
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
