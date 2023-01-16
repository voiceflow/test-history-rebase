import { Box, FlexCenter, SvgIcon, Switcher } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { UnclassifiedTabItems, UnclassifiedTabs } from '@/pages/NLUManager/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Container } from '../../styles';
import NLUSearch from '../Search';
import * as S from './styles';

const UnclassifiedHeader: React.OldFC = () => {
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
        <NLUSearch
          value={nluManager.search}
          placeholder={`Search ${nluManager.unclassifiedUtterances.length} ${
            nluManager.unclassifiedUtterances.length === 1 ? 'utterance' : 'utterances'
          }`}
          onChange={nluManager.setSearch}
        />

        <FlexCenter>
          <S.QueryIconContainer>
            <SvgIcon icon="query" size={16} onClick={() => {}} clickable color={SvgIcon.DEFAULT_COLOR} />
          </S.QueryIconContainer>

          <Box ml={14}>
            <Switcher
              value={nluManager.selectedUnclassifiedTab}
              items={UnclassifiedTabItems}
              onChange={(value) => nluManager.changeUnclassifiedPageTab(value as UnclassifiedTabs)}
              isLoading={nluManager.isClusteringUnclassifiedData}
            />
          </Box>
        </FlexCenter>
      </Container>
    </>
  );
};

export default UnclassifiedHeader;
