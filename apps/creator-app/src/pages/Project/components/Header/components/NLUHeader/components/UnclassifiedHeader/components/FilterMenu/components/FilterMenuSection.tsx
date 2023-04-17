import { Collapse, Divider, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as S from '../styles';
import { FilterMenuSections } from './constants';
import DataSourceSelect from './DataSourceSelect';
import DateRangeSelect from './DateRangeSelect';
import { FilterMenuSectionComponentProps } from './types';

export const FILTER_MENU_SECTIONS: Record<FilterMenuSections, { title: string; component: React.FC<FilterMenuSectionComponentProps> }> = {
  [FilterMenuSections.DATE_RANGE]: { title: 'Date range', component: DateRangeSelect },
  [FilterMenuSections.DATA_SOURCE]: { title: 'Data source', component: DataSourceSelect },
};

export interface FilterMenuSectionProps {
  index: number;
  section: FilterMenuSections;
  activeSections: FilterMenuSections[];
  onToggle: (value: FilterMenuSections) => void;
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
            <Component isActive={isActive} />
          </S.SectionContent>
        </Collapse>
      </S.Section>

      {index < sectionsCount ? <Divider offset={0} /> : null}
    </>
  );
};

export default FilterMenuSection;
