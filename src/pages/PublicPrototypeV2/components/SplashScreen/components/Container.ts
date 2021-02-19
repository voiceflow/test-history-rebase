import { FlexApart } from '@/components/Box';
import { styled } from '@/hocs';

type ContainerProps = {
  isMobile?: boolean;
  isVisuals?: boolean;
};

const Container = styled(FlexApart).attrs({ column: true })<ContainerProps>`
  width: 100%;
  height: 100%;
  padding: ${({ isMobile, isVisuals }) =>
    // eslint-disable-next-line no-nested-ternary
    isMobile ? 32 : isVisuals ? 0 : 48}px;
  background-color: white;
`;

export default Container;
