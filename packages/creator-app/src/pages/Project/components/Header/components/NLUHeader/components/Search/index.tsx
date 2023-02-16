import { SvgIcon, TippyTooltip } from '@voiceflow/ui';
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
        icon={value ? 'close' : 'search'}
        value={value}
        onFocus={() => setTooltipOpen(false)}
        iconProps={{ color: SvgIcon.DEFAULT_COLOR, size: 16, onClick: () => onChange(''), clickable: true }}
        placeholder={placeholder}
        onChangeText={onChange}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      />
    </TippyTooltip>
  );
};

export default NLUSearch;
