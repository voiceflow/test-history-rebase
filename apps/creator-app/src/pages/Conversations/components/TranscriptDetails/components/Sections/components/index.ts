import { Flex, FlexApart } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(Flex)<{
  curved?: boolean;
  rightExtend?: boolean;
  topExtend?: boolean;
  withBackground?: boolean;
  withBorder?: boolean;
}>`
  flex-direction: column;
  width: 100%;
  ${({ withBorder }) =>
    withBorder &&
    css`
      border-bottom: 1px solid;
    `}

  border-color: ${({ theme }) => theme.colors.borders};
  padding: ${({ topExtend }) => (topExtend ? 32 : 22)}px 32px;
  background-color: ${({ theme }) => theme.backgrounds.white};

  ${({ rightExtend }) =>
    rightExtend &&
    css`
      padding-right: 0px;
    `}

  ${({ withBackground, theme }) =>
    withBackground &&
    css`
      background-color: ${theme.backgrounds.lightGray};
    `}

  ${({ curved }) =>
    curved &&
    css`
      border-color: #fff !important;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      box-shadow:
        0 0 16px 0 rgba(19, 33, 68, 0.03),
        0 0 0 1px rgba(19, 33, 68, 0.06);
    `}
`;

export const SectionTitle = styled(FlexApart)`
  color: #62778c;
  font-size: 13px;
  font-weight: 600;
  width: 100%;
  margin-bottom: 12px;
`;
