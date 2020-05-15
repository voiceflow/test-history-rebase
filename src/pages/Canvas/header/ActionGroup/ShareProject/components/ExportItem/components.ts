import Button from '@/components/Button';
import { Icon } from '@/components/Button/components/SecondaryButton/components';
import { Container } from '@/components/Checkbox/components';
import BaseRadioGroup from '@/components/RadioGroup';
import { styled } from '@/hocs';

export const RadioGroup = styled(BaseRadioGroup)`
  ${Container} {
    color: #132144 !important;
    font-weight: normal !important;
  }
`;

export const LoadingButton = styled(Button)`
  pointer-events: none;
  margin-top: 1px;

  ${Icon} {
    width: 20px;
    height: 20px;
  }
`;
