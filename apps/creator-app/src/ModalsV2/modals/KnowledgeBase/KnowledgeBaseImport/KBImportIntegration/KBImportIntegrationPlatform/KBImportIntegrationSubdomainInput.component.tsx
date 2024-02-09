import { BaseProps, Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

interface IKBImportIntegrationSubdomainInput extends BaseProps {
  value: string;
  error: string | null;
  onValueChange: (value: string) => void;
}

export const KBImportIntegrationSubdomainInput: React.FC<IKBImportIntegrationSubdomainInput> = ({ value, error, onValueChange, testID }) => {
  const input = useInput({
    value,
    error,
    onSave: onValueChange,
    autoFocusIfEmpty: true,
  });

  return (
    <Box width="100%" direction="column">
      <TextField
        {...input.attributes}
        label="Subdomain URL"
        caption={input.errored ? undefined : 'e.g. https://company.zendesk.com'}
        placeholder="Enter url"
        errorMessage={input.errorMessage}
        testID={testID}
      />
    </Box>
  );
};
