import { css, styled } from '@/hocs';

const CheckBoxButtonContainer = styled.div<{ padding?: boolean }>`
  flex: 0 0 auto;

  ${({ padding }) =>
    padding &&
    css`
      min-width: 0;
      margin-right: 6px;
      padding: 4px;
      padding-left: 0;
    `}

  color: #8da2b5;

  span {
    box-shadow: none !important;
  }
`;

export default CheckBoxButtonContainer;
