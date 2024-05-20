import { z } from 'zod';

import { NodePortDTO } from '../node-port.dto';
import { NodeSystemPortType } from '../node-system-port-type.enum';

export const BasePortsDTO = z
  .object({
    byKey: z.record(NodePortDTO).describe('Mapping of arbitrary string key to port'),

    /**
     * @deprecated use byKey instead
     */
    builtIn: z.record(z.nativeEnum(NodeSystemPortType), NodePortDTO).describe('@deprecated use byKey instead'),

    /**
     * @deprecated use byKey instead
     */
    dynamic: z.array(NodePortDTO).describe('@deprecated use byKey instead'),
  })
  .strict();

export type BasePorts = z.infer<typeof BasePortsDTO>;
