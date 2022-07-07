import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import OldIntegrationEditor from '@/pages/Canvas/managers/Integration/IntegrationEditor';
import { isCustomAPI } from '@/pages/Canvas/managers/Integration/utils';

import { CUSTOM_API_NAME } from '../constants';
import BodySection from './BodySection';
import CaptureResponseSection from './CaptureResponseSection';
import HeaderSection from './HeaderSection';
import ParametersSection from './ParametersSection';
import RequestTypeSection from './RequestTypeSection';

const IntegrationRootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.CustomPayloadBuiltInPorts>();
  const { selectedAction, selectedIntegration } = editor.data;
  const showBodySection = selectedAction !== BaseNode.Api.APIActionType.GET;
  const { open: openTestModal } = useModals<{}>(ModalType.INTEGRATION_EDITOR_SEND_REQUEST_MODAL);

  if (!isCustomAPI(selectedIntegration)) return <OldIntegrationEditor {...editor} />;

  return (
    <EditorV2
      header={<EditorV2.DefaultHeader title={CUSTOM_API_NAME} />}
      footer={
        <EditorV2.DefaultFooter tutorial={Documentation.API_STEP}>
          <Button variant={Button.Variant.PRIMARY} onClick={() => openTestModal({ ...editor.data })} squareRadius>
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

      {showBodySection && (
        <>
          <BodySection />
          <SectionV2.Divider />
        </>
      )}

      <CaptureResponseSection />
    </EditorV2>
  );
};

export default IntegrationRootEditor;
