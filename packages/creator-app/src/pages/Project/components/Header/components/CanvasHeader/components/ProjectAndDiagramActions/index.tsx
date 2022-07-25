import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { HeaderIconButton } from '@/components/ProjectPage';
import { Permission } from '@/config/permissions';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
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

  const updateProjectName = useDispatch(Project.updateActiveProjectName);
  const setActiveDesignMenuTab = useDispatch(UI.setActiveCreatorMenu);

  const projectID = useSelector(Session.activeProjectIDSelector);
  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);

  const getEngine = useEventualEngine();
  const topicsAndComponents = useFeature(Realtime.FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const isPrototypingMode = usePrototypingMode();
  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const titleRef = React.useRef<EditableTextAPI>(null);
  const [focused, setFocused] = useToggle(false);
  const [formValue, updateFormValue] = useLinkedState(projectName ?? '');

  const isReadOnly = isPrototypingMode || !canEditProject;

  const onBlur = () => {
    if (isReadOnly) {
      return;
    }

    const formattedName = formatProjectName(formValue);

    updateFormValue(formattedName);
    updateProjectName(formattedName);

    setFocused(false);
  };

  const onFocus = () => {
    if (isReadOnly || focused) {
      return;
    }

    setFocused(true);
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

  const onCopy = async () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

    await engine.copyActive(null, { disableSuccessToast: false });
  };

  return (
    <Container>
      {!canEditCanvas && <ViewOnly>View only</ViewOnly>}

      {canEditCanvas &&
      topicsAndComponents.isEnabled &&
      isTopicsAndComponentsVersion &&
      (selectedTargets.length > 1 || (selectedTargets.length === 1 && selectedTargets[0] !== startNodeID)) ? (
        <Box.Flex gap={5}>
          <HeaderIconButton
            icon="flowV2"
            isSmall
            tooltip={{ title: 'Create flow', hotkey: HOTKEY_LABEL_MAP[Hotkey.CREATE_COMPONENT] }}
            onClick={onCreateComponent}
          />

          <HeaderIconButton icon="copy" isSmall tooltip={{ title: 'Copy', hotkey: HOTKEY_LABEL_MAP[Hotkey.COPY] }} onClick={onCopy} />
        </Box.Flex>
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
            disabled={!canEditProject}
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
