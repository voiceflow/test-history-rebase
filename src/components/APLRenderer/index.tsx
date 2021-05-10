import AlexaAPLRenderer, * as APL from 'apl-viewhost-web';
import cuid from 'cuid';
import React from 'react';

import { useEnableDisable } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

const DEFAULT_VIEWPORT = {
  width: 1024,
  height: 600,
  dpi: 96,
  isRound: false,
};

const APLRendererContext = React.createContext(false);

export const APLRendererProvider: React.FC = ({ children }) => {
  const [isInitialized, initialize] = useEnableDisable();

  React.useEffect(() => {
    APL.initEngine()
      .then(() => initialize())
      .catch(Sentry.error);
  }, []);

  return <APLRendererContext.Provider value={isInitialized}>{children}</APLRendererContext.Provider>;
};

export type APLRendererProps = React.ComponentProps<'div'> & {
  content: string;
  data?: string;
  commands?: string;
  onCommandFail?: (error: Error) => void;
  viewport: APL.IAPLOptions['viewport'];
};

const APLRenderer: React.FC<APLRendererProps> = ({
  content: contentString,
  data,
  viewport = DEFAULT_VIEWPORT,
  commands,
  onCommandFail,
  ...props
}) => {
  const isInitialized = React.useContext(APLRendererContext);
  const elementID = React.useMemo(() => cuid(), []);

  React.useEffect(() => {
    if (!isInitialized) return undefined;

    const content = APL.Content.create(contentString);

    if (data) {
      content.addData('payload', data);
    }

    const renderer = AlexaAPLRenderer.create({
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
    renderer.init();

    if (commands) {
      try {
        renderer.context.executeCommands(commands);
      } catch (e) {
        onCommandFail?.(e);
      }
    }

    return () => renderer.destroy();
  }, [isInitialized, data, contentString, viewport]);

  return <div id={elementID} {...props} />;
};

export default APLRenderer;
