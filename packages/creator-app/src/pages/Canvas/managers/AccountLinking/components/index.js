import { FlexApart, FlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export { default as Client } from './AccountLinkClient';
export { default as Domain } from './AccountLinkDomain';
export { default as Scope } from './AccountLinkScope';
export { default as HelpTooltip } from './HelpTooltip';

export const SpinnerContainer = styled(FlexCenter)`
  height: 300px;
`;

export const SubHeader = styled(FlexApart)`
  box-sizing: border-box;
  height: ${({ theme }) => theme.components.subHeader.height}px;
  border-top: 1px solid #dfe3ed;
  background: ${({ theme }) => theme.backgrounds.offWhite};
  background-color: #fff;
  background-image: linear-gradient(-180deg, rgba(246, 246, 246, 0.5) 0%, rgba(246, 246, 246, 0.65) 100%);
  padding: 0 30px 0px 40px;
`;
