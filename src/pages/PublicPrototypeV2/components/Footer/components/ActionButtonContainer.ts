import { FlexCenter } from '@/components/Box';
import { styled } from '@/hocs';

const ActionButtonContainer = styled(FlexCenter)`
  padding: 10px 15px;

  :last-child {
    padding-right: 0;
  }
`;

export default ActionButtonContainer;
