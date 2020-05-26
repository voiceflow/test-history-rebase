/* eslint-disable jsx-a11y/no-autofocus */

import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { FlexLabel } from '@/components/Flex';
import { useKeygen } from '@/hooks';
import { useCombinedRefs } from '@/hooks/ref';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';
import { getScrollbarWidth, stopImmediatePropagation, stopPropagation } from '@/utils/dom';
import { stringify } from '@/utils/functional';

import { ButtonContainer, Container, Item, itemStyles } from './components';

export { Item as MenuItem, Container as MenuContainer, itemStyles as menuItemStyles };

function Menu(
  {
    id,
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
    maxVisibleItems,
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
    <Container
      id={id}
      className={ClassName.MENU}
      ref={menuRef}
      fullWidth={fullWidth}
      maxVisibleItems={maxVisibleItems}
      disableAnimation={disableAnimation}
      nativeScrollbar={scrollBarWidth === 0}
    >
      <FadeDownDelayedContainer duration={disableAnimation ? 0 : undefined} delay={disableAnimation ? 0 : undefined}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        {searchable}
        <Scrollbars ref={scrollbarsRef} className="scrollbars" autoHeight autoHide autoHeightMax={maxHeight} hideTracksWhenNotNeeded>
          {children ||
            visibleOptions.map(({ value, label, onClick }) => (
              <Item
                className={ClassName.MENU_ITEM}
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
      </FadeDownDelayedContainer>
      {multiselect && (
        <ButtonContainer disabled={disabled} onClick={disabled ? stopImmediatePropagation() : stopImmediatePropagation(buttonClick)}>
          {buttonLabel}
        </ButtonContainer>
      )}
    </Container>
  );
}

export default React.forwardRef(Menu);
