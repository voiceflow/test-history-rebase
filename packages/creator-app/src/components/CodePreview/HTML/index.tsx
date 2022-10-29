import { Box, Preview } from '@voiceflow/ui';
import React from 'react';

import { copyWithToast } from '@/utils/clipboard';

interface PreviewHTMLProps {
  code: string;
}

export const PreviewHTML: React.FC<PreviewHTMLProps> = ({ code }) => {
  return (
    <Box position="relative" borderRadius={8} overflow="hidden">
      <Preview.Code code={code} wrapLongLines={false} padding="20px 24px" />
      <Box position="absolute" right={16} top={16}>
        <Preview.ButtonIcon icon="copy" onClick={copyWithToast(code)} style={{ height: 42, width: 56 }} />
      </Box>
    </Box>
  );
};
