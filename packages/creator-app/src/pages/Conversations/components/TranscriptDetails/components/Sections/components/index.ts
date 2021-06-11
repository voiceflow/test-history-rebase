import Flex, { FlexApart } from '@/components/Flex';
import { css, styled } from '@/hocs';

export const Container = styled(Flex)<{ curved?: boolean; flex?: number; rightExtend?: boolean; topExtend?: boolean }>`
  flex-direction: column;
  flex: 2;
  border-top: 1px solid;
  width: 100%;
  border-color: ${({ theme }) => theme.colors.borders};
  padding: ${({ topExtend }) => (topExtend ? 40 : 22)}px 32px;
  background-color: #fdfdfd;
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

  ${({ curved }) =>
    curved &&
    css`
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    `}
`;

export const SectionTitle = styled(FlexApart)`
  color: #62778c;
  font-size: 13px;
  font-weight: 600;
  width: 100%;
`;
