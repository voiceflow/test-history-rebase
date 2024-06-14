import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { ResponseMessageLayout } from '../ResponseMessageLayout/ResponseMessageLayout.component';
import type { IResponseEditMessage } from './ResponseEditMessage.interface';

export const ResponseEditMessage: React.FC<IResponseEditMessage> = ({ responseMessage, ...props }) => {
  const patchVariant = useDispatch(Designer.Response.ResponseVariant.effect.patchOneText, responseMessage.id);
  const replaceWithType = useDispatch(Designer.Response.ResponseVariant.effect.replaceWithType, responseMessage.id);

  return (
    <ResponseMessageLayout
      {...props}
      value={responseMessage.text}
      onValueChange={(text) => patchVariant({ text })}
      onChangeVariantType={replaceWithType}
    />
  );
};
