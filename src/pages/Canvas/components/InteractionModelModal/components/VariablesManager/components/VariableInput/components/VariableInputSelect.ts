import { Container } from '@/components/SvgIcon';
import { styled } from '@/hocs';

const Select = styled.div<{ active: boolean }>`
  color: ${({ active }) => (active ? '#5d9df5' : '#62778c')};
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;

  &:hover {
    color: #5d9df5;
  }

  ${Container} {
    display: inline-block;
  }
`;

export default Select;
