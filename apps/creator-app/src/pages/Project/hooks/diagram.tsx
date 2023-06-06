import { datadogRum } from '@datadog/browser-rum';
import { MenuTypes, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { Permission } from '@/constants/permissions';
import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

interface DiagramRenameApi {
  catEdit: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
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
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
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
      datadogRum.addError(Errors.noActiveDiagramID());
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

    inputRef.current?.focus({ preventScroll: true });

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
  const duplicateComponent = useDispatch(Diagram.duplicateComponent);
  const deleteComponentDiagram = useDispatch(Diagram.deleteComponentDiagram);

  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: diagramID });
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const errorModal = ModalsV2.useModal(ModalsV2.Error);
  const confirmModal = ModalsV2.useModal(ModalsV2.Confirm);

  const onDuplicate = React.useCallback(() => {
    if (!diagramID) {
      datadogRum.addError(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    duplicateComponent(diagramID, { openDiagram: true });
  }, [diagramID]);

  const onDelete = React.useCallback(() => {
    if (!diagramID) {
      datadogRum.addError(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    confirmModal.openVoid({
      body: (
        <>
          This action will permanently delete all contents of the <b>"{diagram?.name ?? ''}" component</b> and can not be reversed. Are you sure you
          want to continue?
        </>
      ),
      header: `Delete component`,
      confirmButtonText: 'Delete',

      confirm: () => {
        deleteComponentDiagram(diagramID).catch(() =>
          errorModal.openVoid({ error: `Another user is currently using this component. Please wait until they're done before deleting` })
        );
      },
    });
  }, [diagramID, diagram, deleteComponentDiagram]);

  return React.useMemo<MenuTypes.OptionWithoutValue[]>(() => {
    if (!canEditCanvas) {
      return [];
    }

    return [
      ...(onEdit
        ? [
            { label: 'Edit', onClick: onEdit },
            { label: 'Divider', divider: true },
          ]
        : []),

      { label: 'Rename', onClick: onRename },

      ...(rootDiagramID !== diagramID
        ? [
            { label: 'Duplicate', onClick: onDuplicate },
            { label: 'Divider', divider: true },
            { label: 'Delete', onClick: onDelete },
          ]
        : []),
    ];
  }, [onEdit, onRename, onDelete, onDuplicate, canEditCanvas, rootDiagramID]);
};
