import { SvgIcon, TippyTooltip, useDebouncedCallback, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

import { SearchInput } from './styles';

interface KBSearchProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
}

export const KBSearch: React.FC<KBSearchProps> = ({ value, onChange, placeholder }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useLinkedState(value);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  const onChangeDebounced = useDebouncedCallback(300, onChange);

  const onLocalChange = (newValue: string) => {
    setLocalValue(newValue);
    onChangeDebounced(newValue);
  };

  useHotkey(Hotkey.FOCUS_KB_MANAGER_SEARCH, () => inputRef.current?.focus(), { action: 'keyup' });

  return (
    <TippyTooltip
      content={
        <div style={{ color: '#A2A7A8', fontSize: '13px' }}>
          Press <span style={{ color: '#F2F7F7' }}>/</span> to search
        </div>
      }
      position="bottom"
      visible={tooltipOpen}
      offset={[-33, -6]}
    >
      <SearchInput
        ref={inputRef}
        icon={localValue ? 'close' : 'search'}
        value={localValue}
        onFocus={() => setTooltipOpen(false)}
        iconProps={{ color: SvgIcon.DEFAULT_COLOR, size: 16, onClick: () => onLocalChange(''), clickable: true }}
        placeholder={placeholder}
        onChangeText={onLocalChange}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      />
    </TippyTooltip>
  );
};
