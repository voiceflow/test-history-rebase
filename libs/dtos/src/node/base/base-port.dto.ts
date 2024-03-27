import { z } from 'zod';

import { SystemPortType } from '../system-port-type.enum';

export const BasePortDTO = z
  .object({
    id: z.string(),
    type: z.union([z.string(), z.nativeEnum(SystemPortType)]),
    target: z.string().nullable().describe('Id of the node that the port points to'),
  })
  .strict();

export type BasePort = Omit<z.infer<typeof BasePortDTO>, 'type'> & {
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: SystemPortType | (string & {});
};

export const LegacyBasePortsDTO = z
  .object({
    /**
     * @deprecated use byKey instead
     */
    builtIn: z.record(z.record(z.nativeEnum(SystemPortType), BasePortDTO)),

    /**
     * @deprecated use byKey instead
     */
    dynamic: z.array(BasePortDTO),
  })
  .strict()
  .describe('@deprecated legacy ports definition, new steps should use byKey instead');

export type LegacyBasePorts = z.infer<typeof LegacyBasePortsDTO>;

export const BasePortsDTO = z
  .object({
    byKey: z.record(BasePortDTO).describe('Mapping of arbitrary string key to port'),
    builtIn: z.never().optional().describe('@deprecated use byKey instead'),
    dynamic: z.never().optional().describe('@deprecated use byKey instead'),
  })
  .strict();

export type BasePorts = z.infer<typeof BasePortsDTO>;
