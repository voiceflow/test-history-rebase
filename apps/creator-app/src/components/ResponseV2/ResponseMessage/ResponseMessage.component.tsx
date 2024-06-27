import { tid } from '@voiceflow/style';
import { Box, Divider, DragButton, FocusIndicator, SlateEditor, Text, Tooltip } from '@voiceflow/ui-next';
import type { ReactNode } from 'react';
import React from 'react';

import { dragButtonModifier, responseEditorContainer, responseEditorElement, wrapper } from '../Response.css';
import { ResponseMessageInput } from '../ResponseMessageInput/ResponseMessageInput.component';
// import { ResponseVariantTypeDropdown } from '../ResponseVariantTypeDropdown/ResponseVariantTypeDropdown.component';
import type { IResponseMessage } from './ResponseMessage.interface';

export const ResponseMessage: React.FC<IResponseMessage> = ({
  removeButton,
  onChangeVariantType,
  canDrag,
  ...props
}) => {
  const editableContainer = ({ editable }: { editable: ReactNode }) => {
    return <FocusIndicator.Container pl={0}>{editable}</FocusIndicator.Container>;
  };

  return (
    <>
      <Box className={wrapper}>
        {canDrag && <DragButton className={dragButtonModifier} />}

        <div className={responseEditorContainer}>
          <ResponseMessageInput
            {...props}
            editableContainer={editableContainer}
            toolbar={[
              <Box
                justify="space-between"
                key={0}
                ml={12}
                mr={16}
                my={2}
                className={responseEditorElement}
                testID={tid(props.testID, 'toolbar')}
              >
                <Box mr={2} gap={2}>
                  <SlateEditor.TextBoldButton />
                  <SlateEditor.TextItalicButton />
                  <SlateEditor.TextUnderlineButton />
                  <Divider.Vertical />
                  <Tooltip
                    placement="top"
                    referenceElement={({ ref, onOpen, onClose }) => (
                      <SlateEditor.HyperlinkButton onMouseEnter={onOpen} onMouseLeave={onClose} ref={ref} />
                    )}
                  >
                    {() => <Text variant="caption"> Insert link </Text>}
                  </Tooltip>
                  <Divider.Vertical />
                  <SlateEditor.MessageDelayButton initialDelay={0} />
                </Box>

                <Box gap={8} grow={1} justify="end">
                  {removeButton}
                </Box>
              </Box>,
            ]}
          />
        </div>
      </Box>
    </>
  );
};
