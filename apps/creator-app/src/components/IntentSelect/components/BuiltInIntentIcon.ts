import { SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const BuiltInIntentIcon = styled(SvgIcon).attrs({ icon: 'builtInIntent', clickable: true })<{
  isItemFocused?: boolean;
}>`
  color: #6e849a;
  opacity: ${({ isItemFocused }) => (isItemFocused ? 0.85 : 0.65)};
`;

export default BuiltInIntentIcon;
