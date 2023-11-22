import { Button, Input, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import { designerClient } from '@/client/designer';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../manager';

export interface Props {
  reFetchBackups?: VoidFunction;
}

const ManualSaveBackup = manager.create<Props>('ManualSaveBackup', () => ({ api, type, opened, hidden, animated, reFetchBackups }) => {
  const [saveName, setSaveName] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const [trackingEvents] = useTrackingEvents();

  const handleSave = async () => {
    if (!saveName.trim() || saving) return;
    setSaving(true);

    try {
      await designerClient.backup.createOne(projectID, { versionID: activeVersionID, name: saveName.trim() });

      trackingEvents.trackBackupManuallyCreated();
      toast.success(`Saved new backup '${saveName}'`);
      reFetchBackups?.();
      api.close();
    } catch (e) {
      toast.error('Unable to save backup, try again later');
      setSaving(false);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Save New Backup</Modal.Header>
      <Modal.Body>
        <Input value={saveName} placeholder="Enter backup name" onChangeText={setSaveName} onEnterPress={handleSave} autoFocus disabled={saving} />
      </Modal.Body>

      <Modal.Footer>
        <Button disabled={!saveName || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ManualSaveBackup;
