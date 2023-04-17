import { styled } from '@ui/styles';

import { LinkProps, linkStyles } from './Link';
import Text, { TextProps } from './Text';

/**
 * @deprecated Use `System.Link.Button` instead
 */
export const ClickableText = styled(Text)<TextProps & LinkProps>`
  display: inline-block;

  ${linkStyles}
`;

export default ClickableText;
