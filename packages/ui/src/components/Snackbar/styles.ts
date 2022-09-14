import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import SvgIcon from '@ui/components/SvgIcon';
import { styled } from '@ui/styles';
import * as Animations from '@ui/styles/animations';

export const RECONNECT_TIMEOUT = 10;

export const Overlay = styled.div`
  position: absolute;
  z-index: 1000;
  height: 100%;
  width: 100%;
  background: #fff;
  opacity: 0.65;
  cursor-events: none;
`;

export const BarWrapper = styled.div`
  position: absolute;
  z-index: 1001;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
`;

export const Snackbar = styled(Box.FlexCenter)`
  ${Animations.FadeDownDelayed}
  box-shadow: inset rgb(0 0 0 / 50%) 0px -1px 0px 0px, rgb(0 0 0 / 16%) 0px 1px 3px 0px;
  padding: 6px;
  color: #f2f7f7;
  height: 40px;
  background: #33373a;
  border-radius: 10px;
  font-size: 13px;
`;

export const Icon = styled(SvgIcon).attrs({ mx: 12 })``;

export const DarkButton = styled(Button.DarkButton).attrs({ px: 12, py: 5 })``;

export const PrimaryButton = styled(Button.PrimaryButton).attrs({ px: 12, py: 5 })``;
