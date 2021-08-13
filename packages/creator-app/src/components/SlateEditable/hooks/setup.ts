import React from 'react';
import { Editor } from 'slate';

import { createEditor, PluginType } from '../editor';

// eslint-disable-next-line import/prefer-default-export
export const useSetupEditor = (...plugins: PluginType[]): Editor => React.useMemo(() => createEditor(plugins), []);
