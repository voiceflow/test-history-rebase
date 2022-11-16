import { Box } from '@voiceflow/ui';
import React from 'react';

import { HeaderIconButton } from '@/components/ProjectPage';
import { Permission } from '@/config/permissions';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useEventualEngine, useHotKeys, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import CanvasTemplateEditorNewTemplate from '@/pages/Canvas/components/TemplateEditor/NewTemplate';
import { LastCreatedComponentContext, SelectionSetTargetsContext, SelectionTargetsContext } from '@/pages/Project/contexts';
import { usePrototypingMode } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatProjectName } from '@/utils/string';

import { Container, DomainActions, PlatformLogo, ProjectTitle, ViewOnly } from './components';

const DomainsAndCanvasActions: React.FC = () => {
  const [templatePopperIsOpen, setTemplatePopperIsOpen] = React.useState(false);

  const selectedTargets = React.useContext(SelectionTargetsContext);
  const setSelectedTargets = React.useContext(SelectionSetTargetsContext);
  const lastCreatedComponent = React.useContext(LastCreatedComponentContext);

  const updateProjectName = useDispatch(Project.updateActiveProjectName);

  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);

  const getEngine = useEventualEngine();

  const isPrototypingMode = usePrototypingMode();
  const [canEditProject] = usePermission(Permission.EDIT_PROJECT);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const [focused, setFocused] = useToggle(false);
  const [formValue, updateFormValue] = useLinkedState(projectName ?? '');

  const isReadOnly = isPrototypingMode || !canEditProject;

  const showEditorIcons = canEditCanvas && (selectedTargets.length > 1 || (selectedTargets.length === 1 && selectedTargets[0] !== startNodeID));

  React.useEffect(() => {
    if (!showEditorIcons && templatePopperIsOpen) {
      setTemplatePopperIsOpen(false);
    }
  }, [showEditorIcons]);

  useHotKeys(Hotkey.ADD_TO_LIBRARY, () => setTemplatePopperIsOpen(true), { preventDefault: true });

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

  const onCreateComponent = async () => {
    const engine = getEngine();

    if (!engine) {
      return;
    }

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

      <PlatformLogo />

      {showEditorIcons ? (
        <Box.Flex gap={5}>
          <HeaderIconButton
            icon="componentOutline"
            isSmall
            tooltip={{ title: 'Create component', hotkey: HOTKEY_LABEL_MAP[Hotkey.CREATE_COMPONENT] }}
            onClick={onCreateComponent}
          />
          <CanvasTemplateEditorNewTemplate
            isOpen={templatePopperIsOpen}
            nodeIDs={selectedTargets}
            onClose={() => setTemplatePopperIsOpen(false)}
            onOpen={() => setTemplatePopperIsOpen(true)}
          >
            {({ onToggle }) => (
              <HeaderIconButton
                icon="librarySmall"
                active={templatePopperIsOpen}
                isSmall
                tooltip={{ title: 'Add to library', hotkey: HOTKEY_LABEL_MAP[Hotkey.ADD_TO_LIBRARY] }}
                onClick={onToggle}
              />
            )}
          </CanvasTemplateEditorNewTemplate>

          <HeaderIconButton icon="copy" isSmall tooltip={{ title: 'Copy', hotkey: HOTKEY_LABEL_MAP[Hotkey.COPY] }} onClick={onCopy} />
        </Box.Flex>
      ) : (
        <>
          <ProjectTitle
            id={Identifier.PROJECT_TITLE}
            value={formValue}
            onBlur={onBlur}
            onFocus={onFocus}
            readOnly={isReadOnly}
            onChange={updateFormValue}
            disabled={!canEditProject}
            $secondary
            onKeyPress={withEnterPress(withInputBlur())}
          />

          {!focused && <DomainActions />}
        </>
      )}
    </Container>
  );
};

export default DomainsAndCanvasActions;
