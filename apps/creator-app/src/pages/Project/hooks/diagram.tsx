import { datadogRum } from '@datadog/browser-rum';
import { MenuTypes, toast, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import * as Errors from '@/config/errors';
import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useLinkedState, usePermission, useSelector, useToggle } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { isTopicDiagram } from '@/utils/diagram.utils';

import TopicDomainPopper from '../components/DesignMenu/Layers/TopicsSection/TopicDomainPopper';

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
  const flow = useSelector(Designer.Flow.selectors.byDiagramID, { diagramID });

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

interface DiagramOptionsOptions {
  onEdit?: () => void;
  onRename: () => void;
  diagramID?: string | null;
  isSubtopic?: boolean;
  rootTopicID?: string;
}

export const useDiagramOptions = ({
  onEdit,
  onRename,
  diagramID,
  isSubtopic,
  rootTopicID,
}: DiagramOptionsOptions): MenuTypes.OptionWithoutValue[] => {
  const duplicateFlow = useDispatch(Designer.Flow.effect.duplicateOne);
  const deleteTopicDiagram = useDispatch(DiagramV2.deleteTopicDiagram);
  const deleteSubtopicDiagram = useDispatch(DiagramV2.deleteSubtopicDiagram);
  const deleteFlow = useDispatch(Designer.Flow.effect.deleteOne);
  const goToRootDiagramIfActive = useDispatch(Router.goToRootDiagramIfActive);
  const goToDiagram = useDispatch(Router.goToDiagram);
  const convertCMSComponentToTopic = useDispatch(Designer.Flow.effect.convertOneToTopic);
  const setLastCreatedID = useDispatch(DiagramV2.setLastCreatedID);

  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: diagramID });
  const flow = useSelector(Designer.Flow.selectors.byDiagramID, { diagramID });
  const domains = useSelector(Domain.allDomainsSelector);
  const rootDiagramID = useSelector(Domain.active.rootDiagramIDSelector);
  const activeDomainID = useSelector(Session.activeDomainIDSelector);
  const activeVersionID = useSelector(Session.activeVersionIDSelector);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const errorModal = ModalsV2.useModal(ModalsV2.Error);
  const confirmModal = ModalsV2.useModal(ModalsV2.Confirm);

  const onDuplicate = React.useCallback(async () => {
    if (!diagramID || !activeVersionID) {
      datadogRum.addError(!activeVersionID ? Errors.noActiveVersionID() : Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    if (flow) {
      const duplicated = await duplicateFlow(flow.id);
      setLastCreatedID({ id: duplicated.diagramID });
      goToDiagram(duplicated.diagramID);
    }
  }, [activeVersionID, diagramID, flow]);

  const onConvertToTopic = React.useCallback(() => {
    if (!diagramID) {
      datadogRum.addError(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    if (flow) {
      goToRootDiagramIfActive(flow.diagramID);
      convertCMSComponentToTopic(flow.id);
    }
  }, [diagramID, flow]);

  const isTopic = isTopicDiagram(diagram?.type);
  const domainsList = domains.filter((domain) => domain.id !== activeDomainID);

  const onDelete = React.useCallback(() => {
    if (!diagramID) {
      datadogRum.addError(Errors.noActiveDiagramID());
      toast.genericError();
      return;
    }

    const label = isTopic ? 'topic' : 'component';

    confirmModal.openVoid({
      body: (
        <>
          This action will permanently delete all contents of the{' '}
          <b>
            "{diagram?.name ?? ''}" {label}
          </b>{' '}
          and can not be reversed. Are you sure you want to continue?
        </>
      ),
      header: `Delete ${label}`,
      confirmButtonText: 'Delete',

      confirm: () => {
        const onError = () =>
          errorModal.openVoid({ error: `Another user is currently using this ${label}. Please wait until they're done before deleting` });

        if (!isTopic) {
          if (flow) {
            goToRootDiagramIfActive(flow.diagramID);
            deleteFlow(flow.id).catch(onError);
          }
        } else if (isSubtopic) {
          if (rootTopicID) deleteSubtopicDiagram(diagramID, rootTopicID).catch(onError);
        } else {
          deleteTopicDiagram(diagramID).catch(onError);
        }
      },
    });
  }, [diagramID, diagram, isTopic, isSubtopic, rootTopicID, deleteFlow, deleteSubtopicDiagram, deleteTopicDiagram, flow]);

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

      ...(isTopic && domainsList.length > 0 && diagramID !== rootDiagramID
        ? [{ label: <TopicDomainPopper domains={domainsList} topicID={diagramID} rootTopicID={rootTopicID} /> }]
        : []),

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
  }, [onEdit, isTopic, onRename, onDelete, onDuplicate, canEditCanvas, rootDiagramID, onConvertToTopic]);
};
