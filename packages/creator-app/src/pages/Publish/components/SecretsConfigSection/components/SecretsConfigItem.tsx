import { Box, Input, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import HideableInput from '@/components/HideableInput';
import THEME from '@/styles/theme';

import { SecretField } from '../types';

export interface SecretsConfigItemProps extends SecretField {
  value: any;
  onChangeValue?: (newSecretValue: unknown) => void | Promise<void>;
  className?: string;
}

export const SecretsConfigItem: React.OldFC<SecretsConfigItemProps> = ({
  name,
  value,
  onChangeValue,
  uiConfig: { description, isConfidential, placeholder },
  className,
}) => (
  <>
    <Box className={className} px={32} py={24}>
      <Box mb={11} fontWeight={600}>
        {name}
      </Box>
      <Box.Flex gap={24} alignContent="center">
        <Box minWidth={318}>
          {isConfidential ? (
            <HideableInput value={value} placeholder={placeholder} onChangeText={onChangeValue} />
          ) : (
            <Input value={value} placeholder={placeholder} onChangeText={onChangeValue} />
          )}
        </Box>
        <Box fontSize={THEME.fontSizes.s}>{description}</Box>
      </Box.Flex>
    </Box>
    <SectionV2.Divider />
  </>
);
