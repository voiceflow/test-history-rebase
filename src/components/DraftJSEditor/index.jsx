import 'draft-js/dist/Draft.css';
import 'draft-js-mention-plugin/lib/plugin.css';

import BaseDraftJSEditor from 'draft-js-plugins-editor';
import React from 'react';

import Container from './components/DraftJSEditorContainer';

export { Container as DraftJSEditorContainer };

const DraftJSEditor = ({ wordBreak, ...props }, ref) => (
  <Container wordBreak={wordBreak}>
    <BaseDraftJSEditor {...props} ref={ref} />
  </Container>
);
export default React.forwardRef(DraftJSEditor);
