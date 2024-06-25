import { tid } from '@voiceflow/style';
import type { IEditorAPI } from '@voiceflow/ui-next';
import { Box, Divider, Editor, Scroll, Text } from '@voiceflow/ui-next';
import { isSystemVariableName } from '@voiceflow/utils-designer';
import React, { useRef } from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { VariableColorSection } from '@/components/Variable/VariableColorSection/VariableColorSection.component';
import { VariableDefaultValueSection } from '@/components/Variable/VariableDefaultValueSection/VariableDefaultValueSection.component';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { EDITOR_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';
import { transformVariableName } from '@/utils/variable.util';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSVariableEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);

  const variableID = useCMSActiveResourceID();
  const getMoreMenu = useCMSResourceGetMoreMenu({
    onRename: () => editorRef.current?.startTitleEditing(),
    canRename: (resourceID) => !isSystemVariableName(resourceID),
    canDelete: (resourceID) => {
      const allowed = !isSystemVariableName(resourceID);

      if (allowed) return true;

      return {
        allowed: false,
        tooltip: {
          placement: 'left',
          children: () => <Text variant="caption">Built-in variables can’t be deleted</Text>,
        },
      };
    },
  });

  const variable = useSelector(Designer.Variable.selectors.oneByID, { id: variableID });
  const patchVariable = useDispatch(Designer.Variable.effect.patchOne, variableID);

  if (!variable) return null;

  return (
    <Editor
      ref={editorRef}
      title={variable.name}
      testID={EDITOR_TEST_ID}
      readOnly={variable.isSystem}
      onTitleChange={(name) => patchVariable({ name: name.trim() })}
      headerActions={
        <CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: variableID, onClose })}</CMSEditorMoreButton>
      }
      titleTransform={transformVariableName}
    >
      <Scroll style={{ display: 'block' }}>
        <Box px={24} py={20} direction="column">
          <VariableColorSection
            name={variable.name}
            color={variable.color}
            onColorChange={(color) => patchVariable({ color })}
          />
        </Box>

        <Divider noPadding />

        <VariableDefaultValueSection
          value={variable.defaultValue}
          onValueChange={(defaultValue) => patchVariable({ defaultValue })}
        />

        <Divider noPadding />

        <CMSEditorDescription
          value={variable.description ?? ''}
          testID={tid('variable', 'description')}
          placeholder="Enter description"
          onValueChange={(description) => patchVariable({ description })}
        />
      </Scroll>
    </Editor>
  );
};
