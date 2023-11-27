import { Box, Divider, Editor } from '@voiceflow/ui-next';
import React from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { EntityClassifierColorSection } from '@/components/Entity/EntityClassifierColorSection/EntityClassifierColorSection.component';
import { EntityEditVariantsSection } from '@/components/Entity/EntityEditVariantsSection/EntityEditVariantsSection.component';
import { Designer } from '@/ducks';
import { useEditEntityValidator } from '@/hooks/entity.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useValidateWarningOnUnmount } from '@/hooks/validate.hook';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSEntityEditor: React.FC = () => {
  const entityID = useCMSActiveResourceID();

  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
  const patchEntity = useDispatch(Designer.Entity.effect.patchOne, entityID);
  const deleteEntity = useDispatch(Designer.Entity.effect.deleteOne, entityID);

  const editEntityValidator = useEditEntityValidator(entity);

  const onChangeName = (name: string) => {
    patchEntity({ name });
    editEntityValidator.resetNameError();
  };

  useValidateWarningOnUnmount({
    prefix: entity && `${entity.name}:`,
    validator: entity && (() => editEntityValidator.validate(entity)),
  });

  if (!entity) return null;

  return (
    <Editor
      title={entity.name}
      onTitleChange={onChangeName}
      headerActions={<CMSEditorMoreButton options={[{ label: 'Remove', onClick: deleteEntity }]} />}
    >
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

      <EntityEditVariantsSection
        entity={entity}
        variantsError={editEntityValidator.variantsError}
        resetVariantsError={editEntityValidator.resetVariantsError}
      />

      <Divider noPadding />

      <CMSEditorDescription
        value={entity.description ?? ''}
        placeholder="Enter entity description"
        onValueChange={(description) => patchEntity({ description })}
      />
    </Editor>
  );
};
