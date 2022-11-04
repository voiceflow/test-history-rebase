import { Box, FlexCenter, SvgIcon, Switcher } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { UnclassifiedTabItems, UnclassifiedTabs } from '@/pages/NLUManager/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Container, SearchInput } from '../../styles';
import * as S from './styles';

const UnclassifiedHeader: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useHotKeys(Hotkey.FOCUS_NLU_MANAGER_SEARCH, focusInput, { action: 'keyup' });

  return (
    <>
      {nluManager.isScrolling && <S.ShadowBox />}

      <Container style={{ paddingRight: '18px' }}>
        <Box style={{ width: '50%' }}>
          <SearchInput
            ref={inputRef}
            icon="search"
            value={nluManager.search}
            iconProps={{ color: '#8da2b5', size: 16 }}
            placeholder={`Search ${nluManager.unclassifiedUtterances.length} ${
              nluManager.unclassifiedUtterances.length === 1 ? 'utterance' : 'utterances'
            }`}
            onChangeText={nluManager.setSearch}
          />
        </Box>

        <FlexCenter>
          <Box mr="28px">
            <SvgIcon icon="query" size={16} color="#8da2b5" clickable />
          </Box>

          <Switcher
            value={nluManager.selectedUnclassifiedTab}
            items={UnclassifiedTabItems}
            onChange={(value) => nluManager.setSelectedUnclassifiedTab(value as UnclassifiedTabs)}
          />
        </FlexCenter>
      </Container>
    </>
  );
};

export default UnclassifiedHeader;
