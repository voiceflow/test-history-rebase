import { EditorState } from 'draft-js';
import React from 'react';

import { FlexAround } from '@/components/Flex';
import { MarkupModeType, TextAlignment } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import { useDidUpdateEffect, useSetup, useTeardown } from '@/hooks';
import { Markup } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import { Section } from '@/pages/Canvas/components/MarkupComponents';
import { MarkupModeContext } from '@/pages/Skill/contexts';

import { FontStyles, Hyperlink, IconButtonSeparator, TextAligns, TextColor, TextStyles } from './components';
import { getRawContent } from './utils';

export type MarkupTextEditorProps = {
  data: Markup.TextNodeData;
  nodeID: string;
  isOpen: boolean;
  onChange: (data: Partial<Markup.TextNodeData>) => void;
};

export const MarkupTextEditor: React.FC<MarkupTextEditorProps> = ({ data, nodeID, onChange, isOpen }) => {
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const { setModeType } = React.useContext(MarkupModeContext)!;
  const { toolbarPlugin, fakeSelectionPlugin, anchorPlugin } = eventualEngine.get()!.markup.getPluginsByNodeID(nodeID);

  const onSetAlignment = (textAlignment: TextAlignment) => onChange({ textAlignment });

  const saveEditorState = (state: EditorState) => {
    onChange({ content: getRawContent(state) });
  };

  const wrapSetEditorStateToSave = (setEditorState: (state: EditorState) => void) => (state: EditorState) => {
    setEditorState(state);
    onChange({ content: getRawContent(state) });
  };

  useSetup(() => {
    setModeType(MarkupModeType.TEXT);
  });

  useTeardown(() => {
    const state = toolbarPlugin.store.getItem<() => EditorState>('getEditorState')?.();

    if (state?.getCurrentContent().getPlainText().trim() === '' && eventualEngine.get()?.getNodeByID(nodeID)) {
      eventualEngine.get()?.node.remove(nodeID);
    }
  });

  useDidUpdateEffect(() => {
    const state = toolbarPlugin.store.getItem<() => EditorState>('getEditorState')?.();

    if (!isOpen && state?.getCurrentContent().getPlainText().trim() === '') {
      eventualEngine.get()?.node.remove(nodeID);
    }

    if (!isOpen) {
      setModeType(null);
    } else {
      setModeType(MarkupModeType.TEXT);
    }
  }, [isOpen]);

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
