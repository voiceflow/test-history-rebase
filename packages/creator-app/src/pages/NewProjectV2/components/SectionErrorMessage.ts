import { css, styled } from '@/hocs';

interface SectionTitleErrorMessageProps {
  marginTop?: number;
}

const SectionErrorMessage = styled.div<SectionTitleErrorMessageProps>`
  text-align: left;
  font-size: 13px;
  color: #e91e63;
  margin-top: 12px;

  ${({ marginTop }) =>
    marginTop &&
    css`
      margin-top: ${marginTop}px;
    `}
`;

export default SectionErrorMessage;
