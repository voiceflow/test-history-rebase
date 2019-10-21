import Button from '@/components/Button';
import { styled } from '@/hocs';

const DropdownButton = styled(Button)`
  position: relative;
  display: flex;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 10px;
  color: #8da2b5;
  font-size: 18px;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.04), 0 2px 4px 0 rgba(17, 49, 96, 0.16);
`;

export default DropdownButton;
