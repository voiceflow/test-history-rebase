import { styled } from '@/hocs';

type ContainerProps = {
  url: string;
  width: number;
  height: number;
};

export const Container = styled.div.attrs<ContainerProps>(({ width, height }) => ({
  style: {
    width: `${width}px`,
    height: `${height}px`,
  },
}))<ContainerProps>`
  background-size: 100% 100%;
  background-position: center;
  background-image: ${({ url }) => `url(${url})`};
  z-index: -1;
`;

export default Container;
