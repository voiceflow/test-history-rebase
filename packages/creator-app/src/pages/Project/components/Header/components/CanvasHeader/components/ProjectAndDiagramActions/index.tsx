import { BoxFlex } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { HeaderIconButton } from '@/components/ProjectPage';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import * as Creator from '@/ducks/creator';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Realtime from '@/ducks/realtime';
import * as Session from '@/ducks/session';
import * as UI from '@/ducks/ui';
import { useDispatch, useEventualEngine, useFeature, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { DesignMenuTab } from '@/pages/Project/components/DesignMenu';
import { LastCreatedComponentContext, SelectionSetTargetsContext, SelectionTargetsContext } from '@/pages/Project/contexts';
import { usePrototypingMode } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatProjectName } from '@/utils/string';

import { Container, DiagramsActions, ProjectActions, ProjectTitle, ViewOnly } from './components';

const ProjectAndDiagramActions: React.FC = () => {
  const selectedTargets = React.useContext(SelectionTargetsContext);
  const setSelectedTargets = React.useContext(SelectionSetTargetsContext);
  const lastCreatedComponent = React.useContext(LastCreatedComponentContext);

  const lockResource = useDispatch(() => Realtime.sendRealtimeProjectUpdate(Realtime.lockResource(Realtime.ResourceType.SETTINGS)));
  const unlockResource = useDispatch(() => Realtime.sendRealtimeProjectUpdate(Realtime.unlockResource(Realtime.ResourceType.SETTINGS)));
  const updateProjectName = useDispatch(Project.updateActiveProjectName);
  const setActiveDesignMenuTab = useDispatch(UI.setActiveCreatorMenu);

  const isLocked = useSelector((state) => Realtime.isResourceLockedSelector(state)(Realtime.ResourceType.SETTINGS));
  const projectID = useSelector(Session.activeProjectIDSelector);
  const startNodeID = useSelector(Creator.startNodeIDSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);

  const getEngine = useEventualEngine();
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const isPrototypingMode = usePrototypingMode();
  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const titleRef = React.useRef<EditableTextAPI>(null);
  const [focused, setFocused] = useToggle(false);
  const [formValue, updateFormValue] = useLinkedState(projectName ?? '');

  const isReadOnly = isLocked || isPrototypingMode || !canEditProject;

  const onBlur = () => {
    if (isReadOnly) {
      return;
    }

    const formattedName = formatProjectName(formValue);

    updateFormValue(formattedName);
    updateProjectName(formattedName);

    setFocused(false);
    unlockResource();
  };

  const onFocus = () => {
    if (isReadOnly || focused) {
      return;
    }

    setFocused(true);
    lockResource();
  };

  const onRename = () => {
    setFocused(true);

    titleRef.current?.startEditing();
  };

  const onCreateComponent = async () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    setActiveDesignMenuTab(DesignMenuTab.LAYERS);

    const diagramID = await engine.createComponent();

    lastCreatedComponent.setComponentID(diagramID);

    setSelectedTargets([]);
  };

  const onDuplicate = () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    engine.node.duplicateMany(engine.activation.getTargets());
  };

  return (
    <Container>
      {!canEditCanvas && <ViewOnly>View only</ViewOnly>}

      {canEditCanvas &&
      topicsAndComponents.isEnabled &&
      isTopicsAndComponentsVersion &&
      (selectedTargets.length > 1 || (selectedTargets.length === 1 && selectedTargets[0] !== startNodeID)) ? (
        <BoxFlex gap={5}>
          <HeaderIconButton
            icon="component"
            isSmall
            tooltip={{ title: 'Create component', hotkey: HOTKEY_LABEL_MAP[Hotkey.CREATE_COMPONENT] }}
            onClick={onCreateComponent}
          />

          <HeaderIconButton
            icon="duplicate"
            isSmall
            tooltip={{ title: 'Duplicate', hotkey: HOTKEY_LABEL_MAP[Hotkey.DUPLICATE] }}
            onClick={onDuplicate}
          />
        </BoxFlex>
      ) : (
        <>
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
        </>
      )}
    </Container>
  );
};

export default ProjectAndDiagramActions;
