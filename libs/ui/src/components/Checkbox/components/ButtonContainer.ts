import { css, styled } from '@/styles';

const ButtonContainer = styled.div<{ padding?: boolean }>`
  flex: 0 0 auto;
  color: #8da2b5;

  ${({ padding }) =>
    padding &&
    css`
      min-width: 0;
      margin-right: 8px;
      padding: 4px;
      padding-left: 0;
    `}
`;

export default ButtonContainer;
