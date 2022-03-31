import { CustomSlot, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, pickRandomDefaultColor, toast, useCache, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useLinkedState, useModals, useSelector } from '@/hooks';
import { validateSlotName } from '@/utils/slot';

import EntityForm from './components/EntityForm';
import { MAX_ENTITY_MODAL_WIDTH, MAX_HEIGHT_CALC } from './constants';

const CreateModal: React.FC = () => {
  const { close, data, isInStack } = useModals<{
    name: string;
    onCreate: (slot: Pick<Realtime.Slot, 'id' | 'name' | 'color'> | null) => void;
    onClose?: () => void;
  }>(ModalType.ENTITY_CREATE);
  const createSlot = useDispatch(Slot.createSlot);
  const cache = useCache<{ created: boolean }>({ created: false });
  const slots = useSelector(SlotV2.allSlotsSelector);
  const intents = useSelector(IntentV2.allIntentsSelector);

  const [type, setType] = React.useState(CustomSlot.type);
  const [name, setName] = useLinkedState(data.name ?? '');
  const [values, setValues] = React.useState<Realtime.SlotInput[]>([]);
  const [color, setColor] = React.useState<string>(pickRandomDefaultColor());

  const notEmptyValues = React.useMemo(() => values.some(({ value, synonyms }) => value.trim() || synonyms.trim()), [values]);

  const onCreate = async () => {
    const formattedSlotName = Utils.string.removeTrailingUnderscores(name);
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
      return;
    }

    await createSlot(id, { id, type, name: formattedSlotName, color, inputs: values });
    data.onCreate({ id, name, color } as Realtime.Slot);
    cache.current.created = true;
    close();
  };

  useDidUpdateEffect(() => {
    if (!isInStack) return undefined;

    return () => {
      setType(CustomSlot.type);
      setName('');
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
    <Modal maxWidth={MAX_ENTITY_MODAL_WIDTH} id={ModalType.ENTITY_CREATE} title="Create Entity" headerBorder>
      <Box width="100%" overflow="auto" maxHeight={MAX_HEIGHT_CALC}>
        <EntityForm
          color={color}
          saveColor={setColor}
          values={values}
          updateType={setType}
          updateName={setName}
          saveValues={setValues}
          name={name}
          type={type}
        />
      </Box>
      <ModalFooter justifyContent="flex-end">
        <Box>
          <Button onClick={handleCancel} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px', display: 'inline-block' }}>
            Cancel
          </Button>
          <Button onClick={onCreate} style={{ display: 'inline-block' }} variant={ButtonVariant.PRIMARY} squareRadius>
            Create Entity
          </Button>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default CreateModal;
