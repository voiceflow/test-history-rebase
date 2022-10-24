import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Input, Link, Modal, toast } from '@voiceflow/ui';
// eslint-disable-next-line you-dont-need-lodash-underscore/get
import _get from 'lodash/get';
import React from 'react';

import client from '@/client';
import * as Account from '@/ducks/account';
import * as Feature from '@/ducks/feature';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';

import manager from '../../manager';

const AccountName = manager.create('AccountName', () => ({ api, type, opened, hidden, animated }) => {
  const user = useSelector(Account.userSelector);
  const isIdentityUserEnabled = useSelector(Feature.isFeatureEnabledSelector)(Realtime.FeatureFlag.IDENTITY_USER);

  const [saving, setSaving] = React.useState(false);
  const [saveName, setSaveName] = React.useState(user.name ?? '');

  const updateAccount = useDispatch(Account.updateAccount);

  const [trackingEvents] = useTrackingEvents();

  const handleSave = async () => {
    if (!saveName.trim() || saving) return;

    setSaving(true);

    try {
      if (isIdentityUserEnabled) {
        await client.identity.user.update({ name: saveName });
      } else {
        await client.user.updateProfileName(saveName);
      }

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
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header>Change Name</Modal.Header>

      <Modal.Body>
        <div style={{ color: '#62778c', marginBottom: '12px', fontWeight: 600 }}>Name</div>
        <Input autoFocus value={saveName} placeholder="Enter name" onChangeText={setSaveName} onEnterPress={handleSave} />
      </Modal.Body>

      <Modal.Footer>
        <Link onClick={() => api.close()} style={{ marginRight: '33px', fontWeight: 600 }}>
          Cancel
        </Link>

        <Button disabled={!saveName || saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default AccountName;
