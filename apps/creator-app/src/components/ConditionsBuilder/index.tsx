import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { ConditionLabel, ConditionSelect, LogicInterfaceHandler } from './components';
import { getAddionalLogicData, getDefaultValue } from './utils';

export interface ConditionsBuilderProps {
  style?: React.CSSProperties;
  onChange: (value: Realtime.ExpressionData) => void;
  expression?: Realtime.ExpressionData;
}

const ConditionsBuilder: React.FC<ConditionsBuilderProps> = ({ onChange, expression, style }) => {
  const addNewCondition = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => {
    const values = getDefaultValue(logicInterface);
    onChange({ ...expression, value: [{ ...values }] } as Realtime.ExpressionData);
  };

  const addAdditionalCondition = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => {
    const values = getDefaultValue(logicInterface);
    onChange(getAddionalLogicData(expression!, values));
  };

  const updateBaseType = (type: BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR) => {
    onChange({ ...expression, type } as Realtime.ExpressionData);
  };

  const onUpdateData = (index: number) => (data: Realtime.ExpressionV2 | Realtime.LogicGroupData) => {
    onChange({
      ...expression,
      value: expression!.value.map((item: any, idx: number) => (idx === index ? { ...item, ...data } : item)),
    } as Realtime.ExpressionData);
  };

  const onDeleteCondition = (index: number) => () => {
    onChange({ ...expression, value: expression!.value.filter((_, idx: number) => idx !== index) } as Realtime.ExpressionData);
  };

  return (
    <Box pt={16} pb={17} style={style}>
      {/* if new expression */}
      {!expression?.value?.length && (
        <Box.Flex>
          <Box.Flex mr={16}>
            <ConditionLabel>IF</ConditionLabel>
          </Box.Flex>
          <ConditionSelect onChange={addNewCondition} />
        </Box.Flex>
      )}

      {expression && (
        <>
          {expression.value?.map((item: Realtime.ExpressionV2 | Realtime.LogicGroupData, index: number) => {
            const isLastItem = index === expression.value.length - 1;
            const isFirstItem = index === 0;

            return (
              <div key={index}>
                <LogicInterfaceHandler
                  firstItem={isFirstItem}
                  expression={item}
                  onChange={onUpdateData(index)}
                  onDelete={onDeleteCondition(index)}
                  baseLogicType={expression.type ?? null}
                  updateBaseType={updateBaseType}
                />

                {isLastItem && item.logicInterface !== BaseNode.Utils.ConditionsLogicInterface.EXPRESSION && (
                  <ConditionSelect onChange={addAdditionalCondition} additional />
                )}
              </div>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default ConditionsBuilder;
