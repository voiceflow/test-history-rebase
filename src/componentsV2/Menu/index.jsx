/* eslint-disable jsx-a11y/no-autofocus */

import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { useKeygen } from '@/components/KeyedComponent';
import { FlexLabel } from '@/componentsV2/Flex';
import { FadeDownContainer } from '@/styles/animations';
import { getScrollbarWidth, stopPropagation } from '@/utils/dom';
import { stringify } from '@/utils/functional';

import { ButtonContainer, Container, Item } from './components';

export { Item as MenuItem, Container as MenuContainer };

function Menu({ options, onSelect, searchable, multiSelectProps: { multiselect, buttonClick, buttonLabel } = {}, children, scrollbarsRef }) {
  const genKey = useKeygen();
  const menuRef = React.useRef();
  const [visibleOptions, setVisibleOptions] = React.useState(options);
  const scrollBarWidth = React.useMemo(() => getScrollbarWidth(), []);

  useEffect(() => {
    const callback = (event) => event.stopImmediatePropagation();
    const node = menuRef.current;

    node.addEventListener('wheel', callback, { passive: true });
    node.addEventListener('mousedown', stopPropagation());
    return () => {
      node.removeEventListener('wheel', callback);
      node.removeEventListener('mousedown', stopPropagation());
    };
  });

  useEffect(() => {
    setVisibleOptions(options);
  }, [options]);

  return (
    <Container ref={menuRef} nativeScrollbar={scrollBarWidth === 0}>
      <FadeDownContainer>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        {searchable}
        <Scrollbars ref={scrollbarsRef} className="scrollbars" autoHeight autoHide hideTracksWhenNotNeeded>
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
