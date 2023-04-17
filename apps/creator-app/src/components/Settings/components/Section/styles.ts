import { css, styled } from '@/hocs/styled';

export const Description = styled.div`
  font-size: 13px;
  color: #62778c;
  margin-bottom: 16px;
`;

export const Title = styled.div<{ withDescription?: boolean }>`
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

export const Container = styled.div<{ mb?: number; w?: number | string }>`
  width: ${({ w = '100%' }) => (typeof w === 'number' ? `${w}px` : w)};

  &:not(:last-child) {
    margin-bottom: ${({ mb = 32 }) => `${mb}px`};
  }
`;
