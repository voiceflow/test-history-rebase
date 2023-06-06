import { Banner, BlockText, SearchInput, Select } from '@voiceflow/ui';

import Page from '@/components/Page';
import { styled } from '@/hocs/styled';

export const Title = styled(BlockText)`
  width: 100%;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
`;

export const Grid = styled.div`
  margin-bottom: 48px;
  display: grid;
  gap: 32px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

  @media (min-width: 1100px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  }

  @media (min-width: 1350px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  }
`;

export const StyledBanner = styled(Banner)`
  margin-top: 18px;

  ${Banner.Container} {
    background-size: 332px;
    background-position: right 38px top 17.5%;
  }
`;

export const Content = styled(Page.Content)<{ fullHeight?: boolean }>`
  padding-top: 14px;

  ${({ fullHeight }) => fullHeight && `height: 100%;`}
`;

export const StyledSelect = styled(Select)`
  ${SearchInput} {
    text-align: right;
    text-transform: initial;
  }
  margin-right: -9px;
` as typeof Select;
