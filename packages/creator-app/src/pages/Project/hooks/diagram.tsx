import { BaseModels } from '@voiceflow/base-types';
import { MenuTypes, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { Permission } from '@/config/permissions';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import * as Modal from '@/ducks/modal';
import { useDispatch, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
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

interface DiagramOptionsOptions {
  onEdit?: () => void;
  onRename: () => void;
  diagramID?: string | null;
}

export const useDiagramOptions = ({ onEdit, onRename, diagramID }: DiagramOptionsOptions): MenuTypes.OptionWithoutValue[] => {
  const deleteDiagram = useDispatch(Diagram.deleteDiagram);
  const setErrorModal = useDispatch(Modal.setError);
  const setConfirmModal = useDispatch(Modal.setConfirm);
  const duplicateComponent = useDispatch(Diagram.duplicateComponent);
  const convertComponentToTopic = useDispatch(Diagram.convertComponentToTopic);

  const rootDiagramID = useSelector(Domain.active.rootDiagramIDSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);

  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const onDuplicate = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    duplicateComponent(diagramID, { openDiagram: true });
  }, [diagramID]);

  const onConvertToTopic = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    convertComponentToTopic(diagramID);
  }, [diagramID]);

  const onDelete = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    const label = getDiagramByID({ id: diagramID })?.type === BaseModels.Diagram.DiagramType.TOPIC ? 'topic' : 'component';

    setConfirmModal({
      body: 'This action will permanently delete all contents of the component and can not be reversed. Are you sure you want to continue?',
      header: `Delete ${label}`,

      confirm: () => {
        deleteDiagram(diagramID).catch(() =>
          setErrorModal(`Another user is currently using this ${label}. Please wait until they're done before deleting`)
        );
      },
    });
  }, [diagramID, deleteDiagram]);

  return React.useMemo<MenuTypes.OptionWithoutValue[]>(() => {
    if (!canEditCanvas) {
      return [];
    }

    const isTopic = getDiagramByID({ id: diagramID })?.type === BaseModels.Diagram.DiagramType.TOPIC;

    return [
      ...(onEdit
        ? [
            { label: 'Edit', onClick: onEdit },
            { label: 'Divider', divider: true },
          ]
        : []),

      { label: 'Rename', onClick: onRename },

      ...(!isTopic
        ? [
            { label: 'Duplicate', onClick: onDuplicate },
            { label: 'Convert to Topic', onClick: onConvertToTopic },
          ]
        : []),

      ...(rootDiagramID !== diagramID
        ? [
            { label: 'Divider', divider: true },
            { label: 'Delete', onClick: onDelete },
          ]
        : []),
    ];
  }, [onEdit, onRename, onDelete, onDuplicate, canEditCanvas, rootDiagramID, onConvertToTopic]);
};
