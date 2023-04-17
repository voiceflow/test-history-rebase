import { Box, SearchInput } from '@voiceflow/ui';

import { UncontrolledSection } from '@/components/Section';
import ContentContainer from '@/components/Section/components/ContentContainer';
import SectionHeader from '@/components/Section/components/SectionHeader';
import { InteractionModelTabType } from '@/constants';
import { css, styled, transition } from '@/hocs/styled';

export const SectionSection = styled(UncontrolledSection)<{ isExpanded: boolean }>`
  ${SectionHeader} {
    ${({ isExpanded }) =>
      isExpanded &&
      css`
        background: #fdfdfd;
        padding-bottom: 12px;
      `}
  }

  ${ContentContainer} {
    padding: 0px 16px;
    max-height: calc(100vh - 363px);
    overflow: auto;

    ${({ isExpanded }) =>
      isExpanded &&
      css`
        background: #fdfdfd;
      `}
  }
`;

export const Container = styled(Box)`
  border-right: solid 1px #dfe3ed;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: 280px;
`;

export const NLUButton = styled(Box)`
  ${transition('opacity')}
  cursor: pointer;
  padding: 22px 32px;
  background: #eef4f6;
  border-top: solid 1px #dfe3ed;
  display: flex;
  font-weight: 600;
  align-items: center;
  opacity: 0.85;

  &:hover,
  &:active {
    opacity: 1;
  }
`;

export const HeaderSearchInput = styled(SearchInput)`
  padding: 21.5px 32px;
  border-radius: 0;
  height: 63px;
`;

export const SectionsContainer = styled.div<{ activeTab: InteractionModelTabType }>`
  flex: 10;
  overflow: hidden;

  ${({ activeTab }) =>
    activeTab === InteractionModelTabType.VARIABLES &&
    css`
      background: #fdfdfd;
    `}
`;
