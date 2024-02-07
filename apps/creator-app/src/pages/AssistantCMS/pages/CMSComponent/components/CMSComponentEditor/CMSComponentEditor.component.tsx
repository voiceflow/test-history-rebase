import { Editor, IEditorAPI, Scroll } from '@voiceflow/ui-next';
import React, { useRef } from 'react';

import { CMSEditorDescription } from '@/components/CMS/CMSEditor/CMSEditorDescription/CMSEditorDescription.component';
import { CMSRoute } from '@/config/routes';
import { Designer } from '@/ducks';
import { goToCMSResource } from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { CMSEditorMoreButton } from '../../../../components/CMSEditorMoreButton/CMSEditorMoreButton.components';
import { useCMSResourceGetMoreMenu } from '../../../../hooks/cms-resource.hook';
import { useCMSActiveResourceID } from '../../../../hooks/cms-table.hook';

export const CMSComponentEditor: React.FC = () => {
  const editorRef = useRef<IEditorAPI>(null);
  const duplicateOne = useDispatch(Designer.Flow.effect.duplicateOne);

  const componentID = useCMSActiveResourceID();
  const getMoreMenu = useCMSResourceGetMoreMenu({
    onRename: () => editorRef.current?.startTitleEditing(),
    onDuplicate: async (id) => {
      const data = await duplicateOne(id);

      goToCMSResource(CMSRoute.COMPONENT, data.id);
    },
  });

  const component = useSelector(Designer.Flow.selectors.oneByID, { id: componentID });
  const patchComponent = useDispatch(Designer.Flow.effect.patchOne, componentID);

  if (!component) return null;

  return (
    <Editor
      ref={editorRef}
      title={component.name}
      onTitleChange={(name) => patchComponent({ name: name.trim() })}
      headerActions={<CMSEditorMoreButton>{({ onClose }) => getMoreMenu({ id: componentID, onClose })}</CMSEditorMoreButton>}
      testID="cms-editor"
    >
      <Scroll style={{ display: 'block' }}>
        <CMSEditorDescription
          value={component.description ?? ''}
          placeholder="Enter component description"
          onValueChange={(description) => patchComponent({ description })}
          testID="component__description"
        />
      </Scroll>
    </Editor>
  );
};
