import { VariableTextField } from '@/components/VariableText';
import { styled } from '@/hocs';

const VariableInputContainer = styled.div`
  & .vi__displayOnLeft {
    transform: translateX(-70%);
  }

  & .public-DraftStyleDefault-block {
    align-items: baseline;
    white-space: pre;
    overflow-x: auto;

    ::-webkit-scrollbar {
      display: none;
    }
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    overflow-x: auto;
  }

  ${VariableTextField} {
    line-height: 28px;
    height: 28px;
    padding-top: 6px;
    padding-bottom: 6px;
  }
`;

export default VariableInputContainer;
