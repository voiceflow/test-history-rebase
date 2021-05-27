import { css, styled } from '@/hocs';

const RadioButtonContainer = styled.div<{ column?: boolean; noBottomPadding?: boolean; paddingBottom?: number; cursor?: string }>`
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
`;

export default RadioButtonContainer;
