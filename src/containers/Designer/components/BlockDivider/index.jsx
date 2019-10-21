import composeRefs from '@seznam/compose-react-refs';
import React from 'react';

import Divider from '@/components/Divider';
import SvgIcon from '@/components/SvgIcon';
import Dropdown from '@/componentsV2/Dropdown';
import { StepType } from '@/containers/Designer/constants';
import { StepManagerContext, StepMenuContext } from '@/containers/Designer/contexts';

import { Container, Overlay } from './components';

const STEP_OPTIONS = [
  {
    label: 'If',
    value: StepType.IF,
  },
  {
    label: 'Set',
    value: StepType.SET,
  },
  {
    label: 'Link to',
    value: StepType.LINK_TO,
  },
  {
    label: 'End',
    value: StepType.END,
  },
  {
    label: 'API',
    value: StepType.API,
  },
];

const BlockDivider = ({ index }) => {
  const stepAdding = React.useContext(StepMenuContext);
  const stepManager = React.useContext(StepManagerContext);
  const buttonRef = React.useRef();
  const isActive = stepAdding.isEnabled;

  if (stepManager.isDragging) {
    return null;
  }

  const handleClose = () => {
    stepAdding.enable();
    buttonRef.current.blur();
  };

  const handleAdd = (value) => stepManager.insert(index, value);

  return (
    <Container isActive={isActive} fullWidth>
      <Overlay isActive={isActive}>
        <Dropdown options={STEP_OPTIONS} onSelect={handleAdd} onClose={handleClose}>
          {(ref, onToggle) => {
            const handleClick = () => {
              if (stepAdding.isEnabled) {
                onToggle();
                stepAdding.disable();
              }
            };

            return (
              <Divider onClick={handleClick} tabIndex={-1} fullWidth ref={composeRefs(buttonRef, ref)}>
                <SvgIcon icon="plusCircle" />
              </Divider>
            );
          }}
        </Dropdown>
      </Overlay>
    </Container>
  );
};

export default BlockDivider;
