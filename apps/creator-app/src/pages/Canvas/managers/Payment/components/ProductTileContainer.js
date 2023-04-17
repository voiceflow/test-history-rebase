import { FlexApart } from '@voiceflow/ui';

import { css, styled, units } from '@/hocs/styled';

const ProductTileContainer = styled(FlexApart)`
  position: relative;
  padding: ${units(2.5)}px 0;
  cursor: pointer;

  &:last-child {
    border: none;
  }

  &:before {
    position: absolute;
    top: -1px;
    right: -32px;
    left: 0;
    display: block;
    height: 1px;
    background-color: #eaeff4;
    content: '';
  }

  ${({ edit }) =>
    edit &&
    css`
      height: 60px;
      padding: 0 ${units(4)}px 0 0;
    `}
`;

export default ProductTileContainer;
