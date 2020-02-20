import { VariableTag } from '@/components/VariableTag';
import { styled } from '@/hocs';
import { LabelVariant } from '@/pages/Canvas/components/Step/constants';

const ExpressionPreviewContainer = styled.span`
  ${VariableTag} {
    display: inline;
    padding: 0;
    border: none;
    background: none;
    color: ${({ theme }) => theme.components.step.labelText.variants[LabelVariant.PRIMARY]};
    line-height: inherit;
    font-size: inherit;
    font-weight: inherit;
  }

  .plus,
  .minus,
  .times,
  .divide,
  .equals,
  .greater,
  .less,
  .and,
  .or,
  .not {
    display: inline;
    vertical-align: baseline;

    &::before {
      display: inline;
    }

    & > span {
      display: none;
    }
  }

  .plus::before {
    content: '+';
  }
  .minus::before {
    content: '−';
  }
  .times::before {
    content: '×';
  }
  .divide::before {
    content: '÷';
  }
  .equals::before {
    content: '=';
  }
  .greater::before {
    content: '>';
  }
  .less::before {
    content: '>';
  }
  .and::before {
    content: '&&';
  }
  .or::before {
    content: '||';
  }
  .not::before {
    content: '≠';
  }
`;

export default ExpressionPreviewContainer;
