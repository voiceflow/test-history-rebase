import { Button, Input, Modal } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import _get from 'lodash/get';
import React from 'react';

import client from '@/client';
import * as Account from '@/ducks/account';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { useTrackingEvents } from '@/hooks/tracking';

import manager from '../../manager';

const AccountName = manager.create('AccountName', () => ({ api, type, opened, hidden, animated }) => {
  const user = useSelector(Account.userSelector);

  const [saving, setSaving] = React.useState(false);
  const [saveName, setSaveName] = React.useState(user.name ?? '');

  const updateAccount = useDispatch(Account.updateAccount);

  const [trackingEvents] = useTrackingEvents();

  const handleSave = async () => {
    if (!saveName.trim() || saving) return;

    setSaving(true);

    try {
      await client.identity.user.update({ name: saveName });

      updateAccount({ name: saveName });

      setSaving(false);

      toast.success('Name successfully updated');
      trackingEvents.trackProfileNameChanged();
      api.close();
    } catch (e) {
      const errText = _get(e, ['body', 'data']) || false;
      const errToast = errText || 'Unable to update name';

      setSaving(false);

      toast.error(errToast);
    }
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>Edit Name</Modal.Header>

      <Modal.Body>
        <Input autoFocus value={saveName} placeholder="Enter name" onChangeText={setSaveName} onEnterPress={handleSave} />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => api.close()} squareRadius>
          Cancel
        </Button>

        <Button disabled={!saveName || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default AccountName;
