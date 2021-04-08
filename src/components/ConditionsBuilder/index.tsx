import { ConditionsLogicInterface, ExpressionData, ExpressionTypeV2, ExpressionV2, LogicGroupData } from '@voiceflow/general-types';
import React from 'react';

import Box, { Flex } from '@/components/Box';

import { ConditionLabel, ConditionSelect, LogicInterfaceHandler } from './components';
import { getAddionalLogicData, getDefaultValue } from './utils';

export type ConditionsBuilderProps = {
  onChange: (value: ExpressionData) => void;
  expression?: ExpressionData;
};

const ConditionsBuilder: React.FC<ConditionsBuilderProps> = ({ onChange, expression }) => {
  const addNewCondition = (logicInterface: ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange({ ...expression, value: [{ ...values }] } as ExpressionData);
  };

  const addAdditionalCondition = (logicInterface: ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange(getAddionalLogicData(expression!, values));
  };

  const updateBaseType = (type: ExpressionTypeV2.AND | ExpressionTypeV2.OR) => {
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
    <Box pt={16} pb={24}>
      {/* if new expression */}
      {!expression?.value?.length && (
        <Flex>
          <Flex mr={16}>
            <ConditionLabel>IF</ConditionLabel>
          </Flex>
          <ConditionSelect onChange={addNewCondition} />
        </Flex>
      )}

      {expression && (
        <>
          {expression.value?.map((item: ExpressionV2 | LogicGroupData, index: number) => (
            <LogicInterfaceHandler
              key={index}
              firstItem={index === 0}
              expression={item}
              onChange={onUpdateData(index)}
              onDelete={onDeleteCondition(index)}
              baseLogicType={expression.type}
              updateBaseType={updateBaseType}
            />
          ))}

          {!!expression.value.length && <ConditionSelect onChange={addAdditionalCondition} additional />}
        </>
      )}
    </Box>
  );
};

export default ConditionsBuilder;
