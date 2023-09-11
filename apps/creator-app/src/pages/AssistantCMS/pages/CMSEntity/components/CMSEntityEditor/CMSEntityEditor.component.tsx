import { Divider, Editor } from '@voiceflow/ui-next';
import React from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { EntityEditForm } from '@/components/Entity/EntityEditForm/EntityEditForm.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSEntityEditor: React.FC = () => {
  const entityID = useCMSActiveResourceID();

  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
  const patchEntity = useDispatch(Designer.Entity.effect.patchOne, entityID);
  const deleteEntity = useDispatch(Designer.Entity.effect.deleteOne, entityID);

  if (!entity) return null;

  return (
    <Editor
      title={entity.name}
      onTitleChange={(name) => name && patchEntity({ name })}
      headerActions={<CMSEditorMoreButton options={[{ label: 'Remove', onClick: deleteEntity }]} />}
    >
      <EntityEditForm pt={20} entityID={entityID} />

      <Divider />

      <CMSEditorDescription
        value={entity.description ?? ''}
        placeholder="Enter entity description"
        onValueChange={(description) => patchEntity({ description })}
      />
    </Editor>
  );
};
