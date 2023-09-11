import { useAtomValue } from 'jotai';
import React from 'react';

import { useCMSManager } from '../CMSManager.hook';
import type { CMSManager, CMSResource } from '../CMSManager.interface';
import type { CMSManagerAtomKey, ICMSManagerConsumer } from './CMSManagerConsumer.interface';

export const CMSManagerConsumer = <Item extends CMSResource, Field extends CMSManagerAtomKey>({
  field,
  render,
}: ICMSManagerConsumer<Item, Field>): React.ReactElement => {
  const cmsManager = useCMSManager<Item>();
  const value = useAtomValue(cmsManager[field]);

  return <>{render(value as ReturnType<CMSManager<Item>[Field]['read']>)}</>;
};
