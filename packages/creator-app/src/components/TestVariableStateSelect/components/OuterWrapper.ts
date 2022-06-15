import { FlexApart, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs';

const LabelContainer = styled(FlexApart).attrs({ fullWidth: true })`
  margin: 0 -24px;
  padding: 0 24px;
  height: 100%;
  width: 300px;

  & ${SvgIcon.Container} {
    ${transition('opacity')}
    opacity: 0;
  }

  &:hover ${SvgIcon.Container} {
    opacity: 0.85;
  }

  ${SvgIcon.Container}:hover {
    opacity: 1;
  }
`;

export default LabelContainer;
