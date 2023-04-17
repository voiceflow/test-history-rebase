import { css, styled } from '@/hocs/styled';

const Container = styled.div`
  ${({ size, width = size }) => css`
    width: ${width};
    height: 100%;
  `}
  background: #FFF;
`;

Container.defaultProps = {
  size: '100%',
};

export default Container;
