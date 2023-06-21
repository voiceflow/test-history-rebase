import { BaseUtils } from '@voiceflow/base-types';
import { Box, Dropdown, Input, Menu, SvgIcon, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import PromptInput, { PromptInputProps } from '@/pages/Canvas/managers/components/AI/components/PromptInput';
import { MemorySelectOption } from '@/pages/Canvas/managers/components/AI/constants';

import { PromptSelectContainer } from './styles';

interface MemorySelectProps<T> extends PromptInputProps<T> {
  options: MemorySelectOption[];
}

function MemorySelect<T extends React.PropsWithChildren>(props: MemorySelectProps<T>): React.ReactElement;
function MemorySelect(props: MemorySelectProps<React.PropsWithChildren>): React.ReactElement {
  // destructure props within function body to avoid TS arrow function error
  const { value, onChange, options } = props;

  const selectedModeOption = React.useMemo(() => options.find(({ mode }) => value.mode === mode) || options[0], [options, value.mode]);

  return (
    <Box>
      <Dropdown
        offset={{ offset: [0, 8] }}
        menu={
          <Menu>
            {options.map(({ mode, label }) => (
              <Menu.Item key={mode} onClick={() => onChange({ mode })}>
                {label}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        {({ ref, onToggle, isOpen }) => (
          <PromptSelectContainer onClick={onToggle} ref={ref} color={isOpen ? ThemeColor.DARKER_BLUE : ThemeColor.SECONDARY}>
            {selectedModeOption?.title}
            <SvgIcon icon="arrowRightSmall" size={8} rotation={90} />
          </PromptSelectContainer>
        )}
      </Dropdown>
      {value.mode === BaseUtils.ai.PROMPT_MODE.MEMORY ? (
        <Input value="Respond using conversation memory..." readOnly disabled cursor="not-allowed" />
      ) : (
        <PromptInput {...props} />
      )}
    </Box>
  );
}

export default MemorySelect;
