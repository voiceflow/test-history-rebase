import { ScopeProvider } from 'jotai-molecules';
import React, { useMemo } from 'react';

import { CMSResourceEditorScope } from './CMSResourceEditor.atom';
import type { ICMSResourceEditorProvider } from './CMSResourceEditor.interface';

export const CMSResourceEditorProvider = ({ children, drawerRef }: ICMSResourceEditorProvider) => {
  const config = useMemo(() => ({ drawerRef, closePrevented: false, closeRequestHandlers: [] }), [drawerRef]);

  return (
    <ScopeProvider scope={CMSResourceEditorScope} value={config}>
      {children}
    </ScopeProvider>
  );
};
