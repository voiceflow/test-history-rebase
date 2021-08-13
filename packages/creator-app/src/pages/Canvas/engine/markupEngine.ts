/* eslint-disable react-hooks/rules-of-hooks */

import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Editor } from 'slate';

import { SlateEditorAPI, SlatePluginType, useSetupSlateEditor } from '@/components/SlateEditable';
import { BlockType, MarkupBlockType } from '@/constants';
import { useForceUpdate, useSetup, useTeardown } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { Nullable } from '@/types';
import { objectID } from '@/utils';
import { isMarkupBlockType } from '@/utils/typeGuards';

import { EngineConsumer } from './utils';

class MarkupEngine extends EngineConsumer {
  log = this.engine.log.child('markup');

  creatingType: Nullable<MarkupBlockType> = null;

  textEditorsMap: Map<string, Editor> = new Map();

  finishCreating: (() => void) | null = null;

  textEditorsOnChangeMap: Map<string, () => void> = new Map();

  get hasFocus() {
    if (!this.engine.focus.hasTarget) return false;

    const nodeID = this.engine.focus.getTarget()!;
    const node = this.engine.getNodeByID(nodeID);

    return !!node && isMarkupBlockType(node.type);
  }

  setCreatingType(type: Nullable<MarkupBlockType>) {
    this.creatingType = type;
  }

  setFinishCreating(callback: (() => void) | null) {
    this.finishCreating = callback;
  }

  async addTextNode(): Promise<void> {
    const nodeData: Markup.NodeData.Text = {
      scale: 1,
      rotate: 0,
      content: SlateEditorAPI.getEmptyState(),
      overrideWidth: 178,
    };

    const nodeID = await this.engine.node.add(
      BlockType.MARKUP_TEXT,
      this.engine.getMouseCoords().sub([12 * (this.engine.canvas?.getZoom() ?? 1), 26 * (this.engine.canvas?.getZoom() ?? 1)]),
      nodeData as NodeData<Markup.NodeData.Text>,
      objectID(),
      false
    );

    this.engine.focus.set(nodeID);
  }

  useSetupTextEditor(nodeID: string): Editor {
    const editor = useSetupSlateEditor(SlatePluginType.LINKS);

    React.useMemo(() => {
      const { onChange } = editor;

      editor.onChange = () => {
        unstable_batchedUpdates(() => {
          this.textEditorsOnChangeMap.get(nodeID)?.();
          onChange();
        });
      };
    }, []);

    useSetup(() => {
      this.textEditorsMap.set(nodeID, editor);
    });

    useTeardown(() => {
      this.textEditorsMap.delete(nodeID);
    });

    return editor;
  }

  useTextEditor(nodeID: string): [key: number, editor: Editor | undefined] {
    const [forceUpdate, key] = useForceUpdate();
    const editor = this.textEditorsMap.get(nodeID);

    useSetup(() => {
      this.textEditorsOnChangeMap.set(nodeID, forceUpdate);
    });

    useTeardown(() => {
      this.textEditorsOnChangeMap.delete(nodeID);
    });

    return [key, editor];
  }
}

export default MarkupEngine;
