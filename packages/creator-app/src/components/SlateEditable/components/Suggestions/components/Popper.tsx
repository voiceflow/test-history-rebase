import { Nullable } from '@voiceflow/common';
import {
  Box,
  ClickableText,
  getNestedMenuFormattedLabel,
  KeyName,
  Menu,
  Portal,
  portalRootNode,
  preventDefault,
  stopPropagation,
  swallowEvent,
  useCache,
  useCachedValue,
  useVirtualElementPopper,
} from '@voiceflow/ui';
import _shuffle from 'lodash/shuffle';
import { denormalize, Normalized } from 'normal-store';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import { TextEditorVariablesPopoverContext } from '@/contexts';
import { useLinkedState, useTheme } from '@/hooks';
import { FadeDownDelayedContainer } from '@/styles/animations';
import { withTargetValue } from '@/utils/dom';

import { useSlateEditor } from '../../../contexts';
import { EditorAPI } from '../../../editor';
import Content from './Content';
import Header from './Header';
import Input from './Input';
import Item from './Item';

export interface PopperItem {
  id: string;
  name: string;
}

interface PopperItemToRender<T extends PopperItem> extends Omit<PopperItem, 'name'> {
  item: T;
  name: React.ReactNode;
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
  inputPlaceholder?: string;
  togglePopperFocused: (value: unknown) => void;
}

const Popper = <T extends PopperItem>({
  search,
  onCreate,
  onSelect,
  formatter,
  creatable,
  isSelected,
  searchable,
  suggestions,
  inputPlaceholder,
  referenceNode,
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
  const portalNode = React.useContext(TextEditorVariablesPopoverContext);
  const formattedSearch = React.useMemo(() => formatter?.(search) ?? search, [search, formatter]);
  const [localSearch, setLocalSearch] = useLinkedState(formattedSearch);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const withHeader = creatable || searchable || false;

  const [suggestionsByNameMap, suggestionsToRender] = React.useMemo(() => {
    const map: Record<string, PopperItem> = {};
    const sorted: PopperItemToRender<T>[] = [];
    const unsorted: PopperItemToRender<T>[] = [];
    const lowerLocalSearch = localSearch.toLowerCase();

    if (!suggestions) {
      return [{}, []] as const;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const suggestion of denormalize(suggestions)) {
      map[suggestion.name] = suggestion;

      if (!withHeader) {
        sorted.push({ ...suggestion, item: suggestion });
      } else if (!lowerLocalSearch || suggestion.name.toLowerCase().includes(lowerLocalSearch)) {
        sorted.push({ ...suggestion, name: getNestedMenuFormattedLabel(suggestion.name, localSearch), item: suggestion });
      } else {
        unsorted.push({ ...suggestion, item: suggestion });
      }
    }

    return [map, [...sorted, ..._shuffle(unsorted)]] as const;
  }, [localSearch, suggestions]);

  const cache = useCache({
    onCreate,
    onSelect,
    creatable,
    searchable,
    isSelected,
    withHeader,
    localSearch,
    activeIndex,
    suggestionsToRender,
  });

  const onCreateSuggestion = React.useCallback(async () => {
    const newSuggestion = await cache.current.onCreate?.(cache.current.localSearch);

    if (newSuggestion) {
      cache.current.onSelect(newSuggestion);
    }
  }, []);

  const onInputChanged = (value: string) => {
    setLocalSearch(formatter?.(value) ?? value);
  };

  const onFocusPopper = () => {
    editor.blurPrevented = true;
    togglePopperFocused(true);

    EditorAPI.blur(editor);
  };

  const onInputBlur = () => {
    editor.blurPrevented = false;
  };

  const dismissableRef = useCachedValue(popper.popperElement as Element);
  useDismissable(true, { ref: dismissableRef, onClose: () => togglePopperFocused(false) });

  React.useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const indexShift = cache.current.withHeader ? 1 : 0;

      if (event.key === KeyName.ARROW_DOWN || event.key === KeyName.ARROW_UP) {
        swallowEvent()(event);

        let nextIndex = cache.current.activeIndex + (event.key === KeyName.ARROW_DOWN ? 1 : -1);

        if (nextIndex >= cache.current.suggestionsToRender.length + indexShift) {
          nextIndex = 0;
        } else if (nextIndex < 0) {
          nextIndex = cache.current.suggestionsToRender.length + indexShift - 1;
        }

        contentRef.current?.children[nextIndex - indexShift]?.scrollIntoView({ block: 'nearest' });

        if (cache.current.withHeader && !cache.current.isSelected) {
          if (nextIndex === 0) {
            inputRef.current?.focus();
          } else if (cache.current.activeIndex === 0) {
            inputRef.current?.blur();
          }
        }

        setActiveIndex(nextIndex);
      } else if (event.key === KeyName.ENTER) {
        swallowEvent()(event);

        if (cache.current.creatable && cache.current.activeIndex === 0) {
          onCreateSuggestion();
        } else {
          cache.current.onSelect(cache.current.suggestionsToRender[cache.current.activeIndex - indexShift].item);
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

  React.useEffect(() => {
    const observer = new MutationObserver(() => popper.forceUpdate?.());
    observer.observe(referenceNode, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, [referenceNode, popper.forceUpdate]);

  return (
    <Portal portalNode={portalNode}>
      <div ref={popper.setPopperElement} style={{ ...popper.styles.popper, zIndex: theme.zIndex.popper }} {...popper.attributes.popper}>
        <Menu.Container onMouseDown={onFocusPopper} onClick={stopPropagation()}>
          <FadeDownDelayedContainer>
            {withHeader && (
              <Header active={activeIndex === 0} onMouseEnter={() => setActiveIndex(0)}>
                <Input
                  ref={inputRef}
                  value={localSearch}
                  onBlur={onInputBlur}
                  onChange={withTargetValue(onInputChanged)}
                  placeholder={inputPlaceholder}
                />

                {creatable && (
                  <Box ml={8}>
                    <ClickableText onClick={preventDefault(onCreateSuggestion)} disabled={!localSearch || !!suggestionsByNameMap[localSearch]}>
                      Create
                    </ClickableText>
                  </Box>
                )}
              </Header>
            )}

            <Content ref={contentRef}>
              {suggestionsToRender.map((suggestion, index) => (
                <Item
                  key={suggestion.id}
                  active={activeIndex === index + Number(withHeader)}
                  onClick={() => onSelect(suggestion.item)}
                  onMouseEnter={() => setActiveIndex(index + Number(withHeader))}
                >
                  {suggestion.name}
                </Item>
              ))}
            </Content>
          </FadeDownDelayedContainer>
        </Menu.Container>
      </div>
    </Portal>
  );
};

export default Popper;
