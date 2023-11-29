import { Box, SlateEditor } from '@voiceflow/ui-next';
import React from 'react';

import { ResponseTextInput } from '../ResponseTextInput/ResponseTextInput.component';
// import { ResponseVariantTypeDropdown } from '../ResponseVariantTypeDropdown/ResponseVariantTypeDropdown.component';
import type { IResponseTextVariantLayout } from './ResponseTextVariantLayout.interface';

export const ResponseTextVariantLayout: React.FC<IResponseTextVariantLayout> = ({
  variantType,
  removeButton,
  settingsButton,
  attachmentsList,
  attachmentButton,
  onChangeVariantType,
  ...props
}) => {
  return (
    <>
      <ResponseTextInput
        {...props}
        toolbar={
          <Box pl={12} mr={-8} height="36px" align="center">
            {/* <Box pl={24} mr={-8} height="36px" align="center"> */}
            {/* <ResponseVariantTypeDropdown value={variantType} onValueChange={onChangeVariantType} /> */}

            <Box gap={2}>
              <SlateEditor.TextBoldButton />
              <SlateEditor.TextItalicButton />
              <SlateEditor.TextUnderlineButton />
              <SlateEditor.HyperlinkButton />
            </Box>

            <Box gap={8} grow={1} justify="end">
              {attachmentButton}

              {removeButton}
            </Box>
          </Box>
        }
      />

      {attachmentsList}

      {!!settingsButton && (
        <Box pl={24} pt={10}>
          {settingsButton}
        </Box>
      )}
    </>
  );
};
