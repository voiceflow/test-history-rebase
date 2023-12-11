import { ScopeProvider } from 'jotai-molecules';
import React, { useMemo } from 'react';

import { CMSResourceEditorScope } from './CMSResourceEditor.atom';
import type { ICMSResourceEditorProvider } from './CMSResourceEditor.interface';

export const CMSResourceEditorProvider = ({ children, drawerNode }: ICMSResourceEditorProvider) => {
  const config = useMemo(() => ({ drawerNode, closePrevented: false, closeRequestHandlers: [] }), [drawerNode]);

  return (
    <ScopeProvider scope={CMSResourceEditorScope} value={config}>
      {children}
    </ScopeProvider>
  );
};
