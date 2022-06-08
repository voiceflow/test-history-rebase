import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import OldIntegrationEditor from '@/pages/Canvas/managers/Integration/IntegrationEditor';
import { isCustomAPI } from '@/pages/Canvas/managers/Integration/utils';

import { CUSTOM_API_NAME } from '../constants';
import CaptureResponseSection from './CaptureResponseSection';
import HeaderSection from './HeaderSection';
import ParametersSection from './ParametersSection';
import RequestTypeSection from './RequestTypeSection';

const IntegrationRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();

  if (!isCustomAPI(editor.data.selectedIntegration)) return <OldIntegrationEditor {...editor} />;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title={CUSTOM_API_NAME} />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <div>daounadso</div> }}>
          <Button variant={Button.Variant.PRIMARY} onClick={() => {}} squareRadius>
            Send Request
          </Button>
        </EditorV2.DefaultFooter>
      }
    >
      <RequestTypeSection />

      <SectionV2.Divider />

      <HeaderSection />

      <SectionV2.Divider />

      <ParametersSection />

      <SectionV2.Divider />

      <CaptureResponseSection />
    </EditorV2>
  );
};

export default IntegrationRootEditor;
