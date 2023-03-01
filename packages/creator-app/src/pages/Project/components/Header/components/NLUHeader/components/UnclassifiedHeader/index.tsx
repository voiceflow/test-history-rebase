import { Box, FlexCenter, stopPropagation, Tabs, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { NLU_MANAGER_ARTICLE_LINK } from '@/constants/links';
import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { UnclassifiedTabs } from '@/pages/NLUManager/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import { Container } from '../../styles';
import NLUSearch from '../Search';
import { FilterMenu } from './components';
import * as S from './styles';

const UnclassifiedHeader: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);
  const isClusteringView = nluManager.isClusteringUnclassifiedData && nluManager.selectedUnclassifiedTab === UnclassifiedTabs.CLUSTERING_VIEW;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useHotkey(Hotkey.FOCUS_NLU_MANAGER_SEARCH, focusInput, { action: 'keyup' });

  return (
    <>
      {nluManager.isScrolling && <S.ShadowBox />}

      <Container style={{ paddingRight: '16px' }}>
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
              <Tabs.Tab value={UnclassifiedTabs.CLUSTERING_VIEW}>
                <TippyTooltip
                  width={232}
                  interactive
                  content={
                    <TippyTooltip.FooterButton
                      // TODO: Add clustering link instead of nlu manager link
                      onClick={stopPropagation(onOpenInternalURLInANewTabFactory(NLU_MANAGER_ARTICLE_LINK))}
                      buttonText="More"
                    >
                      <TippyTooltip.Title>Clustering</TippyTooltip.Title>
                      <Box>When on, utterances are automatically clustered into groups based on their similarity.</Box>
                    </TippyTooltip.FooterButton>
                  }
                >
                  {isClusteringView ? <S.TabLoader /> : 'Clustered'}
                </TippyTooltip>
              </Tabs.Tab>
            </Tabs>
          </Box>
        </FlexCenter>
      </Container>
    </>
  );
};

export default UnclassifiedHeader;
