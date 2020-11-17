import { styled } from '@/hocs';

export type ContainerProps = {
  error: boolean;
};

const Container = styled.div<ContainerProps>`
  border-bottom: 1px solid #eaeff4;
  padding: ${({ error }) => (error ? '0px 32px 0px 0px' : '0px 32px 16px 0px')};
  padding-top: 0;
  margin: 0;
`;

export default Container;
