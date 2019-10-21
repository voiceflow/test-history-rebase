import InlineFormControl from '@/components/InlineFormControl';
import { css, styled } from '@/hocs';

const VariableMappingContainer = styled(InlineFormControl)`
  padding: 0;

  ${({ reverse }) =>
    reverse &&
    css`
      flex-direction: row-reverse;
    `}

  & > .map-box {
    flex: 1;
  }
`;

export default VariableMappingContainer;
