import CustomScrollbars from '@/components/CustomScrollbars';
import { css, styled } from '@/hocs';

export interface ContentProps {
  $fillHeight?: boolean;
}

const Content = styled(CustomScrollbars)<ContentProps>`
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
