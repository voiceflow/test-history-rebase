import { Collapse, Divider, stopPropagation, System } from '@voiceflow/ui';
import React from 'react';

import { FILTER_MENU_SECTIONS, FilterMenuSections } from '../constants';
import * as S from '../styles';

export interface FilterMenuSectionProps {
  section: FilterMenuSections;
  activeSection: FilterMenuSections | null;
  onToggle: (value: FilterMenuSections | null) => void;
  index: number;
}

const FilterMenuSection: React.FC<FilterMenuSectionProps> = ({ section, activeSection, onToggle, index }) => {
  const { title, component: Component } = FILTER_MENU_SECTIONS[section];
  const sectionsCount = Object.values(FilterMenuSections).length - 1;

  return (
    <>
      <S.Section isActive={activeSection === section}>
        <S.SectionHeader>
          <S.SectionTitle>{title}</S.SectionTitle>
          <System.IconButton.Base
            icon={activeSection === section ? 'minus' : 'plus'}
            onClick={stopPropagation(() => (activeSection === section ? onToggle(null) : onToggle(section)))}
            activeBackground={false}
            hoverBackground={false}
          />
        </S.SectionHeader>

        <Collapse isOpen={activeSection === section}>
          <S.SectionContent>
            <Component />
          </S.SectionContent>
        </Collapse>
      </S.Section>

      {index < sectionsCount ? <Divider offset={0} /> : null}
    </>
  );
};

export default FilterMenuSection;
