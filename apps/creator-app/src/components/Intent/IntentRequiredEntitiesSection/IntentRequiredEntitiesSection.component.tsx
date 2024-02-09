import type { Entity } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Popper, Section } from '@voiceflow/ui-next';
import React from 'react';

import { EntityMenu } from '@/components/Entity/EntityMenu/EntityMenu.component';
import { stopPropagation } from '@/utils/handler.util';

import type { IIntentRequiredEntities } from './IntentRequiredEntitiesSection.interface';

const TEST_ID = tid('intent', 'required-entities');

export const IntentRequiredEntitiesSection: React.FC<IIntentRequiredEntities> = ({ onAdd, children, entityIDs }) => {
  const onSelect = (entity: Entity) => {
    onAdd(entity.id);
  };

  const entitiesSize = entityIDs.length;

  return (
    <Box py={11} direction="column">
      <Popper
        placement="bottom-start"
        referenceElement={({ ref, onOpen, isOpen }) => (
          <Section.Header.Container
            title="Required entities"
            variant={entitiesSize ? 'active' : 'basic'}
            onHeaderClick={entitiesSize ? undefined : onOpen}
            testID={tid(TEST_ID, 'header')}
          >
            <Section.Header.Button ref={ref} isActive={isOpen} iconName="Plus" onClick={stopPropagation(onOpen)} testID={tid(TEST_ID, 'add')} />
          </Section.Header.Container>
        )}
      >
        {({ onClose }) => <EntityMenu onClose={onClose} onSelect={onSelect} excludeEntitiesIDs={entityIDs} />}
      </Popper>

      <Box direction="column">{children}</Box>
    </Box>
  );
};
