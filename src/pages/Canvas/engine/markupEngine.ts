import type { AnchorPlugin, AnchorPluginConfig } from '@voiceflow/draft-js-anchor-plugin';
import createAnchorPlugin from '@voiceflow/draft-js-anchor-plugin';
import type { FakeSelectionPlugin } from '@voiceflow/draft-js-fake-selection';
import createFakeSelectionPlugin from '@voiceflow/draft-js-fake-selection';
import type { StaticToolBarPlugin } from '@voiceflow/draft-js-static-toolbar-plugin';
import createStaticToolbarPlugin from '@voiceflow/draft-js-static-toolbar-plugin';
import cuid from 'cuid';
import { EditorState, convertToRaw } from 'draft-js';
import React from 'react';

import { BlockType, TextAlignment } from '@/constants';
import { useSetup, useTeardown } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { NewShapeAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';

import { EngineConsumer } from './utils';

type Plugins = {
  anchorPlugin: AnchorPlugin;
  toolbarPlugin: StaticToolBarPlugin;
  fakeSelectionPlugin: FakeSelectionPlugin;
};

class MarkupEngine extends EngineConsumer<{ newShape: NewShapeAPI }> {
  log = this.engine.log.child('markup');

  pluginsByNodeID: Record<string, Plugins> = {};

  isEnabled = false;

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.engine.clearActivation();

    this.isEnabled = false;
  }

  async addTextNode() {
    const nodeData: Markup.NodeData.Text = {
      content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
      textAlignment: TextAlignment.LEFT,
      scale: 1,
      rotate: 0,
      width: null,
    };

    const nodeID = await this.engine.node.add(
      BlockType.MARKUP_TEXT,
      this.engine.getMouseCoords(),
      nodeData as NodeData<Markup.NodeData.Text>,
      cuid(),
      false
    );

    let editorState = this.pluginsByNodeID[nodeID].toolbarPlugin.store.getItem<() => EditorState>('getEditorState')();

    editorState = EditorState.forceSelection(
      EditorState.push(editorState, editorState.getCurrentContent(), 'apply-entity'),
      editorState.getSelection()
    );

    this.pluginsByNodeID[nodeID].toolbarPlugin.store.getItem<(state: EditorState) => void>('setEditorState')(editorState);

    this.engine.focus.set(nodeID);
  }

  async createShapeNode() {
    this.components.newShape?.show(this.engine.getCanvasMousePosition());
  }

  async addShapeNode(point: Point, nodeData: NodeData<Markup.NodeData.Shape>) {
    await this.engine.node.add(BlockType.MARKUP_SHAPE, this.engine.canvas!.toCoords(point), nodeData, cuid());

    this.components.newShape?.hide();
  }

  useSetupPlugins(nodeID: string, { anchorOptions }: { anchorOptions: AnchorPluginConfig }) {
    const plugins = React.useMemo(
      () => ({
        anchorPlugin: createAnchorPlugin(anchorOptions),
        toolbarPlugin: createStaticToolbarPlugin(),
        fakeSelectionPlugin: createFakeSelectionPlugin(),
      }),
      []
    );

    useSetup(() => {
      this.pluginsByNodeID[nodeID] = plugins;
    });

    useTeardown(() => {
      delete this.pluginsByNodeID[nodeID];
    });

    return plugins;
  }

  getPluginsByNodeID(nodeID: string) {
    return this.pluginsByNodeID[nodeID];
  }

  reset() {
    if (!this.isEnabled) return;

    this.components.newShape?.hide();

    this.isEnabled = false;
  }
}

export default MarkupEngine;
