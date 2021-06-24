import { ChildInput, InputWrapper } from '@voiceflow/ui';

import Section from '@/components/Section';
import { styled, units } from '@/hocs';

export const Variables = styled(Section).attrs({ dividers: false })`
  flex: 1;
  overflow-y: scroll;

  /* Firefox scrollbar fix */
  scrollbar-width: none;

  /* chrome scrollbar fix */
  &::-webkit-scrollbar {
    display: none;
  }

  ${ChildInput} {
    min-width: 0;
  }

  ${InputWrapper} {
    :not(:last-child) {
      margin-bottom: ${units(1)}px;
    }
  }
`;
