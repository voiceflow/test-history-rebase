import { styled } from '@/hocs';

const BubbleText = styled.span`
  padding: 4px 10px;
  border-radius: 6px;
  color: ${({ color = '#5D9DF5' }) => color};
  font-weight: 600;
  font-size: 11px;
  background: white;
  letter-spacing: 0.7px;
  font-weight: bold;
  border-radius: 11px;
  text-transform: uppercase;
  box-shadow: 0 1px 2px 0 rgba(17, 49, 96, 0.24);
`;

export default BubbleText;
