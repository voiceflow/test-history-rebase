import React from 'react';
import type { Editor } from 'slate';

import type { PluginType } from '../editor';
import { createEditor } from '../editor';

export const useSetupEditor = (...plugins: PluginType[]): Editor => React.useMemo(() => createEditor(plugins), []);
