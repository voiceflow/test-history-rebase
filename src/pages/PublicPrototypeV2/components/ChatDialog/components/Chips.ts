import Box from '@/components/Box';
import { styled } from '@/hocs';

const Chips = styled(Box)<{ color?: string }>`
  padding: 8px 20px;
  border-radius: 18px;
  border: ${({ color, theme }) => `1px solid ${color || theme.colors.blue}`};
  margin-right: 10px;
  background-color: #fff;
  font-size: 14px;
  color: ${({ color, theme }) => color || theme.colors.blue};
  cursor: pointer;
  white-space: nowrap;

  :hover {
    background-color: ${({ color, theme }) => color || theme.colors.blue};
    color: ${({ theme }) => theme.backgrounds.white};
  }
`;

export default Chips;
