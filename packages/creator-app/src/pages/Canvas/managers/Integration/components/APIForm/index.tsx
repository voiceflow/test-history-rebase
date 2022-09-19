import { BaseNode } from '@voiceflow/base-types';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { BodySection, CaptureResponseSection, Footer, HeaderSection, ParametersSection, RequestTypeSection } from './components';
import { BaseFormProps } from './types';

interface APIFormProps extends BaseFormProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const APIForm: React.FC<APIFormProps> = ({ editor, header, footer }) => {
  const showBodySection = editor.data.selectedAction !== BaseNode.Api.APIActionType.GET;

  return (
    <EditorV2 header={header ?? <EditorV2.DefaultHeader />} footer={footer ?? <Footer editor={editor} />}>
      <RequestTypeSection editor={editor} />

      <SectionV2.Divider />

      <HeaderSection editor={editor} />

      <SectionV2.Divider />

      <ParametersSection editor={editor} />

      <SectionV2.Divider />

      {showBodySection && (
        <>
          <BodySection editor={editor} />
          <SectionV2.Divider />
        </>
      )}

      <CaptureResponseSection editor={editor} />
    </EditorV2>
  );
};

export default Object.assign(APIForm, { Footer });
