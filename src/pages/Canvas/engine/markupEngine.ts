import type { AnchorPlugin, AnchorPluginConfig } from '@voiceflow/draft-js-anchor-plugin';
import createAnchorPlugin from '@voiceflow/draft-js-anchor-plugin';
import type { StaticToolBarPlugin } from '@voiceflow/draft-js-static-toolbar-plugin';
import createStaticToolbarPlugin from '@voiceflow/draft-js-static-toolbar-plugin';
import { createMatchSelector } from 'connected-react-router';
import cuid from 'cuid';
import { EditorState, convertToRaw } from 'draft-js';
import React from 'react';

import { Path } from '@/config/routes';
import { BlockType, MARKUP_NODES, TextAlignment } from '@/constants';
import * as Router from '@/ducks/router';
import { useSetup, useTeardown } from '@/hooks';
import { Markup, NodeData } from '@/models';

import { EngineConsumer } from './utils';

type Plugins = {
  anchorPlugin: AnchorPlugin;
  toolbarPlugin: StaticToolBarPlugin;
};

class MarkupEngine extends EngineConsumer {
  log = this.engine.log.child('markup');

  pluginsByNodeID: Record<string, Plugins> = {};

  get isActive() {
    return !!this.select(createMatchSelector(Path.CANVAS_MARKUP));
  }

  get hasFocus() {
    if (!this.engine.focus.hasTarget) return false;

    const nodeID = this.engine.focus.getTarget()!;
    const node = this.engine.getNodeByID(nodeID);

    return !!node && MARKUP_NODES.includes(node.type);
  }

  activate() {
    return this.dispatch(Router.goToCurrentCanvasMarkup());
  }

  async addTextNode() {
    const nodeData: Markup.NodeData.Text = {
      content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
      textAlignment: TextAlignment.LEFT,
      scale: 1,
      rotate: 0,
      overrideWidth: null,
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

  useSetupPlugins(nodeID: string, { anchorOptions }: { anchorOptions: AnchorPluginConfig }) {
    const plugins = React.useMemo(
      () => ({
        anchorPlugin: createAnchorPlugin(anchorOptions),
        toolbarPlugin: createStaticToolbarPlugin(),
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
}

export default MarkupEngine;
