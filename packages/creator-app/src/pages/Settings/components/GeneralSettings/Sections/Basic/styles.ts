import { css, styled } from '@/hocs/styled';

interface SectionTitleErrorMessageProps {
  marginTop?: number;
}

export const SectionErrorMessage = styled.div<SectionTitleErrorMessageProps>`
  text-align: left;
  font-size: 13px;
  color: #e91e63;
  margin-top: 10px;

  ${({ marginTop }) =>
    marginTop &&
    css`
      margin-top: ${marginTop}px;
    `}
`;
