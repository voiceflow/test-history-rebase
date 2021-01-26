import { ChildInput } from '@/components/Input/components';
import InputWrapper from '@/components/Input/components/InputWrapper';
import Section, { ContentContainer, Header } from '@/components/Section';
import { styled, units } from '@/hocs';
import { FadeRightContainer } from '@/styles/animations';

export const Container = styled(FadeRightContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;

  ${Header}, ${ContentContainer} {
    padding-right: ${units(3)}px;
    padding-left: ${units(3)}px;
  }
`;

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
