import { CustomSlot, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, pickRandomDefaultColor, useCache, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Slot from '@/ducks/slot';
import { useDispatch, useLinkedState, useModals } from '@/hooks';

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

  const defaultColor = React.useMemo(() => pickRandomDefaultColor(), []);
  const [type, setType] = React.useState(CustomSlot.type);
  const [name, setName] = useLinkedState(data.name ?? '');
  const [values, setValues] = React.useState<Realtime.SlotInput[]>([]);
  const [color, setColor] = React.useState<string>(defaultColor);

  const onCreate = async () => {
    const id = Utils.id.cuid.slug();
    await createSlot(id, { id, type, name, color, inputs: values });
    data.onCreate({ id, name, color });
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
