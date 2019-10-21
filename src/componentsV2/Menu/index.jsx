/* eslint-disable jsx-a11y/no-autofocus */

import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { useKeygen } from '@/components/KeyedComponent';
import { FlexLabel } from '@/componentsV2/Flex';
import { FadeDownContainer } from '@/styles/animations';
import { stopPropagation } from '@/utils/dom';
import { stringify } from '@/utils/functional';

import { ButtonContainer, Container, Item } from './components';
import SearchBox from './components/SearchBox';

export { Item as MenuItem, Container as MenuContainer };

function Menu({ options, onSelect, searchable, multiSelectProps: { multiselect, buttonClick, buttonLabel } = {}, children }) {
  const genKey = useKeygen();
  const menuRef = React.useRef();
  const [searchText, setSearchText] = React.useState('');
  const [visibleOptions, setVisibleOptions] = React.useState(options);

  const filterOptions = (text) => {
    setSearchText(text);
    const newVisibleOptions = [];

    options.forEach((option) => {
      if (option.label.toLowerCase().includes(text.toLowerCase())) newVisibleOptions.push(option);
    });

    setVisibleOptions(newVisibleOptions);
  };

  useEffect(() => {
    const callback = (event) => event.stopImmediatePropagation();
    const node = menuRef.current;

    node.addEventListener('wheel', callback, { passive: true });

    return () => node.removeEventListener('wheel', callback);
  });

  useEffect(() => {
    setSearchText('');
    setVisibleOptions(options);
  }, [options]);

  return (
    <Container ref={menuRef}>
      <FadeDownContainer>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        {searchable && <SearchBox onChange={(e) => filterOptions(e.target.value)} value={searchText} autoFocus placeholder="Search..." />}
        <Scrollbars autoHeight autoHide hideTracksWhenNotNeeded>
          {children ||
            visibleOptions.map(({ value, label, onClick }) => (
              <Item
                onClick={stopPropagation(() => {
                  onClick && onClick();
                  onSelect && onSelect(value);
                })}
                key={genKey(value || label)}
              >
                <FlexLabel>{label || stringify(value)}</FlexLabel>
              </Item>
            ))}
        </Scrollbars>
      </FadeDownContainer>
      {multiselect && <ButtonContainer onClick={buttonClick}>{buttonLabel}</ButtonContainer>}
    </Container>
  );
}

export default Menu;
