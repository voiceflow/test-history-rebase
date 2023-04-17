import { DefaultInputProps, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

import * as S from './styles';

interface SearchBarProps extends Omit<DefaultInputProps, 'onChange'> {
  animateIn?: boolean;
  noBorder?: boolean;
  onSearch: (text: string) => void;
  placeholder: string;
  value: string;
  width?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder, onSearch, noBorder, width, animateIn = true }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useHotkey(Hotkey.FOCUS_DASHBOARD_SEARCH, focusInput, { preventDefault: true });

  return (
    <TippyTooltip
      content={
        <div style={{ color: '#A2A7A8', fontSize: '13px' }}>
          Press <span style={{ color: '#F2F7F7' }}>/</span> to search
        </div>
      }
      popperOptions={{
        modifiers: [{ name: 'offset', options: { offset: [0, -6] } }],
      }}
      placement="bottom-start"
      disabled={isFocused}
    >
      <S.InputContainer animateIn={animateIn}>
        <S.StyledInput
          ref={inputRef}
          icon={value ? 'close' : 'search'}
          value={value}
          iconProps={{ size: 16, color: 'rgba(110, 132, 154)', onClick: () => value && onSearch(''), clickable: true }}
          placeholder={placeholder}
          onChangeText={onSearch}
          noBorder={noBorder}
          width={width}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </S.InputContainer>
    </TippyTooltip>
  );
};

export default SearchBar;
