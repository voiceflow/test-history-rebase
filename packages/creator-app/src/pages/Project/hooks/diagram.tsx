import { Models as BaseModels } from '@voiceflow/base-types';
import { MenuOption, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Modal from '@/ducks/modal';
import * as ProjectV2 from '@/ducks/projectV2';
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

interface DiagramOptionsOptions {
  onEdit?: () => void;
  onRename: () => void;
  diagramID?: string | null;
}

export const useDiagramOptions = ({ onEdit, onRename, diagramID }: DiagramOptionsOptions): MenuOption<undefined>[] => {
  const convertToTopic = useDispatch(Diagram.convertToTopic);
  const duplicateDiagram = useDispatch(Diagram.duplicateDiagram);
  const deleteDiagram = useDispatch(Diagram.deleteDiagram);
  const setErrorModal = useDispatch(Modal.setError);
  const setConfirmModal = useDispatch(Modal.setConfirm);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  const onDuplicate = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    duplicateDiagram(diagramID, { openDiagram: true });
  }, [diagramID]);

  const onConvertToTopic = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    convertToTopic(diagramID);
  }, [diagramID]);

  const onDelete = React.useCallback(() => {
    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    let label = 'flow';

    if (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) {
      label = getDiagramByID(diagramID)?.type === BaseModels.DiagramType.TOPIC ? 'topic' : 'component';
    }

    setConfirmModal({
      text: (
        <>
          Deleting this {label} permanently deletes everything inside and can not be recovered.
          <br />
          <br />
          Are you sure ?
        </>
      ),
      warning: true,
      confirm: () => {
        deleteDiagram(diagramID).catch(() =>
          setErrorModal(`Another user is currently using this ${label}. Please wait until they're done before deleting`)
        );
      },
    });
  }, [diagramID, topicsAndComponents.isEnabled, isTopicsAndComponentsVersion]);

  return React.useMemo<MenuOption<undefined>[]>(() => {
    if (!canEditCanvas) {
      return [];
    }

    const isTopic = diagramID ? getDiagramByID(diagramID)?.type === BaseModels.DiagramType.TOPIC : false;

    return [
      ...(onEdit ? [{ label: 'Edit', onClick: onEdit }] : []),
      { label: 'Rename', onClick: onRename },
      ...(!(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion) || !isTopic ? [{ label: 'Duplicate', onClick: onDuplicate }] : []),
      ...(topicsAndComponents.isEnabled && isTopicsAndComponentsVersion && !isTopic
        ? [{ label: 'Convert to Topic', onClick: onConvertToTopic }]
        : []),
      { label: 'Divider', divider: true },
      { label: 'Delete', onClick: onDelete },
    ];
  }, [onEdit, onRename, onDuplicate, onDelete, canEditCanvas, onConvertToTopic, topicsAndComponents.isEnabled, isTopicsAndComponentsVersion]);
};
