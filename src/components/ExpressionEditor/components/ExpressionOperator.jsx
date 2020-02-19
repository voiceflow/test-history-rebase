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
  [ExpressionType.AND]: 'AND',
  [ExpressionType.OR]: 'OR',
  [ExpressionType.NOT]: 'NOT',
  [ExpressionType.VALUE]: 'Value',
  [ExpressionType.VARIABLE]: 'Variable',
  [ExpressionType.ADVANCE]: 'Expression',
};

function ExpressionOperator({ type }) {
  return <Wrapper>{OPERATORS[type]}</Wrapper>;
}

export default React.memo(ExpressionOperator);
