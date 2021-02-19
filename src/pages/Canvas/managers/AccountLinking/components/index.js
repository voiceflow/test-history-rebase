import { FlexCenter } from '@/components/Flex';
import { styled } from '@/hocs';

export { default as Client } from './AccountLinkClient';
export { default as Domain } from './AccountLinkDomain';
export { default as Scope } from './AccountLinkScope';
export { default as HelpTooltip } from './HelpTooltip';

export const SpinnerContainer = styled(FlexCenter)`
  height: 300px;
`;
