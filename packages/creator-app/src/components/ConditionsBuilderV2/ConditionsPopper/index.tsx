import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Tabs } from '@voiceflow/ui';
import React from 'react';

import ConditionExpressionTooltip from '../../ConditionsBuilder/components/ConditionExpressionTooltip';
import { getAddionalLogicData, getDefaultValue } from '../../ConditionsBuilder/utils';
import BuilderSelect from '../ConditionBuilder/Select';
import { ConditionsEditorTabs } from '../constants';
import { ConditionExpression } from '../ExpressionComponents';
import LogicGroup from '../LogicGroup';
import { PopperContainer, PopperContent, PopperHeader } from '../PopperContainers';

export interface ConditionsPopperProps {
  expression?: Realtime.ExpressionData;
  onChange: (value: Realtime.ExpressionData) => void;
}

const ConditionsPopper: React.FC<ConditionsPopperProps> = ({ expression, onChange }) => {
  const [activeTab, setIsActiveTab] = React.useState<ConditionsEditorTabs>(ConditionsEditorTabs.BUILDER);

  const addAdditionalBuilderComponent = (logicInterface: BaseNode.Utils.ConditionsLogicInterface) => {
    const values = getDefaultValue(logicInterface, true);
    onChange(getAddionalLogicData(expression!, values));
  };

  const onDeleteCondition = (index: number) => () => {
    onChange({ ...expression, value: expression!.value.filter((_, idx: number) => idx !== index) } as Realtime.ExpressionData);
  };

  return (
    <PopperContainer>
      <PopperHeader>
        <div style={{ width: '222px' }}>
          <Tabs value={activeTab} onChange={setIsActiveTab}>
            <Tabs.Tab value={ConditionsEditorTabs.BUILDER}>Builder</Tabs.Tab>
            <Tabs.Tab value={ConditionsEditorTabs.EXPRESSION}>Expression</Tabs.Tab>
          </Tabs>
        </div>
        {activeTab === ConditionsEditorTabs.BUILDER ? (
          <div style={{ marginRight: '7px' }}>
            <BuilderSelect onAddComponent={addAdditionalBuilderComponent} topLevel={true} />
          </div>
        ) : (
          <div style={{ padding: '10px' }}>
            <ConditionExpressionTooltip />
          </div>
        )}
      </PopperHeader>
      <PopperContent>
        {activeTab === ConditionsEditorTabs.BUILDER ? (
          <LogicGroup
            expression={expression as Realtime.LogicGroupData}
            onAddComponent={addAdditionalBuilderComponent}
            topLevel={true}
            onDelete={onDeleteCondition}
            onChange={(partialExp) => onChange({ ...expression, ...(partialExp as Realtime.ExpressionData) })}
          />
        ) : (
          <ConditionExpression expression={expression} />
        )}
      </PopperContent>
    </PopperContainer>
  );
};

export default ConditionsPopper;
