import { Box } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React from 'react';

import { entitiesVariablesMapsAtom } from '@/atoms/other.atom';
import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { markupToString } from '@/utils/markup.util';

import { containerStyles } from './CardPopperButtonEditor.css';
import { ICardPopperButtonEditor } from './CardPopperButtonEditor.interface';
import { CardPopperButtonEditorPopper } from './CardPopperButtonEditorPopper/CardPopperButtonEditorPopper.component';

export const CardPopperButtonEditor: React.FC<ICardPopperButtonEditor> = ({ label, onRemove, onLabelChange }) => {
  const entitiesVariablesMaps = useAtomValue(entitiesVariablesMapsAtom);
  const labelText = React.useMemo(() => (label ? markupToString.fromDB(label, entitiesVariablesMaps) : ''), [label]);

  return (
    <CardPopperButtonEditorPopper
      label={label}
      onLabelChange={onLabelChange}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <CMSFormListItem ref={ref} pr={0} gap={4} align="center" onRemove={() => onRemove()}>
          <Box onClick={onOpen} className={containerStyles({ active: isOpen })}>
            {labelText || 'Untitled button'}
          </Box>
        </CMSFormListItem>
      )}
    />
  );
};
