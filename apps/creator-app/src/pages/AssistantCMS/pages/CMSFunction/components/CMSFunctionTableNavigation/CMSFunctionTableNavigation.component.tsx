import { Box } from '@voiceflow/ui-next';
import { useSetAtom } from 'jotai/react';
import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';

import { Path } from '@/config/routes';
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

  const setIsEditorMenuOpen = useSetAtom(isEditorMenuOpenAtom);
  const pathMatch = useRouteMatch<{ resourceID: string }>(Path.CMS_RESOURCE_ACTIVE);

  const importMany = useDispatch(Designer.Function.effect.importMany);

  const label = `All functions (${count})`;

  const onImportClickHandler = () => filesModal.open({ onSave: ([file]: File[]) => importMany(file) });

  // eslint-disable-next-line xss/no-mixed-html
  const onContainerClick = (event: React.MouseEvent) => {
    if (!pathMatch?.isExact || (event.target instanceof HTMLElement && event.target.textContent === label)) return;

    event.stopPropagation();
    setIsEditorMenuOpen(false);
  };

  const getFolderPath = () => getAtomValue(routeFolders.activeFolderURL) ?? getAtomValue(cmsManager.url);

  return (
    <Box onClick={onContainerClick}>
      <CMSTableNavigation
        label={label}
        onLabelClick={() => navigate.push(getFolderPath())}
        onImportClick={onImportClickHandler}
        actions={
          <>
            <CMSResourceActions.Export />
            <CMSResourceActions.Delete />
          </>
        }
      />
    </Box>
  );
};
