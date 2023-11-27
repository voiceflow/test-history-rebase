import { ScopeProvider } from 'jotai-molecules';
import React, { useMemo } from 'react';

import { CMSResourceEditorScope } from './CMSResourceEditor.atom';
import type { ICMSResourceEditorProvider } from './CMSResourceEditor.interface';

export const CMSResourceEditorProvider = ({ children }: ICMSResourceEditorProvider) => {
  const config = useMemo(() => ({ closePrevented: false, closeRequestHandlers: [] }), []);

  return (
    <ScopeProvider scope={CMSResourceEditorScope} value={config}>
      {children}
    </ScopeProvider>
  );
};
