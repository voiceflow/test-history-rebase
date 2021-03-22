/* eslint-disable react-hooks/rules-of-hooks */
import { createMatchSelector } from 'connected-react-router';
import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import { Path } from '@/config/routes';
import { BlockType, MARKUP_NODES, MarkupModeType } from '@/constants';
import * as Router from '@/ducks/router';
import { useForceUpdate, useSetup, useTeardown } from '@/hooks';
import { Markup, NodeData } from '@/models';
import MarkupSlateEditor, { createSlateEditor, MarkupEditor } from '@/pages/Canvas/managers/MarkupText/MarkupSlateEditor';
import { objectID } from '@/utils';

import { EngineConsumer } from './utils';

class MarkupEngine extends EngineConsumer {
  log = this.engine.log.child('markup');

  textEditorsMap: Map<string, MarkupEditor> = new Map();

  textEditorsOnChangeMap: Map<string, () => void> = new Map();

  modeType: MarkupModeType | null = null;

  isCreating = false;

  finishCreating: (() => void) | null = null;

  get isActive() {
    return !!this.select(createMatchSelector(Path.CANVAS_MARKUP));
  }

  get hasFocus() {
    if (!this.engine.focus.hasTarget) return false;

    const nodeID = this.engine.focus.getTarget()!;
    const node = this.engine.getNodeByID(nodeID);

    return !!node && MARKUP_NODES.includes(node.type);
  }

  setModeTypeAndCreating(modeType: MarkupModeType | null, creating: boolean) {
    this.modeType = modeType;
    this.isCreating = creating;
  }

  setFinishCreating(callback: (() => void) | null) {
    this.finishCreating = callback;
  }

  activate() {
    return this.dispatch(Router.goToCurrentCanvasMarkup());
  }

  async addTextNode(): Promise<void> {
    const nodeData: Markup.NodeData.Text = {
      scale: 1,
      rotate: 0,
      content: MarkupSlateEditor.getEmptyState(),
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

  useSetupTextEditor(nodeID: string): MarkupEditor {
    const editor = React.useMemo(() => {
      const editor = createSlateEditor();

      const { onChange } = editor;

      editor.onChange = () => {
        unstable_batchedUpdates(() => {
          this.textEditorsOnChangeMap.get(nodeID)?.();
          onChange();
        });
      };

      return editor;
    }, []);

    useSetup(() => {
      this.textEditorsMap.set(nodeID, editor);
    });

    useTeardown(() => {
      this.textEditorsMap.delete(nodeID);
    });

    return editor;
  }

  useTextEditor(nodeID: string): MarkupEditor | undefined {
    const [forceUpdate] = useForceUpdate();
    const editor = this.textEditorsMap.get(nodeID);

    useSetup(() => {
      this.textEditorsOnChangeMap.set(nodeID, forceUpdate);
    });

    useTeardown(() => {
      this.textEditorsOnChangeMap.delete(nodeID);
    });

    return editor;
  }
}

export default MarkupEngine;
