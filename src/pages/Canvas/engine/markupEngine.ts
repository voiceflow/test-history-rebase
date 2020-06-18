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
import { CANVAS_MARKUP_ENABLED_CLASSNAME } from '@/pages/Canvas/constants';
import { NewShapeAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';

import { EngineConsumer } from './utils';

type Plugins = {
  anchorPlugin: AnchorPlugin;
  toolbarPlugin: StaticToolBarPlugin;
  fakeSelectionPlugin: FakeSelectionPlugin;
};

class MarkupEngine extends EngineConsumer {
  log = this.engine.log.child('markup');

  pluginsByNodeID: Record<string, Plugins> = {};

  isEnabled = false;

  newShape: NewShapeAPI | null = null;

  enable() {
    this.engine.canvas?.addClass(CANVAS_MARKUP_ENABLED_CLASSNAME);
    this.log.debug('enable markup tool');

    this.isEnabled = true;
  }

  disable() {
    this.engine.clearActivation();
    this.engine.canvas?.removeClass(CANVAS_MARKUP_ENABLED_CLASSNAME);
    this.log.debug('disable markup tool');

    this.isEnabled = false;
  }

  registerNewShape(newShape: NewShapeAPI | null) {
    this.newShape = newShape;
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
      this.engine.getCanvasMousePosition(),
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
    this.newShape?.show(this.engine.getCanvasMousePosition());
  }

  async addShapeNode(point: Point, nodeData: NodeData<Markup.NodeData.Shape>) {
    await this.engine.node.add(BlockType.MARKUP_SHAPE, point, nodeData, cuid());

    this.newShape?.hide();
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

    this.newShape?.hide();

    this.isEnabled = false;
  }
}

export default MarkupEngine;
