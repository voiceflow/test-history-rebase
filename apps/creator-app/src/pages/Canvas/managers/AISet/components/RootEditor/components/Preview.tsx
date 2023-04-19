import { Box, Modal, Tag } from '@voiceflow/ui';
import React from 'react';

import manager from '@/ModalsV2/manager';
import { ResponsePreviewContainer } from '@/pages/Canvas/managers/AIResponse/components/RootEditor/styles';

interface Props {
  results: { variable: string | null; result: string }[];
}

const AISetPreview = manager.create<Props>('AISetPreview', () => ({ api, type, opened, hidden, animated, results }) => (
  <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
    <Modal.Header actions={<Modal.Header.CloseButtonAction onClick={api.close} />}>Variable Preview</Modal.Header>
    <Modal.Body>
      <Box.FlexColumn gap={24} alignItems="stretch">
        {results.map((result, index) => (
          <Box key={index}>
            <Box mb={11}>
              <Tag>{`{${result.variable || '???'}}`}</Tag>
            </Box>
            <ResponsePreviewContainer>{result.result}</ResponsePreviewContainer>
          </Box>
        ))}
      </Box.FlexColumn>
    </Modal.Body>
  </Modal>
));

export default AISetPreview;
