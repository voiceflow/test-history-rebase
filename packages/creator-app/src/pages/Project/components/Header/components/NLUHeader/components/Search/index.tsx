import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import { SearchInput } from '../../styles';

interface NLUSearchProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
}

const NLUSearch: React.FC<NLUSearchProps> = ({ value, onChange, placeholder }) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useHotKeys(Hotkey.FOCUS_NLU_MANAGER_SEARCH, focusInput, { action: 'keyup' });

  return (
    <TippyTooltip
      html={
        <div style={{ color: '#A2A7A8', fontSize: '13px' }}>
          Press <span style={{ color: '#F2F7F7' }}>/</span> to search
        </div>
      }
      position="bottom"
      open={tooltipOpen}
      distance={-6}
      offset={-33}
    >
      <SearchInput
        ref={inputRef}
        icon={value ? 'close' : 'search'}
        value={value}
        iconProps={{ color: '#8da2b5', size: 16 }}
        placeholder={placeholder}
        onChangeText={onChange}
        onIconClick={() => onChange('')}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onFocus={() => setTooltipOpen(false)}
      />
    </TippyTooltip>
  );
};

export default NLUSearch;
