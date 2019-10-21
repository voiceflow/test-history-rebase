import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { components } from 'react-select';
import styled, { css } from 'styled-components';

import SvgIcon from '@/components/SvgIcon';
import { generateLocalKey } from '@/utils/key';

import DropdownMenu from './NestedMenu';
import { ActionButton, InnerContainer, Label, MenuContainer, Option } from './components';

const Fade = styled.div`
  ${({ active }) =>
    active
      ? css`
          opacity: 1;
          transform: scaleY(1) translate3d(0, 0, 0);
          visibility: visible;
        `
      : css`
          opacity: 0;
          transform: scaleY(0) translate3d(0, 0, 0);
          visibility: hidden;
        `}
  transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
  transform-origin: center top;
`;

const Slide = styled(Fade)`
  ${({ active }) =>
    active
      ? css`
          opacity: 1;
          transform: translate3d(0, 0, 0);
        `
      : css`
          opacity: 0;
          transform: translate3d(0, 8px, 0);
        `}
  transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;
  transition-delay: 150ms;
`;

const NestedDropdown = (props) => {
  const {
    children,
    options,
    innerProps,
    selectProps: { actionClick, actionText, isExpandable, active },
  } = props;
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectedId = (selected, depthLevel) => {
    const updatedArray = selectedIds.slice(0);
    updatedArray[depthLevel] = selected;
    setSelectedIds(updatedArray);
  };

  const renderSubMenu = (options, depthLevel = 0) => {
    const genKey = generateLocalKey();
    const { openDirection, selectOption } = props;
    const caret = <SvgIcon color="#8da2b5" icon={openDirection === 'left' ? 'arrowLeft' : 'arrowRight'} size={10} />;

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
      <MenuContainer depth={depthLevel}>
        <InnerContainer>{menuOptions}</InnerContainer>
      </MenuContainer>
    );
  };

  return (
    <Fade active={active} className="select__menu" {...innerProps}>
      <components.Menu {...props}>
        <Slide active={active}>{isExpandable ? renderSubMenu(options) : children}</Slide>
        {actionClick && <ActionButton onClick={() => actionClick()}>{actionText}</ActionButton>}
      </components.Menu>
    </Fade>
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
