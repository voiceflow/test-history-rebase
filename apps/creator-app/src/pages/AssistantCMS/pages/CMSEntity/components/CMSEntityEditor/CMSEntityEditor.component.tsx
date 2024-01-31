import { Box, Divider, Editor, IEditorAPI, Scroll } from '@voiceflow/ui-next';
import React, { useRef } from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { EntityClassifierColorSection } from '@/components/Entity/EntityClassifierColorSection/EntityClassifierColorSection.component';
import { EntityEditVariantsSection } from '@/components/Entity/EntityEditVariantsSection/EntityEditVariantsSection.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { transformVariableName } from '@/utils/variable.util';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSEntityEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);

  const entityID = useCMSActiveResourceID();
  const getMoreMenu = useCMSResourceGetMoreMenu({ onRename: () => editorRef.current?.startTitleEditing() });

  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
  const patchEntity = useDispatch(Designer.Entity.effect.patchOne, entityID);

  if (!entity) return null;

  return (
    <Editor
      ref={editorRef}
      title={entity.name}
      onTitleChange={(name) => patchEntity({ name: name.trim() })}
      headerActions={<CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: entityID, onClose })}</CMSEditorMoreButton>}
      titleTransform={transformVariableName}
      testID="cms-editor"
    >
      <Scroll style={{ display: 'block' }}>
        <Box px={24} py={20} direction="column">
          <EntityClassifierColorSection
            name={entity.name}
            color={entity.color}
            classifier={entity.classifier}
            onColorChange={(color) => patchEntity({ color })}
            onClassifierChange={(classifier) => patchEntity({ classifier })}
            classifierMinWidth={177}
          />
        </Box>

        <Divider noPadding />

        <EntityEditVariantsSection entity={entity} />

        <Divider noPadding />

        <CMSEditorDescription
          value={entity.description ?? ''}
          placeholder="Enter entity description"
          onValueChange={(description) => patchEntity({ description })}
          testID="entity__description"
        />
      </Scroll>
    </Editor>
  );
};
