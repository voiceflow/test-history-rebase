import { FlexApart, Select, SvgIcon } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const SelectContainer = styled(Select)`
  width: 254px;
  text-align: center;
` as typeof Select;

export const OverflowWrapper = styled(FlexApart).attrs({ fullWidth: true })`
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
