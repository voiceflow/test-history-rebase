import { BaseNode } from '@voiceflow/base-types';
import { Button, Modal, toast } from '@voiceflow/ui';
import React from 'react';

import PromptInput from '@/components/PromptInput';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useHotKeys, useSelector } from '@/hooks';
import { Hotkey } from '@/keymap';

import manager from '../../manager';

const GlobalNoReplyModal = manager.create('GlobalNoReplyModal', () => ({ api, type, opened, hidden, animated }) => {
  const patchSettings = useDispatch(Version.patchSettings);
  const settings = useSelector(VersionV2.active.settingsSelector);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [value, setValue] = React.useState<BaseNode.Text.TextData>(settings?.globalNoReply?.prompt as BaseNode.Text.TextData);

  const onUpdate = (partial: Partial<BaseNode.Text.TextData>) => setValue((state) => ({ ...state, ...partial }));

  const onSubmit: React.MouseEventHandler = async () => {
    try {
      setIsSubmitting(true);
      api.preventClose();

      await patchSettings({
        globalNoReply: {
          prompt: value,
        },
      });

      api.enableClose();
      api.close();
    } catch {
      toast.error('Failed to update Global No Reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useHotKeys(Hotkey.MODAL_CLOSE, api.close, { preventDefault: true }, [api.close]);

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header actions={<Modal.Header.CloseButton disabled={isSubmitting} onClick={api.close} />}>Global No Reply</Modal.Header>
      <Modal.Body>
        <PromptInput onUpdate={onUpdate} value={value} placeholder="Enter default no reply response" />
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.PRIMARY} disabled={isSubmitting} squareRadius onClick={onSubmit}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default GlobalNoReplyModal;
