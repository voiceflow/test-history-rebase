import React from 'react';

import Alert from '@/components/legacy/Alert';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

interface EditorProps {
  goBack?: VoidFunction;
}

const Editor: React.FC<EditorProps> = ({ goBack }) => {
  const editor = EditorV2.useEditor();

  return (
    <EditorV2 header={<EditorV2.DefaultHeader onBack={goBack ?? editor.goBack} />}>
      <Alert variant={Alert.Variant.WARNING}>This component is not yet implemented in the new CMS</Alert>
    </EditorV2>
  );
};

export default Editor;
