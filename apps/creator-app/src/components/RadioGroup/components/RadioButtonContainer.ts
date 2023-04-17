import { css, styled } from '@/hocs/styled';

const RadioButtonContainer = styled.div<{
  column?: boolean;
  noBottomPadding?: boolean;
  paddingBottom?: number;
  cursor?: string;
  activeBar?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  cursor: ${({ cursor = 'default' }) => cursor};

  :not(:last-child) {
    margin-right: 20px;
  }

  ${({ column, noBottomPadding = false, paddingBottom }) =>
    column &&
    !noBottomPadding &&
    (paddingBottom
      ? css`
          padding-bottom: ${paddingBottom}px;
        `
      : css`
          padding-bottom: 12px;
        `)}

  ${({ activeBar }) =>
    activeBar &&
    css`
      margin-right: 0;
      padding-bottom: 0;
      :not(:last-child) {
        padding-bottom: 2px;
        margin-right: 0;
      }
    `}
`;

export default RadioButtonContainer;
