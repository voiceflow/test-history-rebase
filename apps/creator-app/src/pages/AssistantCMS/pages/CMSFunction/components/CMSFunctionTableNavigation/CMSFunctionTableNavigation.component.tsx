import { Box } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai/react';
import React from 'react';
import { useHistory } from 'react-router';

import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import * as ModalsV2 from '@/ModalsV2';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';
import { useCMSManager } from '@/pages/AssistantCMS/contexts/CMSManager';
import { useCMSRouteFolders } from '@/pages/AssistantCMS/contexts/CMSRouteFolders';
import { isEditorMenuOpen as isEditorMenuOpenAtom } from '@/pages/AssistantCMS/pages/CMSFunction/CMSFunction.atoms';

import { CMSResourceActions } from '../../../../components/CMSResourceActions';

export const CMSFunctionTableNavigation: React.FC = () => {
  const filesModal = ModalsV2.useModal(ModalsV2.Function.Import);
  const count = useSelector(Designer.Function.selectors.count);
  const getAtomValue = useGetAtomValue();
  const routeFolders = useCMSRouteFolders();
  const cmsManager = useCMSManager();
  const navigate = useHistory();
  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);
  const label = `All functions (${count})`;
  const setIsEditorMenuOpen = useSetAtom(isEditorMenuOpenAtom);

  const importMany = useDispatch(Designer.Function.effect.importMany);

  const onImportClickHandler = () => filesModal.open({ onSave: ([file]: File[]) => importMany(file) });

  return (
    <Box
      onClick={(event) => {
        if ((event.target as HTMLElement).textContent === label) return;
        event.stopPropagation();
        setIsEditorMenuOpen(false);
      }}
    >
      <CMSTableNavigation
        label={label}
        actions={
          <>
            <CMSResourceActions.Export />
            <CMSResourceActions.Delete />
          </>
        }
        onImportClick={onImportClickHandler}
        onLabelClick={() => navigate.push(getFolderPath())}
      />
    </Box>
  );
};
