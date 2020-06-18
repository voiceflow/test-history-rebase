import Button from '@/components/Button';
import { Icon } from '@/components/Button/components/SecondaryButton/components';
import { styled } from '@/hocs';

const LoadingButton = styled(Button)`
  pointer-events: none;
  margin-top: 1px;

  ${Icon} {
    width: 20px;
    height: 20px;
  }
`;

export default LoadingButton;
