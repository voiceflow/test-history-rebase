import type { Entity } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Popper, Section } from '@voiceflow/ui-next';
import React from 'react';

import { EntityMenu } from '@/components/Entity/EntityMenu/EntityMenu.component';
import { stopPropagation } from '@/utils/handler.util';

import type { IIntentRequiredEntities } from './IntentRequiredEntitiesSection.interface';

export const IntentRequiredEntitiesSection: React.FC<IIntentRequiredEntities> = ({ onAdd, children, entityIDs }) => {
  const TEST_ID = tid('intent', 'required-entities');

  const onSelect = (entity: Entity) => {
    onAdd(entity.id);
  };

  const entitiesSize = entityIDs.length;

  return (
    <>
      <Popper
        placement="bottom-start"
        referenceElement={({ ref, onOpen, isOpen }) => (
          <Section.Header.Container
            pt={11}
            pb={entitiesSize ? 0 : 11}
            title="Required entities"
            testID={tid(TEST_ID, 'header')}
            variant={entitiesSize ? 'active' : 'basic'}
            onHeaderClick={entitiesSize ? undefined : onOpen}
          >
            <Section.Header.Button ref={ref} testID={tid(TEST_ID, 'add')} onClick={stopPropagation(onOpen)} isActive={isOpen} iconName="Plus" />
          </Section.Header.Container>
        )}
      >
        {({ onClose }) => <EntityMenu onClose={onClose} onSelect={onSelect} excludeIDs={entityIDs} />}
      </Popper>

      <Box pb={entitiesSize ? 11 : 0} direction="column">
        {children}
      </Box>
    </>
  );
};
