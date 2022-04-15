import React from 'react';
import { Editor } from 'slate';

import { createEditor, PluginType } from '../editor';

export const useSetupEditor = (...plugins: PluginType[]): Editor => React.useMemo(() => createEditor(plugins), []);
