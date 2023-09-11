import { Section } from '@voiceflow/ui-next';
import React from 'react';

import { CMSFormScrollSection } from '@/components/CMS/CMSForm/CMSFormScrollSection/CMSFormScrollSection.component';

import type { IEntityVariantsSection } from './EntityVariantsSection.interface';

export const EntityVariantsSection: React.FC<IEntityVariantsSection> = ({ onAdd, children }) => (
  <CMSFormScrollSection
    pb={8}
    minHeight="108px"
    header={
      <Section.Header.Container title="Values" variant="active">
        <Section.Header.Button iconName="Plus" onClick={onAdd} />
      </Section.Header.Container>
    }
  >
    {children}
  </CMSFormScrollSection>
);
