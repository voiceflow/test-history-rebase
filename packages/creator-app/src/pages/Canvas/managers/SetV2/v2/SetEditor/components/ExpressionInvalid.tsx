import { Box } from '@voiceflow/ui';
import React from 'react';

interface ExpressionInvalidProps {
  error: boolean;
  errorMessage?: string;
}

const ExpressionInvalid: React.FC<ExpressionInvalidProps> = ({ error, errorMessage }) => {
  if (!error) return null;

  return (
    <Box fontSize={13} color="#e91e63" mt={16}>
      {errorMessage ? `Error: ${errorMessage}.` : 'Expression syntax is invalid.'}
    </Box>
  );
};

export default ExpressionInvalid;
