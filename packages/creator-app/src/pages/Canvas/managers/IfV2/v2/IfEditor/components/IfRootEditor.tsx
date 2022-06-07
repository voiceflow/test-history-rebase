import { Button } from '@voiceflow/ui';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import HelpTooltip from '@/pages/Canvas/managers/IfV2/components/HelpTooltip';

const IfRootEditor: React.FC = () => {
  return (
    <EditorV2
      header={<EditorV2.DefaultHeader />}
      footer={
        <EditorV2.DefaultFooter tutorial={{ content: <HelpTooltip /> }}>
          <Button variant={Button.Variant.PRIMARY} onClick={() => {}} squareRadius>
            Add Condition
          </Button>
        </EditorV2.DefaultFooter>
      }
    >
      <div>if editor content</div>
    </EditorV2>
  );
};

export default IfRootEditor;
