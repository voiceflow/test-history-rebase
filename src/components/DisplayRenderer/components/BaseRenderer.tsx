import '../DisplayRenderer.css';

import { DeviceConfig, Renderer, createRenderer, devices } from '@voiceflow/apl-renderer';
import _ from 'lodash';
import React from 'react';

type BaseRendererProps = {
  apl: string;
  data: string;
  commands: string;
  scale: number;
  overrideDevice?: { height: number; width: number; density: number };
  isRound?: boolean;
  onFail: (error: Error) => void;
};

export type BaseRendererAPI = {
  renderPreview: () => Promise<void>;
  setDeviceConfiguration: (config: DeviceConfig) => void;
};

const BaseRenderer = React.forwardRef<BaseRendererAPI, BaseRendererProps>(({ onFail, scale, apl, data, commands, isRound, overrideDevice }, ref) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const device = React.useMemo(
    () =>
      new DeviceConfig(
        overrideDevice
          ? {
              ...devices.medHub,
              shape: isRound ? 'round' : 'rectangle',
              sizes: [
                {
                  name: 'Default',
                  density: overrideDevice.density,
                  pixelHeight: overrideDevice.height,
                  pixelWidth: overrideDevice.width!,
                },
              ],
            }
          : devices.medHub
      ),
    []
  );
  const rendererRef = React.useRef<Renderer | null>(null);

  const renderPreview = React.useCallback(async () => {
    try {
      await rendererRef.current?.render(JSON.parse(apl), JSON.parse(data!), {});

      if (commands) {
        await rendererRef.current?.executeCommands(JSON.parse(commands));
      }
    } catch (err) {
      onFail(err);
    }
  }, [apl, data, commands]);

  React.useImperativeHandle(
    ref,
    () => ({
      renderPreview,
      setDeviceConfiguration: (config) => rendererRef.current?.setDeviceConfiguration(config),
    }),
    [renderPreview]
  );

  React.useEffect(() => {
    rendererRef.current = createRenderer(device, innerRef.current!, { sendCommandEvent: _.constant(0), sendActivityEvent: _.constant(0) });
    renderPreview();
  }, []);

  return <div className="display-elem" ref={innerRef} style={{ transform: `scale(${scale})` }} />;
});

export default BaseRenderer;
