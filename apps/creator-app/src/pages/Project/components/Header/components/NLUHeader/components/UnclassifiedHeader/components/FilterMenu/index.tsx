import { Divider, Link, Popper, System } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { FilterMenuSection, FilterMenuSections } from './components';
import * as S from './styles';

const FilterMenu: React.FC = () => {
  const nluManager = useNLUManager();
  const [activeSections, setActiveSections] = React.useState<FilterMenuSections[]>([]);

  const handleClearAll = () => {
    setActiveSections([]);
    nluManager.setUnclassifiedDataFilters({});
  };

  const handleSessionToggle = (session: FilterMenuSections) => {
    setActiveSections((prev) => (prev.includes(session) ? prev.filter((section) => section !== session) : [...prev, session]));
  };

  return (
    <Popper
      width="350px"
      onClose={() => {}}
      placement="bottom"
      modifiers={{ offset: { offset: '0,0' } }}
      renderContent={() => (
        <Popper.Content>
          <S.Section>
            <S.SectionHeader>
              <S.HeaderTitle>All filters</S.HeaderTitle>
              <Link onClick={handleClearAll} style={{ fontSize: '13px' }}>
                Clear All
              </Link>
            </S.SectionHeader>
          </S.Section>

          <Divider offset={0} />

          {Object.values(FilterMenuSections).map((section, index) => (
            <FilterMenuSection key={index} activeSections={activeSections} section={section} index={index} onToggle={handleSessionToggle} />
          ))}
        </Popper.Content>
      )}
    >
      {({ ref, isOpened, onToggle }) => <System.IconButton.Base ref={ref} icon="query" onClick={onToggle} active={isOpened} />}
    </Popper>
  );
};

export default FilterMenu;
