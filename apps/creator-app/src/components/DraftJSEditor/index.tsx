import 'draft-js/dist/Draft.css';

import BaseDraftJSEditor, { PluginEditorProps } from 'draft-js-plugins-editor';
import React from 'react';

import Container from './components/DraftJSEditorContainer';

export { Container as DraftJSEditorContainer };

export type DraftJSEditorProps = PluginEditorProps & {
  wordBreak?: string;
};

const DraftJSEditor: React.ForwardRefRenderFunction<BaseDraftJSEditor, DraftJSEditorProps> = ({ wordBreak, ...props }, ref) => (
  <Container wordBreak={wordBreak}>
    <BaseDraftJSEditor {...props} ref={ref} />
  </Container>
);

export default React.forwardRef(DraftJSEditor);
