import { BlockText, Box, Checkbox, Menu } from '@voiceflow/ui';
import React from 'react';

import { ControlScheme } from '@/components/Canvas/constants';
import * as UI from '@/ducks/ui';
import { useDispatch, useSelector, useTheme, useTrackingEvents } from '@/hooks';

import { Container } from './components';

interface Option {
  id: ControlScheme;
  label: string;
  description: string;
}

const OPTIONS: Option[] = [
  { id: ControlScheme.MOUSE, label: 'Mouse', description: 'Click and drag to pan the canvas. Zoom by scrolling the mouse wheel.' },
  { id: ControlScheme.TRACKPAD, label: 'Trackpad', description: 'Pan the canvas by sliding two fingers on the trackpad. Zoom by pinching.' },
];

interface MoveTypePopoverProps {
  closePopover: () => void;
}

const MoveTypePopover: React.FC<MoveTypePopoverProps> = ({ closePopover }) => {
  const canvasNavigation = useSelector(UI.selectors.canvasNavigation);
  const setCanvasNavigation = useDispatch(UI.action.SetCanvasNavigation);
  const [trackEvents] = useTrackingEvents();

  const theme = useTheme();

  const onSetNavigation = (controlScheme: ControlScheme) => {
    trackEvents.trackProjectMoveType({ type: controlScheme });
    setCanvasNavigation(controlScheme);
    closePopover();
  };

  return (
    <Menu>
      {OPTIONS.map(({ id, label, description }) => (
        <Menu.Item key={id} height="auto" onClick={() => onSetNavigation(id)}>
          <Container>
            <Box mr={12}>
              <Checkbox type={Checkbox.Type.RADIO} checked={id === canvasNavigation} />
            </Box>

            <div>
              <BlockText mb={4}>{label}</BlockText>

              <BlockText fontSize={theme.fontSizes.s} color={theme.colors.secondary}>
                {description}
              </BlockText>
            </div>
          </Container>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default MoveTypePopover;
