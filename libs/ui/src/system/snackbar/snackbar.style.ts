import Box from '@ui/components/Box';
import UIButton from '@ui/components/Button';
import SvgIcon from '@ui/components/SvgIcon';
import Text from '@ui/components/Text';
import { css, styled, transition } from '@ui/styles';
import * as Animations from '@ui/styles/animations';

export const Overlay = styled.div`
  position: absolute;
  z-index: 1000;
  height: 100%;
  width: 100%;
  background: #fff;
  opacity: 0.65;
  pointer-events: none;
`;

export const Container = styled.div`
  position: absolute;
  z-index: 1001;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
`;

export const Content = styled(Box.FlexCenter)`
  ${Animations.fadeInDownDelayedStyle}

  box-shadow: inset rgba(0, 0, 0, 0.5) 0px -1px 0px 0px, rgba(0, 0, 0, 0.16) 0px 1px 3px 0px;
  color: #f2f7f7;
  height: 40px;
  padding: 6px 16px;
  background: #33373a;
  border-radius: 10px;
  font-size: 13px;

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;

      ${Icon} {
        ${transition('opacity')};
        opacity: 0.85;
      }

      &:hover ${Icon} {
        opacity: 1;
      }
    `}
`;

export { Text };

export const Icon = styled(SvgIcon)`
  margin-right: 12px;
`;

export const Button = styled(UIButton.DarkButton)`
  padding: 5px 12px;
  margin-left: 16px;

  &:last-child {
    margin-right: -10px;
  }
`;

export const CloseButton = styled(Button).attrs({ icon: 'close', iconProps: { size: 14 } })``;
