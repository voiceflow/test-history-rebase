import { Button, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import PromptInput from '@/components/PromptInput';
import * as Session from '@/ducks/session';
import * as Tracking from '@/ducks/tracking';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useHotKeys, useSelector, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

const GlobalNoReplyModal = manager.create('GlobalNoReplyModal', () => ({ api, type, opened, hidden, animated, closePrevented }) => {
  const projectConfig = useActiveProjectTypeConfig();

  const [trackingEvents] = useTrackingEvents();

  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);
  const globalNoReply = useSelector(VersionV2.active.globalNoReplySelector);
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const workspaceID = useSelector(Session.activeWorkspaceIDSelector);

  const patchSettings = useDispatch(Version.patchSettings);

  const [prompt, setPrompt] = React.useState(() => globalNoReply?.prompt ?? projectConfig.utils.prompt.factory({ defaultVoice }));

  const onSubmit: React.MouseEventHandler = async () => {
    try {
      api.preventClose();

      await patchSettings({
        globalNoReply: { delay: globalNoReply?.delay, prompt },
      });

      trackingEvents.trackNoReplyCreated({
        workspace_id: workspaceID,
        project_id: projectID,
        creation_type: Tracking.NoMatchCreationType.GLOBAL,
      });

      api.enableClose();
      api.close();
    } catch {
      api.enableClose();
      toast.error('Failed to update Global No Reply.');
    }
  };

  useHotKeys(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true }, [api.close]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header actions={<Modal.Header.CloseButton disabled={closePrevented} onClick={api.close} />}>Global No Reply</Modal.Header>

      <Modal.Body>
        <PromptInput value={prompt} onChange={setPrompt} placeholder="Enter default no reply response" />
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.PRIMARY} disabled={closePrevented} squareRadius onClick={onSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default GlobalNoReplyModal;
