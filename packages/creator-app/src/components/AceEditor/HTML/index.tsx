import { Box, Preview } from '@voiceflow/ui';
import React from 'react';

import { copyWithToast } from '@/utils/clipboard';

import { HTMLAceEditor } from './styled';

interface HTMLSampleProps {
  sample: string;
}

export const HTMLSample: React.FC<HTMLSampleProps> = ({ sample }) => {
  return (
    <Box position="relative">
      <HTMLAceEditor
        readOnly
        fontSize={13}
        value={sample}
        showGutter={false}
        highlightActiveLine={false}
        setOptions={{ useWorker: false, indentedSoftWrap: false, maxLines: Infinity, fontSize: 15 }}
        onLoad={(editor) => {
          editor.renderer.setPadding(32);
          editor.renderer.setScrollMargin(16, 16, 0, 0);
        }}
      />
      <Box position="absolute" right={16} top={16}>
        <Preview.ButtonIcon icon="copy" onClick={copyWithToast(sample)} style={{ height: 42, width: 56 }} />
      </Box>
    </Box>
  );
};
