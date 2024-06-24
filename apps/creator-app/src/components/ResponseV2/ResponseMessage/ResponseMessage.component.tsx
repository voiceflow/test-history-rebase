import { tid } from '@voiceflow/style';
import { Box, SlateEditor } from '@voiceflow/ui-next';
import React from 'react';

import { ResponseMessageInput } from '../ResponseMessageInput/ResponseMessageInput.component';
// import { ResponseVariantTypeDropdown } from '../ResponseVariantTypeDropdown/ResponseVariantTypeDropdown.component';
import type { IResponseMessage } from './ResponseMessage.interface';

export const ResponseMessage: React.FC<IResponseMessage> = ({ removeButton, onChangeVariantType, ...props }) => {
  return (
    <>
      <ResponseMessageInput
        {...props}
        toolbar={
          <Box pl={12} mr={-8} height="36px" align="center" testID={tid(props.testID, 'toolbar')}>
            {/* <Box pl={24} mr={-8} height="36px" align="center"> */}
            {/* <ResponseVariantTypeDropdown value={variantType} onValueChange={onChangeVariantType} /> */}

            <Box gap={2}>
              <SlateEditor.TextBoldButton />
              <SlateEditor.TextItalicButton />
              <SlateEditor.TextUnderlineButton />
              <SlateEditor.HyperlinkButton />
            </Box>

            <Box gap={8} grow={1} justify="end">
              {removeButton}
            </Box>
          </Box>
        }
      />
    </>
  );
};
