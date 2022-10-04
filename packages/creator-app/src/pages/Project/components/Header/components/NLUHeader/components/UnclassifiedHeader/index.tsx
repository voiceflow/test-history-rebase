import { Box } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Container, SearchInput } from '../../styles';

const UnclassifiedHeader: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useHotKeys(Hotkey.FOCUS_NLU_MANAGER_SEARCH, focusInput, { action: 'keyup' });

  return (
    <Container>
      <Box>
        <SearchInput
          ref={inputRef}
          icon="search"
          value={nluManager.search}
          iconProps={{ color: '#8da2b5', size: 16 }}
          placeholder={`Search ${nluManager.intents.length} ${nluManager.intents.length === 1 ? 'utterance' : 'utterances'}`}
          onChangeText={nluManager.setSearch}
        />
      </Box>
    </Container>
  );
};

export default UnclassifiedHeader;
