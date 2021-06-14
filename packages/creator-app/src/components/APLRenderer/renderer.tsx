import AlexaAPLRenderer, * as APL from 'apl-viewhost-web';
import cuid from 'cuid';
import React from 'react';

import { Nullable } from '@/types';
import * as Sentry from '@/vendors/sentry';

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
  const elementID = React.useMemo(() => cuid(), []);

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
            await new Promise((resolve) => renderer?.context.executeCommands(commands).then(resolve));
          } catch (e) {
            onCommandFail?.(e);
          }
        }
      } catch (error) {
        Sentry.error(error);
      }
    })();

    return () => {
      unmounted = true;

      try {
        content?.delete();
      } catch (error) {
        Sentry.error(error);
      }

      try {
        renderer?.destroy();
      } catch (error) {
        Sentry.error(error);
      }
    };
  }, [data, contentString, viewport]);

  return <div id={elementID} {...props} />;
};

export default APLRenderer;
