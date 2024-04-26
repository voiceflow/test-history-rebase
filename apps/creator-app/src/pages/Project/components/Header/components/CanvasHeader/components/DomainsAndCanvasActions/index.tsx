import { tid } from '@voiceflow/style';
import { Box, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import Page from '@/components/Page';
import { Permission } from '@/constants/permissions';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as ProjectV2 from '@/ducks/projectV2';
import {
  useDispatch,
  useEventualEngine,
  useHotkey,
  useLinkedState,
  usePermission,
  useSelector,
  useToggle,
} from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import CanvasTemplateEditorNewTemplate from '@/pages/Canvas/components/TemplateEditor/NewTemplate';
import { SelectionSetTargetsContext, SelectionTargetsContext } from '@/pages/Project/contexts';
import { usePrototypingMode } from '@/pages/Project/hooks';
import { Identifier } from '@/styles/constants';
import { withEnterPress, withInputBlur } from '@/utils/dom';
import { formatAssistantName } from '@/utils/string';

import { Container, DomainsActions, PlatformLogo, ProjectTitle, ViewOnly } from './components';

const DomainsAndCanvasActions: React.FC = () => {
  const [templatePopperIsOpen, setTemplatePopperIsOpen] = React.useState(false);

  const selectedTargets = React.useContext(SelectionTargetsContext);
  const setSelectedTargets = React.useContext(SelectionSetTargetsContext);

  const updateProjectName = useDispatch(ProjectV2.updateActiveProjectName);

  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const projectName = useSelector(ProjectV2.active.nameSelector);

  const getEngine = useEventualEngine();

  const isPrototypingMode = usePrototypingMode();
  const [canEditProject] = usePermission(Permission.PROJECT_EDIT);
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const [focused, setFocused] = useToggle(false);
  const [formValue, updateFormValue] = useLinkedState(projectName ?? '');

  const isReadOnly = isPrototypingMode || !canEditProject;

  const showEditorIcons =
    canEditCanvas &&
    (selectedTargets.length > 1 || (selectedTargets.length === 1 && selectedTargets[0] !== startNodeID));

  React.useEffect(() => {
    if (!showEditorIcons && templatePopperIsOpen) {
      setTemplatePopperIsOpen(false);
    }
  }, [showEditorIcons]);

  useHotkey(Hotkey.ADD_TO_LIBRARY, () => setTemplatePopperIsOpen(true), { preventDefault: true });

  const onBlur = () => {
    if (isReadOnly) {
      return;
    }

    const formattedName = formatAssistantName(formValue);

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

    if (!engine) return;

    await engine.createComponent();

    setSelectedTargets([]);
  };

  const onCreateSubtopic = async () => {
    const engine = getEngine();

    if (!engine) return;

    await engine.createSubtopic();

    setSelectedTargets([]);
  };

  const onCopy = async () => {
    const engine = getEngine();

    if (!engine) return;

    await engine.copyActive(null, { disableSuccessToast: false });
  };

  return (
    <Container>
      {!canEditCanvas && <ViewOnly data-testid={tid('canvas', ['header', 'view-only'])}>View only</ViewOnly>}

      {showEditorIcons ? (
        <Box.Flex gap={5}>
          <Page.Header.IconButton
            icon="folderSmall"
            tooltip={{
              content: (
                <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.CREATE_SUBTOPIC]}>
                  Create sub topic
                </TippyTooltip.WithHotkey>
              ),
              offset: [0, -6],
            }}
            onClick={onCreateSubtopic}
          />

          <Page.Header.IconButton
            icon="componentOutline"
            tooltip={{
              content: (
                <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.CREATE_COMPONENT]}>
                  Create component
                </TippyTooltip.WithHotkey>
              ),
              offset: [0, -6],
            }}
            onClick={onCreateComponent}
          />

          <CanvasTemplateEditorNewTemplate
            isOpen={templatePopperIsOpen}
            nodeIDs={selectedTargets}
            onClose={() => setTemplatePopperIsOpen(false)}
            onOpen={() => setTemplatePopperIsOpen(true)}
          >
            {({ onToggle }) => (
              <Page.Header.IconButton
                icon="librarySmall"
                active={templatePopperIsOpen}
                tooltip={{
                  content: (
                    <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.ADD_TO_LIBRARY]}>
                      Add to library
                    </TippyTooltip.WithHotkey>
                  ),
                  offset: [0, -6],
                }}
                onClick={onToggle}
              />
            )}
          </CanvasTemplateEditorNewTemplate>

          <Page.Header.IconButton
            icon="copy"
            tooltip={{
              content: <TippyTooltip.WithHotkey hotkey={HOTKEY_LABEL_MAP[Hotkey.COPY]}>Copy</TippyTooltip.WithHotkey>,
              offset: [0, -6],
            }}
            onClick={onCopy}
          />
        </Box.Flex>
      ) : (
        <>
          <PlatformLogo />

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

          {!focused && <DomainsActions />}
        </>
      )}
    </Container>
  );
};

export default DomainsAndCanvasActions;
