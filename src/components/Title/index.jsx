import { withProps } from 'recompose';
import styled, { css } from 'styled-components';

export function getTitleTag(variant) {
  switch (variant) {
    case 'heading':
    default:
      return 'h1';
    case 'subheading':
      return 'h2';
    case 'subtitle':
      return 'h3';
    case 'label':
      return 'h4';
  }
}

const Title = styled.span`
  color: #132144;

  ${({ variant }) => {
    switch (variant) {
      case 'heading':
      default:
        return css`
          font-size: 28px;
          line-height: 38px;
        `;
      case 'subheading':
        return css`
          font-size: 18px;
          line-height: 24px;
        `;
      case 'subtitle':
        return css`
          font-size: 15px;
          line-height: 20px;
        `;
      case 'label':
        return css`
          font-size: 13px;
          line-height: 18px;
        `;
    }
  }}
`;

export default withProps(({ variant }) => ({ as: getTitleTag(variant) }))(Title);
