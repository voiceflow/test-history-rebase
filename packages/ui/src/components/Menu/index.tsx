import composeRefs from '@seznam/compose-react-refs';
import { FlexLabel } from '@ui/components/Flex';
import { useTheme } from '@ui/hooks';
import { FadeDownDelayedContainer } from '@ui/styles/animations';
import { ClassName } from '@ui/styles/constants';
import { Either } from '@ui/types';
import { getScrollbarWidth, stopImmediatePropagation, stopPropagation } from '@ui/utils';
import { Nullable } from '@voiceflow/common';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

import { ButtonContainer, Container, getMaxHeight, Item, itemStyles, MenuItemNote, MenuItemProps } from './components';

export { Container as MenuContainer, Item as MenuItem, itemStyles as menuItemStyles };

interface BaseMenuOption extends MenuItemProps {
  key?: string;
  note?: React.ReactNode;
  label: React.ReactNode;
  style?: React.CSSProperties;
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
  onHide?: () => void;
  onToggle?: () => void;
  fullWidth?: boolean;
  maxHeight?: number | string;
  searchable?: React.ReactNode;
  selfDismiss?: boolean;
  noTopPadding?: boolean;
  scrollbarsRef?: React.Ref<Scrollbars>;
  maxVisibleItems?: number;
  noBottomPadding?: boolean;
  multiSelectProps?: { buttonClick: React.MouseEventHandler; buttonLabel: React.ReactNode };
  disableAnimation?: boolean;
  renderFooterAction?: Nullable<(options: { close: VoidFunction }) => React.ReactNode>;
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
    onHide,
    options,
    disabled,
    onToggle,
    onSelect,
    children,
    maxHeight,
    fullWidth,
    searchable,
    selfDismiss = false,
    noTopPadding,
    scrollbarsRef,
    maxVisibleItems,
    noBottomPadding,
    disableAnimation = false,
    multiSelectProps,
    renderFooterAction,
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

      if (selfDismiss) onToggle?.();
    });

  const onHideMenu = () => {
    onHide?.();
  };

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
      withFooterAction={!!renderFooterAction}
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
          autoHeightMax={getMaxHeight(maxHeight, maxVisibleItems, theme.components.menuItem.height)}
          hideTracksWhenNotNeeded
        >
          {children ||
            options?.map(({ key, value, note, label, onClick, ...props }, index) => (
              <Item {...props} key={key || `${index}-${label}`} onClick={onItemClick(value as T, onClick)}>
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

      {renderFooterAction?.({ close: onHideMenu })}
    </Container>
  );
};

// The only way we found to use generics with forwardRef
const forwardRef = (
  render: (
    props: MenuProps<any>,
    ref: ((instance: MenuRefElement | null) => void) | React.MutableRefObject<MenuRefElement | null> | null
  ) => React.ReactElement | null
): (<G extends any>(props: MenuProps<G> & React.RefAttributes<MenuRefElement>) => React.ReactElement | null) =>
  React.forwardRef<MenuRefElement, MenuProps<any>>(render);

export default forwardRef(Menu);
