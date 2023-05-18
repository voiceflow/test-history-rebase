import { BaseVersion } from '@voiceflow/base-types';
import { Button, Modal, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import PromptInput from '@/components/PromptInput';
import * as Tracking from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useHotkey, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

const GlobalNoMatchModal = manager.create('GlobalNoMatchModal', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const projectConfig = useActiveProjectTypeConfig();

  const [trackingEvents] = useTrackingEvents();

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);
  const globalNoMatch = useSelector(VersionV2.active.globalNoMatchSelector);

  const patchSettings = useDispatch(Version.patchSettings);

  const [prompt, setPrompt] = React.useState(
    () => globalNoMatch?.prompt ?? projectConfig.utils.prompt.factory({ defaultVoice, content: VoiceflowConstants.defaultMessages.globalNoMatch })
  );

  const onSubmit: React.MouseEventHandler = async () => {
    try {
      api.preventClose();

      await patchSettings({ globalNoMatch: { type: BaseVersion.GlobalNoMatchType.STATIC, prompt } });

      trackingEvents.trackNoMatchCreated({ creationType: Tracking.NoMatchCreationType.GLOBAL });

      api.enableClose();
      api.close();
    } catch {
      api.enableClose();
      toast.error('Failed to update Global No Match.');
    }
  };

  useHotkey(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true });

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header actions={<Modal.Header.CloseButtonAction disabled={closePrevented} onClick={api.close} />}>Global No Match</Modal.Header>

      <Modal.Body>
        <PromptInput value={prompt} onChange={setPrompt} placeholder="Enter default no match response" />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.PRIMARY} disabled={closePrevented} squareRadius onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default GlobalNoMatchModal;
