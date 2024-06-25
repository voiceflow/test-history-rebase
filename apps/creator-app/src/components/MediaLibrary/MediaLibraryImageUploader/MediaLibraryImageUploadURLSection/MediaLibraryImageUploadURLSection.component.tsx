import { Box, Button, InputFormControl } from '@voiceflow/ui-next';
import { isMarkupEmpty, markupFactory } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';
import { useInputFocus } from '@/hooks/input.hook';

import { buttonStyle, inputStyle } from './MediaLibraryImageUploadURLSection.css';
import type { IMediaLibraryImageUploadURLSection } from './MediaLibraryImageUploadURLSection.interface';

export const MediaLibraryImageUploadURLSection: React.FC<IMediaLibraryImageUploadURLSection> = ({
  error,
  imageUrl,
  isLoading,
  onUrlSubmit,
}) => {
  const focus = useInputFocus();
  const [value, setValue] = useState(() => imageUrl ?? markupFactory());
  const [isEmpty, setEmpty] = useState(() => isMarkupEmpty(value));

  return (
    <Box direction="column">
      <InputFormControl errorMessage={focus.active ? undefined : error}>
        <InputWithVariables
          {...focus.attributes}
          value={value}
          error={!!error && !focus.active}
          autoFocus
          className={inputStyle({ filled: (!error || focus.active) && !isEmpty })}
          placeholder="Enter URL or {variable}"
          onValueEmpty={setEmpty}
          onValueChange={setValue}
        />
      </InputFormControl>

      {(!error || focus.active) && !isEmpty && (
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
