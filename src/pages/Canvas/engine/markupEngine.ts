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
import { CANVAS_MARKUP_ENABLED } from '@/pages/Canvas/constants';
import { Point } from '@/types';

import { EngineConsumer } from './utils';

type Plugins = {
  anchorPlugin: AnchorPlugin;
  toolbarPlugin: StaticToolBarPlugin;
  fakeSelectionPlugin: FakeSelectionPlugin;
};

class MarkupEngine extends EngineConsumer {
  log = this.engine.log.child('markup');

  private pluginsByNodeID: Record<string, Plugins> = {};

  private lastCreatedNodeID: string | null = null;

  private isEnabled = false;

  enable() {
    this.engine.canvas?.addClass(CANVAS_MARKUP_ENABLED);
    this.log.debug('enable markup tool');

    this.isEnabled = true;
  }

  disable() {
    this.engine.canvas?.removeClass(CANVAS_MARKUP_ENABLED);
    this.log.debug('disable markup tool');

    this.isEnabled = false;
  }

  getIsOpened() {
    return this.isEnabled;
  }

  getLastCreatedNodeID() {
    return this.lastCreatedNodeID;
  }

  resetLastCreatedNodeID() {
    this.lastCreatedNodeID = null;
  }

  async addTextNode(point: Point) {
    const nodeData: Markup.TextNodeData = {
      content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
      textAlignment: TextAlignment.LEFT,
      scale: 1,
    };

    const nodeID = cuid();

    this.lastCreatedNodeID = nodeID;

    this.engine.node.add(BlockType.MARKUP_TEXT, this.engine.canvas!.transformPoint(point), nodeData as NodeData<Markup.TextNodeData>, nodeID);
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
}

export default MarkupEngine;
