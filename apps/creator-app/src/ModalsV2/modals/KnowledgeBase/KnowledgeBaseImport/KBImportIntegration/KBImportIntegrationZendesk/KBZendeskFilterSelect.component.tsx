import { Box, CheckboxControl, Dropdown, Menu, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

export interface IKBZendeskFilterSelect {
  label: string;
  placeholder?: string;
  value: string[];
  options: string[];
  disabled?: boolean;
  onValueChange: (value: string[]) => void;
}

export const KBZendeskFilterSelect: React.FC<IKBZendeskFilterSelect> = ({ label, placeholder, value, disabled, options, onValueChange }) => {
  return (
    <Box width="100%" direction="column" pb={12}>
      <Dropdown value={value.join(', ')} label={label} disabled={disabled} placeholder={placeholder}>
        {() => {
          return (
            <Menu>
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
    </Box>
  );
};
