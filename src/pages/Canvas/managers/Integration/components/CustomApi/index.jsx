import React from 'react';

import { IntegrationActionType } from '@/constants';
import { useEnableDisable } from '@/hooks/toggle';
import { Content, Controls } from '@/pages/Canvas/components/Editor';

import AddDataAndVarsToBodyHelp from './components/AddDataAndVarsToBodyHelp';
import MapDataToVarsHelp from './components/MapDataToVarsHelp';
import MappingOutput from './components/MappingOutput';
import RequestTabs from './components/RequestTabs';
import RequestType from './components/RequestType';
import TestModal from './components/TestModal';

const { CUSTOM_API } = IntegrationActionType;

const mappingFactory = () => ({ path: [], var: null });

function CustomApiEditor({ data, onChange }) {
  const [testModalOpened, openTestModal, closeTestModal] = useEnableDisable(false);
  const { url, body, content, mapping, bodyInputType, headers, parameters, selectedAction } = data;
  const isGet = CUSTOM_API.GET === selectedAction;

  return (
    <Content
      footer={
        <Controls
          tutorial={{
            content: isGet ? <MapDataToVarsHelp /> : <AddDataAndVarsToBodyHelp />,
          }}
          options={[{ label: 'Test Request', disabled: !data.url, onClick: openTestModal }]}
          tutorialTitle={CUSTOM_API.isGet ? 'How to Transform JSON data into a Variable' : 'How to Add Static Data and Variables to Body'}
        />
      }
    >
      <RequestType url={url} selectedAction={selectedAction} onChange={onChange} />

      <RequestTabs
        url={url}
        body={body}
        headers={headers}
        content={content}
        onChange={onChange}
        parameters={parameters}
        bodyInputType={bodyInputType}
        selectedAction={selectedAction}
      />

      <MappingOutput onChange={onChange} mapping={mapping} factory={mappingFactory} />

      {testModalOpened && <TestModal data={data} testModalOpened={testModalOpened} openTestModal={openTestModal} closeTestModal={closeTestModal} />}
    </Content>
  );
}

export default CustomApiEditor;
