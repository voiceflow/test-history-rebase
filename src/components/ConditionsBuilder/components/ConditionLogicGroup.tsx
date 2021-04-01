import { ConditionsLogicInterface, ExpressionTypeV2, ExpressionV2, LogicGroupData } from '@voiceflow/general-types';
import React from 'react';

import Box, { Flex } from '@/components/Box';

import { LogicUnitDataType } from '../types';
import { getAddionalLogicData, getDefaultValue } from '../utils';
import ConditionLabel from './ConditionLabel';
import ConditionSelect from './ConditionSelect';
import LogicUnit from './LogicUnit';

export type ConditionLogicGroupProps = {
  firstItem?: boolean;
  expression: LogicGroupData;
  baseLogicType?: ExpressionTypeV2.AND | ExpressionTypeV2.OR;

  onDelete: () => void;
  onChange: (value: LogicGroupData) => void;
  updateBaseType: (value: ExpressionTypeV2.AND | ExpressionTypeV2.OR) => void;
};

const ConditionLogicGroup: React.FC<ConditionLogicGroupProps> = ({ expression, onChange, firstItem, baseLogicType, updateBaseType }) => {
  const addNewCondition = (logicInterface: ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange({ ...expression, value: [{ ...values }] });
  };

  const addAdditionalCondition = (logicInterface: ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange(getAddionalLogicData({ ...expression, type: ExpressionTypeV2.OR }! as LogicGroupData, values) as LogicGroupData);
  };

  const updateLogicGroupBaseType = (type: ExpressionTypeV2.AND | ExpressionTypeV2.OR) => {
    onChange({ ...expression, type });
  };

  const onUpdateData = (index: number) => (data: ExpressionV2) => {
    onChange({ ...expression, value: expression.value.map((item: any, idx: number) => (idx === index ? { ...item, ...data } : item)) });
  };

  const onDeleteCondition = (index: number) => () => {
    onChange({ ...expression, value: expression.value.filter((_, idx: number) => idx !== index) });
  };

  return (
    <Box>
      {!firstItem && (
        <Box mt={16} mb={16}>
          <ConditionLabel actionable onChange={updateBaseType}>
            {baseLogicType?.toUpperCase()}
          </ConditionLabel>
        </Box>
      )}

      <Box borderRadius={5} border="1px dashed #efefef" p={16} mb={16}>
        {!expression?.value?.length && (
          <Flex>
            <Flex mr={16}>
              <ConditionLabel>IF</ConditionLabel>
            </Flex>
            <ConditionSelect onChange={addNewCondition} isLogicGroup />
          </Flex>
        )}

        {expression?.value?.map((item: ExpressionV2, index: number) => (
          <LogicUnit
            key={index}
            firstItem={index === 0}
            baseLogicType={expression.type}
            updateBaseType={updateLogicGroupBaseType}
            expression={item as LogicUnitDataType}
            onDataChange={onUpdateData(index)}
            onDelete={onDeleteCondition(index)}
          />
        ))}

        {!!expression.value.length && <ConditionSelect onChange={addAdditionalCondition} additional isLogicGroup />}
      </Box>
    </Box>
  );
};

export default ConditionLogicGroup;
