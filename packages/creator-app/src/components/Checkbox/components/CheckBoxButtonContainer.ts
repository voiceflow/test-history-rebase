import { css, styled } from '@/hocs';

const CHECKBOX_BOX_SHADOW_COLOR = 'rgba(17, 49, 96, 0.05)';
const CheckBoxButtonContainer = styled.div<{ padding?: boolean }>`
  flex: 0 0 auto;

  ${({ padding }) =>
    padding &&
    css`
      min-width: 0;
      margin-right: 8px;
      padding: 4px;
      padding-left: 0;
    `}

  color: #8da2b5;

  span {
    box-shadow: none !important;
  }
`;

export const InnerCheckBoxContainer = styled.div`
  background: white;
  box-shadow: 0 1px 0 0 ${CHECKBOX_BOX_SHADOW_COLOR};
  border-radius: 4px;
  width: 16px;
  height: 16px;
`;

export default CheckBoxButtonContainer;
