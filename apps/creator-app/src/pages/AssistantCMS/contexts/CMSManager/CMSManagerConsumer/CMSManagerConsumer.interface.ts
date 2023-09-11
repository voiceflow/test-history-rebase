import type { Atom } from 'jotai';

import type { CMSManager, CMSResource } from '../CMSManager.interface';

export type CMSManagerAtomKey = {
  [Key in keyof CMSManager<any>]: CMSManager<any>[Key] extends Atom<any> ? Key : never;
}[keyof CMSManager<any>];

export interface ICMSManagerConsumer<Item extends CMSResource, Field extends CMSManagerAtomKey> {
  field: Field;
  render: (value: ReturnType<CMSManager<Item>[Field]['read']>) => React.ReactNode;
}
