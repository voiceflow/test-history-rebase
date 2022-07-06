// import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Tabs } from '@voiceflow/ui';
import React from 'react';

import ConditionExpressionTooltip from '../../ConditionsBuilder/components/ConditionExpressionTooltip';
import ConditionSelect from '../../ConditionsBuilder/components/ConditionSelect';
import { ConditionsEditorTabs } from '../constants';
import ConditionBuilder from './ConditionBuilder';
import ConditionExpression from './ConditionExpression';
import { PopperContainer, PopperContent, PopperHeader } from './PopperContainers';

const ConditionsPopper: React.FC<{ expression: Realtime.ExpressionV2 }> = ({ expression }) => {
  const [activeTab, setIsActiveTab] = React.useState<ConditionsEditorTabs>(ConditionsEditorTabs.BUILDER);

  const addAdditionalCondition = (/* logicInterface: BaseNode.Utils.ConditionsLogicInterface */) => {
    // const values = getDefaultValue(logicInterface);
    // onChange(getAddionalLogicData(expression!, values));
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
        <div style={{ width: '36px', height: '36px', padding: '10px' }}>
          {activeTab === ConditionsEditorTabs.BUILDER ? <ConditionSelect isV2 onChange={addAdditionalCondition} /> : <ConditionExpressionTooltip />}
        </div>
      </PopperHeader>
      <PopperContent>
        {activeTab === ConditionsEditorTabs.BUILDER ? <ConditionBuilder /> : <ConditionExpression expression={expression} />}
      </PopperContent>
    </PopperContainer>
  );
};

export default ConditionsPopper;
