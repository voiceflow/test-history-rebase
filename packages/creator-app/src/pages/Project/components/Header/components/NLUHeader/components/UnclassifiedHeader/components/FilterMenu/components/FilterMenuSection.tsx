import { Collapse, Divider, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { FILTER_MENU_SECTIONS, FilterMenuSections } from '../constants';
import * as S from '../styles';

export interface FilterMenuSectionProps {
  section: FilterMenuSections;
  activeSections: FilterMenuSections[];
  onToggle: (value: FilterMenuSections) => void;
  index: number;
}

const FilterMenuSection: React.FC<FilterMenuSectionProps> = ({ section, activeSections, onToggle, index }) => {
  const { title, component: Component } = FILTER_MENU_SECTIONS[section];
  const sectionsCount = Object.values(FilterMenuSections).length - 1;
  const isActive = activeSections.includes(section);

  const handleSectionClick = stopPropagation(() => onToggle(section));

  return (
    <>
      <S.Section isActive={isActive} clickable>
        <S.SectionHeader onClick={handleSectionClick} clickable>
          <S.SectionTitle>{title}</S.SectionTitle>
          <SvgIcon icon={isActive ? 'minus' : 'plus'} onClick={handleSectionClick} clickable active={isActive} variant={SvgIcon.Variant.STANDARD} />
        </S.SectionHeader>

        <Collapse isOpen={isActive}>
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
