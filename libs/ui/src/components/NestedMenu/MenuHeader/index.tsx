import composeRef from '@seznam/compose-react-refs';
import Box from '@ui/components/Box';
import SvgIcon from '@ui/components/SvgIcon';
import { useSetup } from '@ui/hooks';
import { setRef, stopImmediatePropagation } from '@ui/utils';
import { Nullable } from '@voiceflow/common';
import React from 'react';

import { MenuHeaderWrapper, MenuHr, MenuInput, SearchContainer } from './components';

interface MenuHeaderProps {
  onHide: VoidFunction;
  onFocus: VoidFunction;
  onCreate: (value: string) => void;
  creatable?: boolean;
  searchable?: boolean;
  hasOptions?: boolean;
  isDropdown?: boolean;
  searchLabel?: string;
  createLabel?: React.ReactNode;
  onInputBlur?: React.FocusEventHandler<HTMLInputElement>;
  onInputFocus?: React.FocusEventHandler<HTMLInputElement>;
  createInputRef?: React.Ref<HTMLInputElement>;
  newOptionLabel?: string;
  inDropdownSearch?: boolean;
  alwaysShowCreate?: boolean;
  focusedOptionRef?: React.Ref<HTMLLIElement>;
  isButtonDisabled?: (options: { value: string }) => boolean;
  updateSearchLabel: (value: string) => void;
  renderSearchSuffix?: Nullable<(options: { close: VoidFunction; searchLabel: string }) => React.ReactNode>;
  focusedOptionIndex: number | null;
  onChangeSearchLabel?: React.ChangeEventHandler<HTMLInputElement>;
  createInputAutofocus?: boolean;
  createInputPlaceholder?: string;
}

const MenuHeader: React.FC<MenuHeaderProps> = ({
  onHide,
  onFocus,
  onCreate,
  creatable,
  searchable,
  hasOptions,
  isDropdown,
  searchLabel,
  createLabel = 'Create',
  onInputBlur,
  onInputFocus,
  createInputRef,
  newOptionLabel,
  inDropdownSearch,
  alwaysShowCreate,
  focusedOptionRef,
  isButtonDisabled,
  updateSearchLabel,
  renderSearchSuffix,
  focusedOptionIndex,
  onChangeSearchLabel,
  createInputAutofocus = true,
  createInputPlaceholder,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const value = searchable && !isDropdown ? searchLabel : newOptionLabel;
  const inputVal = searchable ? searchLabel : newOptionLabel;

  useSetup(() => {
    if (inDropdownSearch && createInputAutofocus) {
      inputRef.current?.focus();
    }
  });

  if (!inputVal && !alwaysShowCreate) return null;

  const notInDropdownInput = (
    <MenuInput
      value={inputVal}
      onClick={(event) => !inDropdownSearch && event.stopPropagation()}
      onBlur={onInputBlur}
      onFocus={onInputFocus}
      inputRef={inDropdownSearch ? undefined : (node) => setRef(createInputRef, node)}
      onChange={searchable ? onChangeSearchLabel : ({ target }) => updateSearchLabel(target.value)}
      $fullWidth={!inputVal}
      placeholder={createInputPlaceholder}
    />
  );

  return (
    <>
      {inDropdownSearch && (
        <>
          <SearchContainer onClick={stopImmediatePropagation()}>
            <Box mr={12} display="inline-block">
              <SvgIcon icon="search" size={16} color="#6E849A" />
            </Box>

            <MenuInput
              value={inputVal}
              onBlur={onInputBlur}
              onClick={() => inputRef.current?.focus()}
              onFocus={onInputFocus}
              inputRef={(node) => setRef(composeRef(createInputRef, inputRef), node)}
              onChange={searchable ? onChangeSearchLabel : ({ target }) => updateSearchLabel(target.value)}
              autoFocus={createInputAutofocus}
              $fullWidth
              placeholder={createInputPlaceholder && `Search ${createInputPlaceholder}`}
            />

            {renderSearchSuffix?.({ close: onHide, searchLabel: inputVal ?? '' })}
          </SearchContainer>
          <MenuHr />
        </>
      )}

      {(!inDropdownSearch || (value && creatable)) && (
        <MenuHeaderWrapper
          ref={focusedOptionIndex === 0 ? focusedOptionRef : null}
          onClick={() => value && onCreate(value)}
          isFocused={focusedOptionIndex === 0}
          isDisabled={isButtonDisabled?.({ value: value ?? '' })}
          onMouseEnter={onFocus}
        >
          {!isDropdown && (
            <Box mr="4px" color="#6e849a">
              {createLabel}
            </Box>
          )}

          {inputVal ? <span>"{notInDropdownInput}"</span> : notInDropdownInput}
        </MenuHeaderWrapper>
      )}

      {!inDropdownSearch && hasOptions && <MenuHr style={{ margin: '0px' }} />}
    </>
  );
};

export default MenuHeader;
