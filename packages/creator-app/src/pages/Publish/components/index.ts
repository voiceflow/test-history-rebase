import { BoxFlex, BoxFlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export { default as Section } from './Section';

export const ContentContainer = styled(BoxFlex)<{ redesignEnabled?: boolean | null }>`
  flex-direction: column;
  padding: 20px;

  ${({ redesignEnabled }) =>
    redesignEnabled &&
    css`
      align-items: flex-start;
    `}
`;

export const ContentSection = styled(BoxFlexCenter)`
  margin-bottom: 20px;
  width: 724px;
  align-items: flex-end;
`;

export const ActionContainer = styled.div`
  width: 250px;
  position: relative;

  & > div {
    float: right;
  }
`;
