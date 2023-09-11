import { Box, Button, InputFormControl } from '@voiceflow/ui-next';
import React, { useState } from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { isMarkupEmpty, markupFactory } from '@/utils/markup.util';

import { buttonStyle, inputStyle } from './MediaLibraryImageUploadURLSection.css';
import type { IMediaLibraryImageUploadURLSection } from './MediaLibraryImageUploadURLSection.interface';

export const MediaLibraryImageUploadURLSection: React.FC<IMediaLibraryImageUploadURLSection> = ({ error, imageUrl, isLoading, onUrlSubmit }) => {
  const [value, setValue] = useState(() => imageUrl ?? markupFactory());
  const [isEmpty, setEmpty] = useState(() => isMarkupEmpty(value));
  const [touched, setTouched] = useState(false);

  return (
    <Box direction="column">
      <InputFormControl errorMessage={touched ? undefined : error}>
        <InputWithVariables
          value={value}
          error={!!error && !touched}
          autoFocus
          onTouched={setTouched}
          className={inputStyle({ filled: (!error || touched) && !isEmpty })}
          placeholder="Enter URL or {variable}"
          onValueEmpty={setEmpty}
          onValueChange={setValue}
        />
      </InputFormControl>

      {(!error || touched) && !isEmpty && (
        <Button
          label={imageUrl ? 'Update' : 'Add'}
          variant="primary"
          onClick={() => onUrlSubmit(value)}
          disabled={isLoading}
          isLoading={isLoading}
          fullWidth
          className={buttonStyle}
        />
      )}
    </Box>
  );
};
