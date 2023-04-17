import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { ExpressionDataLogicType, LogicUnitDataType } from '../../types';
import ConditionLogicSelect from './LogicSelect';
import * as S from './styles';
import ConditionValueSelect from './ValueSelect';

interface ConditionBuilderInputProps {
  expression: LogicUnitDataType;
  onChange: (value: LogicUnitDataType) => void;
}

const ConditionBuilderInput: React.FC<ConditionBuilderInputProps> = ({ expression, onChange }) => {
  const [focused, setFocused] = React.useState<null | 'left' | 'right' | 'conditionLogic'>(null);
  const [left, right] = expression.value as [Realtime.ValueExpressionV2 | Realtime.VariableExpressionV2, Realtime.ExpressionV2];

  const onValueUpdate = usePersistFunction((key: number) => (values: { value: string }) => {
    onChange({
      ...expression,
      value: expression.value.map((data: any, index: number) => (index === key ? { ...data, ...values } : data)) as Realtime.ExpressionTupleV2,
    });
  });

  const onLogicUpdate = usePersistFunction((logic: ExpressionDataLogicType) => {
    onChange({ ...expression, type: logic });
  });

  return (
    <S.Container>
      <S.InputContainer active={focused === 'left'}>
        <ConditionValueSelect
          value={String(left.value)}
          onChange={onValueUpdate(0)}
          onFocus={() => setFocused('left')}
          onBlur={() => setFocused(null)}
        />
      </S.InputContainer>

      <S.InputContainer active={focused === 'conditionLogic'} style={{ padding: 0 }}>
        <ConditionLogicSelect
          value={expression.type as ExpressionDataLogicType}
          onChange={onLogicUpdate}
          onOpen={() => setFocused('conditionLogic')}
          onClose={() => setFocused(null)}
        />
      </S.InputContainer>

      {right && (
        <S.InputContainer active={focused === 'right'}>
          <ConditionValueSelect
            value={String(right.value)}
            onChange={onValueUpdate(1)}
            onFocus={() => setFocused('right')}
            onBlur={() => setFocused(null)}
          />
        </S.InputContainer>
      )}
    </S.Container>
  );
};

export default ConditionBuilderInput;
