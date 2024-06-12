import { datadogRum } from '@datadog/browser-rum';
import { toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useDispatch, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';

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

export const useDiagramRename = ({
  diagramID,
  autoSelect,
  diagramName,
  onNameChanged,
}: DiagramRenameOptions): DiagramRenameApi => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [canEditCanvas] = usePermission(Permission.PROJECT_CANVAS_UPDATE);
  const [localName, _setLocalName] = useLinkedState(diagramName ?? '');
  const [renameEnabled, toggleRenameEnabled] = useToggle(false);
  const flow = useSelector(Designer.Flow.selectors.oneByDiagramID, { diagramID });

  const renameDiagram = useDispatch(DiagramV2.renameDiagram);
  const patchFlow = useDispatch(Designer.Flow.effect.patchOne);

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

    if (flow) {
      patchFlow(flow.id, { name: nextName });
    } else {
      renameDiagram(diagramID, nextName);
    }

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
