import { BaseUtils } from '@voiceflow/base-types';
import { Box, Dropdown, Input, Menu, SvgIcon, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import VariablesInput from '@/components/VariablesInput';

import { PromptSelectContainer } from './styles';

const ModeDescription: Record<string, string> = {
  [BaseUtils.ai.PROMPT_MODE.PROMPT]: 'Prompt',
  [BaseUtils.ai.PROMPT_MODE.MEMORY]: 'Memory',
  [BaseUtils.ai.PROMPT_MODE.MEMORY_PROMPT]: 'Memory & Prompt',
};

interface MemorySelectProps<T> {
  value: BaseUtils.ai.AIContextParams;
  onChange: (value: Partial<BaseUtils.ai.AIContextParams>) => void;
  placeholder?: string;
  onContentChange?: (hasContent: boolean) => void;
  options?: BaseUtils.ai.PROMPT_MODE[];
  actionPrefix?: string;
  InputWrapper?: {
    Component: React.ComponentType<T>;
    props: T;
  };
}

function MemorySelect<T extends React.PropsWithChildren>(props: MemorySelectProps<T>): React.ReactElement;
function MemorySelect(props: MemorySelectProps<React.PropsWithChildren>): React.ReactElement {
  // destructure props within function body to avoid TS arrow function error
  const {
    value,
    onChange,
    options = Object.values(BaseUtils.ai.PROMPT_MODE),
    actionPrefix = 'Respond using',
    placeholder,
    onContentChange,
    InputWrapper = { Component: React.Fragment, props: {} },
  } = props;

  return (
    <Box>
      <Dropdown
        offset={{ offset: [0, 8] }}
        menu={
          <Menu>
            {options.map((mode) => (
              <Menu.Item key={mode} onClick={() => onChange({ mode })}>
                {actionPrefix} {ModeDescription[mode!]?.toLowerCase().replace('&', 'and')}
              </Menu.Item>
            ))}
          </Menu>
        }
      >
        {({ ref, onToggle, isOpen }) => (
          <PromptSelectContainer onClick={onToggle} ref={ref} color={isOpen ? ThemeColor.DARKER_BLUE : ThemeColor.SECONDARY}>
            <>{ModeDescription[value.mode || BaseUtils.ai.PROMPT_MODE.PROMPT]}</>
            <SvgIcon icon="arrowRightSmall" size={8} rotation={90} />
          </PromptSelectContainer>
        )}
      </Dropdown>
      {value.mode === BaseUtils.ai.PROMPT_MODE.MEMORY ? (
        <Input value="Respond using conversation memory..." readOnly disabled cursor="not-allowed" />
      ) : (
        <InputWrapper.Component {...InputWrapper.props}>
          <VariablesInput
            placeholder={placeholder || 'Enter prompt'}
            value={value.prompt}
            onBlur={({ text }) => onChange({ prompt: text })}
            multiline
            newLineOnEnter
            onEditorStateChange={(state) => onContentChange?.(state.getCurrentContent().hasText())}
          />
        </InputWrapper.Component>
      )}
    </Box>
  );
}

export default MemorySelect;
