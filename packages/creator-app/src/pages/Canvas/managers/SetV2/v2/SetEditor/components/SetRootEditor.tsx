import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

const SetRootEditor: React.FC = () => {
  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <div>tutorial</div> }}>
          <EditorV2.FooterActionsButton actions={[]} />
        </EditorV2.DefaultFooter>
      }
    >
      <EditorV2.PersistCollapse namespace={['SetSection', '123']} defaultCollapsed={false}>
        {() => <div>todo</div>}
      </EditorV2.PersistCollapse>
    </EditorV2>
  );
};

export default SetRootEditor;
