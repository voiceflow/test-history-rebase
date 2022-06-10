import { FlexApart, SvgIconContainer } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

const LabelContainer = styled(FlexApart).attrs({ fullWidth: true })`
  margin: 0 -24px;
  padding: 0 24px;
  height: 100%;
  width: 300px;

  & ${SvgIconContainer} {
    ${transition('opacity')}
    opacity: 0;
  }

  &:hover ${SvgIconContainer} {
    opacity: 0.85;
  }

  ${SvgIconContainer}:hover {
    opacity: 1;
  }
`;

export default LabelContainer;
