import { Utils } from '@voiceflow/common';
import type { Intent, UtteranceText } from '@voiceflow/dtos';
import { AttachmentType, CardLayout, Language, ResponseVariantType, TextResponseVariant } from '@voiceflow/dtos';
import { toast, useCreateConst } from '@voiceflow/ui';
import { intentDescriptionValidator, intentNameValidator, intentUtterancesValidator, markupFactory } from '@voiceflow/utils-designer';
import { useMemo, useState } from 'react';
import { match } from 'ts-pattern';

import { Designer } from '@/ducks';
import { useInputAutoFocusKey, useInputState } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { useDispatch, useGetValueSelector, useSelector } from '@/hooks/store.hook';
import { useValidators } from '@/hooks/validate.hook';
import type { ResultInternalAPI } from '@/ModalsV2/types';
import { isUtteranceLikeEmpty, utteranceTextFactory } from '@/utils/utterance.util';

import type { EntityRepromptAttachment, EntityRepromptForm, IIntentCreateModal, RequiredEntityForm, UtteranceForm } from './IntentCreate.interface';

export const useRequiredEntitiesForm = () => {
  const entitiesMap = useSelector(Designer.selectors.slateEntitiesMapByID);
  const getOneAttachmentByID = useSelector(Designer.Attachment.selectors.getOneByID);

  const createAttachmentCard = useDispatch(Designer.Attachment.effect.createOneCard);

  const [repromptsMap, setRepromptsMap] = useState<Record<string, EntityRepromptForm>>({});
  const [attachmentsMap, setAttachmentsMap] = useState<Record<string, EntityRepromptAttachment>>({});
  const [requiredEntityForms, setRequiredEntityForms] = useState<RequiredEntityForm[]>([]);
  const [entityRepromptsOrder, setEntityRepromptsOrder] = useState<Record<string, string[]>>({});

  const requiredEntities = useMemo(
    () => requiredEntityForms.map(({ id, entityID }) => ({ id, text: entitiesMap[entityID]?.name ?? '', entityID })),
    [entitiesMap, requiredEntityForms]
  );
  const requiredEntityIDs = useMemo(() => requiredEntities.map(({ entityID }) => entityID), [requiredEntities]);

  const textRepromptFactory = (text = markupFactory()): EntityRepromptForm => ({
    id: Utils.id.objectID(),
    type: ResponseVariantType.TEXT,
    text,
    speed: null,
    cardLayout: CardLayout.CAROUSEL,
    attachmentOrder: [],
  });

  const onEntityReorder = (items: RequiredEntityForm[]) => {
    setRequiredEntityForms(items.map((item) => Utils.object.pick(item, ['id', 'entityID'])));
  };

  const onEntityAddMany = (entityIDs: string[]) => {
    const requiredEntityIDsSet = new Set(requiredEntityIDs);
    const uniqueEntityIDs = entityIDs.filter((entityID) => !requiredEntityIDsSet.has(entityID));

    const reprompts = uniqueEntityIDs.map(() => textRepromptFactory());
    const requiredEntities = uniqueEntityIDs.map((entityID) => ({ id: Utils.id.cuid.slug(), entityID }));

    setRepromptsMap((prev) => ({ ...prev, ...Utils.array.createMap(reprompts, (reprompt) => reprompt.id) }));
    setRequiredEntityForms((prev) => [...prev, ...requiredEntities]);
    setEntityRepromptsOrder((prev) => ({
      ...prev,
      ...Object.fromEntries(uniqueEntityIDs.map((entityID, index) => [entityID, [reprompts[index].id]])),
    }));

    return requiredEntities;
  };

  const onEntityAdd = (entityID: string) => onEntityAddMany([entityID])[0];

  const onEntityRemove = (entityID: string) => {
    setRequiredEntityForms((prev) => prev.filter((item) => item.entityID !== entityID));
    setEntityRepromptsOrder((prev) => Utils.object.omit(prev, [entityID]));
  };

  const onEntityReplace = (oldEntityID: string, newEntityID: string) => {
    setRequiredEntityForms((prev) => prev.map((item) => (item.entityID === oldEntityID ? { ...item, entityID: newEntityID } : item)));
    setEntityRepromptsOrder(({ [oldEntityID]: order, ...prev }) => ({ ...prev, [newEntityID]: order }));
  };

  const onRepromptAdd = (entityID: string) => {
    const reprompt = textRepromptFactory();

    setRepromptsMap((prev) => ({ ...prev, [reprompt.id]: reprompt }));
    setEntityRepromptsOrder((prev) => ({ ...prev, [entityID]: Utils.array.append(prev[entityID] ?? [], reprompt.id) }));
  };

  const onRepromptsGenerated = (entityID: string, responses: Pick<TextResponseVariant, 'text'>[]) => {
    const reprompts = responses.map(({ text }) => textRepromptFactory(text));

    setRepromptsMap((prev) => ({ ...prev, ...Utils.array.createMap(reprompts, (reprompt) => reprompt.id) }));
    setEntityRepromptsOrder((prev) => ({ ...prev, [entityID]: [...(prev[entityID] ?? []), ...reprompts.map(Utils.object.selectID)] }));
  };

  const onRepromptChange = (repromptID: string, data: Partial<Omit<EntityRepromptForm, 'id'>>) => {
    setRepromptsMap((prev) => ({ ...prev, [repromptID]: { ...prev[repromptID], ...data } as EntityRepromptForm }));
  };

  const onRepromptRemove = (entityID: string, repromptID: string) => {
    setRepromptsMap((prev) => Utils.object.omit(prev, [repromptID]));
    setEntityRepromptsOrder((prev) => ({ ...prev, [entityID]: Utils.array.withoutValue(prev[entityID] ?? [], repromptID) }));
  };

  const onRepromptAttachmentSelect = (repromptID: string, { id, type }: { id: string; type: AttachmentType }) => {
    const attachment = match(type)
      .with(AttachmentType.CARD, (type) => ({ id: Utils.id.objectID(), type, cardID: id, variantID: repromptID }))
      .with(AttachmentType.MEDIA, (type) => ({ id: Utils.id.objectID(), type, mediaID: id, variantID: repromptID }))
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
    onEntityAddMany,
    onEntityReplace,
    onEntityReorder,
    requiredEntities,
    onRepromptChange,
    onRepromptRemove,
    requiredEntityIDs,
    repromptsByEntityID,
    onRepromptsGenerated,
    onRepromptAttachmentSelect,
    onRepromptVariantTypeChange,
    onRepromptsAttachmentRemove,
    onRepromptAttachmentDuplicate,
    attachmentsPerEntityPerReprompt,
  };
};

export const useUtterancesForm = () => {
  const utteranceState = useInputState({
    value: useCreateConst<UtteranceForm[]>(() => [{ id: Utils.id.objectID(), text: utteranceTextFactory() }]),
  });
  const listEmpty = useIsListEmpty(utteranceState.value, isUtteranceLikeEmpty);
  const autofocus = useInputAutoFocusKey();

  const onUtteranceAdd = () => {
    const id = Utils.id.objectID();

    autofocus.setKey(id);
    utteranceState.setValue((prev) => [{ id, text: utteranceTextFactory() }, ...prev]);
  };

  const onUtteranceRemove = (id: string) => {
    utteranceState.setValue((prev) => prev.filter((item) => item.id !== id));
  };

  const onUtteranceChange = (id: string, { text }: { text: UtteranceText }) => {
    utteranceState.setValue((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  return {
    utterances: utteranceState.value,
    utteranceState,
    onUtteranceAdd,
    utterancesError: utteranceState.error,
    onUtteranceRemove,
    onUtteranceChange,
    utteranceAutoFocusKey: autofocus.key,
    isUtterancesListEmpty: listEmpty.value,
    onUtterancesListEmpty: listEmpty.container,
  };
};

export const useIntentForm = ({
  api,
  nameProp,
  folderID,
}: {
  api: ResultInternalAPI<IIntentCreateModal, Intent>;
  nameProp?: string;
  folderID: string | null;
}) => {
  const getIntents = useGetValueSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);
  const getEntities = useGetValueSelector(Designer.Entity.selectors.all);
  const getVariables = useGetValueSelector(Designer.Variable.selectors.all);

  const createOne = useDispatch(Designer.Intent.effect.createOne);

  const [automaticReprompt, setAutomaticReprompt] = useState(false);

  const nameState = useInputState({ value: nameProp ?? '' });
  const descriptionState = useInputState();

  const utterancesForm = useUtterancesForm();
  const requiredEntitiesForm = useRequiredEntitiesForm();

  const validator = useValidators({
    name: [intentNameValidator, nameState.setError],
    utterances: [intentUtterancesValidator, utterancesForm.utteranceState.setError],
    description: [intentDescriptionValidator, descriptionState.setError],
  });

  const onCreate = validator.container(
    async (data) => {
      api.preventClose();

      try {
        const intent = await createOne({
          ...data,
          folderID,
          utterances: utterancesForm.utterances.map(({ text }) => ({ text, language: Language.ENGLISH_US })).reverse(),
          entityOrder: requiredEntitiesForm.requiredEntityIDs,
          description: descriptionState.value,
          requiredEntities: Object.entries(requiredEntitiesForm.repromptsByEntityID).map(([entityID, reprompts]) => ({
            entityID,
            reprompts: reprompts.map((reprompt) => ({
              ...reprompt,
              condition: null,
              attachments: requiredEntitiesForm.attachmentsPerEntityPerReprompt[entityID]?.[reprompt.id] ?? [],
            })),
          })),
          automaticReprompt,
        });

        api.resolve(intent);

        api.enableClose();
        api.close();
      } catch (e) {
        toast.genericError();

        api.enableClose();
      }
    },
    () => ({
      intents: getIntents(),
      intentID: null,
      entities: getEntities(),
      variables: getVariables(),
    })
  );

  return {
    ...utterancesForm,
    ...requiredEntitiesForm,
    onCreate,
    nameState,
    descriptionState,
    automaticReprompt,
    setAutomaticReprompt,
  };
};
