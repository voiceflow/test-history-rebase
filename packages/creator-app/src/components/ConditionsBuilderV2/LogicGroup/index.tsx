import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { LogicUnitDataType } from '../../ConditionsBuilder/types';
import { getAddionalLogicData, getDefaultValue } from '../../ConditionsBuilder/utils';
import ConditionBuilder from '../ConditionBuilder';
import LogicDropdown from './Dropdown';
import * as S from './styles';

const isLogicGroupData = (expression: Realtime.ExpressionV2 | Realtime.LogicGroupData): expression is Realtime.LogicGroupData =>
  expression.logicInterface === BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP;

export interface LogicGroupProps {
  expression: Realtime.LogicGroupData;
  onAddComponent: (value: BaseNode.Utils.ConditionsLogicInterface) => void;
  onDelete: (index: number) => () => void;
  onDeleteParent?: () => void;
  onChange: (value: Partial<Realtime.ExpressionV2 | Realtime.LogicGroupData>) => void;
  topLevel?: boolean;
  logicIndex?: number;
}

const LogicGroup: React.FC<LogicGroupProps> = ({
  expression,
  onAddComponent,
  onDelete,
  onDeleteParent,
  onChange,
  topLevel = false,
  logicIndex = 0,
}) => {
  const onChangeValue = (index: number) => (data: Partial<Realtime.ExpressionV2 | Realtime.LogicGroupData>) => {
    onChange({
      ...expression,
      value: expression!.value.map((item: any, idx: number) => (idx === index ? { ...item, ...data } : item)),
    });
  };

  const onDeleteValue = (index: number) => () => {
    if (expression.value?.length === 1) {
      return onDeleteParent?.();
    }
    onChange({ value: expression.value.filter((_, idx: number) => idx !== index) });
  };

  const onAddCondition = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => {
    const values: Realtime.ExpressionV2 | Realtime.LogicGroupData = getDefaultValue(logicInterface);
    onChange(getAddionalLogicData<Realtime.LogicGroupData>({ ...expression, type: BaseNode.Utils.ExpressionTypeV2.OR }, values));
  };

  const first = expression?.value[0];
  const last = expression?.value[(expression?.value?.length || 0) - 1];

  return (
    <S.Container style={{ marginTop: topLevel ? 0 : 14, marginLeft: topLevel ? -20 : 0 }}>
      {expression?.value.length > 1 && (
        <LogicDropdown
          value={expression.type || BaseNode.Utils.ExpressionTypeV2.AND}
          onChange={(type) => onChange({ type })}
          numConditions={expression.value.length}
          topOffset={isLogicGroupData(first) && first.value?.length > 1 ? 49 : 20}
          bottomOffset={isLogicGroupData(last) && last.value?.length > 1 ? 49 : 20}
        />
      )}
      <Box>
        {expression?.value?.map((group: Realtime.ExpressionV2 | Realtime.LogicGroupData, index: number) => {
          const handleChange = onChangeValue(index);
          const handleDelete = onDeleteValue(index);

          return (
            <div key={index}>
              {isLogicGroupData(group) ? (
                <LogicGroup
                  expression={group as Realtime.LogicGroupData}
                  onAddComponent={onAddComponent}
                  onDelete={onDelete}
                  onChange={handleChange}
                  logicIndex={index}
                  onDeleteParent={handleDelete}
                />
              ) : (
                <ConditionBuilder
                  expression={group as LogicUnitDataType}
                  onDelete={handleDelete}
                  onAddComponent={topLevel ? onAddComponent : onAddCondition}
                  onChange={handleChange}
                  hasAddButton={!topLevel && index === 0}
                />
              )}
            </div>
          );
        })}
        {expression?.value.length === 0 && <ConditionBuilder onDelete={onDelete(logicIndex)} onAddComponent={onAddComponent} onChange={onChange} />}
      </Box>
    </S.Container>
  );
};

export default LogicGroup;
