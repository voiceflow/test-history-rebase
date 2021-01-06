import 'draft-js/dist/Draft.css';

import BaseDraftJSEditor, { PluginEditorProps } from 'draft-js-plugins-editor';
import React from 'react';

import Container from './components/DraftJSEditorContainer';

export { Container as DraftJSEditorContainer };

export type DraftJSEditorProps = PluginEditorProps & {
  wordBreak?: string;
};

const DraftJSEditor: React.ForwardRefRenderFunction<BaseDraftJSEditor, DraftJSEditorProps> = ({ wordBreak, onChange, ...props }, ref) => {
  const hasRendered = React.useRef(false);

  const changeHandler = React.useCallback<PluginEditorProps['onChange']>(
    (editorState) => {
      if (!hasRendered.current) return;

      onChange(editorState);
    },
    [onChange]
  );

  React.useEffect(() => {
    hasRendered.current = true;
  }, []);

  return (
    <Container wordBreak={wordBreak}>
      <BaseDraftJSEditor {...props} onChange={changeHandler} ref={ref} />
    </Container>
  );
};

export default React.forwardRef(DraftJSEditor);
