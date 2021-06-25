import { Alert, AlertVariant, MenuOption, toast } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { Permission } from '@/config/permissions';
import * as Diagram from '@/ducks/diagram';
import * as Modal from '@/ducks/modal';
import { useDispatch, useLinkedState, useToggle } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import * as Sentry from '@/vendors/sentry';

export const useDiagramRename = ({ diagramID, diagramName }: { diagramID?: string | null; diagramName?: string | null }) => {
  const [localName, _setLocalName] = useLinkedState(diagramName ?? '');
  const [renameEnabled, toggleRenameEnabled] = useToggle(false);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

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

  const onSaveName = React.useCallback(() => {
    if (!canEditCanvas) {
      return;
    }

    if (!diagramID) {
      Sentry.error(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    renameDiagram(diagramID, localName.trim() || diagramName || 'Unnamed Diagram');
    toggleRenameEnabled(false);
  }, [localName, diagramID, diagramName, canEditCanvas]);

  return {
    catEdit: canEditCanvas,
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

    setConfirmModal({
      text: (
        <Alert variant={AlertVariant.DANGER} mb={0}>
          Deleting this flow permanently deletes everything inside and can not be recovered
          <br />
          <br />
          Are you sure ?
        </Alert>
      ),
      warning: true,
      confirm: () => {
        deleteDiagram(diagramID).catch(() =>
          setErrorModal("Another user is currently using this flow. Please wait until they're done before deleting")
        );
      },
    });
  }, [diagramID]);

  return React.useMemo<MenuOption<undefined>[]>(
    () =>
      !canEditCanvas
        ? []
        : [
            { label: 'Rename flow', onClick: onRename },
            { label: 'Duplicate flow', onClick: onDuplicate },
            { label: 'Divider', divider: true },
            { label: 'Delete flow', onClick: onDelete },
          ],
    [onRename, onDuplicate, onDelete, canEditCanvas]
  );
};
