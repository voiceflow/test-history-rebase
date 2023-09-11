import { Utils } from '@voiceflow/common';
import type { Entity } from '@voiceflow/sdk-logux-designer';
import { Box, Popper, Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormScrollSection } from '@/components/CMS/CMSForm/CMSFormScrollSection/CMSFormScrollSection.component';
import { EntitiesMenu } from '@/components/Entity/EntitiesMenu';

import type { IIntentRequiredEntities } from './IntentRequiredEntitiesSection.interface';

export const IntentRequiredEntitiesSection: React.FC<IIntentRequiredEntities> = ({ onAdd, children, entityIDs }) => {
  const onSelect = (entity: Entity) => onAdd(entity.id);

  return (
    <CMSFormScrollSection
      pb={8}
      header={
        <Section.Header.Container title="Required entities" variant="active">
          <Popper referenceElement={({ ref, onOpen }) => <Section.Header.Button ref={ref} iconName="Plus" onClick={onOpen} />}>
            {({ onClose }) => <EntitiesMenu onSelect={Utils.functional.chain(onSelect, onClose)} excludedEntitiesIDs={entityIDs} />}
          </Popper>
        </Section.Header.Container>
      }
    >
      <Box pr={16} direction="column">
        {children}
      </Box>
    </CMSFormScrollSection>
  );
};
