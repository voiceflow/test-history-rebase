import { baseButtonStyles } from '@/components/Button/components/BaseButton';
import { flexApartStyles } from '@/components/Flex';
import { styled } from '@/hocs';

/* list-style: none; */
const PanelHeader = styled.header`
  ${baseButtonStyles}
  ${flexApartStyles}

  width: 100%;
  padding: ${({ theme }) => `${theme.unit * 2}px ${theme.unit * 2.5}px`};
  border-bottom: 1px solid #dfe3ed;
`;

export default PanelHeader;
