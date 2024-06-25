import { BaseNode } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import type { BaseLogicType, LogicUnitDataType } from '../../types';
import { getAddionalLogicData, getDefaultValue } from '../../utils';
import ConditionLabel from '../ConditionLabel';
import ConditionSelect from '../ConditionSelect';
import LogicUnit from '../LogicUnit';
import DeleteButtonContainer from './components/DeleteButtonContainer';
import LogicGroupContainer from './components/LogicGroupContainer';

export interface ConditionLogicGroupProps {
  firstItem?: boolean;
  expression: Realtime.LogicGroupData;
  baseLogicType: BaseLogicType;

  onDelete: () => void;
  onChange: (value: Realtime.LogicGroupData) => void;
  updateBaseType: (value: BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR) => void;
}

const ConditionLogicGroup: React.FC<ConditionLogicGroupProps> = ({
  expression,
  onChange,
  onDelete,
  firstItem,
  baseLogicType,
  updateBaseType,
}) => {
  const addNewCondition = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange({ ...expression, value: [{ ...values }] });
  };

  const addAdditionalCondition = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange(
      getAddionalLogicData(
        { ...expression, type: BaseNode.Utils.ExpressionTypeV2.OR }! as Realtime.LogicGroupData,
        values
      ) as Realtime.LogicGroupData
    );
  };

  const updateLogicGroupBaseType = (type: BaseNode.Utils.ExpressionTypeV2.AND | BaseNode.Utils.ExpressionTypeV2.OR) => {
    onChange({ ...expression, type });
  };

  const onUpdateData = (index: number) => (data: Realtime.ExpressionV2) => {
    onChange({
      ...expression,
      value: expression.value.map((item: any, idx: number) => (idx === index ? { ...item, ...data } : item)),
    });
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

      <LogicGroupContainer>
        <DeleteButtonContainer>
          <SvgIcon clickable icon="close" size={10} color="#6e849a" onClick={onDelete} />
        </DeleteButtonContainer>

        {!expression?.value?.length && (
          <Box.Flex>
            <Box.Flex mr={16}>
              <ConditionLabel>IF</ConditionLabel>
            </Box.Flex>

            <ConditionSelect onChange={addNewCondition} isLogicGroup />
          </Box.Flex>
        )}

        {expression?.value?.map((item: Realtime.ExpressionV2, index: number) => (
          <LogicUnit
            isLogicGroup
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
      </LogicGroupContainer>
    </Box>
  );
};

export default ConditionLogicGroup;
