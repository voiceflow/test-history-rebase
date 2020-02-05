import { css, styled } from '@/hocs';

const activeStyles = css`
  box-shadow: 0px 1px 3px rgba(17, 49, 96, 0.06);
  border: 1px solid ${({ color = '#5D9DF5' }) => color};
`;

const Container = styled.div`
  ${({ size, width = size }) => css`
    width: ${width};
    height: 100%;
  `}
  background: #FFF;
  border: 1px solid #d4d9e6;
  box-shadow: 0px 0px 3px rgba(17, 49, 96, 0.06);
  border-radius: 5px;
  transition: box-shadow 0.15s ease, border 0.15s ease;
  cursor: pointer;
  ${({ active }) => active && activeStyles}
`;

Container.defaultProps = {
  size: '100%',
};

export default Container;
