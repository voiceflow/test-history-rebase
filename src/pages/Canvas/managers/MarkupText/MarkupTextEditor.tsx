import { EditorState } from 'draft-js';
import React from 'react';

import { FlexAround } from '@/components/Flex';
import { MarkupModeType, TextAlignment } from '@/constants';
import { withRequiredEngine } from '@/contexts';
import { useDidUpdateEffect, useSetup, useTeardown } from '@/hooks';
import { Markup } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import Section from '@/pages/Canvas/components/MarkupSection';
import type { Engine } from '@/pages/Canvas/engine';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';
import { MarkupModeContext } from '@/pages/Skill/contexts';

import { FontStyles, Hyperlink, IconButtonSeparator, TextAligns, TextColor, TextStyles } from './components';
import { getRawContent } from './utils';

export const MarkupTextEditor: React.FC<NodeEditorPropsType<Markup.NodeData.Text> & { engine: Engine }> = ({
  data,
  nodeID,
  onChange,
  isOpen,
  engine,
}) => {
  const { setModeType } = React.useContext(MarkupModeContext)!;
  const { toolbarPlugin, anchorPlugin } = engine.markup.getPluginsByNodeID(nodeID);
  const [textAlignment, setTextAlignment] = React.useState(data.textAlignment);

  const onSetAlignment = (alignment: TextAlignment) => {
    setTextAlignment(alignment);
    onChange({ textAlignment: alignment });
  };

  const saveEditorState = (state: EditorState) => {
    onChange({ content: getRawContent(state) });
  };

  const wrapSetEditorStateToSave = (setEditorState: (state: EditorState) => void) => (state: EditorState) => {
    setEditorState(state);
    onChange({ content: getRawContent(state) });
  };

  useSetup(() => setModeType(MarkupModeType.TEXT));

  useTeardown(() => {
    const state = toolbarPlugin.store.getItem<() => EditorState>('getEditorState')?.();

    if (state?.getCurrentContent().getPlainText().trim() === '' && engine?.getNodeByID(nodeID)) {
      engine?.node.remove(nodeID);
    }
  });

  useDidUpdateEffect(() => {
    const state = toolbarPlugin.store.getItem<() => EditorState>('getEditorState')?.();

    if (!isOpen && state?.getCurrentContent().getPlainText().trim() === '') {
      engine?.node.remove(nodeID);
    }

    if (!isOpen) {
      setModeType(null);
    } else {
      setModeType(MarkupModeType.TEXT);
    }
  }, [isOpen]);

  useDidUpdateEffect(() => {
    if (textAlignment !== data.textAlignment) {
      setTextAlignment(data.textAlignment);
    }
  }, [data.textAlignment]);

  return (
    <toolbarPlugin.Toolbar>
      {({ getEditorState, setEditorState }) => (
        <Content>
          <Section>
            <FontStyles key={String(isOpen)} setEditorState={setEditorState} getEditorState={getEditorState} saveEditorState={saveEditorState} />
          </Section>

          <Section>
            <FlexAround>
              <TextAligns alignment={textAlignment} setAlignment={onSetAlignment} />

              <IconButtonSeparator />

              <TextStyles setEditorState={wrapSetEditorStateToSave(setEditorState)} getEditorState={getEditorState} />

              <IconButtonSeparator />

              <Hyperlink
                key={String(isOpen)}
                setEditorState={wrapSetEditorStateToSave(setEditorState)}
                getEditorState={getEditorState}
                saveEditorState={saveEditorState}
                createLinkAtSelection={anchorPlugin.createLinkAtSelection}
                removeLinkAtSelection={anchorPlugin.removeLinkAtSelection}
              />
            </FlexAround>
          </Section>

          <Section>
            <TextColor key={String(isOpen)} setEditorState={setEditorState} getEditorState={getEditorState} saveEditorState={saveEditorState} />
          </Section>
        </Content>
      )}
    </toolbarPlugin.Toolbar>
  );
};

export default withRequiredEngine(MarkupTextEditor) as React.FC<NodeEditorPropsType<Markup.NodeData.Text>>;
