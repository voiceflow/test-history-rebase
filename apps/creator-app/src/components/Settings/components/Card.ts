import { styled } from '@/hocs/styled';

const Card = styled.div<{ width?: number | string }>`
  border-radius: 8px;
  box-shadow: 0px 0px 0px 1px rgba(17, 49, 96, 0.1), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
  overflow: hidden;
  width: ${({ width = '100%' }) => (typeof width === 'number' ? `${width}px` : width)};
  background-color: #ffffff;
`;

export default Card;
