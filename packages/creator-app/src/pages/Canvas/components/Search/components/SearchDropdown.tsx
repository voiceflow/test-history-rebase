import { Checkbox, Dropdown, SvgIcon, swallowEvent, transition } from '@voiceflow/ui';
import React from 'react';

import { SearchContext, SearchTypes } from '@/contexts/SearchContext';
import { styled } from '@/hocs/styled';

const SearchFilters = [
  SearchTypes.NodeCategory.BLOCK,
  SearchTypes.SearchCategory.INTENT,
  SearchTypes.SearchCategory.ENTITIES,
  SearchTypes.NodeCategory.RESPONSES,
  SearchTypes.NodeCategory.USER_INPUT,
  SearchTypes.SearchCategory.TOPIC,
  SearchTypes.SearchCategory.COMPONENT,
];

const DropdownIcon = styled(SvgIcon)`
  cursor: pointer;
  color: #f2f7f7;
  opacity: 0.5;
  ${transition('opacity')};

  &:hover {
    opacity: 0.85;
  }
`;

const SearchDropdown: React.FC = () => {
  const search = React.useContext(SearchContext);

  const options = SearchFilters.map((filter) => {
    const checked = search?.filters[filter] !== false;

    return {
      label: (
        <Checkbox type={Checkbox.Type.CHECKBOX} readOnly checked={checked} isFlat>
          {filter}
        </Checkbox>
      ),
      onClick: swallowEvent(() => search?.updateFilters({ [filter]: !checked })),
    };
  });

  return (
    <Dropdown options={options} placement="bottom">
      {({ ref, onToggle, isOpen }) => (
        <DropdownIcon
          ref={ref}
          icon="systemSettings"
          mr={18}
          p={6}
          ml={6}
          style={isOpen ? { opacity: 1 } : {}}
          onMouseDown={swallowEvent()}
          onClick={swallowEvent(onToggle)}
        />
      )}
    </Dropdown>
  );
};

export default SearchDropdown;
