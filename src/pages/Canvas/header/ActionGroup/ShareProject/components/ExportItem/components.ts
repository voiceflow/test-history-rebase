import Button from '@/components/Button';
import { Icon } from '@/components/Button/components/SecondaryButton/components';
import { styled } from '@/hocs';

/* eslint-disable-next-line import/prefer-default-export */
export const LoadingButton = styled(Button)`
  pointer-events: none;
  margin-top: 1px;

  ${Icon} {
    width: 20px;
    height: 20px;
  }
`;
