import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Input, Modal } from '@voiceflow/ui';
import React from 'react';

import { useFeature } from '@/hooks/feature';
import { useHotkey } from '@/hooks/hotkeys';
import { useActiveProjectPlatformConfig } from '@/hooks/platformConfig';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

export interface Props {
  message?: React.ReactNode;
}

export interface Result {
  versionName: string;
}

const NewVersion = manager.create<Props, Result>('PublishNewVersion', () => ({ api, type, opened, hidden, animated, message, closePrevented }) => {
  const platformConfig = useActiveProjectPlatformConfig();
  const { isEnabled: isProjectApiImprovementsEnabled } = useFeature(Realtime.FeatureFlag.PROJECT_API_IMPROVEMENTS);

  const [versionName, setVersionName] = React.useState('');

  const onConfirm = () => {
    api.resolve({ versionName });
    api.close();
  };

  const getModalTitle = () => {
    if (platformConfig.withThirdPartyUpload) return 'Upload new version';
    if (isProjectApiImprovementsEnabled) return 'Export for Production';
    return 'Publish for Production';
  };

  useHotkey(Hotkey.SUBMIT, onConfirm, { preventDefault: true });
  useHotkey(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true });

  return (
    <Modal type={type} maxWidth={392} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>{getModalTitle()}</Modal.Header>

      <Modal.Body>
        <Box mb={16}>{message ?? `This action will upload a new version to ${platformConfig.name}. Confirm you want to continue.`}</Box>

        <Input
          value={versionName}
          readOnly={closePrevented}
          autoFocus
          placeholder="Enter version name (optional)"
          onChangeText={setVersionName}
          onEnterPress={onConfirm}
        />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button onClick={() => api.close()} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>

        <Button onClick={onConfirm} disabled={closePrevented} squareRadius>
          {platformConfig.withThirdPartyUpload ? 'Upload' : 'Publish'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default NewVersion;
