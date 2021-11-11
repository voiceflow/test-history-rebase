import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

export const getPortByLabel = (ports: Realtime.Port[], label: string): Realtime.Port | null => ports.find((port) => port.label === label) ?? null;

export const getPortByType = (ports: Realtime.Port[], type: Models.PortType): Realtime.Port | null => getPortByLabel(ports, type);
