import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

const CodeRootEditor: React.FC = () => {
  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <div>help tooltip</div> }}>
          <EditorV2.FooterActionsButton actions={[]} />
        </EditorV2.DefaultFooter>
      }
    >
      <div>Code editor content</div>
    </EditorV2>
  );
};

export default CodeRootEditor;
