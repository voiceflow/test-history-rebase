import { Utils } from '@voiceflow/common';
import type { Entity } from '@voiceflow/dtos';
import { Box, Popper, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormScrollSection } from '@/components/CMS/CMSForm/CMSFormScrollSection/CMSFormScrollSection.component';
import { EntityMenu } from '@/components/Entity/EntityMenu';
import { stopPropagation } from '@/utils/handler.util';

import type { IIntentRequiredEntities } from './IntentRequiredEntitiesSection.interface';

export const IntentRequiredEntitiesSection: React.FC<IIntentRequiredEntities> = ({ onAdd, children, entityIDs }) => {
  const onSelect = (entity: Entity) => {
    onAdd(entity.id);
  };

  const entitiesSize = entityIDs.length;

  return (
    <CMSFormScrollSection
      pb={11}
      header={
        <Popper
          placement="bottom-start"
          referenceElement={({ ref, onOpen, isOpen }) => (
            <Section.Header.Container
              title="Required entities"
              variant={entitiesSize ? 'active' : 'basic'}
              onHeaderClick={entitiesSize ? undefined : onOpen}
            >
              <Section.Header.Button ref={ref} isActive={isOpen} iconName="Plus" onClick={stopPropagation(onOpen)} />
            </Section.Header.Container>
          )}
        >
          {({ onClose }) => <EntityMenu onSelect={Utils.functional.chain(onSelect, onClose)} excludeEntitiesIDs={entityIDs} />}
        </Popper>
      }
    >
      <Box direction="column">{children}</Box>
    </CMSFormScrollSection>
  );
};
