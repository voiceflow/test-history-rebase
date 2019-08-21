import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { components } from 'react-select';
import { generateLocalKey } from 'react-smart-key/dist/es5/generateKey';
import styled from 'styled-components';

import SvgIcon from '@/components/SvgIcon';
import { FlexCenter } from '@/componentsV2/Flex';

import DropdownMenu from './NestedMenu';

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0px 8px 16px rgba(17, 49, 96, 0.16), 0px 0px 0px rgba(17, 49, 96, 0.06);
  border-radius: 5px;
`;

const InnerContainer = styled.div`
  padding: 8px 0px;
`;

const Option = styled(FlexCenter)`
  padding: 10px 22px 10px 22px;
  cursor: pointer;

  &:hover {
    background: #deebff;
  }
`;

const Label = styled.div`
  flex: 1;
  font-size: 15px;
  line-height: 18px;
  color: #132144;
  padding-right: 12px;
`;

const NestedDropdown = (props) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectedId = (selected, depthLevel) => {
    const updatedArray = selectedIds.slice(0);
    updatedArray[depthLevel] = selected;
    setSelectedIds(updatedArray);
  };

  const renderSubMenu = (options, depthLevel = 0) => {
    const genKey = generateLocalKey();
    const { openDirection, selectOption } = props;
    const caret = <SvgIcon icon={openDirection === 'left' ? 'arrowLeft' : 'arrowRight'} size={10} />;

    const menuOptions = options.map((option) => {
      let subMenu;
      const hasOptions = option.nestedOptions && option.nestedOptions.length > 0;
      const id = genKey(option.value);

      if (hasOptions && selectedIds[depthLevel] === id) {
        const newDepthLevel = depthLevel + 1;
        subMenu = renderSubMenu(option.nestedOptions, newDepthLevel);
      }
      return (
        <DropdownMenu placement="right" show={selectedIds[depthLevel] === id} component={subMenu} key={id}>
          {(ref) => (
            <Option
              ref={ref}
              onClick={() => {
                selectOption(option);
              }}
              onMouseEnter={() => {
                handleSelectedId(id, depthLevel);
              }}
            >
              <Label>{option.label}</Label>
              {hasOptions ? caret : null}
            </Option>
          )}
        </DropdownMenu>
      );
    });

    return (
      <MenuContainer>
        <InnerContainer>{menuOptions}</InnerContainer>
      </MenuContainer>
    );
  };

  return (
    <>
      <components.Menu {...props}>{renderSubMenu(props.options)}</components.Menu>
    </>
  );
};

NestedDropdown.propTypes = {
  openDirection: PropTypes.oneOf(['left', 'right']),
  label: PropTypes.string,
  hasCaret: PropTypes.bool,
  options: PropTypes.array.isRequired,
};

NestedDropdown.defaultProps = {
  hasCaret: false,
  openDirection: 'right',
};

export default NestedDropdown;
