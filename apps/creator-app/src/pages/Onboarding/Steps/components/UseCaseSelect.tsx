import { Box, Input, Select } from '@voiceflow/ui';
import React from 'react';

const USE_CASE_OPTIONS = ['Agency', 'Customer Support', 'Internal Automation', 'Lead Capture', 'Other'];

interface UseCaseSelectProps {
  useCase?: string;
  setUseCase: (role: string) => void;
}

const UseCaseSelect: React.FC<UseCaseSelectProps> = ({ useCase, setUseCase }) => {
  const [isOther, setIsOther] = React.useState(!!useCase && !USE_CASE_OPTIONS.includes(useCase));

  const updateUseCase = (value: string) => {
    if (value === 'Other') {
      setUseCase('');
      setIsOther(true);
    } else {
      setUseCase(value);
      setIsOther(false);
    }
  };

  return (
    <>
      <Select
        searchLabel={isOther ? 'Other' : useCase}
        value={useCase}
        options={USE_CASE_OPTIONS}
        placeholder="Select your main use case"
        onSelect={updateUseCase}
      />
      {isOther && (
        <Box mt={11}>
          <Input placeholder="Please specify" value={useCase} onChangeText={setUseCase} />
        </Box>
      )}
    </>
  );
};

export default UseCaseSelect;
