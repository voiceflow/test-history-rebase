import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Popper } from '@voiceflow/ui';
import _isEmpty from 'lodash/isEmpty';
import React from 'react';

import type { ExpressionDataLogicType, LogicUnitDataType } from '../../types';
import { isConditionInvalid } from '../../utils';
import ConditionDisplay from '../ConditionDisplay';
import ConditionValueSelect from '../ConditionValueSelect';
import ConditionVariableSelect from '../ConditionVariableSelect';
import ConditionLogicSelect from './components/ConditionLogicSelect';
import Container from './components/Container';

export type ValueSelectExpressionType =
  | BaseNode.Utils.ExpressionTypeV2.VARIABLE
  | BaseNode.Utils.ExpressionTypeV2.VALUE;

export interface ConditionDataSelectProps {
  isLogicGroup?: boolean;
  expression: LogicUnitDataType;
  onDelete: () => void;
  onChange: (value: LogicUnitDataType) => void;
}

const ConditionDataSelect: React.FC<ConditionDataSelectProps> = ({ expression, isLogicGroup, onChange, onDelete }) => {
  // methods
  const onValueUpdate = React.useCallback(
    (key: number) => (values: { value: string }) => {
      onChange({
        ...expression,
        value: expression.value.map((data: any, index) =>
          index === key ? { ...data, ...values } : data
        ) as Realtime.ExpressionTupleV2,
      });
    },
    [onChange]
  );
  const onLogicUpdate = React.useCallback(
    (logic: ExpressionDataLogicType) => {
      onChange({ ...expression, type: logic });
    },
    [onChange]
  );

  return (
    <Popper
      placement="bottom-start"
      initialOpened={expression.logicInterface && _isEmpty(expression.value[0]?.value)}
      renderContent={({ onToggle }) => (
        <Container>
          {/* to add left side value */}
          <>
            {expression.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VARIABLE && (
              <>
                <ConditionVariableSelect value={String(expression.value[0]?.value)} onChange={onValueUpdate(0)} />
                <Box mt={24}>
                  <ConditionLogicSelect
                    onClose={onToggle}
                    logicValue={expression.type as ExpressionDataLogicType}
                    onLogicUpdate={onLogicUpdate}
                    conditionValue={String(expression.value[1]?.value)}
                    onConditionValueUpdate={onValueUpdate(1)}
                  />
                </Box>
              </>
            )}

            {/* display logic and input field for right side once left side value is saved */}
            {expression.logicInterface === BaseNode.Utils.ConditionsLogicInterface.VALUE && (
              <>
                <ConditionValueSelect value={String(expression.value[0]?.value)} onChange={onValueUpdate(0)} />
                <Box mt={24}>
                  <ConditionLogicSelect
                    onClose={onToggle}
                    logicValue={expression.type as ExpressionDataLogicType}
                    onLogicUpdate={onLogicUpdate}
                    conditionValue={String(expression.value[1]?.value)}
                    onConditionValueUpdate={onValueUpdate(1)}
                  />
                </Box>
              </>
            )}
          </>
        </Container>
      )}
    >
      {({ ref, onToggle, isOpened }) => (
        <Box ref={ref} height="100%" onClick={onToggle}>
          <ConditionDisplay
            error={!isOpened && isConditionInvalid(expression)}
            isActive={isOpened}
            onDelete={onDelete}
            expression={expression}
            isLogicGroup={isLogicGroup}
          />
        </Box>
      )}
    </Popper>
  );
};

export default ConditionDataSelect;
