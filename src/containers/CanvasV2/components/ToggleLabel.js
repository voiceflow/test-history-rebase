import { TEXT_COLOR } from '@/components/InfoText';
import { styled } from '@/hocs';

const ToggleLabel = styled.span`
  font-weight: 400;
  color: ${TEXT_COLOR};
  margin-left: ${({ theme }) => theme.unit}px;
`;

export default ToggleLabel;
