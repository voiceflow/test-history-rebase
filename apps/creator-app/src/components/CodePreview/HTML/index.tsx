import { Box, Preview } from '@voiceflow/ui';
import React from 'react';

import { copyWithToast } from '@/utils/clipboard';

interface PreviewHTMLProps {
  code: string;
  onCopy?: () => void;
}

export const PreviewHTML: React.FC<PreviewHTMLProps> = ({ code, onCopy }) => {
  return (
    <Box position="relative" borderRadius={8} overflow="hidden" backgroundColor={Preview.Colors.GREY_DARK_BACKGROUND_COLOR}>
      <Preview.Code code={code} wrapLongLines={false} padding="20px 24px" />
      <Box position="absolute" right={16} top={16}>
        <Preview.ButtonIcon
          icon="copy"
          onClick={() => {
            copyWithToast(code)();
            onCopy?.();
          }}
          style={{ height: 42, width: 56 }}
        />
      </Box>
    </Box>
  );
};
