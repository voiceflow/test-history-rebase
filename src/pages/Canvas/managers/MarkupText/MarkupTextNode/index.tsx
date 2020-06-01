import { EditorState } from 'draft-js';
import type BaseDraftJSEditor from 'draft-js-plugins-editor';
import React from 'react';

import DraftJSEditor from '@/components/DraftJSEditor';
import { Markup } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { EngineContext } from '@/pages/Canvas/contexts';

import { getRawContent } from '../utils';
import { Container, Link } from './components';
import { createEditorState, customStyleFn } from './utils';

const MarkupTextNode: React.FC<ConnectedMarkupNodeProps<Markup.TextNodeData>> = ({ node, data }) => {
  const editorRef = React.useRef<BaseDraftJSEditor>(null);

  const cachedContent = React.useRef(data.content);
  const [editorState, setEditorState] = React.useState(() => createEditorState(data.content));

  const engine = React.useContext(EngineContext)!;

  const pluginsObj = engine.markup.useSetupPlugins(node.id, { anchorOptions: { Link } });
  const plugins = React.useMemo(() => Object.values(pluginsObj), [pluginsObj]);

  const onBlur = () => {
    const content = getRawContent(editorState);

    cachedContent.current = content;

    engine.node.updateData(node.id, { content });
  };

  const onEscape = () => {
    editorRef.current!.blur();
  };

  const onChange = React.useCallback((state: EditorState) => {
    setEditorState(state);
  }, []);

  return (
    <Container>
      <DraftJSEditor
        ref={editorRef}
        onBlur={onBlur}
        plugins={plugins}
        onChange={onChange}
        onEscape={onEscape}
        editorState={editorState}
        placeholder="Type something"
        customStyleFn={customStyleFn}
        textAlignment={data.textAlignment}
      />
    </Container>
  );
};

export default MarkupTextNode;
