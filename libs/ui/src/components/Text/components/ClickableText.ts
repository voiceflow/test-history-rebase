import { styled } from '@/styles';

import type { LinkProps } from './Link';
import { linkStyles } from './Link';
import type { TextProps } from './Text';
import Text from './Text';

/**
 * @deprecated Use `System.Link.Button` instead
 */
export const ClickableText = styled(Text)<TextProps & LinkProps>`
  display: inline-block;

  ${linkStyles}
`;

export default ClickableText;
