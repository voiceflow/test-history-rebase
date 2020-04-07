import InputWrapper from '@/components/Input/components/InputWrapper';
import Section from '@/components/Section';
import { styled, units } from '@/hocs';

const TestSettingsVariables = styled(Section).attrs({ dividers: false })`
  flex: 1;
  overflow-y: scroll;

  /* Firefox scrollbar fix */
  scrollbar-width: none;

  /* chrome scrollbar fix */
  &::-webkit-scrollbar {
    display: none;
  }

  ${InputWrapper} {
    :not(:last-child) {
      margin-bottom: ${units(1)}px;
    }
  }
`;

export default TestSettingsVariables;
