import React from 'react';

import Button from '@/components/Button';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import Flex from '@/componentsV2/Flex';
import VariableSelect from '@/componentsV2/VariableSelect';
import { styled, units } from '@/hocs';

import SlotMappingArrowContainer from './components/SlotMappingArrowContainer';

const Container = styled(Flex)`
  margin-bottom: ${units()}px;
`;

const SlotMapping = ({ mapping, slots, onRemove, onUpdate }) => {
  const selectedSlot = slots.find((slot) => slot.id === mapping.slot);
  const updateVariable = (variable) => onUpdate({ variable });
  const updateSlot = (slot) => onUpdate({ slot });

  return (
    <Container>
      <Flex fullWidth>
        <Select
          value={selectedSlot ? { label: `[${selectedSlot.name}]`, value: selectedSlot.id } : null}
          options={slots.map((slot) => ({ label: `[${slot.name}]`, value: slot.id }))}
          placeholder="Slot"
          onChange={(result) => updateSlot(result.value)}
          fullWidth
        />
        <SlotMappingArrowContainer>
          <SvgIcon color="#8da2b570" icon="arrowRight" size={12} />
        </SlotMappingArrowContainer>
        <VariableSelect className="map-box mr-2" value={mapping.variable} onChange={updateVariable} fullWidth />
      </Flex>
      <Button isCloseSmall onClick={onRemove} />
    </Container>
  );
};

export default SlotMapping;
