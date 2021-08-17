import { Node } from '@voiceflow/base-types';
import { Box, BoxFlex } from '@voiceflow/ui';
import React from 'react';

import { ExpressionData, ExpressionV2, LogicGroupData } from '@/models';

import { ConditionLabel, ConditionSelect, LogicInterfaceHandler } from './components';
import { getAddionalLogicData, getDefaultValue } from './utils';

export interface ConditionsBuilderProps {
  onChange: (value: ExpressionData) => void;
  expression?: ExpressionData;
}

const ConditionsBuilder: React.FC<ConditionsBuilderProps> = ({ onChange, expression }) => {
  const addNewCondition = (logicInterface: Node.Utils.ConditionsLogicInterface) => {
    const values = getDefaultValue(logicInterface);
    onChange({ ...expression, value: [{ ...values }] } as ExpressionData);
  };

  const addAdditionalCondition = (logicInterface: Node.Utils.ConditionsLogicInterface) => {
    const values = getDefaultValue(logicInterface);
    onChange(getAddionalLogicData(expression!, values));
  };

  const updateBaseType = (type: Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR) => {
    onChange({ ...expression, type } as ExpressionData);
  };

  const onUpdateData = (index: number) => (data: ExpressionV2 | LogicGroupData) => {
    onChange({
      ...expression,
      value: expression!.value.map((item: any, idx: number) => (idx === index ? { ...item, ...data } : item)),
    } as ExpressionData);
  };

  const onDeleteCondition = (index: number) => () => {
    onChange({ ...expression, value: expression!.value.filter((_, idx: number) => idx !== index) } as ExpressionData);
  };

  return (
    <Box pt={16} pb={17}>
      {/* if new expression */}
      {!expression?.value?.length && (
        <BoxFlex>
          <BoxFlex mr={16}>
            <ConditionLabel>IF</ConditionLabel>
          </BoxFlex>
          <ConditionSelect onChange={addNewCondition} />
        </BoxFlex>
      )}

      {expression && (
        <>
          {expression.value?.map((item: ExpressionV2 | LogicGroupData, index: number) => {
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

                {isLastItem && item.logicInterface !== Node.Utils.ConditionsLogicInterface.EXPRESSION && (
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
