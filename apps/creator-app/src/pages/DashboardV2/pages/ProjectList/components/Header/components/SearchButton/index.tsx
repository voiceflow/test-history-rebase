import { Input } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';

import * as S from './styles';

interface SearchButtonProps {
  value?: string;
  onSearch: (text: string) => void;
}

const SearchButton: React.FC<SearchButtonProps> = ({ value, onSearch }) => {
  const ref = React.useRef(null);
  const [isOpen, setOpen] = React.useState(false);

  const onEnableSearch = () => setOpen(true);

  useHotkey(Hotkey.FOCUS_DASHBOARD_SEARCH, onEnableSearch, { preventDefault: true });

  return (
    <>
      {isOpen ? (
        <S.InputContainer ref={ref}>
          <Input
            icon={value ? 'close' : 'search'}
            value={value}
            onBlur={() => !value && setOpen(false)}
            autoFocus
            iconProps={{
              size: 16,
              color: 'rgba(110, 132, 154)',
              onClick: () => value && onSearch(''),
              clickable: true,
            }}
            placeholder="Search"
            onChangeText={onSearch}
          />
        </S.InputContainer>
      ) : (
        <Page.Header.IconButton
          icon="search"
          onClick={onEnableSearch}
          tooltip={{
            content: (
              <div style={{ color: '#A2A7A8', fontSize: '13px' }}>
                Press <span style={{ color: '#F2F7F7' }}>/</span> to search
              </div>
            ),
            popperOptions: {
              modifiers: [{ name: 'offset', options: { offset: [0, 3] } }],
            },
          }}
        />
      )}
    </>
  );
};

export default SearchButton;
