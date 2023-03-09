import { CustomSlot, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, COLOR_PICKER_CONSTANTS, pickRandomDefaultColor, toast, useCache, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { MODAL_WIDTH_VARIANTS, MODAL_WIDTHS, ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useLinkedState, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { applySlotNameFormatting, slotNameFormatter, validateSlotName } from '@/utils/slot';

import EntityForm from './components/EntityForm';
import { MAX_HEIGHT_CALC } from './constants';

const CreateModal: React.FC = () => {
  const { close, data, isInStack } = useModals<{
    name: string;
    onCreate: (slot: Pick<Realtime.Slot, 'id' | 'name' | 'color'> | null) => void;
    onClose?: () => void;
    creationType: Tracking.CanvasCreationType;
  }>(ModalType.ENTITY_CREATE);
  const createSlot = useDispatch(Slot.createSlot);
  const cache = useCache<{ created: boolean }>({ created: false });
  const slots = useSelector(SlotV2.allSlotsSelector);
  const intents = useSelector(IntentV2.allIntentsSelector);

  const [isCreating, setIsCreating] = React.useState(false);
  const [type, setType] = React.useState(CustomSlot.type);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const [name, setName] = useLinkedState(applySlotNameFormatting(platform)(data.name) ?? '');
  const [values, setValues] = React.useState<Realtime.SlotInput[]>([]);
  const [color, setColor] = React.useState<string>(() => pickRandomDefaultColor(COLOR_PICKER_CONSTANTS.ALL_COLORS_WITH_DARK_BASE));

  const nameInputRef = React.useRef<HTMLInputElement>(null);

  const notEmptyValues = React.useMemo(() => values.some(({ value, synonyms }) => value.trim() || synonyms.trim()), [values]);

  const [trackingEvents] = useTrackingEvents();

  const onCreate = async () => {
    setIsCreating(true);
    const formattedSlotName = slotNameFormatter(platform)(name);
    const id = Utils.id.cuid.slug();

    const error = validateSlotName({
      slots,
      intents,
      slotName: formattedSlotName,
      slotType: type,
      notEmptyValues,
    });

    if (error) {
      toast.error(error);
      setIsCreating(false);
      return;
    }

    await createSlot(id, { id, type, name: formattedSlotName, color, inputs: values });
    data.onCreate?.({ id, name, color } as Realtime.Slot);
    cache.current.created = true;
    trackingEvents.trackEntityCreated({ creationType: data.creationType });
    setIsCreating(false);
    close();
  };

  useDidUpdateEffect(() => {
    if (!isInStack) return undefined;

    if (!name) {
      nameInputRef.current?.focus();
    }

    return () => {
      setType(CustomSlot.type);
      setName('');
      setColor(pickRandomDefaultColor(COLOR_PICKER_CONSTANTS.ALL_COLORS_WITH_DARK_BASE));
      setValues([]);

      if (!cache.current.created) {
        data.onClose?.();
      }

      cache.current.created = false;
    };
  }, [isInStack]);

  const handleCancel = () => {
    close();
  };

  return (
    <Modal maxWidth={MODAL_WIDTHS[MODAL_WIDTH_VARIANTS.SMALL]} id={ModalType.ENTITY_CREATE} title="Create Entity" headerBorder>
      <Box width="100%" overflow="auto" maxHeight={MAX_HEIGHT_CALC}>
        <EntityForm
          ref={nameInputRef}
          name={name}
          type={type}
          color={color}
          values={values}
          saveColor={setColor}
          updateType={setType}
          updateName={setName}
          saveValues={setValues}
        />
      </Box>

      <ModalFooter justifyContent="flex-end">
        <Button onClick={handleCancel} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px' }}>
          Cancel
        </Button>

        <Button width={137} disabled={isCreating} isLoading={isCreating} onClick={onCreate} variant={ButtonVariant.PRIMARY}>
          Create Entity
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
