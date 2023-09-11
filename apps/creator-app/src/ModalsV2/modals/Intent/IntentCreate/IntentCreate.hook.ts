import { Utils } from '@voiceflow/common';
import type { Intent, UtteranceText } from '@voiceflow/sdk-logux-designer';
import { AttachmentType, CardLayout, ResponseVariantType } from '@voiceflow/sdk-logux-designer';
import { toast } from '@voiceflow/ui';
import { useMemo, useState } from 'react';
import { match } from 'ts-pattern';

import { Designer } from '@/ducks';
import { useInputAutoFocusKey, useInputStateWithError } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useValidator } from '@/hooks/validate.hook';
import type { ResultInternalAPI } from '@/ModalsV2/types';
import { markupFactory } from '@/utils/markup.util';
import { isUtteranceLikeEmpty, utteranceTextFactory } from '@/utils/utterance.util';

import type { EntityRepromptAttachment, EntityRepromptForm, UtteranceForm } from './IntentCreate.interface';

export const useRequiredEntitiesForm = () => {
  const entitiesMap = useSelector(Designer.selectors.slateEntitiesMapByID);
  const getOneAttachmentByID = useSelector(Designer.Attachment.selectors.getOneByID);

  const createAttachmentCard = useDispatch(Designer.Attachment.effect.createOneCard);

  const [repromptsMap, setRepromptsMap] = useState<Record<string, EntityRepromptForm>>({});
  const [attachmentsMap, setAttachmentsMap] = useState<Record<string, EntityRepromptAttachment>>({});
  const [requiredEntityIDs, setRequiredEntityIDs] = useState<string[]>([]);
  const [entityRepromptsOrder, setEntityRepromptsOrder] = useState<Record<string, string[]>>({});

  const requiredEntities = useMemo(
    () => Array.from(requiredEntityIDs.map((id) => ({ id, text: entitiesMap[id]?.name ?? '' }))),
    [entitiesMap, requiredEntityIDs]
  );

  const textRepromptFactory = (): EntityRepromptForm => ({
    id: Utils.id.cuid(),
    type: ResponseVariantType.TEXT,
    text: markupFactory(),
    speed: 0,
    cardLayout: CardLayout.CAROUSEL,
    attachmentOrder: [],
  });

  const onEntityReorder = (items: { id: string; text: string }[]) => {
    setRequiredEntityIDs(Utils.array.unique(items.map((item) => item.id)));
  };

  const onEntityAdd = (entityID: string) => {
    const reprompt = textRepromptFactory();

    setRepromptsMap((prev) => ({ ...prev, [reprompt.id]: reprompt }));
    setRequiredEntityIDs((prev) => [...prev, entityID]);
    setEntityRepromptsOrder((prev) => ({ ...prev, [entityID]: [reprompt.id] }));
  };

  const onEntityRemove = (id: string) => {
    setRequiredEntityIDs((prev) => prev.filter((entityID) => entityID !== id));
  };

  const onEntityReplace = (oldEntityID: string, newEntityID: string) => {
    const reprompt = textRepromptFactory();

    setRepromptsMap((prev) => ({ ...prev, [reprompt.id]: reprompt }));
    setRequiredEntityIDs((prev) => Utils.array.replace(prev, prev.indexOf(oldEntityID), newEntityID));
    setEntityRepromptsOrder((prev) => ({ ...prev, [newEntityID]: [reprompt.id] }));
  };

  const onRepromptAdd = (entityID: string) => {
    const reprompt = textRepromptFactory();

    setRepromptsMap((prev) => ({ ...prev, [reprompt.id]: reprompt }));
    setEntityRepromptsOrder((prev) => ({ ...prev, [entityID]: Utils.array.append(prev[entityID] ?? [], reprompt.id) }));
  };

  const onRepromptChange = (repromptID: string, data: Partial<Omit<EntityRepromptForm, 'id'>>) => {
    setRepromptsMap((prev) => ({ ...prev, [repromptID]: { ...prev[repromptID], ...data } as EntityRepromptForm }));
  };

  const onRepromptRemove = (entityID: string, repromptID: string) => {
    setRepromptsMap(({ [repromptID]: _, ...prev }) => prev);
    setEntityRepromptsOrder((prev) => ({ ...prev, [entityID]: Utils.array.withoutValue(prev[entityID] ?? [], repromptID) }));
  };

  const onRepromptAttachmentSelect = (repromptID: string, { id, type }: { id: string; type: AttachmentType }) => {
    const attachment = match(type)
      .with(AttachmentType.CARD, (type) => ({ id: Utils.id.cuid(), type, cardID: id }))
      .with(AttachmentType.MEDIA, (type) => ({ id: Utils.id.cuid(), type, mediaID: id }))
      .exhaustive();

    setAttachmentsMap((prev) => ({ ...prev, [attachment.id]: attachment }));
    setRepromptsMap((prev) => ({
      ...prev,
      [repromptID]: { ...prev[repromptID], attachmentOrder: Utils.array.append(prev[repromptID].attachmentOrder, attachment.id) },
    }));
  };

  const onRepromptsAttachmentRemove = (repromptID: string, responseAttachmentID: string) => {
    setRepromptsMap((prev) => ({
      ...prev,
      [repromptID]: { ...prev[repromptID], attachmentOrder: Utils.array.withoutValue(prev[repromptID].attachmentOrder, responseAttachmentID) },
    }));
    setAttachmentsMap(({ [responseAttachmentID]: _, ...prev }) => prev);
  };

  const onRepromptVariantTypeChange = () => {
    // TODO: implement
  };

  const onRepromptAttachmentDuplicate = async (repromptID: string, attachmentID: string) => {
    const duplicateAttachment = getOneAttachmentByID({ id: attachmentID });
    const duplicateCard = duplicateAttachment?.type === AttachmentType.CARD ? duplicateAttachment : null;

    const card = await createAttachmentCard({
      title: duplicateCard?.title ?? markupFactory(),
      mediaID: duplicateCard?.mediaID ?? null,
      description: duplicateCard?.description ?? markupFactory(),
      buttonOrder: [],
    });

    onRepromptAttachmentSelect(repromptID, { id: card.id, type: AttachmentType.CARD });
  };

  const repromptsByEntityID = useMemo(
    () => Object.fromEntries(Object.entries(entityRepromptsOrder).map(([entityID, order]) => [entityID, order.map((id) => repromptsMap[id])])),
    [repromptsMap, entityRepromptsOrder]
  );

  const attachmentsPerEntityPerReprompt = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(repromptsByEntityID).map(([entityID, reprompts]) => [
          entityID,
          Object.fromEntries(
            reprompts.map((reprompt) => [
              reprompt.id,
              reprompt.attachmentOrder
                .map((responseAttachmentID) => {
                  const repromptAttachment = attachmentsMap[responseAttachmentID];

                  if (!repromptAttachment) return null;

                  const attachmentID = match(repromptAttachment)
                    .with({ type: AttachmentType.CARD }, ({ cardID }) => cardID)
                    .with({ type: AttachmentType.MEDIA }, ({ mediaID }) => mediaID)
                    .exhaustive();

                  const attachment = getOneAttachmentByID({ id: attachmentID });

                  return attachment ? { ...repromptAttachment, attachment } : null;
                })
                .filter(Utils.array.isNotNullish),
            ])
          ),
        ])
      ),
    [attachmentsMap, repromptsByEntityID, getOneAttachmentByID]
  );

  return {
    onEntityAdd,
    onRepromptAdd,
    onEntityRemove,
    onEntityReplace,
    onEntityReorder,
    requiredEntities,
    onRepromptChange,
    onRepromptRemove,
    requiredEntityIDs,
    repromptsByEntityID,
    onRepromptAttachmentSelect,
    onRepromptVariantTypeChange,
    onRepromptsAttachmentRemove,
    onRepromptAttachmentDuplicate,
    attachmentsPerEntityPerReprompt,
  };
};

export const useUtterancesForm = () => {
  const [utterances, setUtterances] = useState<UtteranceForm[]>(() => [{ id: Utils.id.cuid(), text: utteranceTextFactory() }]);
  const [isListEmpty, onListItemEmpty] = useIsListEmpty(utterances, isUtteranceLikeEmpty);
  const [autoFocusKey, setAutoFocusKey] = useInputAutoFocusKey();

  const onAddUtterance = () => {
    const id = Utils.id.cuid();

    setUtterances((prev) => [{ id, text: utteranceTextFactory() }, ...prev]);
    setAutoFocusKey(id);
  };

  const onRemoveUtterance = (id: string) => {
    setUtterances((prev) => prev.filter((item) => item.id !== id));
  };

  const onChangeUtterance = (id: string, { text }: { text: UtteranceText }) => {
    setUtterances((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  return {
    utterances,
    setUtterances,
    onAddUtterance,
    onRemoveUtterance,
    onChangeUtterance,
    utteranceAutoFocusKey: autoFocusKey,
    isUtterancesListEmpty: isListEmpty,
    onUtterancesListEmpty: onListItemEmpty,
  };
};

export const useIntentForm = ({ nameProp, folderID, api }: { nameProp?: string; folderID: string | null; api: ResultInternalAPI<Intent> }) => {
  const createOne = useDispatch(Designer.Intent.effect.createOne);

  const [name, nameError, setName, setNameError] = useInputStateWithError(nameProp ?? '');
  const [automaticReprompt, setAutomaticReprompt] = useState(false);

  const requiredEntitiesForm = useRequiredEntitiesForm();
  const utterancesForm = useUtterancesForm();

  const validator = useValidator<{ name: string }>({
    setNameError,
    validateName: (value) => !value && 'Name is required.',
  });

  const onCreate = validator.container(async (fields) => {
    try {
      const intent = await createOne({
        ...fields,
        folderID,
        utterances: utterancesForm.utterances.map(({ text }) => ({ text })).reverse(),
        entityOrder: requiredEntitiesForm.requiredEntityIDs,
        description: null,
        requiredEntities: Object.entries(requiredEntitiesForm.repromptsByEntityID).map(([entityID, reprompts]) => ({ entityID, reprompts })),
        automaticReprompt,
      });

      api.resolve(intent);
      api.close();
    } catch (e) {
      toast.genericError();

      api.enableClose();
    }
  });

  return {
    ...utterancesForm,
    ...requiredEntitiesForm,
    name,
    nameError,
    setName,
    onCreate,
    automaticReprompt,
    setAutomaticReprompt,
  };
};
