import { Utils } from '@voiceflow/common';
import type { Entity } from '@voiceflow/dtos';
import { Box, EditorButton, Popper } from '@voiceflow/ui-next';
import React from 'react';

import { EntitiesMenu } from '@/components/Entity/EntitiesMenu';
import { usePopperModifiers } from '@/hooks/popper.hook';

import { editorButtonDropdownRecipe } from './IntentRequiredEntityAutomaticRepromptPopper.css';
import type { IIntentRequiredEntityAutomaticRepromptPopper } from './IntentRequiredEntityAutomaticRepromptPopper.interface';

export const IntentRequiredEntityAutomaticRepromptPopper: React.FC<IIntentRequiredEntityAutomaticRepromptPopper> = ({
  entityID,
  entityIDs,
  entityName,
  onEntityReplace,
}) => {
  const automaticRepromptModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [-20, 1] } }]);

  const onEntitySelect = (entity: Entity) => onEntityReplace({ oldEntityID: entityID, entityID: entity.id });

  return (
    <Popper
      placement="top"
      modifiers={automaticRepromptModifiers}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <Box ref={ref} width="100%">
          <EditorButton
            label={entityName}
            onClick={onOpen}
            isActive={isOpen}
            fullWidth
            buttonClassName={editorButtonDropdownRecipe({ isActive: isOpen })}
          />
        </Box>
      )}
    >
      {({ onClose }) => <EntitiesMenu onSelect={Utils.functional.chain(onEntitySelect, onClose)} excludedEntitiesIDs={entityIDs} />}
    </Popper>
  );
};
