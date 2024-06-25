import React from 'react';
import type { match } from 'react-router';

export const EditorParentMatchContext = React.createContext<match | null>(null);

export const { Consumer: EditorParentMatchConsumer, Provider: EditorParentMatchProvider } = EditorParentMatchContext;
