import { styled } from '@/hocs';

type ContainerProps = {
  url: string;
  width: number;
  height: number;
};

export const Container = styled.div<ContainerProps>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-size: cover;
  background-image: ${({ url }) => `url(${url})`};
  z-index: -1;
`;

export default Container;
