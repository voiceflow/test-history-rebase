import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { ResponseMessageLayout } from '../ResponseMessageLayout/ResponseMessageLayout.component';
import type { IResponseEditMessage } from './ResponseEditMessage.interface';

export const ResponseEditMessage: React.FC<IResponseEditMessage> = ({ responseMessage, ...props }) => {
  const patchMessage = useDispatch(Designer.Response.ResponseMessage.effect.patchOne, responseMessage.id);
  const replaceWithType = useDispatch(Designer.Response.ResponseVariant.effect.replaceWithType, responseMessage.id);

  return (
    <ResponseMessageLayout
      {...props}
      value={responseMessage.text}
      onValueChange={(text) => patchMessage({ text })}
      onChangeVariantType={replaceWithType}
    />
  );
};
