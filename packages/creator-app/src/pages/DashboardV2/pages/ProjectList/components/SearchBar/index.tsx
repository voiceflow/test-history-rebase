import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

import * as S from './styles';

interface SearchBarProps {
  value: string;
  onSearch: (text: string) => void;
}

const SearchBar: React.OldFC<SearchBarProps> = ({ value, onSearch }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useHotKeys(Hotkey.FOCUS_DASHBOARD_SEARCH, focusInput, { preventDefault: true });

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
    >
      <S.InputContainer>
        <S.StyledInput
          ref={inputRef}
          icon={value ? 'close' : 'search'}
          value={value}
          iconProps={{ size: 16, color: 'rgba(110, 132, 154)', onClick: () => value && onSearch(''), clickable: true }}
          placeholder="Search assistants"
          onChangeText={onSearch}
        />
      </S.InputContainer>
    </TippyTooltip>
  );
};

export default SearchBar;
