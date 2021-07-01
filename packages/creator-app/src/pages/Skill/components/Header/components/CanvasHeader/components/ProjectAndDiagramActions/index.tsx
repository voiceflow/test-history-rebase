import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { Permission } from '@/config/permissions';
import * as Project from '@/ducks/project';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import { useDispatch, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
import { usePrototypingMode } from '@/pages/Skill/hooks';
import { Identifier } from '@/styles/constants';
import { withEnterPress, withInputBlur } from '@/utils/dom';

import { Container, DiagramsActions, ProjectActions, ProjectTitle, ViewOnly } from './components';

const validateTitle = (value: string) => value.trim() || 'Untitled Project';

const ProjectAndDiagramActions: React.FC = () => {
  const lockResource = useDispatch(() => Realtime.sendRealtimeProjectUpdate(Realtime.lockResource(Realtime.ResourceType.SETTINGS)));
  const unlockResource = useDispatch(() => Realtime.sendRealtimeProjectUpdate(Realtime.unlockResource(Realtime.ResourceType.SETTINGS)));
  const saveProjectName = useDispatch(Project.saveProjectName);

  const isLocked = useSelector((state) => Realtime.isResourceLockedSelector(state)(Realtime.ResourceType.SETTINGS));
  const projectID = useSelector(Session.activeProjectIDSelector);
  const projectName = useSelector(Project.activeProjectNameSelector);

  const isPrototypingMode = usePrototypingMode();
  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const titleRef = React.useRef<EditableTextAPI>(null);
  const [focused, setFocused] = useToggle(false);
  const [formValue, updateFormValue] = useLinkedState(projectName ?? '');

  const isReadOnly = isLocked || isPrototypingMode || !canEditProject;

  const onBlur = React.useCallback(() => {
    if (isReadOnly) {
      return;
    }

    updateFormValue(validateTitle(formValue));
    saveProjectName(validateTitle(formValue));

    setFocused(false);
    unlockResource();
  }, [isReadOnly, formValue]);

  const onFocus = React.useCallback(() => {
    if (isReadOnly || focused) {
      return;
    }

    setFocused(true);
    lockResource();
  }, [focused, isReadOnly]);

  const onRename = React.useCallback(() => {
    setFocused(true);

    titleRef.current?.startEditing();
  }, []);

  return (
    <Container>
      {!canEditCanvas && <ViewOnly>View only</ViewOnly>}

      <ProjectTitle
        id={Identifier.PROJECT_TITLE}
        ref={titleRef}
        value={formValue}
        onBlur={onBlur}
        onFocus={onFocus}
        readOnly={isReadOnly}
        onChange={updateFormValue}
        disabled={isLocked || !canEditProject}
        onKeyPress={withEnterPress(withInputBlur())}
      />

      {!focused && (
        <>
          <ProjectActions projectID={projectID} projectName={projectName} onRename={onRename} />
          <DiagramsActions />
        </>
      )}
    </Container>
  );
};

export default ProjectAndDiagramActions;
