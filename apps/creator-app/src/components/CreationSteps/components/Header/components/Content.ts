import { styled } from '@/hocs/styled';

interface ContentProps {
  withOffset?: boolean;
}

const Content = styled.div<ContentProps>`
  position: absolute;
  right: ${({ withOffset }) => (withOffset ? 120 : 40)}px;
`;

export default Content;
