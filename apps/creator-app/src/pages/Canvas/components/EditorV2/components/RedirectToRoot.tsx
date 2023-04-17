import { useSetup } from '@voiceflow/ui';
import React from 'react';

import { useEditor } from '../hooks';

const RedirectToRoot: React.FC = () => {
  const editor = useEditor();

  useSetup(() => editor.goToRoot());

  return null;
};

export default RedirectToRoot;
