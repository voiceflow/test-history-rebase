import { Button, Input, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Session from '@/ducks/session';
import { useModals, useSelector } from '@/hooks';

const ImportModal: React.FC = () => {
  const [saveName, setSaveName] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const { isOpened, close } = useModals(ModalType.MANUAL_SAVE_MODAL);
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;

  const reset = () => {
    setSaving(false);
    setSaveName('');
  };

  const handleSave = async () => {
    if (!saveName.trim() || saving) return;
    setSaving(true);
    try {
      await client.version.getVersionSnapshot(activeVersionID);
      toast.success(`Saved new version '${saveName}'`);
      reset();
      close();
    } catch (e) {
      toast.error('Unable to save version, try again later');
      setSaving(false);
    }
  };

  return isOpened ? (
    <Modal id={ModalType.MANUAL_SAVE_MODAL} title="Save New Version">
      <ModalBody>
        <Input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Enter version name" />
      </ModalBody>
      <ModalFooter>
        <Button disabled={!saveName || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </ModalFooter>
    </Modal>
  ) : null;
};

export default ImportModal;
