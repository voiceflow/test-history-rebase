import { Button, Input, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Session from '@/ducks/session';
import { useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../manager';

export interface Props {
  reFetchVersions?: VoidFunction;
}

const ManualSave = manager.create<Props>('ManualSave', () => ({ api, type, opened, hidden, animated, reFetchVersions }) => {
  const [saveName, setSaveName] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;
  const [trackingEvents] = useTrackingEvents();

  const handleSave = async () => {
    if (!saveName.trim() || saving) return;
    setSaving(true);

    try {
      await client.version.getVersionSnapshot(activeVersionID, saveName.trim());

      trackingEvents.trackVersionManuallyCreated();
      toast.success(`Saved new version '${saveName}'`);
      reFetchVersions?.();
      api.close();
    } catch (e) {
      toast.error('Unable to save version, try again later');
      setSaving(false);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Save New Version</Modal.Header>
      <Modal.Body>
        <Input value={saveName} placeholder="Enter version name" onChangeText={setSaveName} onEnterPress={handleSave} autoFocus />
      </Modal.Body>

      <Modal.Footer>
        <Button disabled={!saveName || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default ManualSave;
