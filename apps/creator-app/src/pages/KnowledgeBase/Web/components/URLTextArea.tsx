import { Box, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';

import { useURLs } from '../hooks';

const PLACEHOLDER = `https://example.com/about`;

const URLTextArea: React.FC<ReturnType<typeof useURLs>> = ({ urls, setUrls, validate, errors }) => {
  const hasError = !!errors.length;

  return (
    <>
      <TextArea value={urls} onChangeText={setUrls} minRows={2} maxRows={25} placeholder={PLACEHOLDER} onBlur={validate} error={hasError} />
      {hasError && (
        <Box color={ThemeColor.ERROR} mt={8}>
          {errors.map((error, index) => (
            <Box key={index}>{error}</Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default URLTextArea;
