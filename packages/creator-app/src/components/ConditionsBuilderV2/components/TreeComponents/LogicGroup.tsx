import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { LogicUnitDataType } from '../../../ConditionsBuilder/types';
import { getAddionalLogicData, getDefaultValue } from '../../../ConditionsBuilder/utils';
import { TreeLogicExpressions } from '../../constants';
import { ConditionBuilder } from '../BuilderComponents';
import LogicDropdown from './LogicDropdown';
import LogicGroupContainer from './LogicGroupContainer';

export interface LogicGroupProps {
  expression: Realtime.LogicGroupData;
  onAddComponent: (value: BaseNode.Utils.ConditionsLogicInterface) => void;
  onDelete: (index: number) => () => void;
  onChange: (index: number) => (value: Realtime.ExpressionV2 | Realtime.LogicGroupData) => void;
  topLevel?: boolean;
  logicIndex?: number;
}

const LogicGroup: React.FC<LogicGroupProps> = ({ expression, onAddComponent, onDelete, onChange, topLevel = false, logicIndex = 0 }) => {
  const changeLogicType = (index: number) => (type: TreeLogicExpressions) => {
    onChange(index)({ ...expression, type });
  };

  const addAdditionalCondition = (index: number) => (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => {
    const values: Realtime.ExpressionV2 | Realtime.LogicGroupData = getDefaultValue(logicInterface);
    onChange(index)(
      getAddionalLogicData({ ...expression, type: BaseNode.Utils.ExpressionTypeV2.OR }! as Realtime.LogicGroupData, values) as Realtime.LogicGroupData
    );
  };

  const onDeleteCondition = (logicIndex: number) => (index: number) => () => {
    onChange(logicIndex)({ ...expression, value: expression.value.filter((_, idx: number) => idx !== index) });
  };

  return (
    <LogicGroupContainer>
      {expression?.value.length > 1 && (
        <LogicDropdown
          value={expression.type || BaseNode.Utils.ExpressionTypeV2.AND}
          onChange={changeLogicType(logicIndex)}
          numConditions={expression.value.length}
        />
      )}
      <Box>
        {expression?.value?.map((group: Realtime.ExpressionV2 | Realtime.LogicGroupData, index: number) => {
          return (
            <div key={index}>
              {group.logicInterface === BaseNode.Utils.ConditionsLogicInterface.LOGIC_GROUP ? (
                <LogicGroup
                  expression={group as Realtime.LogicGroupData}
                  onAddComponent={onAddComponent}
                  onDelete={onDelete}
                  onChange={onChange}
                  logicIndex={index}
                />
              ) : (
                <ConditionBuilder
                  expression={group as LogicUnitDataType}
                  onDelete={topLevel ? onDelete(index) : onDeleteCondition(logicIndex)(index)}
                  onAddComponent={topLevel ? onAddComponent : addAdditionalCondition(logicIndex)}
                  onChange={onChange(index)}
                  hasAddButton={!topLevel && index === 0}
                />
              )}
            </div>
          );
        })}
        {expression?.value.length === 0 && (
          <ConditionBuilder onDelete={onDelete(logicIndex)} onAddComponent={onAddComponent} onChange={onChange(logicIndex)} />
        )}
      </Box>
    </LogicGroupContainer>
  );
};

export default LogicGroup;
