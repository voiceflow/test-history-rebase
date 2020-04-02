/* eslint-disable jsx-a11y/no-autofocus */

import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { FlexLabel } from '@/components/Flex';
import { useKeygen } from '@/hooks';
import { useCombinedRefs } from '@/hooks/ref';
import { FadeDownContainer } from '@/styles/animations';
import { getScrollbarWidth, stopImmediatePropagation, stopPropagation } from '@/utils/dom';
import { stringify } from '@/utils/functional';

import { ButtonContainer, Container, Item, itemStyles } from './components';

export { Item as MenuItem, Container as MenuContainer, itemStyles as menuItemStyles };

function Menu(
  {
    options,
    disabled,
    onSelect,
    children,
    maxHeight,
    fullWidth,
    searchable,
    scrollbarsRef,
    multiSelectProps: { multiselect, buttonClick, buttonLabel } = {},
    disableAnimation = false,
  },
  ref
) {
  const genKey = useKeygen();
  const menuRef = useCombinedRefs(ref);
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
    <Container ref={menuRef} fullWidth={fullWidth} disableAnimation={disableAnimation} nativeScrollbar={scrollBarWidth === 0}>
      <FadeDownContainer length={disableAnimation ? 0 : undefined} delay={disableAnimation ? 0 : undefined}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        {searchable}
        <Scrollbars ref={scrollbarsRef} className="scrollbars" autoHeight autoHide autoHeightMax={maxHeight} hideTracksWhenNotNeeded>
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
      {multiselect && (
        <ButtonContainer disabled={disabled} onClick={disabled ? stopImmediatePropagation() : buttonClick}>
          {buttonLabel}
        </ButtonContainer>
      )}
    </Container>
  );
}

export default React.forwardRef(Menu);
