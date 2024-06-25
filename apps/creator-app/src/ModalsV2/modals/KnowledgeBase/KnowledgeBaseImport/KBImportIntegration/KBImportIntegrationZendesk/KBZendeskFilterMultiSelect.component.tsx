import { tid } from '@voiceflow/style';
import type { BaseProps } from '@voiceflow/ui-next';
import { Box, CheckboxControl, Dropdown, Menu, MenuItem, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { useDeferredSearch } from '@/hooks/search.hook';
import type { ZendeskFilterBase } from '@/models/KnowledgeBase.model';

import { captionStyles } from './KBZendeskFilterSelect.css';

export interface IKBZendeskFilterMultiSelect<T extends ZendeskFilterBase> extends BaseProps {
  label: string;
  placeholder?: string;
  value: T[];
  options: T[];
  disabled?: boolean;
  onValueChange: (value: T[]) => void;
  onDropdownClose?: () => void;
  hasTooltip?: boolean;
  tooltipMessage?: string;
  tooltipVariant?: 'alert' | 'basic' | 'success';
}

export const KBZendeskFilterMultiSelect = <T extends ZendeskFilterBase>({
  label,
  placeholder,
  value,
  disabled,
  options,
  onValueChange,
  onDropdownClose,
  hasTooltip,
  tooltipMessage,
  tooltipVariant = 'basic',
  testID,
}: IKBZendeskFilterMultiSelect<T>): React.ReactElement => {
  const search = useDeferredSearch({
    items: options,
    searchBy: (item) => item.name,
  });

  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 28] } }]);

  const onSelectAll = (onClose: VoidFunction) => () => {
    onValueChange(options);
    onDropdownClose?.();
    onClose();
  };

  const onDeselectAll = () => {
    onValueChange([]);
  };

  const dropdown = (
    <Dropdown
      value={value ? value.map((item) => item.name).join(', ') : null}
      label={label}
      disabled={disabled}
      onClose={onDropdownClose}
      placeholder={placeholder}
      testID={testID}
    >
      {({ onClose }) => {
        return (
          <Menu
            searchSection={
              options && options.length ? (
                <Menu.Search
                  onValueChange={search.setValue}
                  placeholder="Search"
                  value={search.value}
                  key={0}
                  testID={tid(testID, ['menu', 'search'])}
                />
              ) : (
                <></>
              )
            }
            actionButtons={
              search.hasItems ? (
                <Menu.ActionButtons
                  firstButton={
                    <Menu.ActionButtons.Button
                      label={value.length > 0 ? 'Unselect all' : 'Select all'}
                      onClick={value.length > 0 ? onDeselectAll : onSelectAll(onClose)}
                      testID={tid(testID, ['menu', 'toggle-all-selected'])}
                    />
                  }
                />
              ) : (
                <></>
              )
            }
          >
            {search.hasItems ? (
              search.items.map((option, index) => {
                return (
                  <MenuItem
                    key={index + 1}
                    onClick={() =>
                      onValueChange(
                        value.includes(option) ? value.filter((item) => item !== option) : [...value, option]
                      )
                    }
                    label={option.name}
                    searchValue={search.deferredValue}
                    testID={tid(testID, 'menu-item')}
                    checkbox={
                      <CheckboxControl
                        id="checkbox"
                        value={value.includes(option)}
                        onChange={() =>
                          onValueChange(
                            value.includes(option) ? value.filter((item) => item !== option) : [...value, option]
                          )
                        }
                        testID={tid(testID, ['menu-item', 'select'])}
                      />
                    }
                  />
                );
              })
            ) : (
              <Menu.NotFound label={label.toLowerCase()} testID={tid(testID, 'not-found')} />
            )}
          </Menu>
        );
      }}
    </Dropdown>
  );

  return (
    <Box width="100%" direction="column">
      <Box direction="column">
        {hasTooltip && disabled ? (
          <Tooltip
            width={175}
            modifiers={modifiers}
            placement="left"
            variant={tooltipVariant}
            referenceElement={({ onOpen, onClose, ref }) => (
              <Box ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} direction="column">
                {dropdown}
              </Box>
            )}
          >
            {() => (
              <Box direction="column">
                <Tooltip.Caption className={captionStyles}>
                  {tooltipMessage || 'Brand selection is required before applying additional filters to the selection.'}
                </Tooltip.Caption>
              </Box>
            )}
          </Tooltip>
        ) : (
          <>{dropdown}</>
        )}
      </Box>
    </Box>
  );
};
