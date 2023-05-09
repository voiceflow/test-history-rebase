import composeRefs from '@seznam/compose-react-refs';
import { FlexLabel } from '@ui/components/Flex';
import { useCachedValue, useTheme } from '@ui/hooks';
import { FadeDownDelayedContainer } from '@ui/styles/animations';
import { ClassName } from '@ui/styles/constants';
import { getScrollbarWidth, stopImmediatePropagation, stopPropagation } from '@ui/utils';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

import {
  ButtonContainer,
  Container,
  Footer,
  getMaxHeight,
  Hint,
  Item,
  ItemActionIcon,
  ItemIcon,
  ItemNextIcon,
  ItemNote,
  itemStyles,
  MAX_VISIBLE_ITEMS,
  NotFound,
} from './components';
import * as T from './types';

export * as MenuTypes from './types';

function Menu(props: T.PropsWithChildren & React.RefAttributes<T.RefElement>, ref: React.Ref<T.RefElement>): React.ReactElement;
function Menu<Value = void>(props: T.PropsWithOptions<Value> & React.RefAttributes<T.RefElement>, ref: React.Ref<T.RefElement>): React.ReactElement;
function Menu<Value = void>(
  {
    id,
    hint,
    width,
    onHide,
    inline,
    options,
    disabled,
    onToggle,
    onSelect,
    children,
    placement,
    maxHeight,
    fullWidth,
    noMargins,
    searchable,
    selfDismiss = false,
    noTopPadding,
    scrollbarsRef,
    maxVisibleItems,
    noBottomPadding,
    disableAnimation = false,
    fadeDownDuration,
    multiSelectProps,
    renderFooterAction,
    swallowMouseDownEvent = true,
  }: T.PropsWithChildren | T.PropsWithOptions<Value>,
  ref: React.Ref<T.RefElement>
): React.ReactElement {
  const menuRef = React.useRef<T.RefElement>(null);
  const scrollBarWidth = React.useMemo(() => getScrollbarWidth(), []);
  const theme = useTheme();

  const swallowMouseDownEventCache = useCachedValue(swallowMouseDownEvent);

  const onItemClick = (value?: Value, onClick?: (event: React.MouseEvent) => void) =>
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
      if (!swallowMouseDownEventCache.current) return;

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

  const footerAction = renderFooterAction?.({ close: onHideMenu });

  return (
    <Container
      id={id}
      ref={composeRefs(ref, menuRef)}
      width={width}
      inline={inline}
      className={ClassName.MENU}
      fullWidth={fullWidth}
      noMargins={noMargins}
      noTopPadding={noTopPadding}
      withScrollbars
      data-placement={placement}
      maxVisibleItems={maxVisibleItems}
      nativeScrollbar={scrollBarWidth === 0}
      noBottomPadding={noBottomPadding || !!footerAction}
      disableAnimation={disableAnimation}
    >
      <FadeDownDelayedContainer duration={disableAnimation ? 0 : fadeDownDuration} delay={disableAnimation ? 0 : undefined}>
        {searchable || (hint && <Hint>{hint}</Hint>)}

        <Scrollbars
          ref={scrollbarsRef}
          autoHide
          className="scrollbars"
          autoHeight
          autoHeightMax={getMaxHeight(maxHeight, maxVisibleItems, theme.components.menuItem.height)}
          hideTracksWhenNotNeeded
        >
          {children ||
            options?.map((option, index) => {
              if (!option) return null;

              const { key, value, note, label, icon, onClick, ...props } = option;

              return (
                <Item key={key || `${index}-${label}`} {...props} onClick={onItemClick(value, onClick)}>
                  {!!icon && <ItemIcon icon={icon} />}

                  <FlexLabel>{label || String(value)}</FlexLabel>

                  {!!note && <ItemNote>{note}</ItemNote>}
                </Item>
              );
            })}
        </Scrollbars>

        {multiSelectProps && (
          <ButtonContainer
            disabled={disabled}
            onClick={disabled ? stopImmediatePropagation() : stopImmediatePropagation(multiSelectProps.buttonClick)}
          >
            {multiSelectProps.buttonLabel}
          </ButtonContainer>
        )}

        {footerAction}
      </FadeDownDelayedContainer>
    </Container>
  );
}

export default Object.assign(React.forwardRef(Menu) as any as typeof Menu, {
  itemStyles,
  getMaxHeight,
  MAX_VISIBLE_ITEMS,

  Item,
  Footer,
  NotFound,
  ItemIcon,
  ItemNote,
  Container,
  ItemNextIcon,
  ItemActionIcon,
  ButtonContainer,
});
