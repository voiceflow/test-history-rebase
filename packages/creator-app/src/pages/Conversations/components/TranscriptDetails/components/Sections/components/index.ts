import Flex, { FlexApart } from '@/components/Flex';
import { css, styled } from '@/hocs';

export const Container = styled(Flex)<{ curved?: boolean; flex?: number; rightExtend?: boolean; topExtend?: boolean; withBackground?: boolean }>`
  flex-direction: column;
  flex: 2;
  border-top: 1px solid;
  width: 100%;
  border-color: ${({ theme }) => theme.colors.borders};
  padding: ${({ topExtend }) => (topExtend ? 40 : 22)}px 32px;
  background-color: #fff;
  &:first-child {
    border: none;
  }

  ${({ rightExtend }) =>
    rightExtend &&
    css`
      padding-right: 0px;
    `}

  ${({ flex }) =>
    flex &&
    css`
      flex: ${flex};
    `}

${({ withBackground }) =>
    withBackground &&
    css`
      background-color: #fcfcfc;
    `}

  ${({ curved }) =>
    curved &&
    css`
      border-color: #fff !important;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      box-shadow: 0 0 16px 0 rgba(19, 33, 68, 0.03), 0 0 0 1px rgba(19, 33, 68, 0.06);
      -webkit-clip-path: inset(-16px -16px 0px -16px);
    `}
`;

export const SectionTitle = styled(FlexApart)`
  color: #62778c;
  font-size: 13px;
  font-weight: 600;
  width: 100%;
  margin-bottom: 12px;
`;
