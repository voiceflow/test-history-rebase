import { VariableTag } from '@/components/VariableTag';
import { StepLabelVariant } from '@/constants/canvas';
import { css, styled } from '@/hocs';

const ExpressionPreviewContainer = styled.div`
  ${VariableTag} {
    display: inline;
    padding: 0;
    border: none;
    background: none;
    color: ${({ theme }) => theme.components.blockStep.labelText.variants[StepLabelVariant.PRIMARY]};
    line-height: inherit;
    font-size: inherit;
    font-weight: inherit;
  }

  ${({ singleLine }) =>
    singleLine &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
    `}

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
    content: '\003e';
  }
  .less::before {
    content: '\003c';
  }
  .and::before {
    content: 'AND';
  }
  .or::before {
    content: 'OR';
  }
  .not::before {
    content: 'NOT';
  }
`;

export default ExpressionPreviewContainer;
