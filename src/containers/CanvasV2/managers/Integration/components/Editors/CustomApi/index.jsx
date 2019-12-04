import React from 'react';
import { TabContent, TabPane } from 'reactstrap';

import Button from '@/componentsV2/Button';
import Tabs from '@/componentsV2/Tabs';
import { IntegrationActionType } from '@/constants';
import { useEnableDisable } from '@/hooks/toggle';
import { variableInputValueIsEmpty } from '@/utils/variableInput';

import MappingOutput from '../../Steps/CustomApi/MappingOutput';
import RequestBody from '../../Steps/CustomApi/RequestBody';
import RequestHeaders from '../../Steps/CustomApi/RequestHeaders';
import RequestParams from '../../Steps/CustomApi/RequestParams';
import RequestType from '../../Steps/CustomApi/RequestType';
import CustomApiTestModal from '../../Steps/CustomApi/TestModal';
import Footer from './components/Footer';
import TabsContainer from './components/TabsContainer';

const keyPairFactory = () => ({
  key: [],
  val: [],
});

const mappingFactory = () => ({
  path: [],
  var: null,
});

const IntegrationTab = {
  HEADERS: 'Headers',
  BODY: 'Body',
  PARAMS: 'Params',
};

function CustomApiEditor({ data, onChange }) {
  const [testModalOpened, openTestModal, closeTestModal] = useEnableDisable(false);

  const { selectedAction } = data;

  const [activeTab, setActiveTab] = React.useState(IntegrationTab.HEADERS);

  const hasNonEmptyURL = variableInputValueIsEmpty(data.url) === false;
  const tabsOptions = React.useMemo(
    () => [
      {
        value: IntegrationTab.HEADERS,
        label: (
          <>
            {IntegrationTab.HEADERS}
            {data.headers.length > 1 && <span> ({data.headers.length})</span>}
          </>
        ),
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
        label: (
          <>
            {IntegrationTab.PARAMS}
            {data.parameters.length > 1 && <span> ({data.parameters.length})</span>}
          </>
        ),
      },
    ],
    [data.headers, data.parameters, selectedAction]
  );

  return (
    <div>
      <RequestType onChange={onChange} data={data} openTestModal={openTestModal} />

      <TabsContainer tabs>
        <Tabs options={tabsOptions} onChange={setActiveTab} selected={activeTab} />
      </TabsContainer>

      <TabContent activeTab={activeTab}>
        <TabPane tabId={IntegrationTab.HEADERS}>
          <RequestHeaders onChange={onChange} data={data} factory={keyPairFactory} />
        </TabPane>
        <TabPane tabId={IntegrationTab.BODY}>
          {selectedAction !== IntegrationActionType.CUSTOM_API.GET && <RequestBody onChange={onChange} data={data} factory={keyPairFactory} />}
        </TabPane>
        <TabPane tabId={IntegrationTab.PARAMS}>
          <RequestParams onChange={onChange} data={data} factory={keyPairFactory} />
        </TabPane>
      </TabContent>
      <MappingOutput onChange={onChange} data={data} factory={mappingFactory} />
      <Footer>
        <div></div>
        <Button disabled={!hasNonEmptyURL} variant="secondary" onClick={() => openTestModal()}>
          Test Request
        </Button>
      </Footer>
      {testModalOpened && (
        <CustomApiTestModal data={data} testModalOpened={testModalOpened} openTestModal={openTestModal} closeTestModal={closeTestModal} />
      )}
    </div>
  );
}

export default CustomApiEditor;
