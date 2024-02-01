import { Box, CheckboxControl, Dropdown, Menu, MenuItem, Text, Tooltip, useTooltipModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { captionStyles, filterLabelStyles } from './KBZendeskFilterSelect.css';

export interface IKBZendeskFilterSelect {
  label: string;
  placeholder?: string;
  value: string[];
  options: string[];
  disabled?: boolean;
  onValueChange: (value: string[]) => void;
  hasTooltip?: boolean;
}

export const KBZendeskFilterSelect: React.FC<IKBZendeskFilterSelect> = ({
  label,
  placeholder,
  value,
  disabled,
  options,
  onValueChange,
  hasTooltip,
}) => {
  const [search, setSearch] = React.useState('');
  const [isSelectAll, setIsSelectAll] = React.useState(true);
  const modifiers = useTooltipModifiers([{ name: 'offset', options: { offset: [-10, 28] } }]);

  const onSelectAll = (onClose: VoidFunction) => () => {
    onValueChange(options);
    onClose();
    setIsSelectAll(false);
  };

  const onDeselectAll = () => {
    onValueChange([]);
    setIsSelectAll(true);
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
                <Text variant="tableHeader" className={filterLabelStyles}>
                  {label}
                </Text>
                <Dropdown value={value.join(', ')} disabled={disabled} placeholder={placeholder}>
                  {() => {
                    return (
                      <Menu
                        searchSection={<Menu.Search onValueChange={setSearch} placeholder="Search" value={search} key={0} />}
                        actionButtons={
                          <Menu.ActionButtons
                            firstButton={
                              <Menu.ActionButtons.Button
                                label={isSelectAll ? 'Select all' : 'Unselect all'}
                                onClick={isSelectAll ? onSelectAll(onClose) : onDeselectAll}
                              />
                            }
                          />
                        }
                      >
                        {options.map((option, index) => {
                          return (
                            <MenuItem
                              key={index}
                              onClick={() => onValueChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])}
                              label={option}
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
            <Text variant="tableHeader" className={filterLabelStyles}>
              {label}
            </Text>
            <Dropdown value={value.join(', ')} disabled={disabled} placeholder={placeholder}>
              {({ onClose }) => {
                return (
                  <Menu
                    searchSection={<Menu.Search onValueChange={setSearch} placeholder="Search" value={search} key={0} />}
                    actionButtons={
                      <Menu.ActionButtons
                        firstButton={
                          <Menu.ActionButtons.Button
                            label={isSelectAll ? 'Select all' : 'Unselect all'}
                            onClick={isSelectAll ? onSelectAll(onClose) : onDeselectAll}
                          />
                        }
                      />
                    }
                  >
                    {options
                      .filter((option) => option.includes(search.toLowerCase()))
                      .map((option, index) => {
                        return (
                          <MenuItem
                            key={index + 1}
                            onClick={() => onValueChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])}
                            label={option}
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
