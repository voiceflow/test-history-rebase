import { Divider, Link, Popper, System } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { FilterMenuSection } from './components';
import { FilterMenuSections } from './constants';
import * as S from './styles';

const FilterMenu: React.FC = () => {
  const nluManager = useNLUManager();
  const [activeSection, setActiveSection] = React.useState<FilterMenuSections | null>(null);

  const handleClearAll = () => {
    setActiveSection(null);
    nluManager.setUnclassifiedDataFilters({});
  };

  return (
    <Popper
      width="350px"
      onClose={() => {}}
      placement="bottom"
      renderContent={() => (
        <Popper.Content>
          <S.Section>
            <S.SectionHeader>
              <S.HeaderTitle>All filters</S.HeaderTitle>
              <Link onClick={handleClearAll}>Clear All</Link>
            </S.SectionHeader>
          </S.Section>

          <Divider offset={0} />

          {Object.values(FilterMenuSections).map((section, index) => (
            <FilterMenuSection key={index} activeSection={activeSection} section={section} index={index} onToggle={setActiveSection} />
          ))}
        </Popper.Content>
      )}
    >
      {({ ref, isOpened, onToggle }) => <System.IconButton.Base ref={ref} icon="query" onClick={onToggle} active={isOpened} />}
    </Popper>
  );
};

export default FilterMenu;
