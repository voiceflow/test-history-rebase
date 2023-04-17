import { css, styled } from '@ui/styles';

import CustomScrollbars from '../../CustomScrollbars';
import * as T from '../types';

const Content = styled(CustomScrollbars)<T.ContentProps>`
  width: 100%;
  overflow: hidden;
  overflow: clip;

  ${({ $fillHeight }) =>
    $fillHeight &&
    css`
      flex: 1;
    `}
`;

export default Content;
