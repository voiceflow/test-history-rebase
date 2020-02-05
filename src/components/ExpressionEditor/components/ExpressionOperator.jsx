import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import { ExpressionType } from '@/constants';
import { styled } from '@/hocs';

const Wrapper = styled.span`
  display: inline-block;
  vertical-align: middle;
`;

const OPERATORS = {
  select: <SvgIcon variant="standard" icon="code" />,

  [ExpressionType.PLUS]: <SvgIcon variant="standard" icon="add" />,
  [ExpressionType.MINUS]: <SvgIcon variant="standard" icon="subtract" />,
  [ExpressionType.TIMES]: <SvgIcon variant="standard" icon="times" />,
  [ExpressionType.DIVIDE]: <SvgIcon variant="standard" icon="divide" />,
  [ExpressionType.EQUALS]: <SvgIcon variant="standard" icon="equals" />,
  [ExpressionType.GREATER]: <SvgIcon variant="standard" icon="greater" />,
  [ExpressionType.LESS]: <SvgIcon variant="standard" icon="less" />,
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
