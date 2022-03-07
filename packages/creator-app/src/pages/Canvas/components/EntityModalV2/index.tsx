import { Box, Button, ButtonVariant, FlexApart, IconButton, IconButtonVariant, Input } from '@voiceflow/ui';
import React from 'react';

import Modal, { ModalFooter } from '@/components/Modal';
import Section, { SectionVariant } from '@/components/Section';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import TypeSection from './components/TypeSection';
import { MAX_ENTITY_MODAL_WIDTH } from './constants';

export enum EntityModalMode {
  CREATING = 'creating',
  EDITING = 'editing,',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EntityModalProps {}

const EntityModalV2: React.FC<EntityModalProps> = () => {
  const { close, data } = useModals<{ id: string; mode: EntityModalMode }>(ModalType.ENTITY);
  const { mode } = data;
  const creating = mode === EntityModalMode.CREATING;

  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');

  return (
    <Modal
      maxWidth={MAX_ENTITY_MODAL_WIDTH}
      id={ModalType.ENTITY}
      title={
        creating ? (
          'Create Entity'
        ) : (
          <>
            <IconButton variant={IconButtonVariant.BASIC} icon="sandwichMenu" size={16} style={{ marginRight: '12px' }} />
            Edit Entity
          </>
        )
      }
      headerBorder
    >
      <Box width="100%" overflow="auto" maxHeight="calc(100vh - 250px)">
        <Section backgroundColor="#fdfdfd" header="Name" variant={SectionVariant.SUBSECTION} customContentStyling={{ paddingBottom: '0px' }}>
          <Input placeholder="Enter entity name" value={name} onChange={(e) => setName(e.target.value)} />
        </Section>
        <TypeSection type={type} onChangeType={setType} />
      </Box>
      <ModalFooter justifyContent="flex-end">
        {creating ? (
          <Box fullWidth>
            <FlexApart>
              <Box>
                <Button onClick={close} variant={ButtonVariant.TERTIARY} squareRadius style={{ marginRight: '10px', display: 'inline-block' }}>
                  Cancel
                </Button>
                <Button onClick={close} style={{ display: 'inline-block' }} variant={ButtonVariant.PRIMARY} squareRadius>
                  Create Entity
                </Button>
              </Box>
            </FlexApart>
          </Box>
        ) : (
          <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={close}>
            Close
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default EntityModalV2;
