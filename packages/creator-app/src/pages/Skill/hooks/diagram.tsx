import { DiagramType } from '@voiceflow/api-sdk';
import { Alert, AlertVariant, MenuOption, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import * as Diagram from '@/ducks/diagram';
import * as Modal from '@/ducks/modal';
import { useDispatch, useFeature, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
import * as Sentry from '@/vendors/sentry';

interface DiagramRenameApi {
  catEdit: boolean;
  inputRef: React.Ref<HTMLInputElement>;
  localName: string;
  onSaveName: VoidFunction;
  setLocalName: (name: string) => void;
  renameEnabled: boolean;
  toggleRenameEnabled: (nextValue?: unknown) => void;
}

interface DiagramRenameOptions {
  diagramID?: string | null;
  autoSelect?: boolean;
  diagramName?: string | null;
  onNameChanged?: (name: string) => void;
}

export const useDiagramRename = ({ diagramID, autoSelect, diagramName, onNameChanged }: DiagramRenameOptions): DiagramRenameApi => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [localName, _setLocalName] = useLinkedState(diagramName ?? '');
  const [renameEnabled, toggleRenameEnabled] = useToggle(false);

  const renameDiagram = useDispatch(Diagram.renameDiagram);

  const setLocalName = React.useCallback(
    (name: string) => {
      if (!canEditCanvas) {
        return;
      }

      _setLocalName(name);
    },
    [canEditCanvas]
  );

  const onNameChangedPersisted = usePersistFunction(onNameChanged);

  const onSaveName = React.useCallback(() => {
    if (!canEditCanvas) {
      return;
    }

    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    const nextName = localName.trim() || diagramName || 'Unnamed Diagram';

    renameDiagram(diagramID, nextName);
    toggleRenameEnabled(false);

    onNameChangedPersisted(nextName);
  }, [localName, diagramID, diagramName, canEditCanvas]);

  React.useEffect(() => {
    if (!renameEnabled) {
      return;
    }

    inputRef.current?.focus();

    if (autoSelect) {
      inputRef.current?.select();
    }
  }, [renameEnabled]);

  return {
    catEdit: canEditCanvas,
    inputRef,
    localName,
    onSaveName,
    setLocalName,
    renameEnabled,
    toggleRenameEnabled,
  };
};

export const useDiagramOptions = ({ diagramID, onRename }: { diagramID?: string | null; onRename: () => void }): MenuOption<undefined>[] => {
  const copyDiagram = useDispatch(Diagram.copyDiagram);
  const deleteDiagram = useDispatch(Diagram.deleteDiagram);
  const setErrorModal = useDispatch(Modal.setError);
  const setConfirmModal = useDispatch(Modal.setConfirm);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const getDiagramByID = useSelector(Diagram.diagramByIDSelector);
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);

  const onDuplicate = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    copyDiagram(diagramID, { openDiagram: true });
  }, [diagramID]);

  const onDelete = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    let label = 'flow';

    if (topicsAndComponents.isEnabled) {
      label = getDiagramByID(diagramID)?.type === DiagramType.TOPIC ? 'topic' : 'component';
    }

    setConfirmModal({
      text: (
        <Alert variant={AlertVariant.DANGER} mb={0}>
          Deleting this {label} permanently deletes everything inside and can not be recovered
          <br />
          <br />
          Are you sure ?
        </Alert>
      ),
      warning: true,
      confirm: () => {
        deleteDiagram(diagramID).catch(() =>
          setErrorModal(`Another user is currently using this ${label}. Please wait until they're done before deleting`)
        );
      },
    });
  }, [diagramID, topicsAndComponents.isEnabled]);

  return React.useMemo<MenuOption<undefined>[]>(
    () =>
      !canEditCanvas
        ? []
        : [
            { label: 'Rename', onClick: onRename },
            ...(!topicsAndComponents.isEnabled || !diagramID || getDiagramByID(diagramID)?.type !== DiagramType.TOPIC
              ? [{ label: 'Duplicate', onClick: onDuplicate }]
              : []),
            { label: 'Divider', divider: true },
            { label: 'Delete', onClick: onDelete },
          ],
    [onRename, onDuplicate, onDelete, canEditCanvas, topicsAndComponents.isEnabled]
  );
};
