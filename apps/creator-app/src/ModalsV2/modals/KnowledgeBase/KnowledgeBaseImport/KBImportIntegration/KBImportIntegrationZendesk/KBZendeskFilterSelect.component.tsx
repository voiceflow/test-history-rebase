import { Box, CheckboxControl, Dropdown, Menu, MenuItem, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { ZendeskFilterBase } from '@/models/KnowledgeBase.model';

import { captionStyles } from './KBZendeskFilterSelect.css';

export interface IKBZendeskFilterSelect<T extends ZendeskFilterBase> {
  label: string;
  placeholder?: string;
  value: T[];
  options: T[];
  disabled?: boolean;
  onValueChange: (value: T[]) => void;
  onClose?: VoidFunction;
  hasTooltip?: boolean;
}

export const KBZendeskFilterSelect = <T extends ZendeskFilterBase>({
  label,
  placeholder,
  value,
  disabled,
  options,
  onValueChange,
  hasTooltip,
  onClose,
}: IKBZendeskFilterSelect<T>): React.ReactElement => {
  const [search, setSearch] = React.useState('');
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [-10, 28] } }]);

  const onSelectAll = (onClose: VoidFunction) => () => {
    onValueChange(options);
    onClose();
  };

  const onDeselectAll = () => {
    onValueChange([]);
  };

  return (
    <Box width="100%" direction="column">
      <Box pb={6} direction="column">
        {hasTooltip && disabled ? (
          <Tooltip
            width={168}
            modifiers={modifiers}
            placement="left-start"
            referenceElement={({ onOpen, onClose, ref }) => (
              <Box ref={ref} onMouseEnter={onOpen} onMouseLeave={onClose} direction="column">
                <Dropdown
                  value={value.map((item) => item.name).join(', ')}
                  label={label}
                  disabled={disabled}
                  placeholder={placeholder}
                  onClose={onClose}
                >
                  {() => {
                    return (
                      <Menu searchSection={<Menu.Search onValueChange={setSearch} placeholder="Search" value={search} key={0} />}>
                        {options.map((option, index) => {
                          return (
                            <MenuItem
                              key={index}
                              onClick={() => onValueChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])}
                              label={option.name}
                              checkbox={
                                <CheckboxControl
                                  id="checkbox"
                                  value={value.includes(option)}
                                  onChange={() =>
                                    onValueChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
                                  }
                                />
                              }
                            />
                          );
                        })}
                      </Menu>
                    );
                  }}
                </Dropdown>
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
          <>
            <Dropdown value={value.map((item) => item.name).join(', ')} label={label} disabled={disabled} placeholder={placeholder}>
              {({ onClose }) => {
                return (
                  <Menu
                    searchSection={<Menu.Search onValueChange={setSearch} placeholder="Search" value={search} key={0} />}
                    actionButtons={
                      <Menu.ActionButtons
                        firstButton={
                          <Menu.ActionButtons.Button
                            label={value.length > 0 ? 'Unselect all' : 'Select all'}
                            onClick={value.length > 0 ? onDeselectAll : onSelectAll(onClose)}
                          />
                        }
                      />
                    }
                  >
                    {options
                      .filter((option) => !search || option.name.toLowerCase().includes(search.toLowerCase()))
                      .map((option, index) => {
                        return (
                          <MenuItem
                            key={index + 1}
                            onClick={() => onValueChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])}
                            label={option.name}
                            checkbox={
                              <CheckboxControl
                                id="checkbox"
                                value={value.includes(option)}
                                onChange={() => onValueChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])}
                              />
                            }
                          />
                        );
                      })}
                  </Menu>
                );
              }}
            </Dropdown>
          </>
        )}
      </Box>
    </Box>
  );
};
