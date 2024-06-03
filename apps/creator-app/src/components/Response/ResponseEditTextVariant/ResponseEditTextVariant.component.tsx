import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { ResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.component';
import { ResponseTextVariantSettings } from '../ResponseTextVariantSettings/ResponseTextVariantSettings.component';
import type { IResponseEditTextVariant } from './ResponseEditTextVariant.interface';

export const ResponseEditTextVariant: React.FC<IResponseEditTextVariant> = ({ textResponseVariant, ...props }) => {
  const patchVariant = useDispatch(Designer.Response.ResponseVariant.effect.patchOneText, textResponseVariant.id);
  const replaceWithType = useDispatch(Designer.Response.ResponseVariant.effect.replaceWithType, textResponseVariant.id);

  return (
    <ResponseTextVariantLayout
      {...props}
      value={textResponseVariant.text}
      variantType={textResponseVariant.type}
      onValueChange={(text) => patchVariant({ text })}
      onChangeVariantType={replaceWithType}
      settingsButton={
        <ResponseTextVariantSettings
          variant={textResponseVariant}
          onVariantChange={({ cardLayout, speed }) => patchVariant({ cardLayout, speed })}
        />
      }
    />
  );
};
