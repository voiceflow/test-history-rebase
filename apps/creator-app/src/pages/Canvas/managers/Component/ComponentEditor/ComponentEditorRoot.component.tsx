import React from 'react';

import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';

import { ComponentEditorBase } from './ComponentEditorBase.component';

export const ComponentEditorRoot: React.FC = () => <ComponentEditorBase headerActions={<EditorV3HeaderActions />} />;
