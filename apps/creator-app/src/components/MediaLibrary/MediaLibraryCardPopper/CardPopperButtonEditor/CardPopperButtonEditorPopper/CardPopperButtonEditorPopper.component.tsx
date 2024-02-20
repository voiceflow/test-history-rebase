import { Box, Popper, Section, Surface, useCreateConst } from '@voiceflow/ui-next';
import React from 'react';

import { InputWithVariables } from '@/components/Input/InputWithVariables/InputWithVariables.component';

import type { ICardPopperButtonEditorPopper } from './CardPopperButtonEditorPopper.interface';

export const CardPopperButtonEditorPopper: React.FC<ICardPopperButtonEditorPopper> = ({ label, onLabelChange, referenceElement, ...props }) => {
  const modifiers = useCreateConst(() => [{ name: 'offset', options: { offset: [0, 13] } }]);

  return (
    <Popper placement="left-start" referenceElement={referenceElement} {...props} modifiers={modifiers}>
      {() => (
        <Surface width="300px">
          <Section.Header.Container pt={11} title="Button label" variant="active" />

          <Box px={24} pb={20}>
            <InputWithVariables value={label} autoFocus placeholder="Untitled button" onValueChange={onLabelChange} singleLine />
          </Box>
        </Surface>
      )}
    </Popper>
  );
};
