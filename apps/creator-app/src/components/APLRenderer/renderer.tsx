import { Nullable, Utils } from '@voiceflow/common';
import AlexaAPLRenderer, * as APL from 'apl-viewhost-web';
import React from 'react';

import client from '@/client';
import { normalizeError } from '@/utils/error';

import aplInitializer from './initializer';
import { APLRendererProps } from './types';

const DEFAULT_VIEWPORT = {
  width: 1024,
  height: 600,
  dpi: 96,
  isRound: false,
};

const APLRenderer: React.FC<APLRendererProps> = ({
  content: contentString,
  data,
  viewport = DEFAULT_VIEWPORT,
  commands,
  onCommandFail,
  ...props
}) => {
  const elementID = React.useMemo(() => Utils.id.cuid(), []);

  React.useEffect(() => {
    let renderer: Nullable<AlexaAPLRenderer> = null;
    let content: Nullable<APL.Content> = null;
    let unmounted = false;

    (async () => {
      try {
        await aplInitializer.initialize();

        if (unmounted) {
          return;
        }

        content = APL.Content.create(contentString);

        if (data) {
          content.addData('payload', data);
        }

        renderer = AlexaAPLRenderer.create({
          content,
          view: document.getElementById(elementID)!,
          viewport,
          environment: {
            agentName: 'APL Sandbox',
            agentVersion: '1.0',
            allowOpenUrl: true,
            disallowVideo: false,
          },
          theme: 'dark',
          utcTime: Date.now(),
          localTimeAdjustment: -new Date().getTimezoneOffset() * 60 * 1000,
        });

        await renderer.init();

        if (unmounted) {
          return;
        }

        if (commands) {
          try {
            await new Promise<void>((resolve, reject) => {
              if (renderer) {
                const action = renderer.context.executeCommands(commands);
                // eslint-disable-next-line promise/catch-or-return
                action.then(() => resolve());
                action.addTerminateCallback(reject);
              } else {
                resolve();
              }
            });
          } catch (error) {
            onCommandFail?.(normalizeError(error));
          }
        }
      } catch (error) {
        client.log.error(error);
      }
    })();

    return () => {
      unmounted = true;

      try {
        content?.delete();
      } catch (error) {
        client.log.error(error);
      }

      try {
        renderer?.destroy();
      } catch (error) {
        client.log.error(error);
      }
    };
  }, [data, contentString, viewport]);

  return <div id={elementID} {...props} />;
};

export default APLRenderer;
