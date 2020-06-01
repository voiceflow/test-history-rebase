import { EditorState } from 'draft-js';
import React from 'react';

import { FlexAround } from '@/components/Flex';
import { TextAlignment } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import { Markup } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import { Section } from '@/pages/Canvas/components/MarkupComponents';

import { FontStyles, Hyperlink, IconButtonSeparator, TextAligns, TextColor, TextStyles } from './components';
import { getRawContent } from './utils';

export type MarkupTextEditorProps = {
  data: Markup.TextNodeData;
  nodeID: string;
  onChange: (data: Partial<Markup.TextNodeData>) => void;
};

export const MarkupTextEditor: React.FC<MarkupTextEditorProps> = ({ data, nodeID, onChange }) => {
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const { toolbarPlugin, fakeSelectionPlugin, anchorPlugin } = eventualEngine.get()!.markup.getPluginsByNodeID(nodeID);

  const onSetAlignment = (textAlignment: TextAlignment) => onChange({ textAlignment });

  const saveEditorState = (state: EditorState) => {
    onChange({ content: getRawContent(state) });
  };

  const wrapSetEditorStateToSave = (setEditorState: (state: EditorState) => void) => (state: EditorState) => {
    setEditorState(state);
    onChange({ content: getRawContent(state) });
  };

  return (
    <toolbarPlugin.Toolbar>
      {({ getEditorState, setEditorState }) => (
        <Content>
          <Section>
            <FontStyles
              setEditorState={setEditorState}
              getEditorState={getEditorState}
              saveEditorState={saveEditorState}
              applyFakeSelection={fakeSelectionPlugin.applyFakeSelection}
              removeFakeSelection={fakeSelectionPlugin.removeFakeSelection}
            />
          </Section>

          <Section>
            <FlexAround>
              <TextAligns alignment={data.textAlignment} setAlignment={onSetAlignment} />

              <IconButtonSeparator />

              <TextStyles setEditorState={wrapSetEditorStateToSave(setEditorState)} getEditorState={getEditorState} />

              <IconButtonSeparator />

              <Hyperlink
                setEditorState={wrapSetEditorStateToSave(setEditorState)}
                getEditorState={getEditorState}
                saveEditorState={saveEditorState}
                applyFakeSelection={fakeSelectionPlugin.applyFakeSelection}
                removeFakeSelection={fakeSelectionPlugin.removeFakeSelection}
                createLinkAtSelection={anchorPlugin.createLinkAtSelection}
                removeLinkAtSelection={anchorPlugin.removeLinkAtSelection}
              />
            </FlexAround>
          </Section>

          <Section>
            <TextColor
              setEditorState={setEditorState}
              getEditorState={getEditorState}
              saveEditorState={saveEditorState}
              applyFakeSelection={fakeSelectionPlugin.applyFakeSelection}
              removeFakeSelection={fakeSelectionPlugin.removeFakeSelection}
            />
          </Section>
        </Content>
      )}
    </toolbarPlugin.Toolbar>
  );
};

export default MarkupTextEditor;
