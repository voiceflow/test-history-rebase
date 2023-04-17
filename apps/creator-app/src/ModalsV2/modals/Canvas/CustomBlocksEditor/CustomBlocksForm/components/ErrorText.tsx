import { Text } from '@voiceflow/ui';
import React from 'react';

import THEME from '@/styles/theme';

interface ErrorTextProps {
  errorMessage: string | null;
}

const ErrorText: React.FC<ErrorTextProps> = ({ errorMessage }) => {
  return errorMessage ? (
    <div style={{ marginTop: 11 }}>
      <Text color={THEME.colors.error} fontSize={13}>
        {errorMessage}
      </Text>
    </div>
  ) : null;
};

export default ErrorText;
