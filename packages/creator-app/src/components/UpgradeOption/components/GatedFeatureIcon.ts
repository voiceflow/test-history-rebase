import { SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const GatedFeatureIcon = styled(SvgIcon).attrs({ icon: 'paid', clickable: true, color: '#6e849a' })<{ isItemFocused?: boolean }>`
  opacity: ${({ isItemFocused }) => (isItemFocused ? '0.85' : '0.65')};
`;

export default GatedFeatureIcon;
