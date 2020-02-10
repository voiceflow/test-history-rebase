import React from 'react';
import { TabContent, TabPane } from 'reactstrap';

import Tabs from '@/componentsV2/Tabs';
import { IntegrationActionType } from '@/constants';

import RequestBody from './RequestBody';
import RequestHeaders from './RequestHeaders';
import RequestParams from './RequestParams';
import TabsContainer from './TabsContainer';

const keyPairFactory = () => ({
  key: [],
  val: [],
});

const IntegrationTab = {
  BODY: 'Body',
  PARAMS: 'Params',
  HEADERS: 'Headers',
};

const getTabs = (headers, parameters, selectedAction) => [
  {
    value: IntegrationTab.HEADERS,
    label: `${IntegrationTab.HEADERS} ${headers.length > 1 ? `(${headers.length})` : ''}`,
  },
  ...(selectedAction !== IntegrationActionType.CUSTOM_API.GET
    ? [
        {
          value: IntegrationTab.BODY,
          label: IntegrationTab.BODY,
        },
      ]
    : []),
  {
    value: IntegrationTab.PARAMS,
    label: `${IntegrationTab.PARAMS} ${parameters.length > 1 ? `(${parameters.length})` : ''}`,
  },
];

function RequestTabs({ headers, body, content, bodyInputType, parameters, selectedAction, onChange }) {
  const [activeTab, setActiveTab] = React.useState(IntegrationTab.HEADERS);

  const tabsOptions = React.useMemo(() => getTabs(headers, parameters, selectedAction), [headers, parameters, selectedAction]);

  return (
    <>
      <TabsContainer tabs>
        <Tabs options={tabsOptions} onChange={setActiveTab} selected={activeTab} />
      </TabsContainer>

      <TabContent activeTab={activeTab}>
        <TabPane tabId={IntegrationTab.HEADERS}>
          <RequestHeaders headers={headers} onChange={onChange} factory={keyPairFactory} />
        </TabPane>

        <TabPane tabId={IntegrationTab.BODY}>
          {selectedAction !== IntegrationActionType.CUSTOM_API.GET && (
            <RequestBody onChange={onChange} body={body} content={content} bodyInputType={bodyInputType} factory={keyPairFactory} />
          )}
        </TabPane>

        <TabPane tabId={IntegrationTab.PARAMS}>
          <RequestParams onChange={onChange} parameters={parameters} factory={keyPairFactory} />
        </TabPane>
      </TabContent>
    </>
  );
}

export default RequestTabs;
