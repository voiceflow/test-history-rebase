import { Utils } from '@voiceflow/common';
import { Box, Button, Modal, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import manager from '@/ModalsV2/manager';

import { sanitizeURLs, useURLs } from '../hooks';
import URLTextArea from './URLTextArea';

interface WebManagerProps {
  save: (urls: string[]) => void;
}

const WebManager = manager.create<WebManagerProps>('KnowledgeBaseURLs', () => ({ save, api, type, opened, hidden, animated, closePrevented }) => {
  const urlAPI = useURLs();
  const { urls, validate, disabled } = urlAPI;

  const onSave = () => {
    if (!validate()) return;

    // only save MAX_ROWS
    save(Utils.array.unique(sanitizeURLs(urls)));
    api.close();
  };

  return (
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={700}>
      <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>
        Add URLs
      </Modal.Header>
      <Modal.Body mt={16}>
        <Box mb={11} fontWeight={600} color={ThemeColor.SECONDARY}>
          Add URLs (separate by line)
        </Box>
        <URLTextArea {...urlAPI} />
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button onClick={api.close} variant={Button.Variant.TERTIARY} disabled={closePrevented} squareRadius>
          Cancel
        </Button>
        <Button disabled={closePrevented || disabled} onClick={onSave}>
          Add URLs
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default WebManager;
