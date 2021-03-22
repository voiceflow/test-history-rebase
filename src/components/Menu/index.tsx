import React, { useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { FlexLabel } from '@/components/Flex';
import { useDidUpdateEffect, useTheme } from '@/hooks';
import { useCombinedRefs } from '@/hooks/ref';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';
import { Either } from '@/types';
import { getScrollbarWidth, stopImmediatePropagation, stopPropagation } from '@/utils/dom';
import { stringify } from '@/utils/functional';

import { ButtonContainer, Container, getItemsContainer, Item, itemStyles, MAX_VISIBLE_ITEMS } from './components';

export { Container as MenuContainer, Item as MenuItem, itemStyles as menuItemStyles };

export type MenuOption<T> = T extends undefined
  ? { value?: never; label: React.ReactNode; onClick?: (e: React.MouseEvent) => void }
  : { value: T; label: React.ReactNode; onClick?: (e: React.MouseEvent) => void };

export type MenuProps<T> = {
  id?: string;
  disabled?: boolean;
  maxHeight?: number | string;
  fullWidth?: boolean;
  width?: number;
  searchable?: React.ReactNode;
  scrollbarsRef?: React.Ref<Scrollbars>;
  maxVisibleItems?: number;
  noBottomPadding?: boolean;
  multiSelectProps?: { buttonClick: React.MouseEventHandler; buttonLabel: React.ReactNode };
  disableAnimation?: boolean;
} & Either<
  {
    options: MenuOption<T>[];
    onSelect?: T extends undefined ? (value?: T) => void : (value: T) => void;
  },
  { children: React.ReactNode }
>;

export type MenuRefElement = HTMLUListElement;

const Menu = <T,>(
  {
    id,
    options,
    disabled,
    onSelect,
    children,
    maxHeight,
    fullWidth,
    width,
    searchable,
    scrollbarsRef,
    maxVisibleItems = MAX_VISIBLE_ITEMS,
    noBottomPadding,
    disableAnimation = false,
    multiSelectProps,
  }: MenuProps<T>,
  ref: Parameters<React.ForwardRefRenderFunction<MenuRefElement>>[1]
) => {
  const menuRef = useCombinedRefs(ref);
  const [visibleOptions, setVisibleOptions] = React.useState(options || []);
  const scrollBarWidth = React.useMemo(() => getScrollbarWidth(), []);
  const theme = useTheme();

  const onItemClick = (value?: T, onClick?: (e: React.MouseEvent) => void) =>
    stopPropagation<React.MouseEvent>((e) => {
      onClick?.(e);
      onSelect?.(value!);
    });

  useDidUpdateEffect(() => {
    setVisibleOptions(options || []);
  }, [options]);

  useEffect(() => {
    const wheelCallback = (event: WheelEvent) => event.stopImmediatePropagation();
    const mouseDownCallback = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const node = menuRef.current;

    node?.addEventListener('wheel', wheelCallback, { passive: true });
    node?.addEventListener('mousedown', mouseDownCallback);
    return () => {
      node?.removeEventListener('wheel', wheelCallback);
      node?.removeEventListener('mousedown', mouseDownCallback);
    };
  }, []);

  return (
    <Container
      id={id}
      ref={menuRef}
      className={ClassName.MENU}
      fullWidth={fullWidth}
      width={width}
      maxVisibleItems={maxVisibleItems}
      nativeScrollbar={scrollBarWidth === 0}
      noBottomPadding={noBottomPadding}
      disableAnimation={disableAnimation}
    >
      <FadeDownDelayedContainer duration={disableAnimation ? 0 : undefined} delay={disableAnimation ? 0 : undefined}>
        {searchable}

        <Scrollbars
          ref={scrollbarsRef}
          className="scrollbars"
          autoHeight
          autoHide
          autoHeightMax={maxHeight ?? getItemsContainer(theme.components.menuItem.height, maxVisibleItems)}
          hideTracksWhenNotNeeded
        >
          {children ||
            visibleOptions.map(({ value, label, onClick }, index) => (
              <Item key={`${index}-${label}`} className={ClassName.MENU_ITEM} onClick={onItemClick(value, onClick)}>
                <FlexLabel>{label || stringify(value)}</FlexLabel>
              </Item>
            ))}
        </Scrollbars>
      </FadeDownDelayedContainer>

      {multiSelectProps && (
        <ButtonContainer disabled={disabled} onClick={disabled ? stopImmediatePropagation() : stopImmediatePropagation(multiSelectProps.buttonClick)}>
          {multiSelectProps.buttonLabel}
        </ButtonContainer>
      )}
    </Container>
  );
};

// The only way I found to use generics with forwardRef
const forwardRef = (
  render: (
    props: MenuProps<any>,
    ref: ((instance: MenuRefElement | null) => void) | React.MutableRefObject<MenuRefElement | null> | null
  ) => React.ReactElement | null
): (<G extends any>(props: MenuProps<G>) => React.ReactElement | null) => React.forwardRef<MenuRefElement, MenuProps<any>>(render);

export default forwardRef(Menu);
