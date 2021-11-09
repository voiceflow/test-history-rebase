import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { BaseLogicType, LogicUnitDataType } from '../../types';
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
  updateBaseType: (value: Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR) => void;
}

const ConditionLogicGroup: React.FC<ConditionLogicGroupProps> = ({ expression, onChange, onDelete, firstItem, baseLogicType, updateBaseType }) => {
  const addNewCondition = (logicInterface: Node.Utils.ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange({ ...expression, value: [{ ...values }] });
  };

  const addAdditionalCondition = (logicInterface: Node.Utils.ConditionsLogicInterface) => {
    const values: any = getDefaultValue(logicInterface);
    onChange(
      getAddionalLogicData({ ...expression, type: Node.Utils.ExpressionTypeV2.OR }! as Realtime.LogicGroupData, values) as Realtime.LogicGroupData
    );
  };

  const updateLogicGroupBaseType = (type: Node.Utils.ExpressionTypeV2.AND | Node.Utils.ExpressionTypeV2.OR) => {
    onChange({ ...expression, type });
  };

  const onUpdateData = (index: number) => (data: Realtime.ExpressionV2) => {
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

      <LogicGroupContainer>
        <DeleteButtonContainer>
          <SvgIcon clickable icon="close" size={10} color="#6e849a" onClick={onDelete} enableOpacity />
        </DeleteButtonContainer>

        {!expression?.value?.length && (
          <BoxFlex>
            <BoxFlex mr={16}>
              <ConditionLabel>IF</ConditionLabel>
            </BoxFlex>
            <ConditionSelect onChange={addNewCondition} isLogicGroup />
          </BoxFlex>
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
