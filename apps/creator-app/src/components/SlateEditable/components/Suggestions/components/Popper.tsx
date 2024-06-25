import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import {
  Animations,
  Box,
  defaultMenuLabelRenderer,
  KeyName,
  Menu,
  Portal,
  portalRootNode,
  preventDefault,
  stopPropagation,
  SvgIcon,
  swallowEvent,
  System,
  useCache,
  useCachedValue,
  useLinkedState,
  useVirtualElementPopper,
} from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import type { Normalized } from 'normal-store';
import { denormalize } from 'normal-store';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { useTheme } from '@/hooks/theme';

import { useSlateEditor } from '../../../contexts';
import { EditorAPI } from '../../../editor';
import Content from './Content';
import Header from './Header';
import Hr from './Hr';
import Input from './Input';
import Item from './Item';

export interface PopperItem {
  id: string;
  name: string;
}

export interface PopperProps<T extends PopperItem = PopperItem> {
  search: string;
  onSelect: (item: T) => void;
  onCreate?: (text: string) => Nullable<T> | Promise<Nullable<T>>;
  creatable?: boolean;
  formatter?: (text: string) => string;
  searchable?: boolean;
  isSelected?: boolean;
  suggestions?: Normalized<T>;
  referenceNode: HTMLElement;
  notExistMessage?: string;
  notFoundMessage?: string;
  inputPlaceholder?: string;
  togglePopperFocused: (value: unknown) => void;
}

const Popper = <T extends PopperItem>({
  search,
  onCreate: onCreateProp,
  onSelect,
  formatter,
  creatable,
  isSelected,
  suggestions,
  referenceNode,
  notExistMessage,
  notFoundMessage,
  inputPlaceholder,
  togglePopperFocused,
}: PopperProps<T>): React.ReactElement<any, any> => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const popper = useVirtualElementPopper(referenceNode, {
    strategy: 'fixed',
    placement: 'bottom-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: portalRootNode, padding: 16 } },
    ],
  });

  const theme = useTheme();
  const editor = useSlateEditor();

  const items = React.useMemo(() => _sortBy(suggestions ? denormalize(suggestions) : [], 'name'), [suggestions]);
  const formattedSearch = React.useMemo(() => formatter?.(search) ?? search, [search, formatter]);

  const [searchLabel, setSearchLabel] = useLinkedState(formattedSearch);
  const [focusedIndex, setFocusedIndex] = React.useState(0);

  const itemsToRender = React.useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(searchLabel)),
    [items, searchLabel]
  );
  const itemsByNameMap = React.useMemo(
    () => Utils.array.createMap(itemsToRender, (item) => item.name.toLowerCase()),
    [itemsToRender]
  );

  const onCreate = async () => {
    const newSuggestion = await onCreateProp?.(searchLabel);

    if (newSuggestion) {
      onSelect(newSuggestion);
    }
  };

  const onFocusPopper = () => {
    editor.blurPrevented = true;
    togglePopperFocused(true);

    EditorAPI.blur(editor);
  };

  const onInputBlur = () => {
    editor.blurPrevented = false;
  };

  const cache = useCache({
    onCreate,
    onSelect,
    creatable,
    isSelected,
    focusedIndex,
    itemsToRender,
  });

  const dismissableRef = useCachedValue(popper.popperElement);

  useDismissable(true, { ref: dismissableRef, onClose: () => togglePopperFocused(false) });

  React.useEffect(() => {
    const observer = new MutationObserver(() => popper.forceUpdate?.());

    observer.observe(referenceNode, { subtree: true, childList: true });

    return () => observer.disconnect();
  }, [referenceNode, popper.forceUpdate]);

  React.useEffect(() => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === KeyName.ARROW_DOWN || event.key === KeyName.ARROW_UP) {
        swallowEvent()(event);

        let nextIndex = cache.current.focusedIndex + (event.key === KeyName.ARROW_DOWN ? 1 : -1);

        if (nextIndex >= cache.current.itemsToRender.length + 1) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = cache.current.itemsToRender.length;
        }

        contentRef.current?.children[nextIndex - 1]?.scrollIntoView({ block: 'nearest' });

        if (!cache.current.isSelected) {
          if (nextIndex === 0) {
            inputRef.current?.focus();
          } else if (cache.current.focusedIndex === 0) {
            inputRef.current?.blur();
          }
        }

        setFocusedIndex(nextIndex);
      } else if (event.key === KeyName.ENTER) {
        swallowEvent()(event);

        if (cache.current.creatable && cache.current.focusedIndex === 0) {
          cache.current.onCreate();
        } else {
          cache.current.onSelect(cache.current.itemsToRender[cache.current.focusedIndex - 1]);
        }
      }
    };

    document.addEventListener('keydown', onKeydown, { capture: true });

    return () => {
      document.removeEventListener('keydown', onKeydown, { capture: true });

      editor.blurPrevented = false;
      togglePopperFocused(false);
    };
  }, []);

  return (
    <Portal portalNode={document.body}>
      <div
        ref={popper.setPopperElement}
        style={{ ...popper.styles.popper, zIndex: theme.zIndex.popper }}
        {...popper.attributes.popper}
      >
        <Menu.Container onMouseDown={onFocusPopper} onClick={stopPropagation()}>
          <Animations.FadeDownDelayed>
            <Header onMouseEnter={() => setFocusedIndex(0)}>
              <Box mr={12} display="inline-block">
                <SvgIcon icon="search" size={16} color="#6E849A" />
              </Box>

              <Input
                ref={inputRef}
                value={searchLabel}
                onBlur={onInputBlur}
                placeholder={inputPlaceholder}
                onChangeText={setSearchLabel}
              />

              {creatable && (
                <System.IconButtonsGroup.Base>
                  <System.IconButton.Base
                    icon="plus"
                    onClick={Utils.functional.chainVoid(preventDefault, onCreate)}
                    disabled={!searchLabel || !!itemsByNameMap[searchLabel]}
                    onMouseDown={preventDefault()}
                  />
                </System.IconButtonsGroup.Base>
              )}
            </Header>

            <Hr />

            <Content ref={contentRef}>
              {!itemsToRender.length ? (
                <Menu.Item readOnly>
                  <Menu.NotFound>
                    {!searchLabel ? notExistMessage ?? 'No items exist.' : notFoundMessage ?? 'Nothing found'}
                  </Menu.NotFound>
                </Menu.Item>
              ) : (
                itemsToRender.map((item, index) => (
                  <Item
                    key={item.id}
                    active={focusedIndex === index + 1}
                    onClick={() => onSelect(item)}
                    onMouseEnter={() => setFocusedIndex(index + 1)}
                  >
                    {defaultMenuLabelRenderer(item.name, searchLabel, () => item.name, Utils.functional.noop)}
                  </Item>
                ))
              )}
            </Content>
          </Animations.FadeDownDelayed>
        </Menu.Container>
      </div>
    </Portal>
  );
};

export default Popper;
