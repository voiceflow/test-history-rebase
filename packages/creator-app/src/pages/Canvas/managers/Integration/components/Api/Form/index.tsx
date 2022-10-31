import { BaseNode } from '@voiceflow/base-types';
import { ContextMenu, SectionV2 } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import TLSEditor from '../TLSEditor';
import { BodySection, CaptureResponseSection, Footer, HeaderSection, ParametersSection, RequestTypeSection } from './components';
import { FormProps } from './types';

const Form: React.FC<FormProps> = ({ editor, header, footer }) => {
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

      {editor.data?.tls && (
        <>
          <SectionV2.Divider />

          <ContextMenu options={[{ label: 'Remove', onClick: () => editor.onChange({ tls: null }) }]}>
            {({ onContextMenu }) => (
              <SectionV2.LinkSection onClick={() => editor.goToNested(TLSEditor.PATH)} onContextMenu={onContextMenu}>
                <SectionV2.Title>Certificates</SectionV2.Title>
              </SectionV2.LinkSection>
            )}
          </ContextMenu>
        </>
      )}
    </EditorV2>
  );
};

export default Object.assign(Form, { Footer });
