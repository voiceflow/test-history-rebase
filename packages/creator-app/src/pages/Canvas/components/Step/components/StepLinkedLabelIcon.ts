import { SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const StepLinkedLabelIcon = styled(SvgIcon).attrs({
  icon: 'subArrow',
  width: 12,
  height: 10,
})`
  margin-right: 4px;
  margin-top: 4px;
`;

export default StepLinkedLabelIcon;
