import { Button, Input, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import Modal, { ModalBody, ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Session from '@/ducks/session';
import { useModals, useSelector } from '@/hooks';
import { withEnterPress } from '@/utils/dom';

const ManualSaveModal: React.FC = () => {
  const [saveName, setSaveName] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const { isOpened, close, data } = useModals<{ reFetchVersions?: VoidFunction }>(ModalType.MANUAL_SAVE_MODAL);
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;
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
      await client.version.getVersionSnapshot(activeVersionID, saveName.trim());
      toast.success(`Saved new version '${saveName}'`);
      data.reFetchVersions?.();
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
        <Input
          onKeyPress={withEnterPress(handleSave)}
          ref={nameInputRef}
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Enter version name"
        />
      </ModalBody>
      <ModalFooter>
        <Button disabled={!saveName || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </ModalFooter>
    </Modal>
  ) : null;
};

export default ManualSaveModal;
