import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import * as ModalsV2 from '@/ModalsV2';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSFunctionTableNavigation: React.FC = () => {
  const filesModal = ModalsV2.useModal(ModalsV2.Function.Import);
  const count = useSelector(Designer.Function.selectors.count);

  const importMany = useDispatch(Designer.Function.effect.importMany);

  const onImportClickHandler = () => filesModal.open({ onSave: ([file]: File[]) => importMany(file) });

  return (
    <CMSTableNavigation
      label={`All functions (${count})`}
      actions={
        <>
          <CMSResourceActions.Delete />
          <CMSResourceActions.Export />
        </>
      }
      onImportClick={onImportClickHandler}
    />
  );
};
