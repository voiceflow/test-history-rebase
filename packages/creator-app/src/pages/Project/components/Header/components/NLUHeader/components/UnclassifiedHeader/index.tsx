import { Box, FlexCenter, SvgIcon, Switcher } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { UnclassifiedTabs } from '@/pages/NLUManager/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Container } from '../../styles';
import NLUSearch from '../Search';
import { UnclassifiedTabItems } from './constants';
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
        <NLUSearch
          value={nluManager.search}
          placeholder={`Search ${nluManager.unclassifiedUtterances.length} ${
            nluManager.unclassifiedUtterances.length === 1 ? 'utterance' : 'utterances'
          }`}
          onChange={nluManager.setSearch}
        />

        <FlexCenter>
          <Box mr="28px">
            <SvgIcon icon="query" size={16} color="#8da2b5" clickable />
          </Box>

          <Switcher
            value={nluManager.selectedUnclassifiedTab}
            items={UnclassifiedTabItems}
            onChange={(value) => nluManager.changeUnclassifiedPageTab(value as UnclassifiedTabs)}
            isLoading={nluManager.isClusteringUnclassifiedData}
          />
        </FlexCenter>
      </Container>
    </>
  );
};

export default UnclassifiedHeader;
