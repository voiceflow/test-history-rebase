import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { BlockType } from '@/constants';

import { NodeConfig } from '../types';

export const PERMISSIONS = [
  { label: 'Reminders', value: 'alexa::alerts:reminders:skill:readwrite' },
  { label: 'Lists Read', value: 'alexa::household:lists:read' },
  { label: 'Lists Write', value: 'alexa::household:lists:write' },
  { label: 'Notifications', value: 'alexa::devices:all:notifications:write' },
  { label: 'Address', value: 'alexa::devices:all:address:full:read' },
  { label: 'Full Name', value: 'alexa::profile:name:read' },
  { label: 'Email', value: 'alexa::profile:email:read' },
  { label: 'Phone', value: 'alexa::profile:mobile_number:read' },
  { label: 'Location Services', value: 'alexa::devices:all:geolocation:read' },
  { label: 'Skill Personalization', value: 'alexa::person_id:read' },
];

export const PERMISSION_LABELS = PERMISSIONS.reduce<Record<string, string>>((acc, { label, value }) => {
  acc[value] = label;

  return acc;
}, {});

export const NODE_CONFIG: NodeConfig<Realtime.NodeData.Permission, Realtime.NodeData.PermissionBuiltInPorts> = {
  type: BlockType.PERMISSION,
  icon: 'lockUnlocked',

  factory: () => ({
    node: {
      ports: {
        in: [{}],
        out: {
          byKey: {},
          dynamic: [],
          builtIn: {
            [BaseModels.PortType.NEXT]: { label: BaseModels.PortType.NEXT },
          },
        },
      },
    },
    data: {
      name: 'Permission',
      custom: false,
      permissions: [],
    },
  }),
};
