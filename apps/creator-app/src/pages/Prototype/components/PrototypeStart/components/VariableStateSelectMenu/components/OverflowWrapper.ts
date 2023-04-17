import { FlexApart, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

const OverflowWrapper = styled(FlexApart).attrs({ fullWidth: true })`
  height: 100%;
  width: 100%;

  & ${SvgIcon.Container} {
    ${transition('opacity')}
    display: none;
    opacity: 0;
  }

  &:hover ${SvgIcon.Container} {
    display: block;
    opacity: 0.85;
  }

  ${SvgIcon.Container}:hover {
    display: block;
    opacity: 1;
  }
`;

export default OverflowWrapper;
