import { css, styled } from '@/hocs/styled';

export const SectionDescription = styled.div`
  font-size: 13px;
  color: #62778c;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.div<{ withDescription?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  text-transform: capitalize;
  color: #132144;

  ${({ withDescription }) =>
    withDescription &&
    css`
      margin-bottom: 4px;
    `}
`;

export const SettingsSectionContainer = styled.div<{ marginBottom?: number }>`
  margin-bottom: ${({ marginBottom }) => marginBottom || 40}px;
  width: 100%;
`;
