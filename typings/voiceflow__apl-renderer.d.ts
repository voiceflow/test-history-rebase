declare module '@voiceflow/apl-renderer' {
  export type DeviceType = 'smallHub' | 'medHub';

  export type Device = {
    id: DeviceType;
    name: string;
    svgIcon: string;
    shape: 'round' | 'rectangle';
    sizes: {
      name: string;
      density: number;
      pixelWidth: number;
      pixelHeight: number;
    }[];
  };

  export class DeviceConfig {
    constructor(device: Device);

    getDpWidth: () => number;

    getDpHeight: () => number;
  }

  export const devices: Record<DeviceType, Device>;

  export type Renderer = {
    render: (apl: Record<string, any>, document: Record<string, any>, other: Record<string, any>) => Promise<void>;
    executeCommands: (commands: any[]) => Promise<void>;
    setDeviceConfiguration: (config: DeviceConfig) => void;
  };

  export const createRenderer: (
    config: DeviceConfig,
    el: HTMLElement,
    handlers: { sendCommandEvent: () => void; sendActivityEvent: () => void }
  ) => Renderer;
}
