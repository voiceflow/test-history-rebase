import { Box, Divider, DotSeparator, Text, Tokens } from '@voiceflow/ui-next';
import React from 'react';

import { footerStyle } from './PreviewResultFooter.css';
import { IPreviewResultFooter } from './PreviewResultFooter.interface';

export const PreviewResultFooter: React.FC<IPreviewResultFooter> = ({ status, latency, disabled, children }) => {
  return (
    <>
      <Divider noPadding />

      <Box px={24} py={12} justify="space-between" align="center" className={footerStyle({ disabled })}>
        <Box gap={11} align="center">
          <Text variant="caption" weight="semiBold" color={status === 'error' ? Tokens.colors.alert.alert700 : Tokens.colors.success.success600}>
            {status === 'error' ? 'Error' : 'Success'}
          </Text>

          <DotSeparator light />

          <Text variant="caption" color={Tokens.colors.neutralDark.neutralsDark50}>
            {latency}ms
          </Text>
        </Box>

        {children}
      </Box>
    </>
  );
};
