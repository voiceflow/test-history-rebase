import { css, styled } from '@/hocs';

interface SectionTitleErrorMessageProps {
  marginTop?: number;
}

export const SectionDescription = styled.div`
  text-align: left;
  font-size: 13px;
  color: #62778c;
  margin-top: 10px;
`;

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

export const SectionTitle = styled.div`
  color: #62778c;
  font-size: 15px;
  font-weight: 600;
`;
