import { tid } from '@voiceflow/style';
import { BaseProps, Box, Dropdown, Menu, MenuItem, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { useDeferredSearch } from '@/hooks/search.hook';
import { ZendeskFilterBase } from '@/models/KnowledgeBase.model';

import { captionStyles } from './KBZendeskFilterSelect.css';

export interface IKBZendeskFilterSelect<T extends ZendeskFilterBase> extends BaseProps {
  label: string;
  placeholder?: string;
  value: T | null;
  options: T[];
  errorMessage: string | null;
  disabled?: boolean;
  onValueChange: (value: T) => void;
  onDropdownClose?: () => void;
  hasTooltip?: boolean;
}

export const KBZendeskFilterSelect = <T extends ZendeskFilterBase>({
  label,
  placeholder,
  value,
  disabled,
  options,
  errorMessage,
  onValueChange,
  onDropdownClose,
  hasTooltip,
  testID,
}: IKBZendeskFilterSelect<T>): React.ReactElement => {
  const search = useDeferredSearch({
    items: options,
    searchBy: (item) => item.name,
  });

  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [0, 28] } }]);

  const dropdown = (
    <Dropdown
      value={value?.name || null}
      label={label}
      disabled={disabled}
      error={!!errorMessage}
      errorMessage={errorMessage || undefined}
      onClose={onDropdownClose}
      placeholder={placeholder}
      testID={testID}
    >
      {({ onClose }) => {
        return (
          <Menu
            searchSection={
              options.length ? (
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
          >
            {search.hasItems ? (
              search.items.map((option, index) => {
                const onChange = () => {
                  onValueChange(option);
                  onClose();
                };
                return (
                  <MenuItem
                    key={index + 1}
                    onClick={onChange}
                    searchValue={search.deferredValue}
                    testID={tid(testID, 'menu-item')}
                    label={option.name}
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
            width={168}
            modifiers={modifiers}
            placement="left-start"
            referenceElement={({ onOpen, onClose, ref }) => (
              <Box ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} direction="column">
                {dropdown}
              </Box>
            )}
          >
            {() => (
              <Box direction="column">
                <Tooltip.Caption className={captionStyles}>This filter is disabled until the one above it has a selection present.</Tooltip.Caption>
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
