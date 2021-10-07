import composeRefs from '@seznam/compose-react-refs';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { useTheme } from '../../hooks';
import { FadeDownDelayedContainer } from '../../styles/animations';
import { ClassName } from '../../styles/constants';
import { Either } from '../../types';
import { getScrollbarWidth, stopImmediatePropagation, stopPropagation } from '../../utils';
import { FlexLabel } from '../Flex';
import { ButtonContainer, Container, getItemsContainer, Item, itemStyles, MAX_VISIBLE_ITEMS, MenuItemNote } from './components';

export { Container as MenuContainer, Item as MenuItem, itemStyles as menuItemStyles };

interface BaseMenuOption {
  key?: string;
  note?: React.ReactNode;
  label: React.ReactNode;
  divider?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

interface MenuOptionWithValue<T> extends BaseMenuOption {
  value: T;
}

interface MenuOptionWithoutValue extends BaseMenuOption {
  value?: never;
}

export type MenuOption<T extends any> = T extends undefined ? MenuOptionWithoutValue : MenuOptionWithValue<T>;

export type MenuProps<T extends any> = {
  id?: string;
  width?: number;
  disabled?: boolean;
  maxHeight?: number | string;
  fullWidth?: boolean;
  onToggle?: () => void;
  selfDismiss?: boolean;
  searchable?: React.ReactNode;
  noTopPadding?: boolean;
  footerAction?: boolean;
  scrollbarsRef?: React.Ref<Scrollbars>;
  maxVisibleItems?: number;
  noBottomPadding?: boolean;
  multiSelectProps?: { buttonClick: React.MouseEventHandler; buttonLabel: React.ReactNode };
  disableAnimation?: boolean;
  footerActionComponent?: () => React.FC;
} & Either<
  {
    options: MenuOption<T>[];
    onSelect?: T extends undefined ? (value?: T) => void : (value: T) => void;
  },
  { children: React.ReactNode }
>;

export type MenuRefElement = HTMLUListElement;

const Menu = <T extends any>(
  {
    id,
    width,
    options,
    disabled,
    onToggle,
    onSelect,
    children,
    maxHeight,
    fullWidth,
    searchable,
    selfDismiss = false,
    footerAction,
    noTopPadding,
    scrollbarsRef,
    maxVisibleItems = MAX_VISIBLE_ITEMS,
    noBottomPadding,
    disableAnimation = false,
    multiSelectProps,
    footerActionComponent,
  }: MenuProps<T>,
  ref: React.Ref<MenuRefElement>
) => {
  const menuRef = React.useRef<MenuRefElement>(null);
  const scrollBarWidth = React.useMemo(() => getScrollbarWidth(), []);
  const theme = useTheme();

  const onItemClick = (value?: T, onClick?: (event: React.MouseEvent) => void) =>
    stopPropagation<React.MouseEvent>((event) => {
      onClick?.(event);
      onSelect?.(value!);
      if (selfDismiss) {
        onToggle?.();
      }
    });

  React.useEffect(() => {
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
      footerAction={footerAction}
      ref={composeRefs(ref, menuRef)}
      className={ClassName.MENU}
      fullWidth={fullWidth}
      width={width}
      maxVisibleItems={maxVisibleItems}
      nativeScrollbar={scrollBarWidth === 0}
      noTopPadding={noTopPadding}
      noBottomPadding={noBottomPadding}
      disableAnimation={disableAnimation}
      withScrollbars
    >
      <FadeDownDelayedContainer duration={disableAnimation ? 0 : undefined} delay={disableAnimation ? 0 : undefined}>
        {searchable}

        <Scrollbars
          ref={scrollbarsRef}
          autoHide
          className="scrollbars"
          autoHeight
          autoHeightMax={maxHeight ?? getItemsContainer(theme.components.menuItem.height, maxVisibleItems)}
          hideTracksWhenNotNeeded
        >
          {children ||
            options?.map(({ key, value, note, label, divider, onClick }, index) => (
              <Item key={key || `${index}-${label}`} divider={divider} onClick={onItemClick(value as T, onClick)}>
                <FlexLabel>{label || String(value)}</FlexLabel>
                {!!note && <MenuItemNote>{note}</MenuItemNote>}
              </Item>
            ))}
        </Scrollbars>
      </FadeDownDelayedContainer>

      {multiSelectProps && (
        <ButtonContainer disabled={disabled} onClick={disabled ? stopImmediatePropagation() : stopImmediatePropagation(multiSelectProps.buttonClick)}>
          {multiSelectProps.buttonLabel}
        </ButtonContainer>
      )}
      {footerAction && footerActionComponent?.()}
    </Container>
  );
};

// The only way we found to use generics with forwardRef
const forwardRef = (
  render: (
    props: MenuProps<any>,
    ref: ((instance: MenuRefElement | null) => void) | React.MutableRefObject<MenuRefElement | null> | null
  ) => React.ReactElement | null
): (<G extends any>(props: MenuProps<G>) => React.ReactElement | null) => React.forwardRef<MenuRefElement, MenuProps<any>>(render);

export default forwardRef(Menu);
