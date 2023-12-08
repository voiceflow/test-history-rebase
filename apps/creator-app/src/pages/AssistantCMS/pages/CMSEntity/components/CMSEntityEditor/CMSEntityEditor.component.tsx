import { Box, Divider, Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { EntityClassifierColorSection } from '@/components/Entity/EntityClassifierColorSection/EntityClassifierColorSection.component';
import { EntityEditVariantsSection } from '@/components/Entity/EntityEditVariantsSection/EntityEditVariantsSection.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSEntityEditor: React.FC = () => {
  const entityID = useCMSActiveResourceID();
  const getMoreMenu = useCMSResourceGetMoreMenu();

  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
  const patchEntity = useDispatch(Designer.Entity.effect.patchOne, entityID);

  const onChangeName = (name: string) => {
    if (!name) return;

    patchEntity({ name });
  };

  if (!entity) return null;

  return (
    <Editor
      title={entity.name}
      onTitleChange={onChangeName}
      headerActions={<CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: entityID, onClose })}</CMSEditorMoreButton>}
    >
      <Scroll style={{ display: 'block' }}>
        <Box px={24} py={20}>
          <EntityClassifierColorSection
            name={entity.name}
            color={entity.color}
            classifier={entity.classifier}
            typeMinWidth={177}
            onColorChange={(color) => patchEntity({ color })}
            onClassifierChange={(classifier) => patchEntity({ classifier })}
          />
        </Box>

        <Divider noPadding />

        <EntityEditVariantsSection entity={entity} />

        <Divider noPadding />

        <CMSEditorDescription
          value={entity.description ?? ''}
          placeholder="Enter entity description"
          onValueChange={(description) => patchEntity({ description })}
        />
      </Scroll>
    </Editor>
  );
};
