import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { ExpressionType } from '@/constants';
import { styled } from '@/hocs';

const Wrapper = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

const OPERATORS = {
  select: <SvgIcon icon="code" />,

  [ExpressionType.PLUS]: <SvgIcon icon="add" />,
  [ExpressionType.MINUS]: <SvgIcon icon="subtract" />,
  [ExpressionType.TIMES]: <SvgIcon icon="times" />,
  [ExpressionType.DIVIDE]: <SvgIcon icon="divide" />,
  [ExpressionType.EQUALS]: <SvgIcon icon="equals" />,
  [ExpressionType.GREATER]: <SvgIcon icon="greater" />,
  [ExpressionType.LESS]: <SvgIcon icon="less" />,
  [ExpressionType.AND]: <span>AND</span>,
  [ExpressionType.OR]: <span>OR</span>,
  [ExpressionType.NOT]: <span>NOT</span>,
  [ExpressionType.VALUE]: <span>Value</span>,
  [ExpressionType.VARIABLE]: <span>Variable</span>,
  [ExpressionType.ADVANCE]: <span>Expression</span>,
};

function ExpressionOperator({ type }) {
  return <Wrapper className={ExpressionType.PLUS}>{OPERATORS[type]}</Wrapper>;
}

export default React.memo(ExpressionOperator);
