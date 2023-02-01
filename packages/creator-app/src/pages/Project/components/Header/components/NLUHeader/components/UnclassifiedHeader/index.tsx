import { Box, FlexCenter, Tabs } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { UnclassifiedTabs } from '@/pages/NLUManager/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Container } from '../../styles';
import NLUSearch from '../Search';
import { FilterMenu } from './components';
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
            <FilterMenu />
          </S.QueryIconContainer>

          <Box ml={14} width={250} position="relative">
            <Tabs value={nluManager.selectedUnclassifiedTab} onChange={nluManager.changeUnclassifiedPageTab}>
              <Tabs.Tab value={UnclassifiedTabs.UNCLASSIFIED_VIEW}>Raw</Tabs.Tab>
              <Tabs.Tab value={UnclassifiedTabs.CLUSTERING_VIEW}>{nluManager.isClusteringUnclassifiedData ? <S.TabLoader /> : 'Clustered'}</Tabs.Tab>
            </Tabs>
          </Box>
        </FlexCenter>
      </Container>
    </>
  );
};

export default UnclassifiedHeader;
