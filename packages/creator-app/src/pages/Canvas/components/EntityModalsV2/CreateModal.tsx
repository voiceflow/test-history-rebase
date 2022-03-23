import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, useCache, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import { ModalType } from '@/constants';
import * as Slot from '@/ducks/slot';
import { useDispatch, useLinkedState, useModals } from '@/hooks';

import EntityForm from './components/EntityForm';
import { MAX_ENTITY_MODAL_WIDTH } from './constants';

const CreateModal: React.FC = () => {
  const { close, data, isInStack } = useModals<{ name: string; onCreate: (slot: Realtime.Slot | null) => void; onClose?: () => void }>(
    ModalType.ENTITY_CREATE
  );
  const createSlot = useDispatch(Slot.createSlot);
  const cache = useCache<{ created: boolean }>({ created: false });

  const [type, setType] = React.useState('');
  const [name, setName] = useLinkedState(data.name ?? '');
  const [values, setValues] = React.useState<Realtime.SlotInput[]>([]);

  const onCreate = async () => {
    const id = Utils.id.cuid.slug();
    await createSlot(id, { id, type, name, color: undefined, inputs: values });
    data.onCreate({ id, name } as Realtime.Slot);
    cache.current.created = true;
    close();
  };

  useDidUpdateEffect(() => {
    if (!isInStack) return undefined;

    return () => {
      setType('');
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
      <Box width="100%" overflow="auto" maxHeight="calc(100vh - 220px)">
        <EntityForm values={values} updateType={setType} updateName={setName} saveValues={setValues} name={name} type={type} />
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
