import type { AnchorPlugin, AnchorPluginConfig } from '@voiceflow/draft-js-anchor-plugin';
import createAnchorPlugin from '@voiceflow/draft-js-anchor-plugin';
import type { FakeSelectionPlugin } from '@voiceflow/draft-js-fake-selection';
import createFakeSelectionPlugin from '@voiceflow/draft-js-fake-selection';
import type { StaticToolBarPlugin } from '@voiceflow/draft-js-static-toolbar-plugin';
import createStaticToolbarPlugin from '@voiceflow/draft-js-static-toolbar-plugin';
import React from 'react';

import { useSetup, useTeardown } from '@/hooks';

import { EngineConsumer } from './utils';

type Plugins = {
  anchorPlugin: AnchorPlugin;
  toolbarPlugin: StaticToolBarPlugin;
  fakeSelectionPlugin: FakeSelectionPlugin;
};

class MarkupEngine extends EngineConsumer {
  log = this.engine.log.child('focus');

  private pluginsByNodeID: Record<string, Plugins> = {};

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
