import { css, styled } from '@/hocs/styled';

const BubbleText = styled.span<{ clickable?: boolean }>`
  padding: 4px 8px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  font-size: 11px;
  background: ${({ color = '#5D9DF5' }) => color};
  letter-spacing: 0.7px;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  box-shadow: 0 1px 2px 0 rgba(17, 49, 96, 0.24);

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
    `}
`;

export default BubbleText;
