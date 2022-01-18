import { SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

import ItemContainer from './ItemContainer';

const StepIcon = styled(SvgIcon)`
  ${transition('color')}
  color: ${({ theme }) => theme.buttonIconColors.default};
  ${ItemContainer}:hover & {
    color: ${({ theme }) => theme.buttonIconColors.hover};
  }
`;

export default StepIcon;
